<?php

require_once("src/TEMPY.CLASS.php");

header("Content-type: text/json");



/*$_POST['arguments'] = array(

    array("name" => "mainView"),
    array("name" => "template2")

);*/

//$_POST['args'][0]['name'] = "mainView";
$tempy = new TEMPY();

foreach($_POST['arguments'] as $template){
    $tempy -> pushTemplate($template['name']);
}

$tempy -> getTemplates();




/*
//print_r($_POST);


// Templates einlesen
// Template Packs einlesen
// Templates Ausgeben
// Forced Expiration

echo json_encode(
        array(
            array(  "templateName" => $_POST['args'][0]['name'],
                    "templateContent" => file_get_contents("template1.tpl")
            )
        )
    );
*/
?>