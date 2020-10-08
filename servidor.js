require('dotenv').config();
/*--creacion y ejecucion del servidor--*/
var express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  server = require('http').createServer(app),
  md5 = require('MD5'),
  io = require('socket.io').listen(server),
  mysql = require('mysql'),
  events = require('events'),
  serverEmitter = new events.EventEmitter();
server.listen(8888);

app.set(
  'views',
  __dirname + '/views',
); /*donde se encuentran las vistas de la aplicacion*/
app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname + '/'));

var clientes_conect = {};
var reservaciones_conect = {};
var rooms = {};
app.use(bodyParser.urlencoded({ extended: true }));
/*--conexion a la base de datos--*/
var bdChat = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

/*renderizacion de paginas*/
app.get('/', function (req, res) {
  disp_reservacion = 'SELECT * from disponibilidad WHERE disp=1';
  bdChat.query(disp_reservacion, function (error, rows) {
    if (rows != '') {
      res.render('index.html', {
        disponibilidad: 'disponible',
        enviado_men: '',
        nombre_usu: '',
        correo_usu: '',
        msg: '',
      });
    } else {
      res.render('index.html', {
        disponibilidad: 'nodisponible',
        enviado_men: '',
        nombre_usu: '',
        correo_usu: '',
        msg: '',
      });
    }
  });
});

app.get('/ingresar353rb4', function (req, res) {
  res.render('ingresar353rb4.html', {
    errors: '',
  });
});

app.get('/loginreserv4', function (req, res) {
  res.render('ingresar353rb4.html', {
    errors: '',
  });
});

/*envio de post de cada uno de los formularios*/
app.post('/loginreserv4', function (req, res) {
  var nombre_reservacion = req.body.nombresre;
  var password_reservacion = md5(req.body.passwordre);
  loguear =
    "SELECT * from disponibilidad WHERE Asistente='" +
    nombre_reservacion +
    "' and aPassword='" +
    password_reservacion +
    "'";
  bdChat.query(loguear, function (error, rows) {
    if (error) {
      console.log('Error: ' + error.message);
      throw error;
    } else {
      if (rows != '') {
        dis = 'SELECT * from disponibilidad where disp = 1 ';
        bdChat.query(dis, function (error, rows5) {
          if (rows5 != '') {
            res.render('ingresar353rb4.html', {
              errors: 'sessionocupada',
            });
          } else {
            actualizar =
              "UPDATE disponibilidad SET disp = 1 WHERE Asistente='" +
              nombre_reservacion +
              "' and aPassword='" +
              password_reservacion +
              "'";
            bdChat.query(actualizar, function (error, rows1) {
              if (error) {
                console.log('Error: ' + error.message);
                throw error;
              } else {
                res.render('reservaciones.html', {
                  nombrereservaciones: nombre_reservacion,
                  fotoreservaciones: rows[0].aFoto,
                  clave: rows[0].id,
                  aceptacion: '1',
                });
              }
            });
          }
        });
      } else {
        var errores = 'error';
        res.render('ingresar353rb4.html', {
          errors: errores,
        });
      }
    }
  });
});

app.get('/reservacion', function (req, res) {
  var idusuario = req.query.val1;
  var id = req.query.val2;
  var mensajes = req.query.val3;

  guarda_conversa =
    "UPDATE conversaciones SET conversacion = '" +
    mensajes +
    "' WHERE clave = " +
    id;
  bdChat.query(guarda_conversa);

  /*Selecciona para mostrar en cada consola*/
  conversacion_select =
    'SELECT Cliente, conversacion from conversaciones WHERE lConectado=1 and clave=' +
    id;
  bdChat.query(conversacion_select, function (error, rows) {
    if (error) {
      console.log('Error: ' + error.message);
      throw error;
    } else {
      res.send({ ids: id, mensajes: rows[0].conversacion });
    }
  });
});

/**************************************************/
app.get('/conversacion', function (req, res) {
  var idusuario = req.query.nombre;
  var nombre1 = req.body.nombre;
  var id = req.query.correo;
  var mensajes = req.query.correo;

  res.render('index.html', {
    disponibilidad: 'nodisponible',
    enviado_men: '',
    nombre_usu: '',
    correo_usu: '',
    msg: '',
  });
});

app.post('/conversacion', function (req, res) {
  var nombre1 = req.body.nombre;
  var nombre = replaceAll(nombre1, '.', '');
  var correo = req.body.correo;
  var asunto = req.body.asunto;
  var mensaje = req.body.mensaje_send;

  var fecha = new Date();
  var hrs = fecha.getHours();
  var min = fecha.getMinutes();
  var seg = fecha.getSeconds();
  var Hora = hrs + ':' + min + ':' + seg;

  var dia = fecha.getDate();
  var mes = fecha.getMonth() + 1;
  var year = fecha.getFullYear();
  var Fechaingreso = year + '-' + mes + '-' + dia + ' ' + Hora;
  var fechasinhora = year + '-' + mes + '-' + dia;

  if (asunto != '') {
    disp_reservacion = 'SELECT * from disponibilidad WHERE disp=1';
    bdChat.query(disp_reservacion, function (error, rows) {
      if (rows != '') {
        /*verifica que el usuario no exista, para no insertar dobles registros*/
        select_usu =
          "SELECT * from conversaciones WHERE Cliente='" +
          nombre +
          "' and emailCliente='" +
          correo +
          "' and asunto='" +
          asunto +
          "' and lConectado=1";
        bdChat.query(select_usu, function (error, rows1) {
          if (rows1 != '') {
            res.render('conversacion.html', {
              nombres: nombre,
              correos: correo,
              asuntos: asunto,
              clave: rows1[0].clave,
              reservaciones: rows[0].Asistente,
              fotoreserva: rows[0].aFoto,
              ingreso: 'aceptado',
            });
          } else {
            insert_usu =
              "INSERT INTO conversaciones(asistente, empresa, Cliente, fecha, conversacion, emailCliente, asunto, puertoAsistente,lConectado) values ('" +
              rows[0].Asistente +
              "','Destinos Parhikuni','" +
              nombre +
              "','" +
              Fechaingreso +
              "','','" +
              correo +
              "','" +
              asunto +
              "','1030','1')";
            bdChat.query(insert_usu, function (error, rows2) {
              usu_insertados =
                "SELECT * from conversaciones WHERE Cliente='" +
                nombre +
                "' and emailCliente='" +
                correo +
                "' and asunto='" +
                asunto +
                "' and lConectado=1";
              bdChat.query(usu_insertados, function (error, rows3) {
                res.render('conversacion.html', {
                  nombres: nombre,
                  correos: correo,
                  asuntos: asunto,
                  clave: rows3[0].clave,
                  reservaciones: rows[0].Asistente,
                  fotoreserva: rows[0].aFoto,
                  ingreso: 'aceptado',
                });
              });
            });
          }
        });
      }
    });
  } else {
    insert_men =
      "INSERT INTO conversaciones(asistente, empresa, Cliente, fecha, conversacion, emailCliente, asunto, puertoAsistente,lConectado) values ('nodisponible','Destinos Parhikuni','" +
      nombre +
      "','" +
      Fechaingreso +
      "','" +
      mensaje +
      "','" +
      correo +
      "','','1030','2')";
    bdChat.query(insert_men, function (error, rows5) {
      res.render('index.html', {
        disponibilidad: 'nodisponible',
        enviado_men: 1,
        nombre_usu: nombre,
        correo_usu: correo,
        msg: mensaje,
      });
    });
  }
});

function replaceAll(text, busca, reemplaza) {
  while (text.toString().indexOf(busca) != -1)
    text = text.toString().replace(busca, reemplaza);
  return text;
}

io.sockets.on('connection', function (socket) {
  /**********Ingreso a reservaciones*********/
  // Carga lista de usuarios en inicio de sesión
  usu_conectados =
    'SELECT  clave, Asistente, Cliente, emailCliente, asunto, lConectado from conversaciones WHERE lConectado=1 AND TO_DAYS(NOW())-TO_DAYS(fecha) <=15';
  bdChat.query(usu_conectados, function (error, rows) {
    if (rows != '') {
      io.sockets.emit('usersconect', rows);
    }
  });

  socket.on('adduser', function (nombre_cl, tipo) {
    socket.nombre_cl = nombre_cl;
    if (tipo != 'r') {
      clientes_conect[nombre_cl] = nombre_cl;
    } else {
      reservaciones_conect[nombre_cl] = nombre_cl;
    }

    rooms[nombre_cl] = nombre_cl;
    socket.join(nombre_cl);

    io.sockets.emit('updaterooms', clientes_conect);
    socket.room = nombre_cl;

    actualiza_conectado =
      'UPDATE conversaciones SET lconectado = 1 WHERE clave = ' + nombre_cl;
    bdChat.query(actualiza_conectado);
  });

  socket.on('menuConectados', function (dato) {
    usu_conectados =
      'SELECT clave, Asistente, Cliente, emailCliente, asunto, lConectado from conversaciones WHERE lConectado=1';
    bdChat.query(usu_conectados, function (error, rows) {
      if (rows != '') {
        socket.broadcast.emit('usersconect', rows);
      }
    });
  });

  /*Envio de mensajes de usuario a reservaciones*/
  socket.on('sendchat', function (mensaje, clave_usuario) {
    usuarios_select =
      'SELECT clave, Asistente, Cliente from conversaciones WHERE lConectado=1 and clave=' +
      clave_usuario;
    bdChat.query(usuarios_select, function (error, rows) {
      if (error) {
        console.log('Error: ' + error.message);
        throw error;
      } else {
        var nombre = rows[0].Cliente;
        socket.broadcast.emit('updatemensaje', mensaje, rows);
      }
    });
  });

  /*Envio de mensajes de reservaciones a usuarios*/
  socket.on('sendchat_usuario', function (
    men,
    nombre_reservaciones,
    usuario_conversando,
  ) {
    socket.broadcast.emit(
      'updatemensajeausuario',
      men,
      nombre_reservaciones,
      usuario_conversando,
    );
  });

  socket.on('switchroom', function (newroom) {
    socket.join(newroom);
    socket.room = newroom;
    socket.emit('updaterooms', rooms, newroom);
  });

  /*mensajes a guardar*/
  socket.on('guardamensajes', function (clave_usuario, men) {
    guarda_conversacion =
      "UPDATE conversaciones SET conversacion = '" +
      men +
      "' WHERE clave = " +
      clave_usuario;
    bdChat.query(guarda_conversacion);
  });

  /*Fuerzan a desconectar a un usuarios*/
  socket.on('usu_desconectar', function (clave) {
    socket.broadcast.emit('abandonausuario', clave);
  });

  /*Cuando se desconecta un usuario*/
  socket.on('disconnect', function () {
    try {
      delete clientes_conect[socket.nombre_cl];
      if (socket.nombre_cl == 1 || socket.nombre_cl == 2) {
        socket.broadcast.emit('allconversations');
        desconecta_re =
          'UPDATE disponibilidad SET disp = 0 WHERE id = ' + socket.nombre_cl;
        bdChat.query(desconecta_re);
      }
      io.sockets.emit('updaterooms', clientes_conect);
      select_desconectado =
        "SELECT clave, Cliente from conversaciones WHERE clave = '" +
        socket.nombre_cl +
        "'";
      bdChat.query(select_desconectado, function (error, rows1) {
        if (error) {
          console.log('Error: ' + error.message);
          throw error;
        } else {
          if (rows1 != '') {
            socket.broadcast.emit(
              'avisodesconecta',
              rows1[0].clave,
              rows1[0].Cliente,
            );
          }
        }
      });

      actualiza_desconectado =
        "UPDATE conversaciones SET lconectado = 0 WHERE clave = '" +
        socket.nombre_cl +
        "'";
      bdChat.query(actualiza_desconectado, function (error, row2) {
        if (error) {
          console.log('Error: ' + error);
          throw error;
        }
      });
      socket.leave(socket.room);
    } catch (error) {}
  });

  /*Cuando se desconecta la persona de reservaciones*/
  socket.on('desconecta_reserva', function (id_r) {
    console.log('desconecta reservaciones');
    desconecta_re = 'UPDATE disponibilidad SET disp = 0 WHERE id = ' + id_r;
    bdChat.query(desconecta_re);
    delete reservaciones_conect[socket.nombre_cl];
    socket.leave(socket.room);
    socket.emit('redirecciona');
  });
});
