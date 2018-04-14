<?php
/*
  funções declaradas dentro do web.php geram erro no artisan config:cache, mensagem de declaração duplicada
  sem existir, por isso foi usado o helper;
*/

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                                                                                             
███████╗    ██████╗     ██╗   ██╗            ███╗   ██╗    ███████╗    ██╗    ██╗    ███████╗
██╔════╝    ██╔══██╗    ██║   ██║            ████╗  ██║    ██╔════╝    ██║    ██║    ██╔════╝
███████╗    ██████╔╝    ██║   ██║            ██╔██╗ ██║    █████╗      ██║ █╗ ██║    ███████╗
╚════██║    ██╔══██╗    ╚██╗ ██╔╝            ██║╚██╗██║    ██╔══╝      ██║███╗██║    ╚════██║
███████║    ██║  ██║     ╚████╔╝             ██║ ╚████║    ███████╗    ╚███╔███╔╝    ███████║
╚══════╝    ╚═╝  ╚═╝      ╚═══╝              ╚═╝  ╚═══╝    ╚══════╝     ╚══╝╚══╝     ╚══════╝
                                                                                             
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

Route::group(['prefix' => 'admin', 'middleware' => ['web','admin'], 'as' => 'admin.'],function(){
    Route::group(['prefix' => 'news'], function () {
    Route::get('/','NewsController@index');
    Route::post('store', 'NewsController@store');
    Route::get('list', 'NewsController@list');
    Route::get('edit/{id}', 'NewsController@edit');
    Route::post('update/{id}', 'NewsController@update');
    Route::get('html-content/{id}', 'NewsController@getHTMLContent');
    Route::get('categories', 'NewsController@getCategories');
    Route::get('subcategories/{catid}', 'NewsController@getSubCategories');
    Route::get('moxieconfig', 'NewsController@moxieConfig');
    Route::get('destroy/{id}', 'NewsController@destroy');			
  });
});
