<?php
namespace Dataview\IONews;

use Dataview\IntranetOne\IOModel;
use Dataview\IntranetOne\File as ProjectFile;
use Dataview\IntranetOne\Group;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;

class News extends IOModel
{
  protected $fillable = ['title','short_title','subtitle','keywords','content','preview','featured','by','source','date'];
	protected $casts = [
			'featured' => 'boolean',
	];	

	public function searchableAs(){
      return 'news_index';
  }

	public function toSearchableArray(){
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
		return $this->belongsToMany('Dataview\IntranetOne\Category','news_category')->withPivot('id');
	}

  
	public function group(){
		return $this->belongsTo('Dataview\IntranetOne\Group');
  }
  
	public function video(){
		return $this->belongsTo('Dataview\IntranetOne\Video');
  }


  public static function boot() { 
    parent::boot(); 

    /*static::saved(function(News $news){
      //check if group is empty
      if($news->group != null){	
        if(count($news->group->files)==0 && File::exists($path)){
          $news->group()->dissociate()->save();
          File::deleteDirectory($path);
        }
      }
    });*/
    
    static::created(function (News $obj) {
      $news = new Group([
        'group' => "Album da Notícia ".$obj->id,
        'sizes' => $obj->getAppend("sizes")
      ]);
      $news->save(); 
      $obj->group()->associate($news)->save();
    });
  }
}
