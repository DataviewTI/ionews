<?php

namespace Dataview\IONews;
use Dataview\IntranetOne\IORequest;

class NewsRequest extends IORequest
{

	public function sanitize(){
    $input = parent::sanitize();

		$input['featured'] = (int)($input['__featured']=='true');
		$input['keywords'] = $input['__keywords'];
    $input['date'] = date($input['date_submit']);

    if(isset($input['video_start_at']))
      $input['start_at'] = str_replace(' ','',date($input['video_start_at']));
    else
      $input['start_at'] = '';
      
    $arr = explode(',',$input['__cat_subcats']);
    $_cats=[];
    array_walk($arr,function($a,$b) use (&$_cats){
      $_cats[$a] = ['main'=>($b ? false : true)];
    });
    $input['__cat_subcats_converted'] = $_cats;
    
		$this->replace($input);
	}
		
  public function rules(){
    $this->sanitize();
    return [
      'title' => 'required|max:255',
      'subtitle' => 'max:255',
      'date' => 'required',
      'by' => 'required|max:60',
      'content'=>'required|min:5',
      'keywords' => 'max:255',
    ];
  }
}
