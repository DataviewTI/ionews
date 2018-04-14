<?php
namespace Dataview\IONews\Console;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use Dataview\IONews\IONewsServiceProvider;

class IONewsInstallCommand extends Command
{
    protected $name = 'intranetone-ionews:install';

    protected $description = 'Instalação do serviço para IntranetOne - News';
    public function handle()
    {
      $loops = [1,2,3,4,5];
      $msg = [
        "Love is: never having to say XX% loaded...",
        "Breaking water...",
        "Getting stuck in traffic...",
        "Dividing by 0...",
        "Crying over spilled milk...",
        "Generating Lex's voice",
        "Patching Conics...",
        "Just a minute, while I dig the dungeon...",
        "disinfecting germ cells...",
        "Spinning up the hamster...",
        "Programming the flux capacitor...",
        "640K ought to be enough for anybody...",
        "Checking the gravitational constant in your locale...",
        "Dig on the 'X' for buried treasure... ARRR!...",
        "It's still faster than you could draw it..."
      ];

      $this->info('Publicando os arquivos...');
        
        $i = array_random($loops);
        while($i--){
          sleep(array_random($loops));
          $this->info(array_random($msg));
        }
        sleep(1);

        Artisan::call('vendor:publish', [
            '--provider' => IONewsServiceProvider::class,
        ]);

        $this->info('migrando tabelas...');
        Artisan::call('migrate');
      
      $this->info(' ');
        $this->info('IntranetOne - News Instalado com sucesso! _|_');
    }
}
