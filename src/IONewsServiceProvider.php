<?php

namespace Dataview\IONews;

use Illuminate\Support\ServiceProvider;
use Dataview\IONews\Console\IONewsInstallCommand;

class IONewsServiceProvider extends ServiceProvider
{
    public function boot()
    {
      $this->loadViewsFrom(__DIR__.'/views', 'News');
      //$this->loadMigrationsFrom(__DIR__.'/database/migrations');
    }


    public function register()
    {
      $this->commands([
        IONewsInstallCommand::class,
      ]);

      $this->app['router']->group(['namespace' => 'dataview\ionews'], function () {
        include __DIR__.'/routes/web.php';
      });
      //buscar uma forma de não precisar fazer o make de cada classe

      $this->app->make('Dataview\IONews\NewsController');
      $this->app->make('Dataview\IONews\NewsRequest');
      //$this->app->make('Dataview\IONews\News');
    }
}
