$(document).ready(function()
{

  var comboResponsablesOperativos = ""; //variable para carga inicial de combo de responsables operativos
  $('.tblHeadMenu').show();
  $('.jsgrid-SaveActions-button').show();

  $(".clsGestion").keypress(function(key){
    if(key.which != 8 && key.which != 0 && (key.which < 48 || key.which > 57)) return false;
  });

  $(".clsPlazo").keypress(function(key)
  {
    if(key.which != 8 && key.which != 0 && (key.which < 48 || key.which > 57)) return false;
  });

  $(".clsPlazo").change(function()
  {
    if(parseInt(this.value) < 0)
    {
      this.value = 0;
    }
    else if(parseInt(this.value) >365)
    {
      this.value = 365;
    }
    return false;
  });

  $(".clsCodigoFramework").keypress(function(key){
    if(key.which != 8 && key.which != 46 && key.which != 0 && (key.which < 48 || key.which > 57)) return false;
  });

  getGerencias();


  var strCode = GetQueryStringParams('Code');

  if(strCode != undefined)
  {
    $('.clsCode').text(strCode);

    getResponsablesOperativos();
    getResponsables();

    setTimeout(function()
    {
      $("#ctl00_PlaceHolderMain_ppResponsable_checkNames").click();

      $("#ctl00_PlaceHolderMain_ppResponsableOperativo_checkNames").click();
    }, 1000);

    setTimeout(function()
    {
      getObjetivo(strCode);
      getGrupos(strCode);
    }, 1500);

  }

  function getGerencias()
  {
    var txtUser = '';

    var CurrentUser = $().SPServices.SPGetCurrentUser({
      fieldNames: ["ID", "Name"],
      debug: false
    });

    txtUser = CurrentUser.Name;

    if(txtUser.indexOf("\\")>0)
    {
      txtUser = txtUser.split('\\')[1];
    }

    var serviceUri = _spPageContextInfo.webAbsoluteUrl + "/_vti_bin/SGOParametrizacion.asmx";
    var obj = {UserID:txtUser};

    var waitMessage = "<table width='100%' align='center'><tr><td align='center'><img src='/_layouts/images/progress.gif'/></td></tr></table>";

    $("#divOutput") .html(waitMessage);

    $.ajax(
      {
        type: "POST",
        url: serviceUri+"/getGerencias",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data:JSON.stringify(obj),
        complete: OnComplete,
        success: OnSuccess,
        error: OnError
      });

    function OnSuccess(data, status, xhttp)
    {
      var xmlDoc = $.parseXML(data.d);
      var xml = $(xmlDoc);
      var customers = xml.find("Gerencias").find("Table");

      for (var i = 0; i < customers.length; i++)
      {
        x = customers[i].childNodes;

        var strItemID = "";
        var strItemNombre = "";

        for (j = 0; j < x.length; j++)
        {
          if(x[j].nodeType == 1)
          {
            //alert(x[j].nodeName + '/'+x[j].textContent);
            if(x[j].nodeName == "ID")
            {
              strItemID = x[j].textContent;
            }

            if(x[j].nodeName == "Descripcion")
            {
              strItemNombre = x[j].textContent;
            }

            if(x[j].nodeName == "IDArea")
            {
              $('.clsArea').text(x[j].textContent);
            }
          }
        }

        $('.clsGerencia').append('<option value="'+strItemID+'">'+strItemNombre+'</option>');

        if(i == 0)
        {
          getDependencias();
        }
      }

      $("#divOutput").empty();
    }
  }

  function loadGerenciaIndicador (gerenciaID,gerenciaIndicadorID){

    $('.clsGerencia').val(gerenciaID);
    getDependencias();

    setTimeout(function()
    {
      getDimensiones(gerenciaID);

    }, 500);
    getGerenciasIndicador(gerenciaID,function(res){

      $('.clsGerenciaIndicador').val(gerenciaIndicadorID);
    });


  }
  function getGerenciasIndicador(gerenciaID,callback)
  {

    var serviceUri = _spPageContextInfo.webAbsoluteUrl + "/_vti_bin/SGOParametrizacion.asmx";

    var waitMessage = "<table width='100%' align='center'><tr><td align='center'><img src='/_layouts/images/progress.gif'/></td></tr></table>";
    var obj = {GerenciaID:gerenciaID};

    $('.clsGerenciaIndicador').html("");

    $("#divOutput") .html(waitMessage);

    $.ajax(
      {
        type: "POST",
        url: serviceUri+"/getGerenciasIndicador",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data:JSON.stringify(obj),
        complete: OnComplete,
        success: OnSuccess,
        error: OnError
      });

    function OnSuccess(data, status, xhttp)
    {
      var xmlDoc = $.parseXML(data.d);
      var xml = $(xmlDoc);
      var customers = xml.find("Indicadores").find("Table");



      for (var i = 0; i < customers.length; i++)
      {
        x = customers[i].childNodes;

        var strItemID = "";
        var strItemNombre = "";

        for (j = 0; j < x.length; j++)
        {
          if(x[j].nodeType == 1)
          {
            //alert(x[j].nodeName + '/'+x[j].textContent);
            if(x[j].nodeName == "ID")
            {
              strItemID = x[j].textContent;
            }

            if(x[j].nodeName == "Descripcion")
            {
              strItemNombre = x[j].textContent;
            }


          }
        }

        $('.clsGerenciaIndicador').append('<option value="'+strItemID+'">'+strItemNombre+'</option>');


      }

      $("#divOutput").empty();

      return callback(data);
    }
  }

  function getDependencias()
  {
    $('.clsDependencia').empty();
    $('.clsDependencia').append('<option value="0"></option>');

    var serviceUri = _spPageContextInfo.webAbsoluteUrl + "/_vti_bin/SGOParametrizacion.asmx";
    var obj = { Area: $(".clsArea").text(), Gerencia: $(".clsGerencia option:selected").val(), Gestion: $(".clsGestion").val() };

    var waitMessage = "<table width='100%' align='center'><tr><td align='center'><img src='/_layouts/images/progress.gif'/></td></tr></table>";

    $("#divOutput").html(waitMessage);

    $.ajax(
      {
        type: "POST",
        url: serviceUri+"/getParametrizacionDependencias",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data:JSON.stringify(obj),
        complete: OnComplete,
        success: OnSuccess,
        error: OnError
      });

    function OnSuccess(data, status, xhttp)
    {
      var xmlDoc = $.parseXML(data.d);
      var xml = $(xmlDoc);
      var customers = xml.find("Objetivos").find("Table");

      for (var i = 0; i < customers.length; i++)
      {
        x = customers[i].childNodes;

        var strItemID = "";
        var strItemNombre = "";

        for (j = 0; j < x.length; j++)
        {
          if(x[j].nodeType == 1)
          {
            //alert(x[j].nodeName + '/'+x[j].textContent);
            if(x[j].nodeName == "ID")
            {
              strItemID = x[j].textContent;
            }

            if(x[j].nodeName == "Codigo")
            {
              strItemNombre = x[j].textContent;
            }
          }
        }

        $('.clsDependencia').append('<option value="'+strItemID+'">'+strItemNombre+'</option>');
      }

      $("#divOutput").empty();
    }
  }

  function OnComplete(data, status)
  {
    //alert("Completed"+status);
  }

  function OnError(request, status, error)
  {
    //alert(request.d+'/'+status+'/'+error);
    $("#divOutput").empty();
    $("#divOutput").append('<font size="3" class="clsMsgRed"><strong>'+error+'</strong></font>');
  }

  function getObjetivo(strCode)
  {
    var txtArea = 0;
    var txtGerencia = 0;
    //aqui se aumento
    var txtCodigo = 0;

    var txtGestion = 0;

    var serviceUri = _spPageContextInfo.webAbsoluteUrl + "/_vti_bin/SGOParametrizacion.asmx";
    var obj = {ID:strCode, Area:txtArea, Gerencia:txtGerencia, Gestion:txtGestion, User:0, Codigo:0};//{ username: $("#txtuser").val(), name: $("#txtname").val() };

    var waitMessage = "<table width='100%' align='center'><tr><td align='center'><img src='/_layouts/images/progress.gif'/></td></tr></table>";

    $("#divOutput") .html(waitMessage);

    $.ajax(
      {
        type: "POST",
        url: serviceUri+"/getParametrizacionObjetivos",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data:JSON.stringify(obj),
        complete: OnComplete,
        success: OnSuccess,
        error: OnError
      });

    function OnSuccess(data, status, xhttp)
    {
      var dataJs = $.xml2json(data.d);
      var xmlDoc = $.parseXML(data.d);
      var xml = $(xmlDoc);
      var customers = xml.find("Objetivos").find("Table");
      var gerenciaIndicador=0;

      var Objetivo=dataJs.Objetivos.Table;

      loadGerenciaIndicador(Objetivo.Gerencia,Objetivo.Gerencia_Indicador);


      for (var i = 0; i < customers.length; i++)
      {
        x = customers[i].childNodes;

        for (j = 0; j < x.length; j++)
        {
          if(x[j].nodeType == 1)
          {
            //alert(x[j].nodeName + '/'+x[j].textContent);
            if(x[j].nodeName == "ID")
            {
              $('.clsCode').text(x[j].textContent);
            }

            if(x[j].nodeName == "Area")
            {
              $('.clsArea').text(x[j].textContent);
            }

            if(x[j].nodeName == "Codigo")
            {
              $('.clsCodigo').val(x[j].textContent);
            }

            if(x[j].nodeName == "Gestion")
            {
              $('.clsGestion').val(x[j].textContent);
            }
            /*
            if(x[j].nodeName == "Gerencia")
            {
              $('.clsGerencia').val(x[j].textContent);
              $('.clsGerencia').change();
            }
            */

            if(x[j].nodeName == "Dependencia")
            {
              $('.clsDependencia').val(x[j].textContent);
            }

            if(x[j].nodeName == "Tipo")
            {
              $('.clsTipo').val(x[j].textContent);
            }

            if(x[j].nodeName == "Calculo_Cumplimiento")
            {
              $('.clsCalculoCumplimiento').val(x[j].textContent);
            }

            if(x[j].nodeName == "Plazo")
            {
              $('.clsPlazo').val(x[j].textContent);
            }

            if(x[j].nodeName == "Tiempo")
            {
              $('.clsTiempo').val(x[j].textContent);
              $(".clsTiempo").change();
            }

            if(x[j].nodeName == "Tipo_Dias")
            {
              $('.clsTipoDias').val(x[j].textContent);
            }

            if(x[j].nodeName == "Permisibilidad")
            {
              $('.clsPermisibilidad').val(x[j].textContent);
              $(".clsPermisibilidad").change();
            }

            if(x[j].nodeName == "Estado")
            {
              $('.clsEstado').text(x[j].textContent);

              if(x[j].textContent == 'Borrador')
              {
                $('.jsgrid-Publish-button').show();
              }
              else
              {
                $('.jsgrid-Publish-button').hide();
              }
            }

            if(x[j].nodeName == "Indicador")
            {
              $('.clsCodigoFramework').val(x[j].textContent);
            }

            if(x[j].nodeName == "Meta")
            {
              $('.clsMeta').val(x[j].textContent);
            }

            if(x[j].nodeName == "Frecuencia")
            {
              $('.clsFrecuencia').val(x[j].textContent);
            }

            if(x[j].nodeName == "Descripcion")
            {
              $('.clsDescripcion').text(x[j].textContent);
            }

            if(x[j].nodeName == "Metrica")
            {
              $('.clsMetrica').text(x[j].textContent);
            }

            /*
            if(x[j].nodeName == "Gerencia_Indicador")
            {
              gerenciaIndicador= x[j].textContent;

            }
            */
          }
        }
      }


      $('.clsPanel2').show();
      $('.clsPanel3').show();
      $('.clsPanel4').show();
      $("#divOutput").empty();
    }
  }

  function loadTableGrupos (){
    var strHoras= '';
    var txtCode = $('.clsCode').text();
    if($('.clsTiempo').val() == 'Horas')
    {
      strHoras = '<th class="clsHeadDetailGrupos clsHHoras "  width="10%">Horas</th>';
    }

    $('#tblDetailGrupos').html('<table width="100%" border="0" cellspacing="0" cellpadding="0" class="clsTblDetailsGrupos">'+
      '<thead class="tHeadDetailGrupos">'+
      '<tr>'+
      '<th class="clsHeadDetailGrupos" width="5%"></th>'+
      '<th class="clsHeadDetailGrupos" width="5%"></th>'+
      '<!--<th style="padding:5px; background:#8268b2; color:#fff;" width="5%"></th>-->'+
      '<th class="clsHeadDetailGrupos" style="display:none;" width="10%">Correlativo</th>'+
      '<th class="clsHeadDetailGrupos"id="ok"  width="15%">Codigo</th>'+
      '<th class="clsHeadDetailGrupos" width="20%">Descripcion</th>'+
      '<th class="clsHeadDetailGrupos clsHPlazo"  width="10%">Plazo (dias)</th>'+
      strHoras +
      '<th class="clsHeadDetailGrupos" width="10%">Porcentaje</th>'+
      '<th class="clsHeadDetailGrupos" width="15%">Orden de Tareas</th>'+
      '<th class="clsHeadDetailGrupos" width="15%">Responsable</th>'+
      '</tr>'+
      '</thead>'+
      '<tbody class="clsTareas">'+
      '</tbody>'+
      '</table>');
    var strCode = GetQueryStringParams('Code');
    getGrupos(txtCode);
  }

  function getGrupos(strCode)
  {
    var serviceUri = _spPageContextInfo.webAbsoluteUrl + "/_vti_bin/SGOParametrizacion.asmx";
    var obj = {Objetivo:strCode};

    var waitMessage = "<table width='100%' align='center'><tr><td align='center'><img src='/_layouts/images/progress.gif'/></td></tr></table>";

    $("#divOutput") .html(waitMessage);

    $.ajax(
      {
        type: "POST",
        url: serviceUri+"/getParametrizacionGrupos",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data:JSON.stringify(obj),
        complete: OnComplete,
        success: OnSuccess,
        error: OnError
      });


    function OnSuccess(data, status, xhttp)
    {
      var xmlDoc = $.parseXML(data.d);   //alert(xmlDoc);
      var xml = $(xmlDoc);	//alert(xml);
      var customers = xml.find("Grupos").find("Table");
      var strID = "";
      var strCorrelativo = "";
      var strCodigo = "";
      var strDescripcion = "";
      var strPlazo = "";
      // se aumento aqui
      var strHoras = "";

      var strPorcentaje = "";
      var strOrden = "";
      var strResponsable = "";
      var strResponsableNombre = "";

      for (var i = 0; i < customers.length; i++)
      {
        x = customers[i].childNodes;
        strID = "";
        strCorrelativo = "";
        strCodigo = "";
        strDescripcion = "";
        strPlazo = "";
        //se aumento aqui
        strHoras = "";


        strPorcentaje = "";
        strOrden = "";
        strResponsable = "";
        strResponsableNombre = "";


        for (j = 0; j < x.length; j++)
        {
          //console.log(x[j].nodeName );
          if(x[j].nodeType == 1)
          {
            if(x[j].nodeName == "ID")
            {
              strID = x[j].textContent;
              $('.clsGrpID').text(strID);

              $(".btn-AddGrupo").click();

              var intRows = $('.clsGrpID').text();

              $('.clsTareas .clsTareaItem'+intRows).each(function(i, tr)
              {
                $(tr).find('.clsGroupCode').text(strID);

                getTareas(strID);
              });
            }

            if(x[j].nodeName == "Correlativo")
            {
              strCorrelativo = x[j].textContent;
            }

            if(x[j].nodeName == "Codigo")
            {
              strCodigo = x[j].textContent;
            }

            if(x[j].nodeName == "Descripcion")
            {
              strDescripcion = x[j].textContent;
            }

            if(x[j].nodeName == "Plazo")
            {
              strPlazo = x[j].textContent;
            }



            //se aumento aqui
            if(x[j].nodeName == "Horas")
            {
              strHoras = x[j].textContent;

            }

            if(x[j].nodeName == "Porcentaje")
            {
              strPorcentaje = x[j].textContent;
            }

            if(x[j].nodeName == "Orden")
            {
              strOrden = x[j].textContent;
            }

            if(x[j].nodeName == "Responsable")
            {
              strResponsable = x[j].textContent;


            }

            if(x[j].nodeName == "ResponsableNombre")
            {
              strResponsableNombre = x[j].textContent;
            }
          }
        }

        var intRows = $('.clsGrpID').text();
        console.log('COD--->', strCodigo);
        $('.clsTareas .clsTareaItem'+intRows).each(function(i, tr)
        {
          //$(tr).find('.clsGroupCode').text(strID);
          $(tr).find('.clsTaskCorrelativoItem').text(strCorrelativo);
          $(tr).find('.clsTaskCodigoItem').val(strCodigo);
          $(tr).find('.clsTaskDescripcion').text(strDescripcion);
          $(tr).find('.clsTaskPlazo').val(strPlazo);
          //se aumento aqui
          $(tr).find('.clsTaskHoras').val(strHoras);

          $(tr).find('.clsTaskPorcentaje').val(strPorcentaje);
          $(tr).find('.clsTaskTipoTarea').find('option[value="'+strOrden+'"]').prop('selected', 'selected');
          $(tr).find('.clsTaskResponsable').find('option[value="'+strResponsable+'"]').prop('selected', 'selected');

          $('.clsGrpID').text('');
        });


      }

      $("#divOutput").empty();
    }
  }

  function getTareas(strGrupo)
  {	//alert(strGrupo);
    var serviceUri = _spPageContextInfo.webAbsoluteUrl + "/_vti_bin/SGOParametrizacion.asmx";
    var obj = {Grupo:strGrupo};//{ username: $("#txtuser").val(), name: $("#txtname").val() };

    var waitMessage = "<table width='100%' align='center'><tr><td align='center'><img src='/_layouts/images/progress.gif'/></td></tr></table>";

    $("#divOutput") .html(waitMessage);

    $.ajax(
      {
        type: "POST",
        url: serviceUri+"/getParametrizacionTareas",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data:JSON.stringify(obj),
        complete: OnComplete,
        success: OnSuccess,
        error: OnError
      });

    function OnSuccess(data, status, xhttp)
    {   //alert(data.d+'/'+status);
      /*if(data.d="SUCCESS") //status='success'
      {*/
      //var json = '[{"id":"1","tagName":"apple"},{"id":"2","tagName":"orange"}, {"id":"3","tagName":"banana"},{"id":"4","tagName":"watermelon"},	{"id":"5","tagName":"pineapple"}]';

      //alert(xhttp.responseText);
      //$('#jsGrid').append('<table id="tblResult" class="ms-rteTable-5" cellspacing="0" ><tr class="ms-rteTableEvenRow-5"><td class="jsgrid-hide-field"><label class="clsTitle">ID</label></td><td style="width:450px;"><label class="clsTitle">Codigo</label></td><td style="width:350px;"><label class="clsTitle">Descripcion</label></td><td style="width:150px;"><label class="clsTitle"></label></td></tr>');		//<th style="width:350px;"><label class="clsTitle">Objetivo</label></th>

      var xmlDoc = $.parseXML(data.d);   //alert(xmlDoc);
      var xml = $(xmlDoc);	//alert(xml);
      var customers = xml.find("Tareas").find("Table");
      var strTskID = "";
      var strTskCorrelativo = "";
      var strTskCodigo = "";
      var strTskDescripcion = "";
      var strTskPlazo = "";

      //se aumento aqui
      var strTskHoras = "";


      var strTskPorcentaje = "";
      var strTskResponsable = "";
      var strTskResponsableNombre = "";

      var ddlTskResponsables = '';


      for (var i = 0; i < customers.length; i++)
      {	//alert(customers[i].attr('id'));
        //alert(customers[i].childNodes);
        //alert("<table><tbody><tr><td>" + customers[i].localName + "</td><td>" + customers[i].nodeName + "</td></tr></tbody></table>");
        x = customers[i].childNodes;
        strTskID = "";
        strTskCorrelativo = "";
        strTskCodigo = "";
        strTskDescripcion = "";
        strTskPlazo = "";
        // se aumento aqui
        strTskHoras = "";


        strTskPorcentaje = "";
        strTskResponsable = "";
        strTskResponsableNombre = "";

        //$('#tblResult').append('<tr class="jsgrid-filter-row clsIndex clsIndex'+i+'"><td class="jsgrid-hide-field"><label class="lblCode"></label></td><td><label class="lblCodigo" ></label ></td><td><label class="lblDescripcion" ></label ></td><td><input class="jsgrid-button jsgrid-EditDocument-button clsEdit'+i+'" type="button" title="Editar Objetivo"></td></tr>');  //<td><label >'+strObjetivo+'</label></td> 		  &nbsp;<input class="jsgrid-Copy-button" type="button" title="Copiar">


        /*$(document).on('click', '.clsEdit'+i, function()
        {  //alert('s');
          var strID = $(this).parent().parent().find('.lblCode').html().trim();
             $(location).attr('href', '/SGO/FormsParametrizacionObjetivo.aspx?Code='+strID);
      });*/

        //alert(x.length);

        for (j = 0; j < x.length; j++)
        {
          if(x[j].nodeType == 1)
          {
            // alert(x[j].nodeName + '/'+x[j].textContent);
            if(x[j].nodeName == "ID")
            {
              strTskID = x[j].textContent;
              //alert(strID+'A');
            }

            if(x[j].nodeName == "Correlativo")
            {
              strTskCorrelativo = x[j].textContent;
            }

            if(x[j].nodeName == "Codigo")
            {
              strTskCodigo = x[j].textContent;
            }

            if(x[j].nodeName == "Descripcion")
            {
              strTskDescripcion = x[j].textContent;
            }

            if(x[j].nodeName == "Plazo")
            {
              strTskPlazo = x[j].textContent;
            }


            //se aumento aqui

            if(x[j].nodeName == "Horas")
            {
              strTskHoras = x[j].textContent;
            }

            if(x[j].nodeName == "Porcentaje")
            {
              strTskPorcentaje = x[j].textContent;
            }

            if(x[j].nodeName == "Responsable")
            {
              strTskResponsable = x[j].textContent;



            }

            if(x[j].nodeName == "ResponsableNombre")
            {
              strTskResponsableNombre = x[j].textContent;

            }

          }
        }


        console.log('RES--->', strTskResponsable);
        var strHoras = '';

        if($('.clsTiempo').val() == 'Horas')
        {
          strHoras = '<td class="clsCHoras" style="padding:5px;"><input class="form-control clsTaskHoras clsTaskHoras'+strGrupo+strTskID+'" type="text" value="'+strTskHoras+'"></td>';
        }

        //ddlTskResponsables

        $('.clsGruposTasks'+strGrupo).append('<tr class="clsTareaItemDetalle clsTareaItemDetalle'+strGrupo+strTskID+'">'+
          '<td style="padding:5px;"><label class="clsHide clsTaskCode" >'+strTskID+'</label><img title="Eliminar" class="clsDeleteTaskItemDetalle clsDeleteTaskItemDetalle'+strGrupo+strTskID+'" src="/SGO/img/delete.png" width="25px"></img></td>'+
          '<td style="padding:5px; display:none;">'+
          '<label class="form-control clsTaskCorrelativoItem">'+strTskCorrelativo+'</label>'+
          '</td>'+
          '<td style="padding:5px;">'+
          '<input class="form-control clsTaskCodigoItem" type="text" value="'+strTskCodigo+'">'+
          '</td>'+
          '<td style="padding:5px;">'+
          '<textarea class="form-control clsTaskDescripcion" >'+strTskDescripcion+'</textarea>'+
          '</td>'+
          '<td class="clsCPlazo" style="padding:5px;">'+
          '<input class="form-control clsTaskPlazo clsTaskPlazo'+strGrupo+strTskID+' type="text"  value="'+strTskPlazo+'">'+
          '</td>'+
          strHoras +
          '<td style="padding:5px;">'+
          '<input class="form-control clsTaskPorcentaje clsTaskPorcentaje'+strGrupo+strTskID+' type="text" value="'+strTskPorcentaje+'">'+
          '</td>'+
          '<td style="padding:5px;">'+
          '<select class="form-control clsTaskResponsable">'+	comboResponsablesOperativos +
          '</select>'+
          '</td>'+
          '</tr>');

        //console.log($('.clsTareaItemDetalle'+strGrupo+strTskID).find(".clsTaskResponsable"));

        if($('.clsTareaItemDetalle'+strGrupo+strTskID).find(".clsTaskResponsable").find('option[value="'+strTskResponsable+'"]').length)
        {
          $('.clsTareaItemDetalle'+strGrupo+strTskID).find(".clsTaskResponsable").find('option[value="'+strTskResponsable+'"]').prop('selected', 'selected');
        }

        $(".clsTaskPlazo"+strGrupo+strTskID).keypress(function(key){
          if(key.which != 8 && key.which != 0 && (key.which < 48 || key.which > 57)) return false;
        });
        $(".clsTaskPlazo"+strGrupo+strTskID).change(function()
        {
          if(parseInt(this.value) < 1)
          {
            this.value = 1;
          }
          else if(parseInt(this.value) >365)
          {
            this.value = 365;
          }
          return false;
        });

        $(".clsTaskHoras"+strGrupo+strTskID).keypress(function(key){
          if(key.which != 8 && key.which != 0 && (key.which < 48 || key.which > 57)) return false;
        });
        $(".clsTaskHoras"+strGrupo+strTskID).change(function()
        {
          if(parseInt(this.value) < 0)
          {
            this.value = 0;
          }
          else if(parseInt(this.value) >24)
          {
            this.value = 24;
          }
          return false;
        });
        $(".clsTaskPorcentaje"+strGrupo+strTskID).keypress(function(key){
          if(key.which != 8 && key.which != 0 && (key.which < 48 || key.which > 57)) return false;
        });

        $(".clsTaskPorcentaje"+strGrupo+strTskID).change(function()
        {
          if(parseInt(this.value) < 1)
          {
            this.value = 1;
          }
          else if(parseInt(this.value) >100)
          {
            this.value = 100;
          }
          return false;
        });
        $('.clsDeleteTaskItemDetalle'+strGrupo+strTskID).click(function(Task, Taskj)
        {
          if (confirm("Esta Segur@?"))
          {
            $(this).parent().parent().hide();//.remove();
          }
        });

      }

      $("#divOutput").empty();
    }
  }
  //aï¿½adir grupo
  $(".btn-AddGrupo").click(function()
  {
    var intRows = $('.clsTareas tr').length+100000;

    if($('.clsGrpID').text() != "")
    {
      intRows = $('.clsGrpID').text();
    }

    ddlResponsables = '';

    $("#ctl00_PlaceHolderMain_ppResponsableOperativo_upLevelDiv .ms-entity-resolved").each(function(ie, tre)
    {
      var strKey = $(tre).find('#divEntityData').attr('key');
      strKey = strKey.replace('i:0#.w|', '');
      var strDisplay = $(tre).find('#divEntityData').attr('displaytext');

      if(strKey.indexOf("\\")>0)
      {
        strKey = strKey.split('\\')[1];
      }

      ddlResponsables += '<option value="'+strKey+'">'+strDisplay+'</option>';
    });

    if(ddlResponsables==""){
      ddlResponsables=comboResponsablesOperativos;
    }else if(comboResponsablesOperativos==""){
      comboResponsablesOperativos=ddlResponsables;

    }


    var strHoras = '';
    var strHorasHead = '';

    if($('.clsTiempo').val() == 'Horas')
    {
      strHoras = '<td class="clsCHoras" style="padding:5px;"><input class="form-control clsTaskHoras clsTaskHoras'+intRows+'" type="text" value="0"></td>';
      strHorasHead = '<th class="clsHHoras" style="padding:5px; background:#8268b2; color:#fff;" width="10%">Horas</th>';
    }
    //alert(strHoras + '*'+strHorasHead );

    //	GRUPOS

    //Cris: agregando cabeceras para diferenciar los grupos
    var $headDetailGruposContainer = $('.tHeadDetailGrupos').children().clone();
    $headDetailGruposContainer.addClass('clsHeadTareaItem'+intRows);
    $headDetailGruposContainer.find("th").replaceWith(function(){
      $(this).css("font-weight","bold");
      var $style=$(this).attr("style");
      var $class=$(this).attr("class");
      return $('<td/>',{
        html : this.innerHTML,
        style : $style,
        class : $class

      });
    });
    $('.tHeadDetailGrupos').hide();
    $('.clsTareas').append($headDetailGruposContainer);

    $('.clsTareas').append('<tr class="clsTareaItem clsTareaItem'+intRows+'" Code="'+intRows+'">'+
      '<td style="padding:5px;"><label class="clsHide clsGroupCode" /><img title="Eliminar" class="clsDeleteItem clsDeleteItem'+intRows+'" src="/SGO/img/delete.png" width="25px"></img></td>'+
      '<td style="padding:5px;"><img title="Adicionar Tarea" class="clsInsertItem clsInsertItem'+intRows+'" src="/SGO/img/add.png" width="25px"></img></td>'+
      //'<td style="padding:5px;"><img title="Clonar" class="clsCloneItem clsCloneItem'+intRows+'" src="/Style%20Library/NuevaTelBranding/img/SGO/copy.png" width="25px"></img></td>'+
      '<td style="padding:5px;  display:none;">'+
      '<label class="form-control clsTaskCorrelativoItem"></label>'+
      '</td>'+
      '<td style="padding:5px;">'+
      '<input class="form-control clsTaskCodigoItem" type="text">'+
      '</td>'+
      '<td style="padding:5px;">'+
      '<textarea class="form-control clsTaskDescripcion" ></textarea>'+
      '</td>'+
      '<td class="clsCPlazo" style="padding:5px;">'+
      '<input class="form-control clsTaskPlazo clsTaskPlazo'+intRows+'" type="text" value="0">'+
      '</td>'+
      strHoras +
      '<td style="padding:5px;">'+
      '<input class="form-control clsTaskPorcentaje clsTaskPorcentaje'+intRows+'" type="text" value="0">'+
      '</td>'+
      '<td style="padding:5px;">'+
      '<select class="form-control clsTaskTipoTarea clsTaskTipoTarea'+intRows+'">'+
      '<option value="P">Paralelas</option>'+
      '<option value="S">Secuenciales</option>'+
      '</select>'+
      '</td>'+
      '<td style="padding:5px;">'+
      '<select class="form-control clsTaskResponsable clsTaskResponsable'+intRows+'">'+ ddlResponsables +
      '</select>'+
      '</td>'+
      '</tr><tr class="clsGrupoTasksItem clsGrupoTasksItem'+intRows+'">'+
      '<td colspan="2" style="padding:5px;"><label class="clsHide clsID" /></td>'+
      '<td colspan="7" style="padding:5px;">'+
      '<table width="100%" border="0" cellspacing="0" cellpadding="0" class="clsTblTasks">'+
      '<thead>'+
      '<tr>'+
      '<th style="padding:5px; background:#8268b2; color:#fff;" width="5%"></th>'+
      '<th style="padding:5px; background:#8268b2; color:#fff; display:none;" width="10%">Correlativo</th>'+
      '<th style="padding:5px; background:#8268b2; color:#fff;" width="15%">Codigo</th>'+
      '<th style="padding:5px; background:#8268b2; color:#fff;" width="20%">Descripcion</th>'+
      '<th class="clsHPlazo" style="padding:5px; background:#8268b2; color:#fff;" width="15%">Plazo(dias)</th>'+
      strHorasHead +
      '<th style="padding:5px; background:#8268b2; color:#fff;" width="15%">Porcentaje</th>'+
      '<th style="padding:5px; background:#8268b2; color:#fff;" width="15%">Responsable</th>'+
      '</tr>'+
      '</thead>'+
      '<tbody class="clsGruposTasks clsGruposTasks'+intRows+'">'+
      '</tbody>'+
      '</table>'+
      '</td>'+
      '</tr>');

    $(".clsTaskPlazo"+intRows).keypress(function(key){
      if(key.which != 8 && key.which != 0 && (key.which < 48 || key.which > 57)) return false;
    });

    $(".clsTaskPlazo"+intRows).change(function()
    {
      if(parseInt(this.value) < 1)
      {
        this.value = 1;
      }
      else if(parseInt(this.value) >365)
      {
        this.value = 365;
      }

      if($(this).val()>$('.clsPlazo').val())
      {
        alert('Plazo incorrecto!');
        return false;
      }
      return false;
    });

    $(".clsTaskHoras"+intRows).keypress(function(key){
      if(key.which != 8 && key.which != 0 && (key.which < 48 || key.which > 57)) return false;
    });

    $(".clsTaskHoras"+intRows).change(function()
    {
      if(parseInt(this.value) < 0)
      {
        this.value = 0;
      }
      else if(parseInt(this.value) >24)
      {
        this.value = 24;
      }
      return false;
    });

    $(".clsTaskPorcentaje"+intRows).keypress(function(key){
      if(key.which != 8 && key.which != 0 && (key.which < 48 || key.which > 57)) return false;
    });
    $(".clsTaskPorcentaje"+intRows).change(function()
    {

      if(parseInt(this.value) < 1)
      {
        this.value = 1;
      }
      else if(parseInt(this.value) >100)
      {
        this.value = 100;
      }
      return false;
    });

    $('.clsInsertItem'+intRows).click(function()
    {
      var intRowsTasks = $('.clsGruposTasks tr').length+1;
      //aqui se aumnto codigo para la validacion de descripcion
      var intCodigo = $(this).parent().parent().find('.clsTaskCodigoItem').val();
      var intDescripcion = $(this).parent().parent().find('.clsTaskDescripcion').val();



      var intPlazo = $(this).parent().parent().find('.clsTaskPlazo').val();
      // se aumento aqui
      var intHoras = $(this).parent().parent().find('.clsTaskHoras').val();

      var intPorcentaje = $(this).parent().parent().find('.clsTaskPorcentaje').val();
      var strTipoTarea = $(this).parent().parent().find('.clsTaskTipoTarea').find('option:selected').val();

      //se aumento aqui un codigo para la validacion de descripcion

      dw = true;
      //validacion codigoGrupo se aumento aqui este codigo
      $('.clsTaskCodigoItem').removeClass('required');

      if($('.clsTaskCodigoItem').val().length == 0)
      {
        $('.clsTaskCodigoItem').addClass('required');
        dw=false;
      }

      if(!dw)
      {
        alert('Codigo requerido!!');
        return false;
      }


      //validacion descripcion grupo
      $('.clsTaskDescripcion').removeClass('required');

      if($('.clsTaskDescripcion').val().length == 0)
      {
        $('.clsTaskDescripcion').addClass('required');
        dw=false;
      }

      if(!dw)
      {
        alert('Descripcion requerida!!');
        return false;
      }

      if(!dw)
      {
        alert('Datos invalidos,!!');
        return false;
      }

      if(intCodigo == 0)
      {
        alert('Codigo Invalido!');
        return false;
      }

      if(intDescripcion == 0 )
      {
        alert('Descripcion Invalido!');
        return false;
      }

      if(intPlazo == 0)
      {
        alert('Plazo Invalido!');
        return false;
      }

      //se aumento aqui
      if(intHoras == 0)
      {
        alert('Horas Invalido!');
        return false;
      }


      if(intPorcentaje == 0)
      {
        alert('Porcentaje Invalido!');
        return false;
      }

      $('.clsGruposTasks'+intRows+' .clsTareaItemDetalle').each(function(id, trd)
      {
        var intTaskPlazo = Number($(trd).find('.clsTaskPlazo').val());


        var intTaskHoras = Number($(trd).find('.clsTaskHoras').val());


        var intTaskPorcentaje = Number($(trd).find('.clsTaskPorcentaje').val());
      });

      //hasta aqui todo ok la  parametrizacion


      var strHoras = '';

      if($('.clsTiempo').val() == 'Horas')
      {
        strHoras = '<td class="clsCHoras" style="padding:5px;"><input class="form-control clsTaskHoras clsTaskHoras'+intRows+intRowsTasks+'" type="text" value="0"></td>';
      }

      $('.clsGruposTasks'+intRows).append('<tr class="clsTareaItemDetalle clsTareaItemDetalle'+intRows+intRowsTasks+'">'+
        '<td style="padding:5px;"><label class="clsHide clsTaskCode" /><img title="Eliminar" class="clsDeleteTaskItemDetalle clsDeleteTaskItemDetalle'+intRows+intRowsTasks+'" src="/SGO/img/delete.png" width="25px"></img></td>'+
        '<td style="padding:5px; display:none;">'+
        '<label class="form-control clsTaskCorrelativoItem"></label>'+
        '</td>'+
        '<td style="padding:5px;">'+
        '<input class="form-control clsTaskCodigoItem" type="text">'+
        '</td>'+
        '<td style="padding:5px;">'+
        '<textarea class="form-control clsTaskDescripcion"></textarea>'+
        '</td>'+
        '<td class="clsCPlazo" style="padding:5px;">'+
        '<input class="form-control clsTaskPlazo clsTaskPlazo'+intRows+intRowsTasks+'" type="text" value="0">'+
        '</td>'+
        strHoras + /*se modifico aqui*

													'<td style="padding:5px;">'+
													'<input class="form-control clsTaskHoras clsTaskHoras'+intRows+intRowsTasks+'" type="text" value="0">'+
													'</td>'+  */

        '<td style="padding:5px;">'+
        '<input class="form-control clsTaskPorcentaje clsTaskPorcentaje'+intRows+intRowsTasks+'" type="text" value="0">'+
        '</td>'+
        '<td style="padding:5px;">'+
        '<select class="form-control clsTaskResponsable">'+	ddlResponsables +
        '</select>'+
        '</td>'+
        '</tr>');

      $(".clsTaskPlazo"+intRows+intRowsTasks).keypress(function(key){
        if(key.which != 8 && key.which != 0 && (key.which < 48 || key.which > 57)) return false;
      });
      $(".clsTaskPlazo"+intRows+intRowsTasks).change(function()
      {
        if(parseInt(this.value) < 1)
        {
          this.value = 1;
        }
        else if(parseInt(this.value) >365)
        {
          this.value = 365;
        }
        return false;
      });

      $(".clsTaskHoras"+intRows+intRowsTasks).keypress(function(key){
        if(key.which != 8 && key.which != 0 && (key.which < 48 || key.which > 57)) return false;
      });
      $(".clsTaskHoras"+intRows+intRowsTasks).change(function()
      {
        if(parseInt(this.value) < 0)
        {
          this.value = 0;
        }
        else if(parseInt(this.value) >24)
        {
          this.value = 24;
        }
        return false;
      });

      $(".clsTaskPorcentaje"+intRows+intRowsTasks).keypress(function(key){
        if(key.which != 8 && key.which != 0 && (key.which < 48 || key.which > 57)) return false;
      });
      $(".clsTaskPorcentaje"+intRows+intRowsTasks).change(function()
      {
        if(parseInt(this.value) < 1)
        {
          this.value = 1;
        }
        else if(parseInt(this.value) >100)
        {
          this.value = 100;
        }
        return false;
      });

      $('.clsDeleteTaskItemDetalle'+intRows+intRowsTasks).click(function(Task, Taskj)
      {
        if (confirm("Esta Segur@?"))
        {
          $(this).parent().parent().hide();//.remove();
        }
      });

    });

    $('.clsCloneItem'+intRows).click(function()
    {
      if (confirm("Esta Segur@?"))
      {
        var intRowsTasks = $('.clsGruposTasks tr').length+1;
      }
    });

    $('.clsDeleteItem'+intRows).click(function()
    {
      if (confirm("Esta Segur@?"))
      {
        $('.clsHeadTareaItem'+intRows).hide();
        $('.clsTareaItem'+intRows).hide();//.remove();
        $('.clsGrupoTasksItem'+intRows).hide();//.remove();
      }
    });

    return false;
  });

  function getResponsables()
  {
    var txtCodigo = $('.clsCode').text();

    var serviceUri = _spPageContextInfo.webAbsoluteUrl + "/_vti_bin/SGOParametrizacion.asmx";
    var obj = {Objetivo:txtCodigo};//{ username: $("#txtuser").val(), name: $("#txtname").val() };

    var waitMessage = "<table width='100%' align='center'><tr><td align='center'><img src='/_layouts/images/progress.gif'/></td></tr></table>";

    $("#divOutput") .html(waitMessage);

    $.ajax(
      {
        type: "POST",
        url: serviceUri+"/getParametrizacionResponsables",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data:JSON.stringify(obj),
        complete: OnComplete,
        success: OnSuccess,
        error: OnError
      });

    function OnSuccess(data, status, xhttp)
    {
      var xmlDoc = $.parseXML(data.d);   //alert(xmlDoc);
      var xml = $(xmlDoc);	//alert(xml);
      var customers = xml.find("Responsables").find("Table");
      console.log('--->', customers);


      for (var i = 0; i < customers.length; i++)
      {
        x = customers[i].childNodes;
        var strID = "";
        var strNombre = "";

        for (j = 0; j < x.length; j++)
        {
          if(x[j].nodeType == 1)
          {
            //alert(x[j].nodeName + '/'+x[j].textContent);
            if(x[j].nodeName == "Usuario")
            {
              strID = x[j].textContent;
              //$('.clsResponsable').text(strID);
              $('#ctl00_PlaceHolderMain_ppResponsable_upLevelDiv').append(strID+";");
            }

            if(x[j].nodeName == "Nombre")
            {
              strNombre = x[j].textContent;
            }
          }
        }

        $('.clsResponsablesLst').append('<li value="'+strID+'">'+strNombre+'</li>');
      }
    }
  }

  function getResponsablesOperativos()
  {
    var txtCodigo = $('.clsCode').text();

    var serviceUri = _spPageContextInfo.webAbsoluteUrl + "/_vti_bin/SGOParametrizacion.asmx";
    var obj = {Objetivo:txtCodigo};//{ username: $("#txtuser").val(), name: $("#txtname").val() };

    var waitMessage = "<table width='100%' align='center'><tr><td align='center'><img src='/_layouts/images/progress.gif'/></td></tr></table>";

    $("#divOutput") .html(waitMessage);

    $.ajax(
      {
        type: "POST",
        url: serviceUri+"/getParametrizacionResponsablesOperativos",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data:JSON.stringify(obj),
        complete: OnComplete,
        success: OnSuccess,
        error: OnError
      });

    function OnSuccess(data, status, xhttp)
    {
      var xmlDoc = $.parseXML(data.d);   //alert(xmlDoc);
      var xml = $(xmlDoc);	//alert(xml);
      var customers = xml.find("Responsables").find("Table");

      for (var i = 0; i < customers.length; i++)
      {

        //var strTskKey = new Array();
        //var strTskDisplay =new Array();


        x = customers[i].childNodes;
        var strID = "";
        var strNombre = "";

        for (j = 0; j < x.length; j++)
        {
          if(x[j].nodeType == 1)
          {
            //alert(x[j].nodeName + '/'+x[j].textContent);
            if(x[j].nodeName == "Usuario")
            {
              strID = x[j].textContent;
              //$('.clsResponsableOperativo').text(strID);
              $('#ctl00_PlaceHolderMain_ppResponsableOperativo_upLevelDiv').append(strID+";");



            }

            if(x[j].nodeName == "Nombre")
            {
              strNombre = x[j].textContent;
            }
          }
        }

        $('.clsResponsablesOperativosLst').append('<li value="'+strID+'">'+strNombre+'</li>');
        comboResponsablesOperativos += '<option value="'+strID+'">'+strNombre+'</option>';

      }




    }
  }

  $('.clsPermisibilidad').on('change', function()
  {
    switch($('.clsPermisibilidad option:selected').text())
    {
      case 'Muy Baja':
        $('.clsPermisibilidadRoja').text('0 a 99,99%');
        $('.clsPermisibilidadAmarilla').text('-');
        $('.clsPermisibilidadVerde').text('100% o mas');
        $('.clsPermisibilidadRojaMax').text('100'); //<
        $('.clsPermisibilidadVerdeMin').text('100'); //>=
        break;
      case 'Baja':
        $('.clsPermisibilidadRoja').text('0 a 94.99%');
        $('.clsPermisibilidadAmarilla').text('95 a 99.99%');
        $('.clsPermisibilidadVerde').text('100% o mas');
        $('.clsPermisibilidadRojaMax').text('95'); //<
        $('.clsPermisibilidadVerdeMin').text('100'); //>=
        break;
      case 'Media':
        $('.clsPermisibilidadRoja').text('0 a 91,99%');
        $('.clsPermisibilidadAmarilla').text('92 a 99,99%');
        $('.clsPermisibilidadVerde').text('100% o mas');
        $('.clsPermisibilidadRojaMax').text('92'); //<
        $('.clsPermisibilidadVerdeMin').text('100'); //>=
        break;
      case 'Media Alta':
        $('.clsPermisibilidadRoja').text('0 a 89,99%');
        $('.clsPermisibilidadAmarilla').text('90 a 99,99%');
        $('.clsPermisibilidadVerde').text('100% o mas');
        $('.clsPermisibilidadRojaMax').text('90'); //<
        $('.clsPermisibilidadVerdeMin').text('100'); //>=
        break;
      case 'Alta':
        $('.clsPermisibilidadRoja').text('0 a 84,99%');
        $('.clsPermisibilidadAmarilla').text('85 a 94,99%');
        $('.clsPermisibilidadVerde').text('95% o mas');
        $('.clsPermisibilidadRojaMax').text('85'); //<
        $('.clsPermisibilidadVerdeMin').text('95'); //>=
        break;
      case 'Muy Alta':
        $('.clsPermisibilidadRoja').text('0 a 79.99%');
        $('.clsPermisibilidadAmarilla').text('80 a 89.99%');
        $('.clsPermisibilidadVerde').text('90% o mas');
        $('.clsPermisibilidadRojaMax').text('80'); //<
        $('.clsPermisibilidadVerdeMin').text('90'); //>=
        break;
    }
  });

  $('.clsTiempo').on('change', function()
  {
    if($(this).val() == 'Horas')
    {
      $('<th class="clsHHoras" style="padding:5px; background:#8268b2; color:#fff;" width="10%">Horas</th>').insertAfter('.clsHPlazo');
      $('<td class="clsCHoras" style="padding:5px;"><input class="form-control clsTaskHoras clsTaskHoras" type="text" value="0"></td>').insertAfter('.clsCPlazo');


      $(".clsTaskHoras").keypress(function(key){
        if(key.which != 8 && key.which != 0 && (key.which < 48 || key.which > 57)) return false;
      });
    }
    else
    {
      $('.clsHHoras').remove();
      $('.clsCHoras').remove();
    }
  });


  $('.clsGerencia').on('change', function()
  {
    getDependencias();

    setTimeout(function()
    {
      getDimensiones($('.clsGerencia').find('option:Selected').val());

    }, 500);
    getGerenciasIndicador($('.clsGerencia').find('option:Selected').val(),function(res){});
  });

  $(document).on('click', '.clsGetIndicador', function()
  {
    $('.clsDescripcion').html('');
    $('.clsDescripcion').attr('contenteditable','true');
    $('.clsMetrica').html('');
    $('.clsMetrica').attr('contenteditable','true');
    $('.clsMeta').val('');
    $('.clsMeta').removeAttr('disabled');

    var sw = true;

    $('.clsCodigoFramework').removeClass('required');

    if($('.clsCodigoFramework').val().length == 0)
    {
      $('.clsCodigoFramework').addClass('required');
      sw=false;
    }

    if(!sw)
    {
      alert('Campos requeridos!!');
      return false;
    }








    var txtCodigoIndicador = $('.clsCodigoFramework').val();

    var serviceUri = _spPageContextInfo.webAbsoluteUrl + "/_vti_bin/SGOParametrizacion.asmx";
    var obj = {Codigo:txtCodigoIndicador};//{ username: $("#txtuser").val(), name: $("#txtname").val() };

    var waitMessage = "<table width='100%' align='center'><tr><td align='center'><img src='/_layouts/images/progress.gif'/></td></tr></table>";

    $("#divOutput") .html(waitMessage);

    $.ajax(
      {
        type: "POST",
        url: serviceUri+"/getIndicadorFramework",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data:JSON.stringify(obj),
        complete: OnComplete,
        success: OnSuccess,
        error: OnError
      });

    function OnSuccess(data, status, xhttp)
    {
      var xmlDoc = $.parseXML(data.d);
      var xml = $(xmlDoc);
      var customers = xml.find("Indicadores").find("Indicador");

      for (var i = 0; i < customers.length; i++)
      {
        x = customers[i].childNodes;

        for (j = 0; j < x.length; j++)
        {
          if(x[j].nodeType == 1)
          {

            if(x[j].nodeName == "Descripcion")
            {
              $('.clsDescripcion').html(x[j].textContent);
              $('.clsDescripcion').attr('contenteditable','false');
            }

            if(x[j].nodeName == "Meta")
            {
              $('.clsMeta').val(x[j].textContent);
              $('.clsMeta').attr('disabled','disabled');
            }

            if(x[j].nodeName == "Metrica")
            {
              $('.clsMetrica').html(x[j].textContent);
              $('.clsMetrica').attr('contenteditable','false');
            }

            if(x[j].nodeName == "Frecuencia")
            {
              strFrecuencia = x[j].textContent.split(';#');

              for (var iF = 0; iF < strFrecuencia.length; iF++)
              {
                if(iF % 2 != 0)
                {
                  $('.clsFrecuencia').val(strFrecuencia[iF]);
                }
              }
            }
          }
        }
      }

      $("#divOutput").empty();
    }

    return false;
  });

  //gaurdado para el boton borrado
  $(document).on('click', '.jsgrid-SaveActions-button', function()
  {
    SaveObjetivo('Borrador');
    return false;
  });

  $(document).on('click', '.jsgrid-Publish-button', function()
  {
    SaveObjetivo('Publicado');
    return false;
  });

  function SaveObjetivo(strEstadoNuevo)
  {
    var sw=validarObjetivo() ;


    if(!sw)
    {
      alert('Existen Datos invalidos en el formulario, verifique grupos, tareas, plazos, horas, porcentaje y responsables!!');
      return false;
    }
    //return false;
    sw = true;

    if (confirm("Esta Segur@?"))
    {

      var waitMessage = "<table width='100%' align='center'><tr><td align='center'><img src='/_layouts/images/progress.gif'/></td></tr></table>";
      //alert(strEstadoNuevo+'/'+txtCode);
      $("#divOutput") .html(waitMessage);

      var txtUser = '';

      var CurrentUser = $().SPServices.SPGetCurrentUser({
        fieldNames: ["ID", "Name"],
        debug: false
      });

      txtUser = CurrentUser.Name;

      if(txtUser.indexOf("\\")>0)
      {
        txtUser = txtUser.split('\\')[1];
      }

      var txtCode = $('.clsCode').text();
      var txtCodigo = $('.clsCodigo').val();
      var txtArea = $('.clsArea').text();
      var txtGestion = $('.clsGestion').val();
      var txtGerencia = $('.clsGerencia').find('option:selected').val();
      var txtDependencia = $('.clsDependencia').find('option:selected').val();
      var txtGerencia = $('.clsGerencia').find('option:selected').val();
      var txtTipo = $('.clsTipo').find('option:selected').val();
      var txtCalculoCumplimiento = $('.clsCalculoCumplimiento').find('option:selected').val();
      var txtTipoDias = $('.clsTipoDias').find('option:selected').val();
      var txtPermisibilidad = $('.clsPermisibilidad').find('option:selected').val();
      var txtPlazo = $('.clsPlazo').val();
      var txtEstado = strEstadoNuevo;//'Borrador'; //$('.clsEstado').text();
      var txtCodigoFramework = $('.clsCodigoFramework').val();
      var txtMeta = $('.clsMeta').val();
      var txtFrecuencia = $('.clsFrecuencia').val();
      var txtDescripcion = $('.clsDescripcion').text();
      var txtMetrica = $('.clsMetrica').text();
      var txtTiempo = $('.clsTiempo').find('option:selected').val();
      var txtGerenciaIndicador = $('.clsGerenciaIndicador').find('option:selected').val();

      var serviceUri = _spPageContextInfo.webAbsoluteUrl + "/_vti_bin/SGOParametrizacion.asmx";
      //alert(txtGerencia);
      if(txtGerencia == null)//undefined)
      {
        txtGerencia = 0;
      }

      if(txtDependencia == null)
      {
        txtDependencia = 0;
      }

      if(txtCode.length == 0){

        var obj = {Codigo:txtCodigo, Area:txtArea, Gerencia:txtGerencia, Gestion:txtGestion, Tiempo:txtTiempo, Estado:txtEstado, Indicador:txtCodigoFramework, Meta:txtMeta, Frecuencia:txtFrecuencia, Metrica:txtMetrica, Descripcion:txtDescripcion, Tipo:txtTipo, Dependencia:txtDependencia, Plazo:txtPlazo, Calculo_Cumplimiento:txtCalculoCumplimiento, Permisibilidad:txtPermisibilidad, Tipo_Dias:txtTipoDias, Autor:txtUser, Gerencia_Indicador : txtGerenciaIndicador};

        $.ajax(
          {
            type: "POST",
            url: serviceUri+"/setParametrizacionObjetivo",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data:JSON.stringify(obj),
            complete: OnComplete,
            success: OnSuccess,
            error: OnError
          });

        function OnSuccess(data, status,xhttp)
        {
          if(status=="success")
          {
            var strCodeResult = data.d.split('|')[0];
            var strCodigoResult = data.d.split('|')[1];
            $('.clsCode').text(strCodeResult);
            $('.clsCodigo').val(strCodigoResult);

            $('.clsPanel2').show();
            $('.clsPanel3').show();
            $('.clsPanel4').show();

            if(strEstadoNuevo == 'Borrador')
            {
              $('.jsgrid-Publish-button').show();
            }
            else
            {
              $('.jsgrid-Publish-button').hide();
            }

            $('.clsEstado').text(strEstadoNuevo);

            $("#ctl00_PlaceHolderMain_ppResponsable_upLevelDiv .ms-entity-resolved").each(function(ie, itr)
            {
              var strKey = $(itr).find('#divEntityData').attr('key');

              if(strKey.indexOf("\\")>0)
              {
                strKey = strKey.split('\\')[1];
              }

              var objRes = {Objetivo:strCodeResult, Usuario:strKey, Autor:txtUser};

              console.log(objRes, '<------Responsable');

              $.ajax(
                {
                  type: "POST",

                  url: serviceUri+"/setParametrizacionResponsable",
                  contentType: "application/json; charset=utf-8",
                  dataType: "json", data:JSON.stringify(objRes),
                  complete: OnComplete,
                  success: OnSuccessResp,
                  error: OnError
                });

              function OnSuccessResp(data, status,xhttp)
              {
                if(status!="success")
                {
                  alert("Error al guardar los Responsables, Vuelva a intentarlo");
                }
              }

            });

            $("#ctl00_PlaceHolderMain_ppResponsableOperativo_upLevelDiv .ms-entity-resolved").each(function(je, jtr)
            {
              var strKeyOP = $(jtr).find('#divEntityData').attr('key');

              if(strKeyOP.indexOf("\\")>0)
              {
                strKeyOP = strKeyOP.split('\\')[1];
              }

              var objROP = {Objetivo:strCodeResult, Usuario:strKeyOP, Autor:txtUser};

              $.ajax(
                {
                  type: "POST",
                  url: serviceUri+"/setParametrizacionResponsablesOperativos",
                  contentType: "application/json; charset=utf-8",
                  dataType: "json",
                  data:JSON.stringify(objROP),
                  complete: OnComplete,
                  success: OnSuccessRespOp,
                  error: OnError
                });

              function OnSuccessRespOp(data, status,xhttp)
              {
                if(status!="success")
                {
                  alert("Error al guardar los Responsables Operativos, Vuelva a intentarlo");
                }
              }

            });

            $("#divOutput").empty();

            var strCode = GetQueryStringParams('Code');
            //console.log("strCode",strCode);

            if(strCode == undefined)
            {
              updateURL('Code',strCodeResult);
            }

          }else{
            alert("Error, Vuelva a intentarlo");
          }

        }
      }else{

        var obj = {ID:txtCode, Codigo:txtCodigo, Area:txtArea, Gerencia:txtGerencia, Gestion:txtGestion, Tiempo:txtTiempo, Estado:txtEstado, Indicador:txtCodigoFramework, Meta:txtMeta, Frecuencia:txtFrecuencia, Metrica:txtMetrica, Descripcion:txtDescripcion, Tipo:txtTipo, Dependencia:txtDependencia, Plazo:txtPlazo, Calculo_Cumplimiento:txtCalculoCumplimiento, Permisibilidad:txtPermisibilidad, Tipo_Dias:txtTipoDias, Autor:txtUser, Gerencia_Indicador : txtGerenciaIndicador};//{ username: $("#txtuser").val(), name: $("#txtname").val() };

        $.ajax(
          {
            type: "POST",
            url: serviceUri+"/UpdateParametrizacionObjetivo",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data:JSON.stringify(obj),
            complete: OnComplete,
            success: OnSuccess,
            error: OnError
          });

        function OnSuccess(data, status,xhttp)
        {
          if(status=="success")
          {
            if(strEstadoNuevo == 'Borrador')
            {
              $('.jsgrid-Publish-button').show();
            }
            else
            {
              $('.jsgrid-Publish-button').hide();
            }

            $('.clsEstado').text(strEstadoNuevo);

            $("#ctl00_PlaceHolderMain_ppResponsable_upLevelDiv .ms-entity-resolved").each(function(ie, itr)
            {
              var strKey = $(itr).find('#divEntityData').attr('key');

              if(strKey.indexOf("\\")>0)
              {
                strKey = strKey.split('\\')[1];
              }

              var objRes = {Objetivo:txtCode, Usuario:strKey, Autor:txtUser};

              $.ajax(
                {
                  type: "POST",
                  url: serviceUri+"/setParametrizacionResponsable",
                  contentType: "application/json; charset=utf-8",
                  dataType: "json",
                  data:JSON.stringify(objRes),
                  complete: OnComplete,
                  success: OnSuccessResp,
                  error: OnError
                });

              function OnSuccessResp(data, status,xhttp)
              {
                if(status!="success")
                {
                  alert("Error, Vuelva a intentarlo");
                }
              }

            });

            $("#ctl00_PlaceHolderMain_ppResponsableOperativo_upLevelDiv .ms-entity-resolved").each(function(je, jtr)
            {
              var strKeyOP = $(jtr).find('#divEntityData').attr('key');

              if(strKeyOP.indexOf("\\")>0)
              {
                strKeyOP = strKeyOP.split('\\')[1];
              }

              var objROP = {Objetivo:txtCode, Usuario:strKeyOP, Autor:txtUser};

              $.ajax(
                {
                  type: "POST",
                  url: serviceUri+"/setParametrizacionResponsablesOperativos",
                  contentType: "application/json; charset=utf-8",
                  dataType: "json",
                  data:JSON.stringify(objROP),
                  complete: OnComplete,
                  success: OnSuccessRespOp,
                  error: OnError
                });

              function OnSuccessRespOp(data, status,xhttp)
              {
                if(status!="success")
                {
                  alert("Error, Vuelva a intentarlo");
                }
              }
            });

            guardarGrupos();
            guardarDimensiones();
            $("#divOutput").empty();

            var strCode = GetQueryStringParams('Code');
            if(strCode == undefined)
            {
              var uri = "http://sp2013dev.southcentralus.cloudapp.azure.com/SGO/Forms/Parametrizar.aspx";
              var newUri=updateQueryStringParameter(uri,"Code",strCodeResult)
            }

          }else{
            alert("Error, Vuelva a intentarlo");
          }
        }
      }

      // Cris: correccion de guardado de grupos, tareas y dimensiones
      /*
        //Grupos
        indexi=0;
      $(".clsTareas .clsTareaItem").each(function(i, tr)
      {
        indexi++;
        lblCorrelativoPadre = $('.clsCodigo').val()+'.'+indexi;
        $(tr).find('.clsTaskCorrelativoItem').text(lblCorrelativoPadre);
        txtGrCode = $(tr).attr('Code');
        txtGrID = $(tr).find('.clsGroupCode').text();
        txtGrCorrelativo = $(tr).find('.clsTaskCorrelativoItem').text();
        txtGrCodigo = $(tr).find('.clsTaskCodigoItem').val();
        txtGrDescripcion = $(tr).find('.clsTaskDescripcion').val();
        txtGrPlazo = $(tr).find('.clsTaskPlazo').val();
        txtGrHoras = $(tr).find('.clsTaskHoras').val();
        txtGrPorcentaje = $(tr).find('.clsTaskPorcentaje').val();
        txtGrTipoTarea = $(tr).find('.clsTaskTipoTarea option:selected').val();
        txtGrResponsable = $(tr).find('.clsTaskResponsable option:selected').val();
        intDisabled = 0;

        if($(tr).is(':visible'))
        {
          intDisabled = 0;
        }
        else
        {
          intDisabled = 1;
        }

        if(txtGrHoras == null)
        {
          txtGrHoras = '0';
        }

        if(txtGrID.length == 0)
        {//alert(txtGrID+'new');
          if($(tr).is(':visible'))
          {
            var obj = {Correlativo:txtGrCorrelativo, Codigo:txtGrCodigo, Descripcion:txtGrDescripcion, Plazo:txtGrPlazo, Horas:txtGrHoras, Porcentaje:txtGrPorcentaje, Orden:txtGrTipoTarea, Objetivo:txtCode, Responsable:txtGrResponsable, Autor:txtUser};//{ username: $("#txtuser").val(), name: $("#txtname").val() };

            $.ajax(
            {
                 type: "POST",
                 url: serviceUri+"/setParametrizacionGrupo",
                 contentType: "application/json; charset=utf-8",
                 dataType: "json",
                 data:JSON.stringify(obj),
                 complete: OnComplete,
                 success: OnSuccess,
                 error: OnError
            });

            function OnSuccess(data, status,xhttp)
            {  //alert(data.d+'/'+status);
              if(status=="success") //status='success'
              {
                var strGrCodeResult = data.d;
                $(tr).find('.clsGroupCode').text(strGrCodeResult);
                }
              else
              {
                alert("Error, Vuelva a intentarlo");
              }
            }
          }
        }
        else
        {
            var obj = {ID:txtGrID, Correlativo:txtGrCorrelativo, Codigo:txtGrCodigo, Descripcion:txtGrDescripcion, Plazo:txtGrPlazo, Horas:txtGrHoras, Porcentaje:txtGrPorcentaje, Orden:txtGrTipoTarea, Objetivo:txtCode, Responsable:txtGrResponsable, Autor:txtUser, Disabled:intDisabled};//{ username: $("#txtuser").val(), name: $("#txtname").val() };

            $.ajax(
              {
                   type: "POST",
                   url: serviceUri+"/UpdateParametrizacionGrupo",
                   contentType: "application/json; charset=utf-8",
                   dataType: "json",
                   data:JSON.stringify(obj),
                   complete: OnComplete,
                   success: OnSuccess,
                   error: OnError
              });

            function OnSuccess(data, status,xhttp)
            {
              if(status!="success")
              {
                alert("Error, Vuelva a intentarlo");
              }
            }
        }
      });


      //Tareas
      /*
      setTimeout(function ()
      {
          indexi=0;
          $(".clsTareas .clsTareaItem").each(function(i, tr)
          {
            indexi++;
            txtGrCode = $(tr).attr('Code');
            txtGrID = $(tr).find('.clsGroupCode').text();

            if($(tr).is(':visible'))
            {
              UpdtTarea(txtGrCode, txtGrID, indexi, txtUser, serviceUri);

              //console.log("tareas: ",txtGrCode, txtGrID, indexi, txtUser, serviceUri);
            }
          });
      }, 1500);

      $("#divOutput").empty();
      */
    }
  }

  function guardarGrupos (){
    // Cris: correccion de guardado de grupos y tareas

    //Grupos y Tareas
    indexi=0;
    var arregloGrupo = new Array ();
    var txtCode = $('.clsCode').text();

    var txtUser = '';
    var CurrentUser = $().SPServices.SPGetCurrentUser({
      fieldNames: ["ID", "Name"],
      debug: false
    });

    txtUser = CurrentUser.Name;

    if(txtUser.indexOf("\\")>0)
    {
      txtUser = txtUser.split('\\')[1];
    }

    var serviceUri = _spPageContextInfo.webAbsoluteUrl + "/_vti_bin/SGOParametrizacion.asmx";

    $(".clsTareas .clsTareaItem").each(function(i, tr)
    {
      indexi++;
      var arregloTareas = new Array();
      var obj = {};
      lblCorrelativoPadre = $('.clsCodigo').val()+'.'+indexi;
      $(tr).find('.clsTaskCorrelativoItem').text(lblCorrelativoPadre);
      txtGrCode = $(tr).attr('Code');
      txtGrID = $(tr).find('.clsGroupCode').text();
      txtGrCorrelativo = $(tr).find('.clsTaskCorrelativoItem').text();
      txtGrCodigo = $(tr).find('.clsTaskCodigoItem').val();
      txtGrDescripcion = $(tr).find('.clsTaskDescripcion').val();
      txtGrPlazo = $(tr).find('.clsTaskPlazo').val();
      txtGrHoras = $(tr).find('.clsTaskHoras').val();
      txtGrPorcentaje = $(tr).find('.clsTaskPorcentaje').val();
      txtGrTipoTarea = $(tr).find('.clsTaskTipoTarea option:selected').val();
      txtGrResponsable = $(tr).find('.clsTaskResponsable option:selected').val();
      intDisabled = 0;

      if($(tr).is(':visible')){
        intDisabled = 0;
        arregloTareas = detalleTareas(txtGrCode, txtGrID, indexi, txtUser, serviceUri, arregloTareas);
      }else{
        intDisabled = 1;
      }

      if(txtGrHoras == null){
        txtGrHoras = '0';
      }


      if(txtGrID.length == 0)
      {//alert(txtGrID+'new');
        if($(tr).is(':visible'))
        {
          obj = {ID:'0',Correlativo:txtGrCorrelativo, Codigo:txtGrCodigo, Descripcion:txtGrDescripcion, Plazo:txtGrPlazo, Horas:txtGrHoras, Porcentaje:txtGrPorcentaje, Orden:txtGrTipoTarea, Objetivo:txtCode, Responsable:txtGrResponsable, Autor:txtUser, Disabled:intDisabled};

        }
      }else{
        obj = {ID:txtGrID, Correlativo:txtGrCorrelativo, Codigo:txtGrCodigo, Descripcion:txtGrDescripcion, Plazo:txtGrPlazo, Horas:txtGrHoras, Porcentaje:txtGrPorcentaje, Orden:txtGrTipoTarea, Objetivo:txtCode, Responsable:txtGrResponsable, Autor:txtUser, Disabled:intDisabled};
      }

      if(typeof obj.ID != "undefined"){
        obj.Tareas = arregloTareas;
        arregloGrupo.push(obj);
      }


    });

    if(arregloGrupo.length > 0 ){
      var dataGrupos={dataGrupos : arregloGrupo};
      //console.log(JSON.stringify(arregloGrupo));


      $.ajax(
        {
          type: "POST",
          url: serviceUri+"/setParametrizacionGrupoData",
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          data:JSON.stringify(dataGrupos),
          complete: function (){
            //console.log("complete");
          },
          success: function(res){
            //console.log("success");
            loadTableGrupos();

          },
          error: function (res) {
            //console.log("error");
          }
        });
    }

  }

  function guardarDimensiones (){
    //Dimensiones
    var txtCode = $('.clsCode').text();
    var txtUser = '';
    var CurrentUser = $().SPServices.SPGetCurrentUser({
      fieldNames: ["ID", "Name"],
      debug: false
    });

    txtUser = CurrentUser.Name;

    if(txtUser.indexOf("\\")>0)
    {
      txtUser = txtUser.split('\\')[1];
    }

    var serviceUri = _spPageContextInfo.webAbsoluteUrl + "/_vti_bin/SGOParametrizacion.asmx";

    $(".clsDimensionesHead th input[type=checkbox]").each(function(t, trt)
    {
      if ($(trt).is(':checked'))
      {
        txtDimension = $(trt).attr('id');

        objDim = {Objetivo:txtCode, Dimension:txtDimension, Autor:txtUser};

        $.ajax(
          {
            type: "POST",
            url: serviceUri+"/setParametrizacionDimensionObjetivo",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data:JSON.stringify(objDim),
            complete: OnComplete,
            success: OnSuccessSavDim,
            error: OnError
          });

        function OnSuccessSavDim(data, status,xhttp)
        {  //alert(data.d+'/'+status);
          if(status!="success") //status='success'
          {
            alert("Error, Vuelva a intentarlo");
          }
        }
      }
    });
  }

  function getDimensiones(txtGerencia)
  {
    //$('.clsDimensionesLst').empty();
    $('.clsDimensionesHead').empty();
    $('.clsDimensionesBody').empty();

    var txtArea = $('.clsArea').text();
    var txtObjetivo = $('.clsCode').text();
    var strMetodo = 'getParametrizacionObjetivoDimensiones';
    var obj = {Area:txtArea, Gerencia:txtGerencia, Objetivo:txtObjetivo, Flag:0};//{ username: $("#txtuser").val(), name: $("#txtname").val() };

    if(txtObjetivo == '')
    {
      strMetodo = 'getDimensiones';
      obj = {Area:txtArea, Gerencia:txtGerencia};
    }

    var serviceUri = _spPageContextInfo.webAbsoluteUrl + "/_vti_bin/SGOParametrizacion.asmx";
    var waitMessage = "<table width='100%' align='center'><tr><td align='center'><img src='/_layouts/images/progress.gif'/></td></tr></table>";

    $("#divOutput").html(waitMessage);

    $.ajax(
      {
        type: "POST",
        url: serviceUri+"/"+strMetodo,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data:JSON.stringify(obj),
        complete: OnComplete,
        success: OnSuccessDIM,
        error: OnError
      });

    function OnSuccessDIM(data, status, xhttp)
    {
      var xmlDoc = $.parseXML(data.d);   //alert(xmlDoc);
      var xml = $(xmlDoc);	//alert(xml);
      var customers = xml.find("Dimensiones").find("Table");
      var intRows = 0;

      for (var i = 0; i < customers.length; i++)
      {
        intRows++;
        x = customers[i].childNodes;
        var strID = "";
        var strDescripcion = "";
        var strFlag = "";

        for (j = 0; j < x.length; j++)
        {
          if(x[j].nodeType == 1)
          {
            //alert(x[j].nodeName + '/'+x[j].textContent);
            if(x[j].nodeName == "ID")
            {
              strID = x[j].textContent;
            }

            if(x[j].nodeName == "Descripcion")
            {
              strDescripcion = x[j].textContent;
              $('.clsDimensionesHead').append('<th class="clsDimensionHead'+strID+'" style="padding:5px; background:#8268b2; color:#fff;" width="10%"><input type="checkbox" id="'+strID+'"/> '+strDescripcion+'</th>');
              $('.clsDimensionesBody').append('<th class="clsDimensionBody'+strID+'"><select class="form-control clsDimension clsDimension'+strID+'" Code='+strID+' Descripcion='+strDescripcion+'></select></th>');

              getDimensionDetalle(strID);
            }

            if(x[j].nodeName == "Flag")
            {
              strFlag = x[j].textContent;
              $('.clsDimensionesHead').find('.clsDimensionHead'+strID).find('input[type=checkbox]').prop('checked', true);

            }
          }
        }
      }
    }


    $("#divOutput").empty();
  }

  function getDimensionDetalle(txtDimension)
  {
    var serviceUri = _spPageContextInfo.webAbsoluteUrl + "/_vti_bin/SGOParametrizacion.asmx";
    var obj = {Dimension:txtDimension};//{ username: $("#txtuser").val(), name: $("#txtname").val() };

    var waitMessage = "<table width='100%' align='center'><tr><td align='center'><img src='/_layouts/images/progress.gif'/></td></tr></table>";

    $("#divOutput").html(waitMessage);

    $.ajax(
      {
        type: "POST",
        url: serviceUri+"/getDimensionDetalle",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data:JSON.stringify(obj),
        complete: OnComplete,
        success: OnSuccessDIMD,
        error: OnError
      });

    function OnSuccessDIMD(data, status, xhttp)
    {
      var xmlDoc = $.parseXML(data.d);   //alert(xmlDoc);
      var xml = $(xmlDoc);	//alert(xml);
      var customers = xml.find("Dimensiones").find("Table");
      var intRows = 0;

      for (var i = 0; i < customers.length; i++)
      {
        intRows++;
        x = customers[i].childNodes;
        var strID = "";
        var strDescripcion = "";
        var strDimension = "";

        for (j = 0; j < x.length; j++)
        {
          if(x[j].nodeType == 1)
          {
            //alert(x[j].nodeName + '/'+x[j].textContent);
            if(x[j].nodeName == "ID")
            {
              strID = x[j].textContent;
            }

            if(x[j].nodeName == "Descripcion")
            {
              strDescripcion = x[j].textContent;
            }

            if(x[j].nodeName == "Dimension")
            {
              strDimension = x[j].textContent;

              $('.clsDimensionesBody').find('.clsDimensionBody'+strDimension).find('select').append('<option value="'+strID+'">'+strDescripcion+'</option>');
            }
          }
        }
      }
    }

    $("#divOutput").empty();
  }

  function UpdtTarea(txtGrCode, strGrCodeGroup, indexi, txtUser, serviceUri)
  {
    indexj=0;

    //alert('Code:'+txtGrCode+', Grupo:'+strGrCodeGroup+', i:'+indexi);
    $(".clsTareas .clsGrupoTasksItem"+txtGrCode+' tbody tr').each(function(ij, trj)  //.find('.clsTareaItemDetalle').each(function(ij, trj)
    {
      indexj++;
      lblCorrelativoPadreActividadTarea = $('.clsCodigo').val()+'.'+indexi+'.'+indexj;
      $(trj).find('.clsTaskCorrelativoItem').text(lblCorrelativoPadreActividadTarea);

      txtTskID = $(trj).find('.clsTaskCode').text();
      txtTskCorrelativo = $(trj).find('.clsTaskCorrelativoItem').text();
      txtTskCodigo = $(trj).find('.clsTaskCodigoItem').val();
      txtTskDescripcion = $(trj).find('.clsTaskDescripcion').val();
      txtTskPlazo = $(trj).find('.clsTaskPlazo').val();
      txtTskHoras = $(trj).find('.clsTaskHoras').val();
      txtTskPorcentaje = $(trj).find('.clsTaskPorcentaje').val();
      txtTskResponsable = $(trj).find('.clsTaskResponsable option:selected').val();
      intTaskDisabled = 0;

      if($(trj).is(':visible'))
      {
        intTaskDisabled = 0;
      }
      else
      {
        intTaskDisabled = 1;
      }

      if(txtTskHoras == null)
      {
        txtTskHoras = '0';
      }

      if(txtTskID.length == 0)
      {
        if($(trj).is(':visible'))
        {
          var obj = {Correlativo:txtTskCorrelativo, Codigo:txtTskCodigo, Descripcion:txtTskDescripcion, Plazo:txtTskPlazo, Horas:txtTskHoras, Porcentaje:txtTskPorcentaje, Grupo:strGrCodeGroup, Responsable:txtTskResponsable, Autor:txtUser};//{ username: $("#txtuser").val(), name: $("#txtname").val() };
          //alert('Correlativo:'+txtTskCorrelativo+', Codigo:'+txtTskCodigo+', Descripcion:'+txtTskDescripcion+', Plazo:'+txtTskPlazo+', Porcentaje:'+txtTskPorcentaje+', Grupo:'+strGrCodeGroup+', Responsable:'+txtTskResponsable+', Autor:'+txtUser+', Disabled:'+intTaskDisabled);

          $.ajax(
            {
              type: "POST",
              url: serviceUri+"/setParametrizacionTarea",
              contentType: "application/json; charset=utf-8",
              dataType: "json",
              data:JSON.stringify(obj),
              complete: OnComplete,
              success: OnSuccess,
              error: OnError
            });

          function OnSuccess(data, status,xhttp)
          {  //alert(data.d+'/'+status);
            if(status=="success") //status='success'
            {
              var strTaskCodeResult = data.d;
              //alert(strGrCodeResult);
              //$('.clsCode').text(strCodeResult);
              //$('.clsCodigo').val(strCodigoResult);
              $(trj).find('.clsTaskCode').text(strTaskCodeResult);
              //alert("Operacion Realizada con Exito!");
              $("#divOutput").empty();
              $("#divOutput").append('<font size="3" class="clsMsgRed"><strong>Operacion realizada con Exito!!</strong></font>');
              //$('.clsPanel2').show();
            }
            else
            {
              alert("Error, Vuelva a intentarlo");
            }
          }
        }
      }
      else
      {
        var obj = {ID:txtTskID, Correlativo:txtTskCorrelativo, Codigo:txtTskCodigo, Descripcion:txtTskDescripcion, Plazo:txtTskPlazo, Horas:txtTskHoras, Porcentaje:txtTskPorcentaje, Grupo:strGrCodeGroup, Responsable:txtTskResponsable, Autor:txtUser, Disabled:intTaskDisabled};//{ username: $("#txtuser").val(), name: $("#txtname").val() };

        $.ajax(
          {
            type: "POST",
            url: serviceUri+"/UpdateParametrizacionTarea",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data:JSON.stringify(obj),
            complete: OnComplete,
            success: OnSuccess,
            error: OnError
          });

        function OnSuccess(data, status,xhttp)
        {
          if(status=="success")
          {
            var strTaskCodeResult = data.d;

            $("#divOutput").empty();
            $("#divOutput").append('<font size="3" class="clsMsgRed"><strong>Operacion realizada con Exito!!</strong></font>');
          }
          else
          {
            alert("Error, Vuelva a intentarlo");
          }
        }
      }
    });
  }

  function detalleTareas(txtGrCode, strGrCodeGroup, indexi, txtUser, serviceUri)
  {
    indexj=0;

    var obj = {};
    var arregloTareas = new Array ();


    $(".clsTareas .clsGrupoTasksItem"+txtGrCode+' tbody tr').each(function(ij, trj)  //.find('.clsTareaItemDetalle').each(function(ij, trj)
    {
      indexj++;
      lblCorrelativoPadreActividadTarea = $('.clsCodigo').val()+'.'+indexi+'.'+indexj;
      $(trj).find('.clsTaskCorrelativoItem').text(lblCorrelativoPadreActividadTarea);

      txtTskID = $(trj).find('.clsTaskCode').text();
      txtTskCorrelativo = $(trj).find('.clsTaskCorrelativoItem').text();
      txtTskCodigo = $(trj).find('.clsTaskCodigoItem').val();
      txtTskDescripcion = $(trj).find('.clsTaskDescripcion').val();
      txtTskPlazo = $(trj).find('.clsTaskPlazo').val();
      txtTskHoras = $(trj).find('.clsTaskHoras').val();
      txtTskPorcentaje = $(trj).find('.clsTaskPorcentaje').val();
      txtTskResponsable = $(trj).find('.clsTaskResponsable option:selected').val();
      intTaskDisabled = 0;

      if($(trj).is(':visible'))
      {
        intTaskDisabled = 0;
      }
      else
      {
        intTaskDisabled = 1;
      }

      if(txtTskHoras == null)
      {
        txtTskHoras = '0';
      }

      obj = {};
      if(txtTskID.length == 0)
      {
        if($(trj).is(':visible')){
          obj = {ID :'0',Correlativo:txtTskCorrelativo, Codigo:txtTskCodigo, Descripcion:txtTskDescripcion, Plazo:txtTskPlazo, Horas:txtTskHoras, Porcentaje:txtTskPorcentaje, Grupo:strGrCodeGroup, Responsable:txtTskResponsable, Autor:txtUser};
        }
      }else{
        obj = {ID:txtTskID, Correlativo:txtTskCorrelativo, Codigo:txtTskCodigo, Descripcion:txtTskDescripcion, Plazo:txtTskPlazo, Horas:txtTskHoras, Porcentaje:txtTskPorcentaje, Grupo:strGrCodeGroup, Responsable:txtTskResponsable, Autor:txtUser, Disabled:intTaskDisabled};//{ username: $("#txtuser").val(), name: $("#txtname").val() };

      }


      arregloTareas.push(obj);

    });

    return arregloTareas;
  }


  $(".fuGrupos").change(function()
  {
    if (confirm("Esta Segur@?"))
    {
      var excelFile, fileReader = new FileReader();
      worksheetsNumber =0;

      fileReader.onload = function (e) {
        //var buffer = new Uint8Array(fileReader.result);
        var buffer = new Uint8Array(e.target.result);

        $.ig.excel.Workbook.load(buffer, function (workbook)
        {

          //Grupos
          var column, row, newRow, cellValue, columnIndex, i,
            worksheet = workbook.worksheets(0),
            columnsNumber = 0,
            gridColumnsGrupos = [],
            gridColumnsTareas = [],
            dataGrupos = [],
            dataTareas = [],
            worksheetRowsCount;

          while (worksheet.rows(0).getCellValue(columnsNumber)) {
            columnsNumber++;
          }



          for (columnIndex = 0; columnIndex < columnsNumber; columnIndex++) {
            //Cris_09/01/2018 : correccion a bug: falla el cargado de grupos y tareas en internet explorer // la funcion getCellText provoca un error en IE se cambio por getCellValue
            //  column = worksheet.rows(0).getCellText(columnIndex);
            column = worksheet.rows(0).getCellValue(columnIndex);
            gridColumnsGrupos.push({ headerText: column, key: column });
            //alert(column);
          }

          worksheetRowsCount = worksheet.rows().count();



          for (i = 1 ; i < worksheetRowsCount; i++) {


            newRow = {};
            row = worksheet.rows(i);

            if(row.getCellValue(0)!=null){
              for (columnIndex = 0; columnIndex < columnsNumber; columnIndex++) {

                //Cris_09/01/2018 : correccion a bug: falla el cargado de grupos y tareas en internet explorer // la funcion getCellText provoca un error en IE se cambio por getCellValue
                //cellValue = row.getCellText(columnIndex);
                cellValue = row.getCellValue(columnIndex);
                newRow[gridColumnsGrupos[columnIndex].key] = cellValue;
              }
              dataGrupos.push(newRow);
            }

          }




          worksheet = workbook.worksheets(1),
            columnsNumber = 0;

          while (worksheet.rows(0).getCellValue(columnsNumber)) {
            columnsNumber++;
          }

          for (columnIndex = 0; columnIndex < columnsNumber; columnIndex++) {
            //Cris_09/01/2018 : correccion a bug: falla el cargado de grupos y tareas en internet explorer // la funcion getCellText provoca un error en IE se cambio por getCellValue
            //column = worksheet.rows(0).getCellText(columnIndex);
            column = worksheet.rows(0).getCellValue(columnIndex);
            gridColumnsTareas.push({ headerText: column, key: column });
          }

          for (i = 1, worksheetRowsCount = worksheet.rows().count() ; i < worksheetRowsCount; i++) {
            newRow = {};
            row = worksheet.rows(i);

            if(row.getCellValue(0)!=null){
              for (columnIndex = 0; columnIndex < columnsNumber; columnIndex++) {
                //Cris_09/01/2018 : correccion a bug: falla el cargado de grupos y tareas en internet explorer // la funcion getCellText provoca un error en IE se cambio por getCellValue
                //cellValue = row.getCellText(columnIndex);
                cellValue = row.getCellValue(columnIndex);
                newRow[gridColumnsTareas[columnIndex].key] = cellValue;
              }
              dataTareas.push(newRow);
            }
          }



          $.each(dataGrupos, function( index, value )
          {
            var intRows = value.Codigo;

            $('.clsGrpID').text(intRows);

            $(".btn-AddGrupo").click();

            $('.clsTareas .clsTareaItem'+intRows).each(function(i, tr)
            {
              $(tr).find('.clsTaskCodigoItem').removeClass('required');
              $(tr).find('.clsTaskDescripcion').removeClass('required');
              $(tr).find('.clsTaskPlazo').removeClass('required');
              $(tr).find('.clsTaskHoras').removeClass('required');
              $(tr).find('.clsTaskPorcentaje').removeClass('required');
              $(tr).find('.clsTaskTipoTarea').removeClass('required');
              $(tr).find('.clsTaskResponsable').removeClass('required');

              if(value.Codigo != '')
              {
                $(tr).find('.clsTaskCodigoItem').val(value.Codigo);
              }
              else
              {
                $(tr).find('.clsTaskCodigoItem').addClass('required');
              }

              if(value.Descripcion != '')
              {
                $(tr).find('.clsTaskDescripcion').text(value.Descripcion);
              }
              else
              {
                $(tr).find('.clsTaskDescripcion').addClass('required');
              }

              if(value.Plazo != '')
              {
                $(tr).find('.clsTaskPlazo').val(value.Plazo);
              }
              else
              {
                $(tr).find('.clsTaskPlazo').addClass('required');
              }

              if(value.Horas != '')
              {
                $(tr).find('.clsTaskHoras').val(value.Horas);
              }
              else
              {
                $(tr).find('.clsTaskHoras').addClass('required');
              }

              if(value.Porcentaje != '')
              {
                $(tr).find('.clsTaskPorcentaje').val(value.Porcentaje);
              }
              else
              {
                $(tr).find('.clsTaskPorcentaje').addClass('required');
              }

              if(value.Orden != '')
              {//alert('Orden'+$(tr).find('.clsTaskTipoTarea option[value="'+value.Orden+'"]').length);

                if($(tr).find('.clsTaskTipoTarea').find('option[value="'+value.Orden+'"]').length)
                {
                  $(tr).find('.clsTaskTipoTarea').find('option[value="'+value.Orden+'"]').prop('selected', 'selected');
                }
                else
                {
                  $(tr).find('.clsTaskTipoTarea').addClass('required');
                }
              }
              else
              {
                $(tr).find('.clsTaskTipoTarea').addClass('required');
              }

              if(value.Responsable != '')
              {//alert(value.Responsable);alert('Resp'+$(tr).find('.clsTaskResponsable').find('option[value="'+value.Responsable+'"]').val().length);

                $(tr).find('.clsTaskResponsable').find('option').each(function(index,option){
                  if($(option).text()==value.Responsable)
                    $(option).prop('selected','selected');
                });

                /*    //aqui se cambio febrero 8
               if($(tr).find('.clsTaskResponsable').find('option[value="'+value.Responsable+'"]').length)
               {
                 $(tr).find('.clsTaskResponsable').find('option[value="'+value.Responsable+'"]').prop('selected', 'selected');
               }
               else
               {
                 $(tr).find('.clsTaskResponsable').addClass('required');
               }
               */
              }
              else
              {
                $(tr).find('.clsTaskResponsable').addClass('required');
              }

            });
          });

          var ddlTskResponsables = '';

          $("#ctl00_PlaceHolderMain_ppResponsableOperativo_upLevelDiv .ms-entity-resolved").each(function(ie, tre)
          {
            var strTskKey = $(tre).find('#divEntityData').attr('key');
            strTskKey = strTskKey.replace('i:0#.w|', '');
            var strTskDisplay = $(tre).find('#divEntityData').attr('displaytext');

            if(strTskKey.indexOf("\\")>0)
            {
              strTskKey = strTskKey.split('\\')[1];
            }

            ddlTskResponsables += '<option value="'+strTskKey+'">'+strTskDisplay+'</option>';
          });


          var strHoras = '';

          $.each(dataTareas, function( index, value )

          {
            if(value.Codigo_Grupo != '')
            {

              if($('.clsTareas .clsTareaItem'+value.Codigo_Grupo).length)
              {
                if($('.clsTiempo').val() == 'Horas')
                {
                  strHoras = '<td class="clsCHoras" style="padding:5px;"><input class="form-control clsTaskHoras clsTaskHoras" type="text" value="'+value.Horas+'"></td>';
                }
                else
                {
                  strHoras = '';
                }
                // cris: Bug: el cargado de bulk no reconoce los usuarios que se registra en cada tarea

                //if($(ddlTskResponsables).find('option[value="'+value.Responsable+'"]').length)
                //{
                //	$(ddlTskResponsables).find('option[value="'+value.Responsable+'"]').prop('selected', 'selected');
                //}


                $('.clsTareas .clsGruposTasks'+value.Codigo_Grupo).append('<tr class="clsTareaItemDetalle clsTareaItemDetalle">'+
                  '<td style="padding:5px;"><label class="clsHide clsTaskCode" ></label><img title="Eliminar" class="clsDeleteTaskItemDetalle clsDeleteTaskItemDetalle" src="/SGO/img/delete.png" width="25px"></img></td>'+
                  '<td style="padding:5px; display:none;">'+
                  '<label class="form-control clsTaskCorrelativoItem"></label>'+
                  '</td>'+
                  '<td style="padding:5px;">'+
                  '<input class="form-control clsTaskCodigoItem" type="text" value="'+value.Codigo_Tarea+'">'+
                  '</td>'+
                  '<td style="padding:5px;">'+
                  '<textarea class="form-control clsTaskDescripcion" >'+value.Descripcion+'</textarea>'+
                  '</td>'+
                  '<td class="clsCPlazo" style="padding:5px;">'+
                  '<input class="form-control clsTaskPlazo clsTaskPlazo" type="text"  value="'+value.Plazo+'">'+
                  '</td>'+
                  strHoras +
                  '<td style="padding:5px;">'+
                  '<input class="form-control clsTaskPorcentaje clsTaskPorcentaje" type="text" value="'+value.Porcentaje+'">'+
                  '</td>'+
                  '<td style="padding:5px;">'+
                  '<select class="form-control clsTaskResponsable">'+	ddlTskResponsables +
                  '</select>'+
                  '</td>'+
                  '</tr>');

                // cris: Bug: el cargado de bulk no reconoce los usuarios que se registra en cada tarea

                $('.clsTareas .clsGruposTasks'+value.Codigo_Grupo).find(".clsTaskResponsable").find('option').each(function(index,option){
                  if($(option).text()==value.Responsable)
                    $(option).prop('selected','selected');
                });
                /*

                if($('.clsTareas .clsGruposTasks'+value.Codigo_Grupo).find(".clsTaskResponsable").find('option[value="'+value.Responsable+'"]').length)
                {
                  $('.clsTareas .clsGruposTasks'+value.Codigo_Grupo).find(".clsTaskResponsable").find('option[value="'+value.Responsable+'"]').prop('selected', 'selected');
                }
                */

              }
            }
          });

          $('.clsGrpID').text('');


        }, function (error) {

          alert("Archivo corrupto!");
        });
      }

      if (this.files.length > 0) {
        excelFile = this.files[0];
        if (excelFile.type === "application/vnd.ms-excel" || excelFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || (excelFile.type === "" && (excelFile.name.endsWith("xls") || excelFile.name.endsWith("xlsx")))) {
          fileReader.readAsArrayBuffer(excelFile);
        }
        else
        {
          alert("Formatode archivo no soportado!");
        }
      }
      // });
    }

    return false;
  });


  function validarObjetivo (){

    var sw=true;

    intTotalDescripcion = 0;
    intTotalPlazoGrupo = 0;
    //se aumento
    intTotalHorasGrupo = 0;

    intTotalPorcentajeGrupo = 0;
    intPlazo = Number($('.clsPlazo').val());

    //aqui se aumento para poder validar los datos de Parametrizacion de Objetivo
    $('.clsCodigo').removeClass('required');

    if($('.clsCodigo').val().length == 0)
    {
      $('.clsCodigo').addClass('required');
      sw=false;
    }

    if(!sw)
    {
      alert('Codigo Requerido!!');
      return false;
    }

    //JC - validacion campo Responsable
    $('#ctl00_PlaceHolderMain_ppResponsable_upLevelDiv').removeClass('required');

    if($('#ctl00_PlaceHolderMain_ppResponsable_upLevelDiv span').length == 0)
    {
      $('#ctl00_PlaceHolderMain_ppResponsable_upLevelDiv').addClass('required');
      sw=false;
    }

    if(!sw)
    {
      alert('Responsable Requerido!!');
      return false;
    }

    //JC - validacion campo Responsable Operativo
    $('#ctl00_PlaceHolderMain_ppResponsableOperativo_upLevelDiv').removeClass('required');

    if($('#ctl00_PlaceHolderMain_ppResponsableOperativo_upLevelDiv span').length == 0)
    {
      $('#ctl00_PlaceHolderMain_ppResponsableOperativo_upLevelDiv').addClass('required');
      sw=false;
    }

    if(!sw)
    {
      alert('Responsable Operativo Requerido!!');
      return false;
    }

    //aqui se realiza el cambio
    /*	$('.clsGerencia').removeClass('required');

      if($('.clsGerencia').val().length == 0)
       {
         $('.clsGerencia').addClass('required');
         sw=false;
       }

      if(!sw)
      {
        alert('Gerencia requeridos!!');
        return false;
      }

      */




    $('.clsGestion').removeClass('required');

    if($('.clsGestion').val().length == 0)
    {
      $('.clsGestion').addClass('required');
      sw=false;
    }

    if(!sw)
    {
      alert('Gestion requeridos!!');
      return false;
    }


    //Validacion Grupos
    $(".clsTareas .clsTareaItem").each(function(iPor, trPor)
    {

      if($(trPor).is(':visible'))
      {
        //indexi++;
        //aqui se aumento el codigo para descripcion

        $(trPor).find('.clsTaskDescripcion').removeClass('required');

        $(trPor).find('.clsTaskPlazo').removeClass('required');
        //se aumento
        $(trPor).find('.clsTaskHoras').removeClass('required');


        $(trPor).find('.clsTaskPorcentaje').removeClass('required');
        txtGrCode = $(trPor).attr('Code');
        //aqu se aumento codigo para la

        //Cris: validacion codigoGrupo
        $(trPor).find('.clsTaskCodigoItem').removeClass('required');

        if($(trPor).find('.clsTaskCodigoItem').val().length == 0)
        {
          $(trPor).find('.clsTaskCodigoItem').addClass('required');
          sw=false;
        }

        //Cris: validacion descripcion grupo
        $(trPor).find('.clsTaskDescripcion').removeClass('required');

        if($(trPor).find('.clsTaskDescripcion').val().length == 0)
        {
          $(trPor).find('.clsTaskDescripcion').addClass('required');
          sw=false;
        }

        //Cris: validacion Plazo(dias) grupo
        $(trPor).find('.clsTaskPlazo').removeClass('required');

        if($(trPor).find('.clsTaskPlazo').val().length == 0 || $(trPor).find('.clsTaskPlazo').val() <= 0)
        {
          $(trPor).find('.clsTaskPlazo').addClass('required');
          sw=false;
        }

        //Cris: validacion horas grupo
        $(trPor).find('.clsTaskPlazo').removeClass('required');

        if($('.clsTiempo').val() == 'Horas'){
          if($(trPor).find('.clsTaskHoras').val().length == 0 || $(trPor).find('.clsTaskHoras').val() <= 0)
          {
            $(trPor).find('.clsTaskHoras').addClass('required');
            sw=false;
          }

        }

        //Cris: validacion Porcentaje  grupo
        $(trPor).find('.clsTaskPorcentaje').removeClass('required');

        if($(trPor).find('.clsTaskPorcentaje').val() <= 0 || $(trPor).find('.clsTaskPorcentaje').val() > 100 )
        {
          $(trPor).find('.clsTaskPorcentaje').addClass('required');
          sw=false;
        }

        //Cris: validacion Orden Tareas grupo
        $(trPor).find('.clsTaskTipoTarea').removeClass('required');

        if($(trPor).find('.clsTaskTipoTarea').val() == '' || $(trPor).find('.clsTaskTipoTarea').val() == 'undefined')
        {
          $(trPor).find('.clsTaskTipoTarea').addClass('required');
          sw=false;
        }

        //Cris: validacion Responsable grupo

        $(trPor).find('.clsTaskResponsable').removeClass('required');

        if($(trPor).find('.clsTaskResponsable').val() == '' || $(trPor).find('.clsTaskResponsable').val() == 'undefined' ||  $(trPor).find('.clsTaskResponsable').val() == null)
        {
          $(trPor).find('.clsTaskResponsable').addClass('required');
          sw=false;
        }

        intPlazoGrupo = Number($(trPor).find('.clsTaskPlazo').val());

        //se aumento este codigo
        intHorasGrupo = Number($(trPor).find('.clsTaskHoras').val());

        intPorcentajeGrupo = Number($(trPor).find('.clsTaskPorcentaje').val());
        txtGrTipoTarea = $(trPor).find('.clsTaskTipoTarea option:selected').val();

        if(intPlazoGrupo>$('.clsPlazo').val())
        {
          $(trPor).find('.clsTaskPlazo').addClass('required');
          sw = false;
        }

        if(txtGrTipoTarea == 'S')
        {
          intTotalPlazoGrupo += Number($(trPor).find('.clsTaskPlazo').val());


          //se modifico
          intTotalHorasGrupo += Number($(trPor).find('.clsTaskHoras').val());


          intTotalPorcentajeGrupo += Number($(trPor).find('.clsTaskPorcentaje').val());


          if(intTotalPlazoGrupo > 365)
          {
            $(trPor).find('.clsTaskPlazo').addClass('required');
            sw = false;
          }

          if(intTotalPlazoGrupo > intPlazo)
          {
            $(trPor).find('.clsTaskPlazo').addClass('required');
            sw = false;
          }


          //se aumento
          if(intTotalHorasGrupo > 24)
          {
            $(trPor).find('.clsTaskHoras').addClass('required');
            sw = false;
          }



          if(intTotalPorcentajeGrupo > 100)
          {
            $(trPor).find('.clsTaskPorcentaje').addClass('required');
            sw = false;
          }
        }

        //se aumento
        intTotalHorasTareas = 0;

        intTotalPorcentajeTareas = 0;
        intTotalPlazoTareas = 0;

        //Validacion Tareas Grupo

        $(".clsTareas .clsGruposTasks"+txtGrCode+' tr').each(function(iPorj, trPorj)  //.find('.clsTareaItemDetalle').each(function(ij, trj)
        {
          if($(trPorj).is(':visible'))
          {
            //indexj++;
            $(trPorj).find('.clsTaskPlazo').removeClass('required');

            //se aumento
            $(trPorj).find('.clsTaskHoras').removeClass('required');


            $(trPorj).find('.clsTaskPorcentaje').removeClass('required');

            //Cris: validacion codigo de Tareas para grupo
            $(trPorj).find('.clsTaskCodigoItem').removeClass('required');

            if($(trPorj).find('.clsTaskCodigoItem').val().length == 0)
            {
              $(trPorj).find('.clsTaskCodigoItem').addClass('required');
              sw=false;
            }

            //Cris: validacion descripcion de Tareas para grupo
            $(trPorj).find('.clsTaskDescripcion').removeClass('required');

            if($(trPorj).find('.clsTaskDescripcion').val().length == 0)
            {
              $(trPorj).find('.clsTaskDescripcion').addClass('required');
              sw=false;
            }


            //Cris: validacion plazo de Tareas para grupo
            $(trPorj).find('.clsTaskPlazo').removeClass('required');

            if($(trPorj).find('.clsTaskPlazo').val() <= 0 )
            {
              $(trPorj).find('.clsTaskPlazo').addClass('required');
              sw=false;
            }

            //Cris: validacion horas de Tareas para grupo
            $(trPorj).find('.clsTaskHoras').removeClass('required');

            if($('.clsTiempo').val() == 'Horas'){
              if($(trPorj).find('.clsTaskHoras').val() <= 0 )
              {
                $(trPorj).find('.clsTaskHoras').addClass('required');
                sw=false;
              }

            }

            //Cris: validacion porcentaje  de Tareas para grupo
            $(trPorj).find('.clsTaskPorcentaje').removeClass('required');


            if($(trPorj).find('.clsTaskPorcentaje').val() <= 0 || $(trPorj).find('.clsTaskPorcentaje').val() > 100)
            {
              $(trPorj).find('.clsTaskPorcentaje').addClass('required');
              sw=false;
            }

            //Cris: validacion Responsable  de Tareas para grupo

            $(trPorj).find('.clsTaskResponsable').removeClass('required');

            if($(trPorj).find('.clsTaskResponsable').val() == '' || $(trPorj).find('.clsTaskResponsable').val() == 'undefined' ||  $(trPorj).find('.clsTaskResponsable').val() == null)
            {
              $(trPorj).find('.clsTaskResponsable').addClass('required');
              sw=false;
            }


            txtTskID = $(trPorj).find('.clsTaskCode').text();
            intPlazoTareas = Number($(trPorj).find('.clsTaskPlazo').val());

            //se aumento
            intHorasTareas = Number($(trPorj).find('.clsTaskHoras').val());


            intPorcentajeTareas = Number($(trPorj).find('.clsTaskPorcentaje').val());
            intTotalPlazoTareas += Number($(trPorj).find('.clsTaskPlazo').val());

            //se aumento
            intTotalHorasTareas += Number($(trPorj).find('.clsTaskHoras').val());


            intTotalPorcentajeTareas += Number($(trPorj).find('.clsTaskPorcentaje').val());



            if(txtGrTipoTarea == 'S'){

              if(intTotalPlazoTareas > intPlazoGrupo)
              {
                $(trPorj).find('.clsTaskPlazo').addClass('required');
                sw = false;
              }

              //esto se aumento
              if(intTotalHorasTareas > intHorasGrupo)
              {
                $(trPorj).find('.clsTaskHoras').addClass('required');
                sw = false;
              }

              if(intTotalPorcentajeTareas > intPorcentajeGrupo)
              {
                $(trPorj).find('.clsTaskPorcentaje').addClass('required');
                sw = false;
              }
            }else{
              if(intPlazoTareas > intPlazoGrupo)
              {
                $(trPorj).find('.clsTaskPlazo').addClass('required');
                sw = false;
              }


              if(intHorasTareas > intHorasGrupo)
              {
                $(trPorj).find('.clsTaskHoras').addClass('required');
                sw = false;
              }

              if(intPorcentajeTareas > intPorcentajeGrupo)
              {
                $(trPorj).find('.clsTaskPorcentaje').addClass('required');
                sw = false;
              }
            }
          }
        });
      }
    });

    return sw;


  }




  $(document).on('click', '.jsgrid-Home-button', function()
  {
    $(location).attr('href', '/SGO/Forms');
  });
});

