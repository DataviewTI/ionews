<form action = '/admin/news/store' id='default-form' method = 'post' class = 'form-fit'>
  @component('IntranetOne::io.components.wizard',[
    "_id" => "default-wizard",
    "_min_height"=>"435px",
    "_steps"=> [
        ["name" => "Dados Gerais", "view"=> "News::io.services.news.form-general"],
        ["name" => "Conteúdo da Notícia", "view"=> "News::io.services.news.form-content"],
        ["name" => "Vincular a Categorias", "view"=> "News::io.services.news.form-categories"],
        ["name" => "Imagens", "view"=> "News::io.services.news.form-images"],
        ["name" => "Video", "view"=> "News::io.services.news.form-video"],
      ]
  ])
  @endcomponent
</form>