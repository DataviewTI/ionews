<?php
namespace Dataview\IONews;
  
use Dataview\IntranetOne\IOController;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

use App\Http\Requests;
use Dataview\IONews\NewsRequest;
use Dataview\IONews\News;
use Dataview\IntranetOne\Group;
use Dataview\IntranetOne\Video;
use Dataview\IntranetOne\Category;
use Validator;
use DataTables;
use Session;
use Sentinel;

class NewsController extends IOController{

	public function __construct(){
    $this->service = 'news';
	}

  public function index(){
		return view('News::index');
  }
  
	public function moxieConfig(){
		session_start();
		$_SESSION['moxiemanager.filesystem.rootpath']= public_path(env('MOXIEMANAGER_ROOT'));
		return json_encode(['status'=>true]);
	} 

	public function list(){
		$query = News::select('id','title','short_title','subtitle','keywords','featured','by','source','group_id','video_id','date')
			->with([
				'categories'=>function($query){
					$query->select('categories.id','category','categories.category_id')
					->with('maincategory');
				},
				'video'=>function($query){
					$query->select('videos.id');
				}
			])
			->orderBy('date','desc')
			->get();
			return Datatables::of(collect($query))->make(true);
	}

	public function create(NewsRequest $request){

    $check = $this->__create($request);
    if(!$check['status'])
      return response()->json(['errors' => $check['errors'] ], $check['code']);	

      $news = News::create($request->all());
				$news->categories()->sync($request->__cat_subcats_converted);
        if(count(json_decode($request->__dz_images))>0){
					$news->group()->associate(Group::create([
						'group' => $news->title,
						'description' => 'Album de imagens vinculada a notícia '.$news->id			
					]));

          $news->group->manageImages(json_decode($request->__dz_images),json_decode($request->__dz_copy_params));

					$news->save();
				}
        
        if($request->video_url != null){
          $_vdata = json_decode($request->video_data);
          
          $news->video()->associate(Video::create([
            'url' => $request->video_url,
            'source' => $_vdata->source,
            'title' => $request->video_title,
            'description' => $request->video_description,
            'date' => $request->video_date_submit,
            'thumbnail' => $request->video_thumbnail,
            'data' => $request->video_data,
            'start_at' => $request->start_at
          ]));
          $news->save();
        }

        return response()->json(['success'=>true,'data'=>null]);
	}

	public function getHTMLContent($id){
		return News::find($id)->content;
	}

	public function view($id){
    $check = $this->__view();
    if(!$check['status'])
      return response()->json(['errors' => $check['errors'] ], $check['code']);	

    $query = News::select('id','title','short_title','subtitle','content',
    'keywords','featured','by','source','group_id','video_id','date')
				->with([
					'video','categories'=>function($query){
            $query->select('categories.id','main','category','categories.category_id')
            ->orderBy('main','category')
						->with('maincategory');
					},
					'group.files'
				])
				->orderBy('date','desc')
				->where('id',$id)
				->get();
				
        return response()->json(['success'=>true,'data'=>$query]);
	}
	
	public function update($id,NewsRequest $request){
    $check = $this->__update($request);
    if(!$check['status'])
      return response()->json(['errors' => $check['errors'] ], $check['code']);	

    $_new = (object) $request->all();
			$_old = News::find($id);
			
			$_old->title = $_new->title;
			$_old->subtitle = $_new->subtitle;
			$_old->short_title = $_new->short_title;
			$_old->keywords = $_new->keywords;
			$_old->content = $_new->content;
			$_old->featured = $_new->featured;
			$_old->by = $_new->by;
			$_old->source = $_new->source;
      $_old->date = $_new->date;
      
      
			$_old->categories()->sync($request->__cat_subcats_converted);
      
			if($_old->video != null){
        if($_new->video_url==null){
          $_old->video_id = null;
        }
        else
        {
          $_vdata = json_decode($_new->video_data);
          $_old->video->url = $_new->video_url;
          $_old->video->source = $_vdata->source;
          $_old->video->title = $_new->video_title;
          $_old->video->description = $_new->video_description;
          $_old->video->date = $_new->video_date_submit;
          $_old->video->thumbnail = $_new->video_thumbnail;
          $_old->video->data = $_new->video_data;
          $_old->video->start_at = $_new->start_at;
          $_old->video->save();
        } 
      }
      else
      {
        if($_new->video_data!=null){
          $_vdata = json_decode($_new->video_data);
          $_old->video()->associate(Video::create([
            'url' => $_new->video_url,
            'source' => $_vdata->source, //depois fazer esse dado vir do submit		
            'title' => $_new->video_title,
            'description' => $_new->video_description,
            'date' => $_new->video_date_submit,
            'thumbnail' => $_new->video_thumbnail,
            'data' => $_new->video_data,
            'start_at' => $_new->start_at
          ]));
        }
      }


    if($_old->group != null)
				$_old->group->manageImages(json_decode($_new->__dz_images),json_decode($_new->__dz_copy_params));
			else
			{
				if(count(json_decode($_new->__dz_images))>0)
				{
					$_old->group()->associate(Group::create([
						'group' => $_new->title,
						'description' => 'Album de imagens vinculada a notícia '.$_old->id			
					]));
					$_old->group->manageImages(json_decode($_new->__dz_images),json_decode($_new->__dz_copy_params));
				}
			}
			
			$_old->save();
			return response()->json(['success'=>$_old->save()]);
	}

	public function delete($id){
    $check = $this->__delete();
    if(!$check['status'])
      return response()->json(['errors' => $check['errors'] ], $check['code']);	

      $obj = News::find($id);
			$obj = $obj->delete();
			return  json_encode(['sts'=>$obj]);
  }
}
