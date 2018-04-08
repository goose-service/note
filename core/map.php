<?php
if(!defined("__GOOSE__")){exit();}
$router->route->addMatchTypes([ 'key' => '[0-9A-Za-z_-]++' ]);

// index
$router->route->map('GET', '/', 'index');
$router->route->map('GET', '/index/[key:nest]', 'index');
$router->route->map('GET', '/index/[key:nest]/', 'index');
$router->route->map('GET', '/index/[key:nest]/[i:category]', 'index');
$router->route->map('GET', '/index/[key:nest]/[i:category]/', 'index');

// article
$router->route->map('GET', '/article/[i:article]', 'article');
$router->route->map('GET', '/article/[i:article]/', 'article');

// page
$router->route->map('GET', '/page/[key:page]', 'page');
$router->route->map('GET', '/page/[key:page]/', 'page');

// up like
$router->route->map('GET', '/upLike/[i:article]/', 'upLike');
