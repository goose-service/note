<?php
if (!defined('__GOOSE__')) exit();

return [

	[ 'GET', '', 'index' ],
	[ 'GET', '/', 'index' ],
	[ 'GET', '/index/[char:nest]', 'index/nest' ],
	[ 'GET', '/index/[char:nest]/', 'index/nest' ],
	[ 'GET', '/index/[char:nest]/[i:category]', 'index/nest' ],
	[ 'GET', '/index/[char:nest]/[i:category]/', 'index/nest' ],
	[ 'GET', '/search', 'index/search' ],

	[ 'GET', '/article/[i:srl]', 'article' ],
	[ 'GET', '/article/[i:srl]/', 'article' ],

	[ 'GET', '/page/[char:name]', 'page' ],
	[ 'GET', '/page/[char:name]/', 'page' ],

	[ 'GET', '/rss', 'rss' ],

];