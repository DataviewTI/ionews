<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
//use Laravel\Scout\Searchable;
use Illuminate\Database\Eloquent\SoftDeletes;
use OwenIt\Auditing\Auditable;
use OwenIt\Auditing\Contracts\Auditable as AuditableContract;

class News extends Model implements AuditableContract
{
	use SoftDeletes;
	use Auditable;
	//use Searchable;
	protected $auditTimestamps = true;
	
	protected $fillable = ['title','subtitle','keywords','content','preview','featured','by','source','date'];
	protected $casts = [
			'featured' => 'boolean',
	];	

	public function searchableAs(){
      return 'news_index';
  }

	public function toSearchableArray()
    {
        return [
             'id' => $this->id,
             'title' => $this->title,
             'subtitle' => $this->subtitle,
             'content' => $this->content,
        ];
    }

	/* 
	| Many to Many relations are not audited yet, maybe on v4.1 (02/05/2017)
	*/
	public function getMainCategory(){
		$main = $this->categories()->where('main',true)->first();
		return blank($main) ? $this->categories()->first() : $main; 
	}

	public function categories(){
		return $this->belongsToMany('App\Category','news_category')->withPivot('id');
	}

  
	public function group(){
		return $this->belongsTo('App\Group');
  }
  
	public function video(){
		return $this->belongsTo('App\Video');
  }


  public static function boot() { 
    parent::boot(); 

    static::saved(function(News $news){
      //check if group is empty
      if($news->group != null){	
        $path = storage_path('dataview_/groups/group_'.$news->group_id);

        if(count($news->group->files)==0 && File::exists($path)){
          $news->group()->dissociate()->save();
          File::deleteDirectory($path);
        }
      }
    });
  }

  public static function getSlimNews($category=null,$offset=0,$limit=null,$kw=null){  
		$news = News::select('id','title','featured','by','group_id','video_id','short_title','keywords')
    ->with([
      'categories'=>function($query){
        $query->select('categories.id','category')->where('main',true);
      },
      'video'=>function($query){
        $query->select('videos.id','url','source','videos.title','videos.data','thumbnail');
      }
    ])
    ->whereNotNull('group_id')//garantir somente com imagens
    ->orderByRaw('date DESC','featured DESC', 'short_title DESC');

            
    if(filled($category))
      $news = $news->whereHas('categories', function ($query) use ($category) {
        $query
        ->where('news_category.category_id',$category)
        ->where('main',true);
      });

    if(filled($kw))
      $news = $news
        ->where('title','like','%'.$kw.'%')
        ->orWhere('subtitle','like','%'.$kw.'%')
        ->orWhere('content','like','%'.$kw.'%');
        
    if(is_integer($offset))
      $news = $news->offset($offset)->limit($limit ? $limit : 8);


     return $news->get();
  }

  
}
