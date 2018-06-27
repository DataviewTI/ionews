<div class = 'row'>
    <div class="col-md-7 col-sm-12 pl-1">
      <div class="form-group">
        <label for = 'title' class="bmd-label-floating __required">Título da Notícia</label>
        <input name = 'title' type = 'text' class = 'form-control form-control-lg' />
      </div>
    </div>
    <div class="col-md-5 col-sm-12 ">
      <div class = 'row'>
        <div class="col-md-8 col-sm-12">
          <div class="form-group">
            <label for = 'short_title' class="bmd-label-floating">Título Curto</label>
            <input name = 'short_title' type = 'text' class = 'form-control form-control-lg' />
          </div>
        </div>
        <div class="col-md-4 col-sm-12 pr-1">
          <div class="form-group">
            <label for = 'date' class="bmd-label-floating __required">Data da Notícia</label>
            <input name = 'date' id = 'date' type = 'text' class = 'form-control datepicker form-control-lg' />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class = 'row'>
    <div class="col-md-9 col-sm-12 pl-1">
      <div class="form-group">
        <label for = 'subtitle' class = 'bmd-label-floating'>Subtítulo</label>
        <input name = 'subtitle' type = 'text' class = 'form-control form-control-lg' />
      </div>
    </div>
    <div class="col-md-3 col-sm-12">
      <div class="form-group">
        <label for = 'featured' class = 'bmd-label-static d-block' style = 'font-size:14px'>Notícia em Destaque?</label>
        <button type="button" class="mt-3 btn btn-lg aanjulena-btn-toggle" data-toggle="button" aria-pressed="false" data-default-state='false' autocomplete="off" name = 'featured' id = 'featured'>
        <div class="handle"></div>
        </button>
        <input type = 'hidden' name = '__featured' id = '__featured' />
      </div>
    </div>
  </div>
  <div class = 'row' style = 'margin-top:-8px'>
    <div class="col-md-7 col-sm-12 pl-1">
      <div class="form-group">
        <label for = 'by' class = 'bmd-label-floating __required'>Responsável pela notícia</label>
        <input name = 'by' type = 'text' class = 'form-control form-control-lg' />
      </div>
    </div>
    <div class="col-md-5 col-sm-12 pr-1">
      <div class="form-group">
        <label for = 'source' class = 'bmd-label-floating'>Fonte da notícia</label>
        <input name = 'source' type = 'text' class = 'form-control form-control-lg' />
      </div>
    </div>
  </div>
  <div class = 'row'>
    <div class="col-md-12 col-sm-12 px-1">
      <div class="form-group m-0">
          <label for = 'keywords' class = 'bmd-label-static'>Palavras chave</label>
          @component('IntranetOne::io.components.pillbox',["_id" => "keywords"])
          @endcomponent
        </div>
    </div>
  </div>
  <div class = 'p-0 m-0' id='kws-container'>
    <span>kw1</span>
    <span>kw2</span>
    <span>kw3</span>
    <span>kw4</span>
    <span>kw5</span>
    <span>kw6</span>
    <span>kw7</span>
    <span>...</span>
  </div>