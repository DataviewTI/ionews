new IOService(
  {
    name: "News",
  },
  function(self) {
    $("#featured").attrchange(function(attrName) {
      if (attrName == "aria-pressed") {
        $("#__featured").val($(this).attr("aria-pressed"));
      }
    });

    //video configs
    $(".video-thumb").each(function(i, obj) {
      $(obj).on("click", function() {
        $(".video-thumb").removeClass("active");
        $(this).addClass("active");
      });
    });

    $("#video_start_at").wickedpicker({
      now: "00:00:00",
      clearable: false,
      twentyFour: true,
      showSeconds: true,
      clearable: false,
      beforeShow: function(e, t) {
        $(t).css({
          width:
            $(e)
              .parent()
              .width() + "px",
        });
        self.fv[4].revalidateField("video_start_at");
      },
    });

    $("#video_start_at").on("change", function() {
      //para evitar chamadas redundantes
      if ($(this).attr("data-old-value") != $(this).val()) {
        $(this).attr("data-old-value", $(this).val());
        self.fv[4].revalidateField("video_start_at");
      }
    });

    //pickadate objects initialization
    $("#video_date")
      .pickadate({
        formatSubmit: "yyyy-mm-dd 00:00:00",
        onClose: function() {},
      })
      .pickadate("picker")
      .on("render", function() {
        self.fv[0].revalidateField("date");
      });

    $("#btn-get-current-time").on("click", function() {
      let time = moment.duration(
        parseInt(self.VPlayer.__getCurrent()),
        "seconds"
      );
      $("#video_start_at").val(time.format("hh : mm : ss", { trim: false }));
      $("#video_start_at")
        .data("plugin_wickedpicker")
        .setTime({
          hours: time._data.hours,
          minutes: time._data.minutes,
          seconds: time._data.seconds,
        });
      //pause video
      self.VPlayer.__pause();
    });

    //Sortable initialization
    Sortable.create(document.getElementById("custom-dropzone"), {
      animation: 250,
      handle: ".dz-reorder",
    });

    [
      "__sl-box-left-1",
      "__sl-box-left-2",
      "__sl-box-left-3",
      "__sl-main-group",
    ].forEach(function(obj) {
      if (document.getElementById(obj) != null)
        Sortable.create(document.getElementById(obj), {
          handle: ".__sl-handle",
          animation: 250,
          group: "sl-categories",
          onAdd: function(evt) {
            var item = evt.item;
            self.fv[2].revalidateField("__cat_subcats");
          },
          sort: false,
        });
    });

    //Moxie config initialization
    $.ajax({
      url: self.path + "/moxieconfig",
      type: "GET",
      success: function(data) {
        if (data.status == true)
          console.log("moxiemanager simlink criado com sucesso");
        else console.warn("erro ao criar moxiemanager simlink");
      },
    });

    //pickadate objects initialization
    $("#date")
      .pickadate({
        formatSubmit: "yyyy-mm-dd 00:00:00",
        onClose: function() {
          $("[name='rg']").focus();
        },
      })
      .pickadate("picker")
      .on("render", function() {
        self.fv[0].revalidateField("date");
      });

    //pillbox and other fuelux initialization
    $("#keywords").pillbox({
      edit: true,
      acceptKeyCodes: [13, 188, 191],
      onAdd: function(data, callback) {
        var els = [];
        $("#keywords")
          .pillbox("items")
          .forEach(function(a) {
            els.push(a.value + "");
          });
        if (!els.includes(data.value))
          $("#keywords").pillbox(
            "addColorItem",
            { text: data.text, value: data.value },
            "random",
            true
          );
        //callback(data);
        else toastr["error"]("não informe palavras chave duplicadas!");
      },
      onRemove: function(data, callback) {
        if (data.el.attr("tip") == "true") {
          $(document.createElement("span"))
            .text(data.value)
            .on("click", function(e) {
              $("#keywords").pillbox(
                "addColorItem",
                { text: $(this).text(), value: $(this).text() },
                "random",
                true
              );
              $(this).remove();
            })
            .appendTo($("#kws-container"));
        }
        callback(data);
      },
    });

    $("#kws-container span").on("click", function(e) {
      $("#keywords").pillbox(
        "addColorItem",
        { text: $(this).text(), value: $(this).text() },
        "random",
        true
      );
      $(this).remove();
    });

    //Start tinymce
    tinymce.init({
      selector: "#content",
      moxiemanager_image_settings: {
        moxiemanager_title: "IntranetOne - Seleção de Arquivos", //moxi
        moxiemanager_extensions: "jpg,png,gif",
        //moxiemanager_image_template: "<a href='#'><img src='{$meta.thumb_url}' class = 'XXX'/></a>",
        moxiemanager_view: "thumbs",
        onsave: function(args) {},
      },
      relative_urls: false, //moxi
      paste_auto_cleanup_on_paste: true,
      paste_as_text: true,
      paste_remove_styles: true,
      paste_remove_styles_if_webkit: true,
      paste_strip_class_attributes: true,
      image_advtab: true,
      plugins: "moxiemanager link image paste",
      //toolbar: "image insertimage insertfile",
      document_base_url: document.location.origin + "/storage/moxiemanager/",
      language: "pt_BR",
      resize: false,
      height: 310,
      setup: function(editor) {
        editor.on("keyup", function(e) {
          self.fv[1].revalidateField("content");
        });
      },
      image_class_list: [
        { title: "img-fluid", value: "img-fluid" },
        { title: "img-fluid w-100", value: "img-fluid w-100" },
        { title: "img-fluid h-100", value: "img-fluid h-100" },
      ] /*style_formats       : [
          { title : 'Paragraph', block : 'p', classes : '', styles : { } },
          { title : 'Header 1', block : 'h1', classes : '', styles : { } },
        ]*/,
    });

    //Datatables initialization
    self.dt = $("#default-table")
      .DataTable({
        aaSorting: [[3, "desc"]],
        ajax: self.path + "/list",
        initComplete: function() {
          //parent call
          let api = this.api();
          this.teste = 10;
          $.fn.dataTable.defaults.initComplete(this);

          api.addDTSelectFilter([
            { el: $("#ft_featured"), column: "featured" },
            { el: $("#ft_has_images"), column: "group_id" },
            //verificar cats e subcats durante os filtros, tem que fazer outras N verificações
            {
              el: $("#ft_category"),
              column: "categories",
              format: "|{{value}}|",
            },
            {
              el: $("#ft_subcategory"),
              column: "categories",
              format: "|{{value}}|",
            },
          ]);

          $("#ft_dtini")
            .pickadate()
            .pickadate("picker")
            .on("render", function() {
              api.draw();
            });

          $("#ft_dtfim")
            .pickadate()
            .pickadate("picker")
            .on("render", function() {
              api.draw();
            });

          api.addDTBetweenDatesFilter({
            column: "date",
            min: $("#ft_dtini"),
            max: $("#ft_dtfim"),
          });

          $("#ft_category").change(function(e) {
            if ($(this).val() == "")
              $("#ft_subcategory")
                .prop("disabled", "disabled")
                .find("option")
                .remove()
                .end();
            else
              $.ajax({
                url: "categories/list/" + $(this).val(),
                dataType: "json",
                success: function(data) {
                  if (data.length > 0) {
                    $("#ft_subcategory").removeAttr("disabled");
                    let arr = [{ value: "", text: "" }];
                    $.each(data, function(i, item) {
                      arr.push({ value: item.id, text: item.category });
                    });
                    refreshSelect($("#ft_subcategory"), arr);
                  } else
                    $("#ft_subcategory")
                      .prop("disabled", "disabled")
                      .find("option")
                      .remove();
                },
              });
          });
        },
        footerCallback: function(row, data, start, end, display) {},
        columns: [
          { data: "id", name: "id" },
          { data: "null", name: "null" },
          { data: "title", name: "title" },
          { data: "date", name: "date" },
          { data: "categories", name: "categories" },
          { data: "group_id", name: "group_id" },
          { data: "featured", name: "featured" },
          { data: "actions", name: "actions" },
        ],
        columnDefs: [
          { targets: "__dt_", width: "3%", searchable: true, orderable: true },
          {
            targets: "__dt_c",
            searchable: false,
            width: "2%",
            orderable: false,
            className: "text-center",
            render: function(data, type, row) {
              var data = row["categories"];
              var cats = [];
              data.forEach(function(c) {
                cats.push(c.category);
                if (
                  c.parent != "" &&
                  c.parent != null &&
                  !cats.includes(c.parent.category)
                )
                  cats.push(c.parent.category);
              });

              return self.dt.addDTIcon({
                ico: "ico-structure",
                title:
                  "<span class = 'text-left'>" + cats.join("<br>") + "</span>",
                value: 1,
                pos: "right",
                _class: "text-primary text-normal",
                html: true,
              });
            },
          },
          {
            targets: "__dt_data",
            type: "date-br",
            width: "9%",
            orderable: true,
            className: "text-center",
            render: function(data, type, row) {
              return moment(data).format("DD/MM/YYYY");
            },
          },
          {
            targets: "__dt_cats",
            visible: false,
            render: function(data, type, row) {
              var cats = [];
              data.forEach(function(c) {
                cats.push(c.id);
                if (
                  c.parent != "" &&
                  c.parent != null &&
                  !cats.includes(c.parent.id)
                )
                  cats.push(c.parent.id);
              });
              return "|" + cats.join("|") + "|";
            },
          },
          {
            targets: "__dt_d",
            width: "2%",
            orderable: true,
            className: "text-center",
            render: function(data, type, row) {
              if (data)
                return self.dt.addDTIcon({
                  ico: "ico-image",
                  title: "notícia com imagens",
                  value: 1,
                  pos: "left",
                  _class: "text-success",
                });
              else return self.dt.addDTIcon({ value: 0, _class: "invisible" });
            },
          },
          {
            targets: "__dt_f",
            width: "2%",
            orderable: true,
            className: "text-center",
            render: function(data, type, row) {
              if (data)
                return self.dt.addDTIcon({
                  ico: "ico-star",
                  value: 1,
                  title: "notícia destaque",
                  pos: "left",
                  _class: "text-info",
                });
              else return self.dt.addDTIcon({ value: 0, _class: "invisible" });
            },
          },
          {
            targets: "__dt_acoes",
            width: "7%",
            className: "text-center",
            searchable: false,
            orderable: false,
            render: function(data, type, row, y) {
              return self.dt.addDTButtons({
                buttons: [
                  { ico: "ico-eye", _class: "text-primary", title: "preview" },
                  { ico: "ico-trash", _class: "text-danger", title: "excluir" },
                  { ico: "ico-edit", _class: "text-info", title: "editar" },
                ],
              });
            },
          },
        ],
      })
      .on("click", ".btn-dt-button[data-original-title=editar]", function() {
        var data = self.dt.row($(this).parents("tr")).data();
        self.view(data.id);
      })
      .on("click", ".ico-trash", function() {
        var data = self.dt.row($(this).parents("tr")).data();
        self.delete(data.id);
      })
      .on("click", "button.ico-eye", function() {
        var data = self.dt.row($(this).parents("tr")).data();
        preview({ id: data.id });
      })
      .on("draw.dt", function() {
        $('[data-toggle="tooltip"]').tooltip();
      });

    let form = document.getElementById(self.dfId);
    let fv1 = FormValidation.formValidation(
      form.querySelector('.step-pane[data-step="1"]'),
      {
        fields: {
          title: {
            validators: {
              notEmpty: {
                message: "O título da notícia é obrigatório!",
              },
            },
          },
          date: {
            validators: {
              notEmpty: {
                message: "O data da notícia é obrigatória",
              },
              date: {
                format: "DD/MM/YYYY",
                message: "Informe uma data válida!",
              },
            },
          },
          by: {
            validators: {
              notEmpty: {
                message: "O responsável pela notícia deve ser informado!",
              },
            },
          },
        },
        plugins: {
          trigger: new FormValidation.plugins.Trigger(),
          submitButton: new FormValidation.plugins.SubmitButton(),
          // defaultSubmit: new FormValidation.plugins.DefaultSubmit(),
          bootstrap: new FormValidation.plugins.Bootstrap(),
          icon: new FormValidation.plugins.Icon({
            valid: "fv-ico ico-check",
            invalid: "fv-ico ico-close",
            validating: "fv-ico ico-gear ico-spin",
          }),
        },
      }
    ).setLocale("pt_BR", FormValidation.locales.pt_BR);

    let fv2 = FormValidation.formValidation(
      form.querySelector('.step-pane[data-step="2"]'),
      {
        fields: {
          content: {
            validators: {
              callback: {
                message:
                  "O conteúdo da notícia não pode ter menos que 10 caracteres!",
                callback: function(value, validator, $field) {
                  var text = tinymce
                    .get("content")
                    .getContent({ format: "text" });
                  return text.length >= 10;
                },
              },
            },
          },
        },
        plugins: {
          trigger: new FormValidation.plugins.Trigger(),
          submitButton: new FormValidation.plugins.SubmitButton(),
          // defaultSubmit: new FormValidation.plugins.DefaultSubmit(),
          bootstrap: new FormValidation.plugins.Bootstrap(),
          icon: new FormValidation.plugins.Icon({
            valid: "fv-ico ico-check",
            invalid: "fv-ico ico-close",
            validating: "fv-ico ico-gear ico-spin",
          }),
        },
      }
    ).setLocale("pt_BR", FormValidation.locales.pt_BR);

    let fv3 = FormValidation.formValidation(
      form.querySelector('.step-pane[data-step="3"]'),
      {
        fields: {
          __cat_subcats: {
            validators: {
              callback: {
                message:
                  "A notícia deve ter no mínimo uma categoria vinculada!",
                callback: function(value, validator, $field) {
                  return (
                    $("#__sl-main-group button.list-group-item").length > 0
                  );
                },
              },
            },
          },
        },
        plugins: {
          trigger: new FormValidation.plugins.Trigger(),
          submitButton: new FormValidation.plugins.SubmitButton(),
          // defaultSubmit: new FormValidation.plugins.DefaultSubmit(),
          bootstrap: new FormValidation.plugins.Bootstrap(),
          icon: new FormValidation.plugins.Icon({
            valid: "fv-ico ico-check",
            invalid: "fv-ico ico-close",
            validating: "fv-ico ico-gear ico-spin",
          }),
        },
      }
    ).setLocale("pt_BR", FormValidation.locales.pt_BR);

    let fv4 = FormValidation.formValidation(
      form.querySelector('.step-pane[data-step="4"]'),
      {
        fields: {
          has_images: {
            validators: {
              callback: {
                message: "A notícia deve ter no mínimo uma imagem!",
                callback: function(input) {
                  if (self.dz.files.length > 0) {
                    return true;

                    toastr["error"](
                      "A notícia deve conter no mínimo uma imagem!"
                    );
                    return false;
                  }
                },
              },
            },
          },
        },
        plugins: {
          trigger: new FormValidation.plugins.Trigger(),
          submitButton: new FormValidation.plugins.SubmitButton(),
          // defaultSubmit: new FormValidation.plugins.DefaultSubmit(),
          bootstrap: new FormValidation.plugins.Bootstrap(),
          icon: new FormValidation.plugins.Icon({
            valid: "fv-ico ico-check",
            invalid: "fv-ico ico-close",
            validating: "fv-ico ico-gear ico-spin",
          }),
        },
      }
    ).setLocale("pt_BR", FormValidation.locales.pt_BR);

    let fv5 = FormValidation.formValidation(
      form.querySelector('.step-pane[data-step="5"]'),
      {
        fields: {
          video_url: {
            validators: {
              promise: {
                promise: function(input) {
                  let dfd = new $.Deferred(),
                    video = getVideoInfos($("#video_url").val()),
                    prom;

                  if (video.source != null) {
                    $("#embed-container-video").addClass("loading");
                    switch (video.source) {
                      case "youtube":
                        prom = getYoutubeVideoPromise(video, self);
                        break;
                      case "facebook":
                        prom = getFacebookVideoPromise(video, self);
                        break;
                    }

                    prom
                      .then((resolve) => {
                        resolve.callback(resolve);
                        $("#video_title").val(video.infos.title);
                        $("#video_description").val(video.infos.description);
                        $("#video_start_at").removeAttr("disabled");
                        $("#btn-get-current-time").removeClass(
                          "__disabled mouse-off"
                        );

                        makeVideoThumbs(video, self);
                        $("#video_data").val(JSON.stringify(video));
                        dfd.resolve({ valid: true });

                        if ($("#video_url").attr("data-loaded") !== undefined) {
                          let vdata = JSON.parse(
                            $("#video_url").attr("data-loaded")
                          );
                          //what need to call twice??
                          let vthumb = JSON.parse(
                            JSON.parse($("#video_url").attr("data-thumb"))
                          );
                          $("#video_title").val(vdata.title);
                          $("#video_description").val(vdata.description);
                          $(
                            $(".container-video-thumb .video-thumb")[vthumb.pos]
                          )
                            .css({
                              backgroundImage: "url('" + vthumb.url + "')",
                            })
                            .trigger("click");

                          $("#video_url")
                            .removeAttr("data-loaded")
                            .removeAttr("data-thumb");
                        }
                        return dfd.promise();
                      })
                      .catch((reject) => {
                        reject.callback(reject);
                        let msg =
                          reject.data != null
                            ? reject.data
                            : "Este link não corresponde a nenhum vídeo válido";
                        dfd.reject({
                          valid: false,
                          message: msg,
                        });
                      });
                  } else {
                    videoUnload(self);
                    if ($("#video_url").val() == "")
                      dfd.resolve({ valid: true });
                    else
                      dfd.reject({
                        valid: false,
                        message:
                          "Este link não corresponde a nenhum vídeo válido",
                      });
                  }
                  return dfd.promise();
                },
                message: "O link do vídeo informado é inválido",
              },
            },
          },
          video_start_at: {
            validators: {
              callback: {
                callback: function(input) {
                  let dur = moment.duration(input.value.replace(/\s/g, ""));
                  let isodur = $("#video_start_at").attr("data-video-duration");
                  if (isodur !== undefined && isodur != null) {
                    if (dur.asSeconds() > moment.duration(isodur).asSeconds())
                      return {
                        valid: false,
                        message:
                          "Início máximo em " +
                          moment.duration(isodur, "minutes").format("H:mm:ss"),
                      };
                  }
                  return true;
                },
              },
            },
          },
          video_date: {
            validators: {
              date: {
                format: "DD/MM/YYYY",
                message: "Informe uma data válida!",
              },
            },
          },
        },
        plugins: {
          trigger: new FormValidation.plugins.Trigger(),
          submitButton: new FormValidation.plugins.SubmitButton(),
          // defaultSubmit: new FormValidation.plugins.DefaultSubmit(),
          bootstrap: new FormValidation.plugins.Bootstrap(),
          icon: new FormValidation.plugins.Icon({
            valid: "fv-ico ico-check",
            invalid: "fv-ico ico-close",
            validating: "fv-ico ico-gear ico-spin",
          }),
        },
      }
    ).setLocale("pt_BR", FormValidation.locales.pt_BR);

    self.fv = [fv1, fv2, fv3, fv4, fv5];

    //Dropzone initialization
    self.dz = new DropZoneLoader({
      id: "#custom-dropzone",
      thumbnailWidth: 240,
      thumbnailHeight: 180,
      copy_params: {
        original: true,
        sizes: {
          sm: { w: 400, h: 300 },
          md: { w: 800, h: 600 },
        },
      },
      removedFile: function(file) {
        //self.fv[3].revalidateField('has_images');
      },
      onSuccess: function(file, ret) {
        self.fv[3].revalidateField("has_images");
      },
    });

    //need to transform wizardActions in a method of Class
    self.wizardActions(function() {
      var _kw = [];
      $("#keywords")
        .pillbox("items")
        .forEach(function(a) {
          _kw.push(a.value);
        });
      $("#__keywords").val(_kw.join(";"));
      $("#__keywords").val(_kw.join(";"));
      $("[name='__dz_images']").val(
        JSON.stringify(self.dz.getOrderedDataImages())
      );
      $("[name='__dz_copy_params']").val(JSON.stringify(self.dz.copy_params));
      $("[name='content']").val(
        tinymce.get("content").getContent({ format: "html" })
      );

      var cats = getCatAndSubCats();
      $("#__cat_subcats").val(cats);
      $(document.createElement("input"))
        .prop("type", "hidden")
        .prop("name", "main_cat")
        .val(cats[0])
        .appendTo(self.df);
    });

    self.callbacks.view = view(self);

    self.callbacks.update.onSuccess = function() {
      self.tabs["listar"].tab.tab("show");
    };

    self.callbacks.create.onSuccess = function() {
      self.tabs["listar"].tab.tab("show");
    };

    self.callbacks.unload = function(self) {
      $(".aanjulena-btn-toggle").aaDefaultState();
      $("#keywords").pillbox("removeItems");

      $("#__sl-main-group")
        .find(".list-group-item")
        .each(function(i, obj) {
          let appended = false;
          $(".__sl-box-source").each(function(j, source) {
            if ($(source).find(".list-group-item").length < 9 && !appended) {
              $(obj).appendTo($(source));
              appended = true;
            }
          });
        });
      self.fv[2].revalidateField("__cat_subcats");
      self.dz.removeAllFiles(true);
      videoUnload(self);
      // self.df.formValidation('revalidateField', '__has_images'); __has_images?
      // self.fv[3].revalidateField('has_images');
    };
  }
); //the end ??

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                                                                                                            
  ██╗      ██████╗  ██████╗ █████╗ ██╗         ███╗   ███╗███████╗████████╗██╗  ██╗ ██████╗ ██████╗ ███████╗
  ██║     ██╔═══██╗██╔════╝██╔══██╗██║         ████╗ ████║██╔════╝╚══██╔══╝██║  ██║██╔═══██╗██╔══██╗██╔════╝
  ██║     ██║   ██║██║     ███████║██║         ██╔████╔██║█████╗     ██║   ███████║██║   ██║██║  ██║███████╗
  ██║     ██║   ██║██║     ██╔══██║██║         ██║╚██╔╝██║██╔══╝     ██║   ██╔══██║██║   ██║██║  ██║╚════██║
  ███████╗╚██████╔╝╚██████╗██║  ██║███████╗    ██║ ╚═╝ ██║███████╗   ██║   ██║  ██║╚██████╔╝██████╔╝███████║
  ╚══════╝ ╚═════╝  ╚═════╝╚═╝  ╚═╝╚══════╝    ╚═╝     ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

function getCatAndSubCats() {
  var arr = [];
  $("#__sl-main-group button").each(function(a, b) {
    var cat = $(b).attr("__val");
    var subcat = $(b).attr("__cat");
    arr.push(cat);
  });
  return arr;
}

function preview(param) {
  var win = window.open(
    document.location.origin + "/reader/" + param.id + "/teste-preview",
    "_blank"
  );
  win.focus();
}

function getCategories(param) {
  $.ajax({
    url: "categories/list/" + (param.id || ""),
    dataType: "json",
    success: function(ret) {
      param.callback(ret);
    },
  });
}

function makeVideoThumbs(video, self) {
  let container = $(".container-video-thumb");
  container.find(".video-thumb").remove();
  let new_div = $(document.createElement("div")).addClass("video-thumb d-flex");

  //se existe alguma foto na galeria, add a primeira
  if (self.dz.files.length) {
    container.append(
      new_div
        .clone()
        .on("click", function() {
          $(".video-thumb").removeClass("active");
          $(this).addClass("active");
        })
        .css({
          "background-image":
            "url(" +
            $(self.dz.files[0].previewTemplate)
              .find("[data-dz-thumbnail]")
              .attr("src") +
            ")      ",
        })
        .attrchange(function(attrName) {
          if (attrName == "class") {
            if ($(this).hasClass("active")) {
              let bg = $(this).css("backgroundImage");
              $("#video_thumbnail").val(
                JSON.stringify({
                  pos: $(this).attr("data-pos"),
                  url: bg.substring(5, bg.lastIndexOf('"')),
                })
              );
            }
          }
        })
    );
  }

  //cria as thumbs de acordo com o retorno de data.thumbs
  //$('#video_start_at').attr('data-video-duration',null);
  video.thumbs.forEach(function(url, i) {
    container.append(
      new_div
        .clone()
        .on("click", function() {
          $(".video-thumb").removeClass("active");
          $(this).addClass("active");
        })
        .css({ backgroundImage: "url('" + url + "')" })
        .attrchange(function(attrName) {
          if (attrName == "class") {
            if ($(this).hasClass("active")) {
              let bg = $(this).css("backgroundImage");
              $("#video_thumbnail").val(
                JSON.stringify({
                  pos: $(this).attr("data-pos"),
                  url: bg.substring(5, bg.lastIndexOf('"')),
                })
              );
            }
          }
        })
    );
  });

  container
    .find(".video-thumb")
    .first()
    .addClass("active");
  container.find(".video-thumb").each(function(i, obj) {
    $(obj).attr("data-pos", i);
  });
}

function getYoutubeVideoPromise(video, self) {
  let _resolve = function(res) {
    let player = $("#" + video.source + "-player");
    player.removeClass("d-none").attr("src", video.embed);

    let _ytp = new YT.Player("youtube-player", {
      events: {
        onReady: function(_t) {
          self.VPlayer = _t.target;
          self.VPlayer.__getCurrent = _t.target.getCurrentTime;
          self.VPlayer.__play = _t.target.playVideo;
          self.VPlayer.__pause = _t.target.pauseVideo;
        },
      },
    });

    video.infos = {
      title: res.data.items[0].snippet.title,
      description: res.data.items[0].snippet.description,
      duration: moment
        .duration(res.data.items[0].contentDetails.duration, "seconds")
        .format("hh:mm:ss", { trim: false }),
    };
    for (let i = 0; i < 3; i++)
      video.thumbs.push(
        "https://img.youtube.com/vi/" + video.id + "/" + i + ".jpg"
      );
  };

  let _reject = function(res) {
    videoUnload(self);
  };
  return new Promise((resolve, reject) => {
    //$('#embed-container-video').addClass('loading');
    $.ajax({
      url: [
        "https://www.googleapis.com/youtube/v3/videos",
        "?key=AIzaSyB2-i5P7MPuioxONBQOZwgC7vWEeJ4PnIo",
        "&part=snippet,contentDetails",
        "&id=" + video.id,
      ].join(""),
      type: "GET",
      success: function(ret) {
        if (ret.items.length)
          resolve({ state: true, data: ret, callback: _resolve });
        else
          reject({
            state: false,
            data: "o link informado está quebrado ou é inválido!",
            callback: _reject,
          });
      },
      error: function(ret) {
        reject({
          state: false,
          data: "o link informado está quebrado ou é inválido!",
          callback: _reject,
        });
      },
    }).done(function() {});
  });
}

function getFacebookVideoPromise(video, self) {
  let _resolve = function(res) {
    let player = $("#" + video.source + "-player");
    player.removeClass("d-none").attr("data-href", video.url);
    FB.XFBML.parse(document.getElementById("facebook-player").parentNode);
    self.VPlayer = null;
    FB.Event.subscribe("xfbml.ready", function(msg) {
      if (msg.type === "video") {
        self.VPlayer = msg.instance;
        self.VPlayer.__getCurrent = msg.instance.getCurrentPosition;
        self.VPlayer.__play = msg.instance.play;
        self.VPlayer.__pause = msg.instance.pause;
      }
    });
    video.infos = {
      title: res.data.title,
      description: res.data.description,
      duration: moment
        .duration(parseInt(res.data.length), "seconds")
        .format("hh:mm:ss"),
    };

    video.embed = video.embed + "&width=" + res.data.format[0].width;
    let max_video_number =
      res.data.thumbnails.data.length >= 3
        ? 3
        : res.data.thumbnails.data.length;
    for (let i = 0; i < max_video_number; i++)
      video.thumbs.push(res.data.thumbnails.data[i].uri);
  };

  let _reject = function(res) {
    videoUnload(self);
  };

  return new Promise((resolve, reject) => {
    FB.api(
      "/" +
        video.id +
        "?fields=thumbnails,description,length,embeddable,embed_html,format,title&access_token=" +
        window.IntranetOne.social_media.facebook.long_token,
      function(ret) {
        if (ret && !ret.error) {
          resolve({ state: true, data: ret, callback: _resolve });
        } else {
          if (ret.error.code == 100)
            reject({
              state: false,
              data: "O video deste link não permite sua utilização",
              callback: _reject,
            });
          console.log("entrou no erro");
          reject({ state: false, data: null, callback: _reject });
        }
      }
    );
  });
}

function videoUnload(self) {
  $("#embed-container-video").removeClass("loading");
  $(".vplayer")
    .attr("src", "")
    .addClass("d-none");
  $(".vplayer")
    .attr("data-href", "")
    .addClass("d-none");

  $("#video_start_at")
    .val("00 : 00 : 00")
    .attr("disabled", "disabled");
  //  $('#btn-get-current-time').attr('disabled','disabled');
  self.VPlayer = null;
  $("#video_start_at")
    .data("plugin_wickedpicker")
    .setTime({ hours: 0, minutes: 0, seconds: 0 });
  $(".container-video-thumb .video-thumb").remove();
  $("#video_title,#video_description, #video_data").val("");

  $("#video_start_at").attr("disabled", "disabled");
  $("#btn-get-current-time").addClass("__disabled mouse-off");
  $("#video_data").val("");
}

function getVideoInfos(url) {
  let rgx_youtube = /(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  let rgx_facebook = /^http(?:s?):\/\/(?:www\.|web\.|m\.)?facebook\.com\/([A-z0-9\.]+)\/videos(?:\/[0-9A-z].+)?\/(\d+)(?:.+)?$/;

  if (rgx_youtube.test(url))
    return {
      source: "youtube",
      id: url.match(rgx_youtube)[1],
      url: url,
      embed: [
        "https://www.youtube.com/embed/" + url.match(rgx_youtube)[1],
        "?enablejsapi=1",
        "&origin=" + document.location.origin,
      ].join(""),
      thumbs: [],
    };

  if (rgx_facebook.test(url)) {
    let url_match = url.match(rgx_facebook);
    return {
      source: "facebook",
      id: url_match[2],
      url: url,
      embed: [
        "https://www.facebook.com/plugins/video.php",
        "?href=https%3A%2F%2Fwww.facebook.com%2F",
        url_match[1] + "%2Fvideos%2F" + url_match[2],
      ].join(""),
      thumbs: [],
    };
  }

  return { source: null, id: null, thumbs: [], embed: null, url: null };
}

//CRUD CallBacks
function view(self) {
  return {
    onSuccess: function(data) {
      $("[name='title']").val(data.title);
      $("[name='short_title']").val(data.short_title);
      $("[name='subtitle']").val(data.subtitle);
      $("[name='date']")
        .pickadate("picker")
        .set("select", new Date(data.date));
      $("#featured").aaToggle(data.featured);
      $("[name='by']").val(data.by);
      $("[name='source']").val(data.source);
      $("#keywords").pillbox("removeItems");

      if (data.video_id != null) {
        $("#video_url")
          .attr("data-loaded", JSON.stringify(data.video))
          .val(data.video.url);
        $("#video_url").attr(
          "data-thumb",
          JSON.stringify(data.video.thumbnail)
        );
        self.fv[4].revalidateField("video_url");

        if (data.video.date != null)
          $("#video_date")
            .pickadate("picker")
            .set("select", new Date(data.video.date));

        let dur = moment.duration(data.video.start_at, "seconds");
        $("#video_start_at").val(dur.format("hh : mm : ss", { trim: false }));
        $("#video_start_at")
          .data("plugin_wickedpicker")
          .setTime({
            hours: dur._data.hours,
            minutes: dur._data.minutes,
            seconds: dur._data.seconds,
          });
      } else {
        $("#video_url").removeAttr("data-loaded");
        $("#video_url").removeAttr("data-thumb");
      }

      if (data.keywords != null) {
        data.keywords.split(";").forEach(function(kw) {
          $("#keywords").pillbox(
            "addColorItem",
            { text: kw, value: kw },
            "random",
            false
          );
          $(this).remove();
        });
      }

      tinymce.get("content").setContent(data.content);
      self.fv[1].revalidateField("content");

      //reload categorias
      //zera as categorias no unload
      let attrcats = [];
      data.categories.forEach(function(obj) {
        attrcats.push(obj.id);
      });

      attrcats.forEach(function(i) {
        $(".__sortable-list")
          .not("#__sl-main-group")
          .find(".list-group-item[__val='" + i + "']")
          .appendTo($("#__sl-main-group"));
      });
      self.fv[2].revalidateField("__cat_subcats");

      //reload imagens
      self.dz.removeAllFiles(true);
      if (data.group != null) {
        self.dz.reloadImages(data);
      }
    },
    onError: function(self) {
      console.log("executa algo no erro do callback");
    },
  };
}
