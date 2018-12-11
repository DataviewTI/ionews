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

      //seta privilegios padrão para o user odin
      $odinRole = Sentinel::findRoleBySlug('odin');
      $odinRole->addPermission('news.view');
      $odinRole->addPermission('news.create');
      $odinRole->addPermission('news.update');
      $odinRole->addPermission('news.delete');
      $odinRole->save();

      //seta privilegios padrão para o role admin
      $adminRole = Sentinel::findRoleBySlug('admin');
      $adminRole->addPermission('news.view');
      $adminRole->addPermission('news.create');
      $adminRole->addPermission('news.update');
      $adminRole->addPermission('news.delete');
      $adminRole->save();

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
      
    }
} 
