<?php

class TEMPY {

    private $output = array();
    public $templates = array();

    public function __construct(){

    }

    public function pushTemplate($templateName){
        array_push($this->templates,$templateName);
    }

    public function getTemplates(){

        $this -> getTemplatePacks($this->templates);

        $this -> loadTemplates($this->templates);

        echo json_encode($this->output);

    }

    public function getTemplatePacks($templates){
            $packs = json_decode(file_get_contents("templates/pack.info"),true);
            foreach($templates as $template){

                if(array_key_exists($template,$packs)){
                    $this -> templates = array_merge($this -> templates,$packs[$template]);
                }
            }
    }

    public function loadTemplates($templates){


        foreach($templates as $template){


            $path = "templates/".$template.".tpl";
            //echo $path."\r\n";
            if(file_exists($path)){

                $template = array(
                    "templateName" => $template,
                    "templateContent" => file_get_contents($path)
                );

                array_push($this->output,$template);
            }


        }

        return $this -> output;
    }



}

?>