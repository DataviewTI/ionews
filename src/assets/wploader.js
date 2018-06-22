'use strict';
let mix = require('laravel-mix');

function IONews(params={}){
  let $ = this;
  let dep = {
    news: 'node_modules/intranetone-news/src/',
    moment: 'node_modules/moment/',
    momentdf: 'node_modules/moment-duration-format/lib/',
    sortable: 'node_modules/sortablejs/',
    wickedpicker: 'node_modules/dv-wickedpicker/dist/',
    dropzone: 'node_modules/dropzone/dist/',
    tinymce: 'node_modules/tinymce/',
  }

  let config = {
    optimize:false,
    sass:false,
    cb:()=>{},
  }
  
  this.compile = (IO,callback = ()=>{})=>{

    mix.copyDirectory(dep.tinymce,IO.dest.io.vendors+'tinymce');
    mix.copyDirectory(IO.src.io.vendors + 'tinymce/moxiemanager/', IO.dest.io.vendors + 'tinymce/plugins/moxiemanager/');
    
    mix.copy(IO.src.io.vendors + 'tinymce/pt_BR.js', IO.dest.io.vendors + 'tinymce/langs/pt_BR.js');

    mix.styles([
      IO.src.css + 'helpers/dv-buttons.css',
      IO.src.io.css + 'dropzone.css',
      IO.src.io.css + 'dropzone-preview-template.css',
      IO.src.io.vendors + 'aanjulena-bs-toggle-switch/aanjulena-bs-toggle-switch.css',
      IO.src.io.css + 'sortable.css',
      IO.dep.io.toastr + 'toastr.min.css',
      IO.src.io.css + 'toastr.css',
      IO.src.io.root + 'forms/video-form.css',
      dep.news + 'news.css',
    ], IO.dest.io.root + 'services/io-news.min.css');

    mix.babel([
      dep.sortable + 'Sortable.min.js',
      IO.src.io.vendors + 'aanjulena-bs-toggle-switch/aanjulena-bs-toggle-switch.js',
      IO.dep.io.toastr + 'toastr.min.js',
      IO.src.io.js + 'defaults/def-toastr.js',
      dep.dropzone + 'dropzone.js',
      IO.src.io.js + 'dropzone-loader.js',
      IO.src.io.js + 'extensions/ext-pillbox.js',
      dep.wickedpicker + 'wickedpicker.min.js',
      IO.src.io.js + 'defaults/def-toastr.js',
    ], IO.dest.io.root + 'services/io-news-babel.min.js');

    mix.scripts([
      dep.moment + 'min/moment.min.js',
      IO.src.io.vendors + 'moment/moment-pt-br.js',
      dep.momentdf +'moment-duration-format.js',
    ], IO.dest.io.root + 'services/io-news-mix.min.js');

    mix.babel(dep.news+'news.js', IO.dest.io.root + 'services/io-news.min.js');
    
    callback(IO);
  }
}

module.exports = IONews;
