
# Cadastro de Notícias para IntranetOne
Cadastro de Notícias para IntranetOne. IONews requires IntranetOne.
## Conteúdo
 
## Instalação

```sh
composer require dataview/ionews
```
```sh
php artisan io-news:install
```

- Configure o webpack conforme abaixo 
```js
...
let news = require('intranetone-news');
io.compile({
  services:[
    ...
    new news(),
    ...
  ]
});

```
- Compile os assets e faça o cache
```sh
npm run dev|prod|watch
php artisan config:cache
```
