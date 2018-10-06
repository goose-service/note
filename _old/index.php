<?php
header("content-type:text/html; charset=utf-8");
session_cache_expire(30);
session_start();

define('__GOOSE__', true);
define('__GOOSE_ROOT__', 'https://goose.redgoose.me');
define('__ROOT_URL__', 'https://note.redgoose.me');
define('__REDGOOSE_ROOT__', 'https://redgoose.me');
define('__PWD__', dirname(__FILE__) . '/');
define('__ROOT__', '');
define('__COOKIE_ROOT__', '/');
define('__JSON_SRL_PREFERENCE__', 6);
define('DEBUG', true);

define('__TOKEN_PUBLIC__', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvZ29vc2UucmVkZ29vc2UubWUiLCJqdGkiOiI3YmNkZWZnaGlqa0Vtbm9SIiwiaWF0IjoxNTM0MzI1MjQwLCJkYXRhIjp7InR5cGUiOiJhbm9ueW1vdXMifX0.ZIBynqxpjjYOwrFVQ3854qhVIP4zICrOKQbAgLCsD0g');

require_once(__PWD__ . '/core/bootstrap.php');