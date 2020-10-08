var mysql = require('mysql');

var bdChat = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'F0rt4l3z4',
  database: 'chat',
  port: '3306',
});

function habilitarSesion() {
    bdChat.query('UPDATE disponibilidad SET disp = 0 WHERE id = 1');
    sesionIniciada = true;
}
habilitarSesion();
process.exit()