<?php
if(!defined("__GOOSE__")){exit();}
$router->addMatchTypes([ 'key' => '[0-9A-Za-z_-]++' ]);

// index
$router->map('GET', '/', 'index');
$router->map('GET', '/index/[key:nest]', 'index');
$router->map('GET', '/index/[key:nest]/', 'index');
$router->map('GET', '/index/[key:nest]/[i:category]', 'index');
$router->map('GET', '/index/[key:nest]/[i:category]/', 'index');

// article
$router->map('GET', '/article/[i:article]', 'article');
$router->map('GET', '/article/[i:article]/', 'article');

// page
$router->map('GET', '/page/[key:page]', 'page');
$router->map('GET', '/page/[key:page]/', 'page');

// up like
$router->map('GET', '/upLike/[i:article]/', 'upLike');
