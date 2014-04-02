<?php

require_once("src/TEMPY.CLASS.php");

header("Content-type: text/json");

$tempy = new TEMPY();

foreach($_POST['arguments'] as $template){
    $tempy -> pushTemplate($template['name']);
}

$tempy -> getTemplates();


?>