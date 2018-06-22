<?php
namespace Dataview\IONews\Console;
use Dataview\IntranetOne\Console\IOServiceRemoveCmd;
use Dataview\IONews\IONewsServiceProvider;
use Dataview\IntranetOne\IntranetOne;


class Remove extends IOServiceRemoveCmd
{
  public function __construct(){
    parent::__construct([
      "service"=>"news",
      "tables" =>['news_category','news'],
    ]);
  }

  public function handle(){
    parent::handle();
  }
}
