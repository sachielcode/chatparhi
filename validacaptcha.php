<?php
header('Content-Type: text/javascript; charset=UTF-8');
require_once('plugins/captcha/securimage.php');
if(isset($_GET['codigo'])){
$codigo= $_GET['codigo'];
$securimage = new Securimage();

	if($securimage->check($codigo) == false ) {
		$errores ="*Codigo incorrecto";
	}else{
		$errores ="Correcto";
	}
	
	echo 'datos({ "error" : "'.$errores.'"});';
}
?>
