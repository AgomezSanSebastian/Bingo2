<?php

$bolas = $_REQUEST["bolas"];
$nbolas = count($bolas);
$bola = rand(0,$nbolas-1);
echo $bola;

?>