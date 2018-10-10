<?php
if (preg_match('/\.(?:php)$/', $_SERVER["REQUEST_URI"]))
{
	require_once 'index.php';
}
else
{
	return false;
}