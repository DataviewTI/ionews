@extends('IntranetOne::io.layout.dashboard')

{{-- page level styles --}}
@section('header_styles')
  <link rel="stylesheet" type="text/css" href="{{ asset('css/pickadate-full.min.css') }}">
  <link rel="stylesheet" type="text/css" href="{{ asset('io/services/io-news.min.css') }}">
</style>
@stop

@section('main-heading')
@stop

@section('main-content')
	<!--section ends-->
			@component('IntranetOne::io.components.nav-tabs',
			[
				"_id" => "default-tablist",
				"_active"=>0,
				"_tabs"=> [
					[
						"tab"=>"Listar",
						"icon"=>"ico ico-list",
						"view"=>"News::table-list"
					],
					[
						"tab"=>"Cadastrar",
						"icon"=>"ico ico-new",
						"view"=>"News::form"
					],
					[
						"tab"=>"Categorias",
						"icon"=>"ico ico-structure-2",
						"view"=>"IntranetOne::io.layout.categories-crud",
						"params"=>[
							"cat"=>"News"
						]
					],
				]
			])
			@endcomponent
	<!-- content -->
  @stop

  @section('after_body_scripts')
    @include('IntranetOne::base.social.fb-sdk',[
        'app_id'=>config('intranetone.social_media.facebook.app_id'),
        'app_version'=>config('intranetone.social_media.facebook.app_version'),
        'app_locale'=>config('intranetone.social_media.facebook.locale')
        ])
  @endsection

@section('footer_scripts')
@include('IntranetOne::base.social.google-youtube')

<script src="{{ asset('js/pickadate-full.min.js') }}" type="text/javascript"></script>
<!--<script src="{{ asset('io/vendors/dropzone/dropzone.min.js') }}" type="text/javascript"></script>-->
<script src="{{ asset('io/vendors/tinymce/tinymce.min.js') }}" type="text/javascript"></script>
<script src="{{ asset('io/vendors/tinymce/langs/pt_BR.js') }}" type="text/javascript"></script>

<script src="{{ asset('io/services/io-news-babel.min.js') }}" type="text/javascript"></script>
<script src="{{ asset('io/services/io-news-mix.min.js') }}" type="text/javascript"></script>
<script src="{{ asset('io/services/io-news.min.js') }}" type="text/javascript"></script>
@stop
