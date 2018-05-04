<?php

namespace Dataview\IONews;

use Illuminate\Database\Eloquent\Model;
use Dataview\IntranetOne;

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

    static::saved(function(News $news){
      //check if group is empty
      if($news->group != null){	
        if(count($news->group->files)==0 && File::exists($path)){
          $news->group()->dissociate()->save();
          File::deleteDirectory($path);
        }
      }
    });
  }
}
