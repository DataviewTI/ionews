<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use OwenIt\Auditing\Auditable;
use OwenIt\Auditing\Contracts\Auditable as AuditableContract;
use App\Category;
use App\ContentType;

class ContentType extends Model
{
    use SoftDeletes;
	use Auditable;

    public function categories(){
        return $this->hasMany('App\Category');
    }
}
