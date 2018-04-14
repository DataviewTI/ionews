<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateNewsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
			Schema::create('news', function(Blueprint $table)
			{
				$table->increments('id');
				$table->string('title');
        $table->char('short_title',100)->nullable();
				$table->string('subtitle')->nullable();
				$table->string('keywords')->nullable();
				$table->text('content');
				$table->mediumText('preview')->nullable();
				$table->boolean('featured')->default(false);
				$table->char('by',100);
        $table->char('source',40)->nullable();
				$table->dateTime('date');
        $table->boolean('facebook_comments')->default(1);
        $table->boolean('twitter_comments')->default(1);
        $table->integer('group_id')->unsigned()->nullable();
        $table->integer('video_id')->unsigned()->nullable();
        $table->timestamps();
				$table->softDeletes();
        $table->foreign('group_id')->references('id')->on('groups')->onDelete('cascade')->onUpdate('cascade');
        $table->foreign('video_id')->references('id')->on('videos')->onDelete('cascade')->onUpdate('cascade');
			});
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('news');
    }
}
