<?php

namespace Dataview\IONews;

use Illuminate\Support\ServiceProvider;

class IONewsServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
      //Publish Files
        $this->publishes([
          __DIR__.'/app' => app_path('/')

        ],'app');
      
      $this->loadViewsFrom(__DIR__.'/views', 'News');

      $this->loadMigrationsFrom(__DIR__.'/database/migrations');
      
      //$this->mergeConfigFrom(__DIR__.'/config/app.php', 'intranetone');
    }

    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
  
      $this->app['router']->group(['namespace' => 'dataview\ionews'], function () {
        include __DIR__.'/routes/web.php';
      });

      $this->app->make('Dataview\IONews\NewsController');
      $this->app->make('Dataview\IONews\NewsRequest');
      //$this->app->make('Dataview\IONews\News');
    }
}
