if pgrep node
then
	echo "OK";
else
	forever stop /var/www/chatparhi/servidor.js;
	forever start /var/www/chatparhi/servidor.js;
	node /var/www/chatparhi/reiniciarSesion.js;
fi
