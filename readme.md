
# Galeria de fotos para IntranetOne
Cadastro de Notícias...
IONews requires IntranetOne
## Conteúdo
 
- [Instalação](#instalação)
- [Assets](#assets) 

## Instalação

```sh
composer require dataview/ionews
```
Instalar o IntranetOne com php artisan
```sh
php artisan intranetone-news:install
```


## Assets
  
 - Instalar pacote js da intranetone
 `bower install intranetone-news --save`


### Configurações Manuais

Abrir o package em "resources/vendors/dataview-intranetone-news/src" e inserir o conteúdo do arquivo "append_webpack.js" no webpack do projeto

 - Compilar os assets e fazer cache
 `npm run dev|prod|watch`
 `php artisan config:cache`
 