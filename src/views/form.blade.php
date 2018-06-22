<form action = '/admin/news/create' id='default-form' method = 'post' class = 'form-fit'>
  @component('IntranetOne::io.components.wizard',[
    "_id" => "default-wizard",
    "_min_height"=>"435px",
    "_steps"=> [
        ["name" => "Dados Gerais", "view"=> "News::form-general"],
        ["name" => "Conteúdo da Notícia", "view"=> "News::form-content"],
        [
          "name" => "Categorias",
          "view"=> "IntranetOne::io.forms.form-categories",
          "params"=>[
            "cat"=>"News"
          ]
        ],
        ["name" => "Imagens", "view"=> "IntranetOne::io.forms.form-images"],
        ["name" => "Video", "view"=> "IntranetOne::io.forms.form-video"],
      ]
  ])
  @endcomponent
</form>