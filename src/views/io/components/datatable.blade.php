<table class="table table-striped table-bordered hover" cellspacing="0" width="100%" id="{{$_id}}">
	<thead>
		@foreach($_columns as $col)
			<th class = "__dt_{{str_slug($col['title'])}}">{!! $col['title'] !!}</th>
		@endforeach
	</thead>
</table>
