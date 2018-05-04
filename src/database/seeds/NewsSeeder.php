<?php
namespace Dataview\IONews;

use Illuminate\Database\Seeder;
use Dataview\IntranetOne\Service;
use Sentinel;
use Dataview\IntranetOne\Category;

class NewsSeeder extends Seeder
{
    public function run(){
      //cria o serviço se ele não existe
      if(!Service::where('service','News')->exists()){
        Service::insert([
            'service' => "News",
            'ico' => 'ico-news',
            'alias'=>'news',
            'description' => 'Cadastro de Notícias',
            'order' => Service::max('order')+1
          ]);
      }

      //Adiciona a categoria e subcategorias padrão
      if(!Category::where('Category','News')->exists()){
        $news = Category::create([
          'category' => 'News',
          'category_slug' => 'news',
           'description' => 'Main category for news',
           'erasable'=>false,
           'order' => 0
        ]);

        $cats = ['Geral'];
        foreach($cats as $c){
          Category::create([
            'category_id' => $news->id,
            'category' => $c,
            'erasable'=>false,
            'category_slug' => str_slug($c),
            'order' => (Category::where('category_id',$news->id)->max('order'))+1
          ]);
        }
      }

      //seta privilegios padrão para o user admin
      $user = Sentinel::findById(1);
      $user->addPermission('news.view');
      $user->addPermission('news.create');
      $user->addPermission('news.update');
      $user->addPermission('news.delete');
      $user->save();
    }
} 