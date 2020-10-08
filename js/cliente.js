//var socket = io.connect('http://187.173.204.146:8888/'); //Se hace la conexion con el servidor 
var socket = io.connect('http://destinosparhikuni.no-ip.org:8888/'); //Se hace la conexion con el servidor
			
$(document).ready(function(){

$("#envioemails").click(function(){
	var emails=$('#emails').val();
	var clave_usuario= $('#claves').val();
	var nombre_cliente= espacios($('#nombres').val());
	var nombre=$('#nombres').val();
		if(emails!=""){
		var men_usu =	'<div class="conversacion_us">'; 
			men_usu +=	'<div class="nombres_pers">'+nombre+'</div>';
			men_usu +=	'<div class="calloutUp"><div class="calloutUp21"></div></div>';
			men_usu +=	'<div class="divContainerUp">'+emails+'</div></div>';
			
			$('#areachats > #'+clave_usuario+'_'+nombre_cliente+' > #content_'+clave_usuario).append(men_usu);
			$("#content_"+clave_usuario).mCustomScrollbar("destroy");
			$("#content_"+clave_usuario).mCustomScrollbar();
			$("#content_"+clave_usuario).mCustomScrollbar("scrollTo","bottom",{scrollInertia:0});
				var scroll=$('.mCSB_container').attr('class');
					if(scroll=='mCSB_container'){
						$(".calloutUp2").css('left','250px');
						$(".nombres_pers").css('left','20px');
					}
			$('#emails').val('');
			$('#emails').focus();
			socket.emit('sendchat', emails, clave_usuario);
		}else{
			$('#emails').focus();
		}
});

$('#emails').keypress(function(e) {
	if(e.which == 13) {
		$(this).blur();
		$('#envioemails').focus().click();
	}
});

$('#ingresareserva').click(function(){
	$("#chatreserva").submit();
});

$('#chatreserva').validate({
	submitHandler: function(form) {
		form.submit();
	}
});

$('#enviar_r').click(function(){
var nombre_reservaciones=$('#person_res').html();
var men=$("#chatre").val();
var usuario_conversando=$("#chatre").attr('rel');
var id=usuario_conversando.split('_');
	if(men!=""){
		if(usuario_conversando!=""){
			var mensaje ='<div class="conversacion_us">';
				mensaje +='<div class="nombres_pers1">'+nombre_reservaciones+'</div><div class="calloutUp1">';
				mensaje +='<div class="calloutUp2"></div></div><div class="divContainerUp">'+men+'</div></div>';
				$('#chats_reservacion > #'+usuario_conversando+' > #content_'+id[0]).append(mensaje);
					$("#content_"+id[0]).mCustomScrollbar("destroy");
					$("#content_"+id[0]).mCustomScrollbar();
					$("#content_"+id[0]).mCustomScrollbar("scrollTo","bottom",{scrollInertia:0});

					$('#chatre').val('');
					$('#chatre').focus();
				socket.emit('sendchat_usuario', men, nombre_reservaciones,usuario_conversando);
					
				var clave = usuario_conversando.split('_');
				cuentamensajes(usuario_conversando,clave[0]);
		}else{
			$('#usuariovacio').text('Seleccione un usuario para conversar');
			$('#usuariovacio').dialog({
				modal:true,
				resizable:false,
				show:"scale",
				hide:"puff"
			});
		}
	}else{
		$('#chatre').focus();	
	}
});

	$('#chatre').keypress(function(e) {
		if(e.which == 13) {
			$(this).blur();
			$('#enviar_r').focus().click();
		}
	});	
	
	$('#va_ce').click(function(){
	var id = $(this).attr('rel');
	var cliente = $(this).attr('alt');
		$('#valida_cerrar').dialog('destroy');
		var men=$('#chats_reservacion > #'+id+'_'+cliente+' > #content_'+id).html();
		var id_activo=$('.cliente_activoc').attr('id');
		socket.emit('usu_desconectar', id);
		if(id_activo==id+'_'+cliente){
			$('.cliente_activoc').css('display','none');
			$('#chats_reservacion').find('#'+id+'_'+cliente).css('display','none');
		}
	});
	
	$('#session_c').click(function(){
	var clave_r=$('#claver').val();
		saveallconversations(clave_r);	
	});
	
	$('#cerrar_cliente img').click(function(){
		var usersactive=$('.cliente_activoc').attr('id');
		$('.cliente_activoc').css('display','none');
		$('#chats_reservacion > #'+usersactive).css('display','none');
		$('#chatre').attr('rel','');
	});
});


	document.onkeydown = function(){ 
		if(window.event && window.event.keyCode == 116) { 
			event.preventDefault();
			event.stopPropagation();
			$('.emailss').each(function(){
				var idusuario=$(this).attr('id');
				var id = idusuario.split('_');
				var mensajes=$('#chats_reservacion > #'+idusuario+' > #content_'+id).html();
				var parameters = { val1: idusuario, val2: id[0], val3: mensajes };
				$.get( '/reservacion',parameters, function(data) {
				});
			});
			
		}
	
	}
/***************************************BLOQUEA LA FLECHA ATRAS DEL NAVEGADOR*****************************/	
window.onload = function () {
    if (typeof history.pushState === "function") {
        history.pushState("jibberish", null, null);
        window.onpopstate = function () {
            history.pushState('newjibberish', null, null);
        };
    }
    else {
        var ignoreHashChange = true;
        window.onhashchange = function () {
            if (!ignoreHashChange) {
                ignoreHashChange = true;
                window.location.hash = Math.random();

            }
            else {
                ignoreHashChange = false;   
            }
        };
    }
}
/************************************RESPUESTAS EMITIDAS POR EL SERVIDOR****************************************************************/
	socket.on('enviomensaje',function(){
		$('#asuntop').css('display','none');
	});
	
	socket.on('updaterooms', function(rooms, nombre_usuario){
		//$('#areausucon').empty();
		$.each(rooms, function(key, value) {
			if(value == nombre_usuario){
				socket.emit('menuConectados', value);
			}else{
				socket.emit('menuConectados', value);
			}
		});
	});
	
	/*Agrega los usuarios conectados*/
	socket.on('usersconect', function(rows){
	var claver=$('#claver').val();
		if(claver){
			$('#areausucon').empty();
			var ides = rows[0].clave;
			var client=rows[0].Cliente;
					
				for(y in rows){
					var conectados = rows.length;
					$('#n_usuarios > #num_con1').html(conectados);
					var ids = rows[y].clave;
					var asistente = rows[y].Asistente;
					var cliente = espacios(rows[y].Cliente);
					var email = rows[y].emailCliente;
					var asunto = rows[y].asunto;
					var conectado = rows[y].lConectado;	
					var pendientes="";

					$('.numeromensaj').each(function(){
					var id = $(this).attr('id');
						if(id==ids){
						var valor = $(this).html();
						
							if(valor!=undefined){
								pendientes=valor;
							}else{
								pendientes="";
							}
						}
					});
					
					var html_usucon = '<div id="'+ids+'_'+cliente+'" class="c_conectados">';
						html_usucon+= '<img src="imagenes/reservaciones/cliente.png" class="imaclient"/>';
						html_usucon+= 	'<div onclick="switchRoom(\''+cliente+'\',\''+ids+'_'+cliente+'\');" class="info_clientes">';
						html_usucon+=		'<span class="tiempoconect"></span><br />';
						html_usucon+=		'<span class="tam17">'+cliente.substring(0,24)+'..</span>';
						html_usucon+=		'<span class="tam13 asuntito">Asunto:'+asunto.substring(0,24)+'..</span>';
						html_usucon+=		'<span class="tam13 correo">Correo:'+email.substring(0,40)+'..</span>';
						html_usucon+=	'</div>';
						html_usucon+=	'<div class="cerrar_c">';
						html_usucon+=		'<img src="imagenes/reservaciones/cerrar.png" onclick="cerrar('+ids+',\''+cliente+'\');"/><br />';
						html_usucon+=		'<div class="estado_ti tiempo_no">'+pendientes+'</div>'
						html_usucon+=	'</div>';
						html_usucon+= '</div>';
						
						$('#areausucon').append(html_usucon);
						
						obtpendientesmen(ids,cliente,pendientes);
						$("#content_10").mCustomScrollbar("destroy");
						$("#content_10").mCustomScrollbar();

				}
		}
		$("#content_10").mCustomScrollbar("destroy");
		$("#content_10").mCustomScrollbar();
		PlaySound();
	});
	
	/*recibe mensajes el de reservaciones de los diferentes users conectados*/
	socket.on('updatemensaje', function(mensaje,rows){
	var usuario= espacios(rows[0].Cliente);
	var usuariom=rows[0].Cliente;
	var clave= rows[0].clave;
	
	var recibemen_reserva =	'<div class="conversacion_us">'; 
		recibemen_reserva +=	'<div class="nombres_pers">'+usuariom+'</div>';
		recibemen_reserva +=	'<div class="calloutUp"><div class="calloutUp2"></div></div>';
		recibemen_reserva +=	'<div class="divContainerUp">'+mensaje+'</div></div>';
		
	var ex= $('div#chats_reservacion').find('#'+clave+'_'+usuario).html();
	
		if(ex!=undefined){
			$('.emailss').each(function(){
			var id = $(this).attr('id');
				if(id==clave+'_'+usuario){
					$('#chats_reservacion > #'+clave+'_'+usuario+' > #content_'+clave).append(recibemen_reserva);
					$("#content_"+clave).mCustomScrollbar("destroy");
					$("#content_"+clave).mCustomScrollbar();
					$("#content_"+clave).mCustomScrollbar("scrollTo","bottom",{scrollInertia:0});
					
					cuentamensajes(clave+'_'+usuario,clave);
				}
			});
		}else{
			var agregar='<div id='+clave+'_'+usuario+' class="emailss"><div id="content_'+clave+'" class="content"></div></div>';
			$('#chats_reservacion').append(agregar);
			$('#chats_reservacion > #'+clave+'_'+usuario+' > #content_'+clave).append(recibemen_reserva);
			$("#content_"+clave).mCustomScrollbar("destroy");
			$("#content_"+clave).mCustomScrollbar();
			$("#content_"+clave).mCustomScrollbar("scrollTo","bottom",{scrollInertia:0});

		}
		
		var limpiar=$('#areausucon > #'+clave+'_'+usuario+' > .cerrar_c > .estado_ti');
		
		$('.c_conectados').each(function(){
		var id = $(this).attr('id');
		var busca = $('.numensajesxuser > #'+clave).html();
			if(id==clave+'_'+usuario){	
			var m=1;
			var sumamsg= parseInt(busca) + parseInt(m);
				if(busca!=undefined){
					$('.numensajesxuser > #'+clave).html('');
					$('.numensajesxuser > #'+clave).append(sumamsg);
				}else{
					$('.numensajesxuser').append('<div id="'+clave+'" class="numeromensaj">'+m+'</div>');
					PlaySound();
				}
				
				var useractive=$('.cliente_activoc').attr('id');
				if(id==useractive){
					var idnum=$('.numensajesxuser > #'+clave).html(0);
					limpiar.html('');
					limpiar.append(idnum);
					PlaySound();
				}else{
				var idnum1=$('.numensajesxuser > #'+clave).html();
					limpiar.html('');
					limpiar.append(idnum1);
					obtpendientesmen(clave,usuario,idnum1);
					PlaySound();
				}
			}
		});
	});
	
	/*Recibe los mensajes el usuario de reservaciones*/
	socket.on('updatemensajeausuario', function(men, nombre_reservaciones, usuario_conversando){
	var usuarioactual= espacios($('#nombres').val());
	var claveactual=$('#claves').val();
	var men_usu ='<div class="conversacion_us">'; 
		men_usu +='<div class="nombres_pers1">'+nombre_reservaciones+'</div>';
		men_usu += '<div class="calloutUp"><div class="calloutUp2"></div></div>';
		men_usu +='<div class="divContainerUp">'+men+'</div></div>';
		if(usuario_conversando==claveactual+'_'+usuarioactual){	
			$('#areachats > #'+usuario_conversando+' > #content_'+claveactual).append(men_usu);
				$("#content_"+claveactual).mCustomScrollbar("destroy");
				$("#content_"+claveactual).mCustomScrollbar();
				$("#content_"+claveactual).mCustomScrollbar("scrollTo","bottom",{scrollInertia:0});

					var scroll=$('.mCSB_container').attr('class');
						if(scroll=='mCSB_container'){
							$(".calloutUp2").css('left','250px');
							$(".nombres_pers").css('left','20px');
						}
		}
	});
	
	socket.on('redirecciona',function(){
	var cla_r=$('#estado').val();
		if(cla_r==undefined){
			window.location="/ingresar353rb4";
		}else{
			window.location="/";
		}
	});
	
	socket.on('avisodesconecta',function(idusu,nombre){
	var clave_r=$('#claver').val();
	var numeroconectados=$('#num_con1').html();
	var actualizausuconect=numeroconectados-1;
	var numeroconectados=$('#num_con1').html(actualizausuconect);
	var usu_clav=idusu+'_'+espacios(nombre);
	
		if(clave_r && clave_r!=""){
			var mensaje = $('#chats_reservacion > #'+usu_clav+' > #content_'+idusu).html();
			socket.emit('guardamensajes',idusu, mensaje);
			var usuarioactive=$('.cliente_activoc').attr('id');
			if(usuarioactive==usu_clav){
				$('.cliente_activoc').css('display','none');
				$('#chats_reservacion > #'+usu_clav+'').remove();
			}	
		}	
	});
	
	socket.on('abandonausuario',function(usuario){
		var userActual=$('#claves').val();
		if(userActual==usuario){
			window.location="/";
		}
	});
	
	socket.on('allconversations',function(){
	var clave_r=$('#claver').val();
			saveallconversations(clave_r);
	});
	/*******************************************FUNCIONES********************************************************/
	
	function dialogo(){
	$('#denegado').text('Acceso denegado!!!.Verifique el usuario o su contraseña.');
		$('#denegado').dialog({
			modal:true,
			resizable:false,
			show:"scale",
			hide:"puff"
		});
	}
	
	function sessionocupada(){
	$('#denegado').text('Actualmente existe una sessión. Favor de reintentarlo más tarde.');
		$('#denegado').dialog({
			modal:true,
			resizable:false,
			show:"scale",
			hide:"puff"
		});
	}
	
	function switchRoom(room,id_usuario){
		$('#chatre').attr('rel',id_usuario);
		var id_tabla=id_usuario.split('_');
		$('#chats_reservacion').find('.emailss').css('display','none');
		$('#chats_reservacion').find('#'+id_usuario).css('display','block');
		$('.numensajesxuser > #'+id_tabla[0]).html(0);
		$('#areausucon > #'+id_usuario+' > .cerrar_c > .estado_ti').html('');
		var idnum1=$('.numensajesxuser > #'+id_tabla[0]).html();
		$('.c_conectados').removeClass('active');
		$('#'+id_usuario).addClass('active');
			var nombre=$('#'+id_usuario).find('.tam17').html();
			var asunto=$('#'+id_usuario).find('.asuntito').html();
			var correo=$('#'+id_usuario).find('.correo').html();
	
			$('.cliente_activoc').find('.tam17').html("");
			$('.cliente_activoc').find('.asuntito').html("");
			$('.cliente_activoc').find('.correo').html("");
			$('.cliente_activoc').find('#tiempo_conect').html("");
			$('.cliente_activoc').attr('id',id_usuario);
			$('.cliente_activoc').css('display','block');
				$('.cliente_activoc').find('.tam17').append(nombre);
				$('.cliente_activoc').find('.asuntito').append(asunto);
				$('.cliente_activoc').find('.correo').append(correo);
				
				var ex= $('div#chats_reservacion').find('#'+id_usuario).html();
					if(ex==undefined){
						var agregar='<div id='+id_usuario+' class="emailss"><div id="content_'+id_tabla[0]+'" class="content"></div></div>';
						$('#chats_reservacion').append(agregar);
						$("#content_"+id_tabla[0]).mCustomScrollbar("destroy");
						$("#content_"+id_tabla[0]).mCustomScrollbar();
						$("#content_"+id_tabla[0]).mCustomScrollbar("scrollTo","bottom",{scrollInertia:0});
						$('#chats_reservacion').find('.emailss').css('display','none');
						$('#chats_reservacion').find('#'+id_usuario).css('display','block');
					}
		obtpendientesmen(id_tabla[0],room,idnum1);
		socket.emit('switchRoom',id_tabla);
		$("#content_"+id_tabla[0]).mCustomScrollbar("destroy");
		$("#content_"+id_tabla[0]).mCustomScrollbar();
		$("#content_"+id_tabla[0]).mCustomScrollbar("scrollTo","bottom",{scrollInertia:0});
	}
	
	function cuentamensajes(usuario_conversando,clave){
		var numchat=$('#chats_reservacion > #'+usuario_conversando).find('.conversacion_us').length;
		var men=$('#chats_reservacion > #'+usuario_conversando+' > #content_'+clave).html();
		
		var res=numchat%5;
			if(res==0){
				socket.emit('guardamensajes', clave, men);	
			}	
	}
	
	function cerrar(id,cliente){
	$('#va_ce').attr('rel',id);
	$('#va_ce').attr('alt',cliente);
		$("#valida_cerrar").dialog({
			modal:true,
			resizable:false,
			show:"scale",
			hide:"puff"
		});
	}
	
	/*Cronometro para el tiempo de cada session*/
	var cronometro;
 
	function detenerse(){
		clearInterval(cronometro);
	}
	
	function carga(ides,clientem){
		$('.c_conectados').each(function(){
		var i=$(this).attr('id');
			if(i==ides+'_'+clientem){
			eval("var variables" + ides + " = 0");
			eval("var variablem" + ides + " = 0");
			var s=eval("variables" + ides);
			var m=eval("variablem" + ides);
				cronometro = setInterval(
					function(){
						if(s==60){
							s=0;
							m++;
		 
							if(m==60){
							   m=0;
							}
						}
					   $('#'+ides+'_'+clientem).find('.tiempoconect').html(m+':'+s);
						s++;
					}
					,1000);
			}
		});
	}
	
	function espacios(nombre){
		nombres = nombre.replace(new RegExp(' ','g'), '_');
		return nombres;
	}
	
	/*Cambia el color de los círculos dependiendo del número de mensajes*/
	function obtpendientesmen(ids,cliente,pendientes){
	var limpiar1=$('#areausucon > #'+ids+'_'+cliente+' > .cerrar_c > .estado_ti');
		
		if(pendientes<=3){
		var clases=limpiar1.attr('class');
			if(clases=="estado_ti tiempo_me" || clases=="estado_ti tiempo_ex" ){
				limpiar1.removeClass('tiempo_me');
				limpiar1.removeClass('tiempo_ex');
				limpiar1.addClass('tiempo_no');
			}	
		}else if(pendientes>3 && pendientes<=5){
			limpiar1.removeClass('tiempo_no');
			limpiar1.addClass('tiempo_me');
		}else if(pendientes>5){
			limpiar1.removeClass('tiempo_me');
			limpiar1.addClass('tiempo_ex');
		}
	}
	
	function saveallconversations(id_r){
		$('.emailss').each(function(){
		var clave=$(this).attr('id');
		var id = clave.split('_');
			var mensaje = $('#chats_reservacion > #'+clave+' > #content_'+id[0]).html();
			socket.emit('guardamensajes',id[0],mensaje);
		});
		
		socket.emit('desconecta_reserva',id_r);
	}	
	
	function PlaySound(){
		$('#sound').append('<audio src="sonidos/chat.mp3" autoplay>');
	}