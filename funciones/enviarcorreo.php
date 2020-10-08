<?php
require_once("phpmailer.php");
if(isset($_GET['nombre'])){
	$nombre=$_GET['nombre'];
	$correo=$_GET['correo'];
	$mensaje=$_GET['mensaje'];
	
	$asunto="Nuevo Mensaje enviado desde Chat";
	$VaContenido = utf8_encode("<html>
		<body>
		<p>Un nuevo <strong>Mensaje</strong> ha sido enviado al <strong>Chat de reservaciones</strong>.<br /><br />
		<strong>Nombre: </strong>".$nombre."<br />
		<strong>Correo: </strong>".$correo."<br />
		<strong>Mensaje: </strong>".$mensaje."</p>
		</body></html>");
	
		$mail = new PHPMailer();
		$mail->CharSet = 'UTF-8';	
		$mail->IsSMTP(); 
		$mail->Host       = "host382.hostmonster.com"; 
		$mail->SMTPDebug  = 0; 
		$mail->SMTPAuth   = true;                 
		$mail->Port       = 26;                   
		$mail->Username   = "soporte@parhikuni.com.mx"; 
		$mail->Password   = "p4rh1kun1"; 

		$mail->SetFrom("soporte@parhikuni.com.mx", "Parhikuni");
		$mail->AddReplyTo("soporte@parhikuni.com.mx", "Parhikuni");

		$mail->Subject  = $asunto;
		
		$mail->MsgHTML($VaContenido);
		$mail->AddAddress("carina.cordova@parhikuni.mx", $asunto);
		$mail->AddAddress("marco.neri@parhikuni.mx", $asunto);

		if(!$mail->Send()) {
			$enviado = 'error';
		}else{
			$enviado = 'enviado';
		}
		echo 'datos({ "enviado" : "'.$enviado.'"});';
}
?>
