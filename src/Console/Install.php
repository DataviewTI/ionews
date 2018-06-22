<?php
namespace Dataview\IONews\Console;
use Dataview\IntranetOne\Console\IOServiceInstallCmd;
use Dataview\IONews\IONewsServiceProvider;
use Dataview\IONews\NewsSeeder;

class Install extends IOServiceInstallCmd
{
  public function __construct(){
    parent::__construct([
      "service"=>"news",
      "provider"=> IONewsServiceProvider::class,
      "seeder"=>NewsSeeder::class,
    ]);
  }

  public function handle(){
    parent::handle();
  }
}
