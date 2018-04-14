<?php

namespace Dataview\IONews;
//namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class NewsRequest extends FormRequest
{
	public function authorize(){
		//verificar depois o travamento de requisições apenas para os perfis especificados
		return true;
    }
	
	public function sanitize(){
		// nao apagar $this->request->add(['xyz' => '7']);

		$input = $this->all();

		foreach($input as $key => $value)
			if(empty($value))
				$input[$key] = null;

		$input['featured'] = (int)($input['__featured']=='true');
		$input['keywords'] = $input['__keywords'];
    $input['date'] = date($input['date_submit']);
    //$input['video_date'] = date($input['video_date_submit']);

    if(isset($input['video_start_at']))
      $input['start_at'] = str_replace(' ','',date($input['video_start_at']));
    else
      $input['start_at'] = null;

      
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
			// nao apagar 'xyz' => 'sometimes|required|min:10',
		];
    }
    public function messages(){
		return [
		// nao apagar 'xyz.*'=>"meu validador local"
		];
	}
}
