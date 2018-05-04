<?php
namespace Dataview\IONews\Console;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schema;
use Dataview\IntranetOne\IntranetOne;
use Dataview\IONews\NewsSeeder;
use Dataview\IONews\IONewsServiceProvider;

class IONewsInstallCommand extends Command
{
    protected $name = 'intranetone-news:install';

    protected $description = 'Instalação do serviço para IntranetOne - News';
    public function handle()
    {
      $this->info('Publicando os arquivos...');
        
      IntranetOne::installMessages($this);

      Artisan::call('vendor:publish', [
          '--provider' => IONewsServiceProvider::class,
      ]);

      if(!Schema::hasTable('news')){
        $this->info('Executando migrações news service...');
        Artisan::call('migrate', [
          '--path' => 'vendor/dataview/ionews/src/database/migrations',
        ]);
      }
          
      IntranetOne::installMessages($this,2);

      $this->info('registrando serviço...');
      Artisan::call('db:seed', [
        '--class' => NewsSeeder::class,
      ]);

      
      $this->info(' ');
      $this->info('IntranetOne - News Instalado com sucesso! _|_');
    }
}
