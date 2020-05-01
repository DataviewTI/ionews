# Cadastro de Notícias para IntranetOne

Cadastro de Notícias para IntranetOne. IONews requires IntranetOne.

## Instalação

#### Composer installation

Laravel 7 or above, PHP >= 7.2.5

```sh
composer require dataview/ionews dev-master
```

laravel 5.6 or below, PHP >= 7 and < 7.2.5

```sh
composer require dataview/ionews 1.0.0
```

#### Laravel artisan installation

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
