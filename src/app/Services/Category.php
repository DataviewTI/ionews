<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use OwenIt\Auditing\Auditable;
use OwenIt\Auditing\Contracts\Auditable as AuditableContract;
use App\ContentType;
use App\Category;

class Category extends Model implements AuditableContract
{
	use SoftDeletes;
	use Auditable;
	
	protected $fillable = ['category_id','content_type_id','category','description','order'];
	
	public function parent(){
		return $this->belongsTo('App\Category', 'category_id');
	}

	public function teste(){
		return $this->belongsToMany('App::Category')->withPivot('category_id');
	}
	
	public function subcategories(){
		return $this->hasMany('App\Category','category_id');
	}

	public function contentType(){
        return $this->belongsTo('App\ContentType','content_type_id');
    }

	/*public function _category(){
		return $this->belongsTo(self::class,'category_id');
	}*/
}