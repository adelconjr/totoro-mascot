<?php

$configs = json_decode(file_get_contents("configs.json"), true);

if(isset($_GET['rain'])) {
    if($_GET['rain'] == "on") {
        $configs['rain'] = true;
    }
    else {
        $configs['rain'] = false;
    }

    file_put_contents("configs.json", json_encode($configs, JSON_PRETTY_PRINT));
}

?>