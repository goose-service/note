<?php
use core\Spawn, core\Goose, core\Util, core\Module, core\Blade;
if(!defined("__GOOSE__")){exit();}

@error_reporting(E_ALL ^ E_NOTICE);
if (is_bool(DEBUG) && DEBUG)
{
	@define(__StartTime__, array_sum(explode(' ', microtime())));
}

// is localhost
define('__IS_LOCAL__', (preg_match("/(192.168)/", $_SERVER['REMOTE_ADDR']) || ($_SERVER['REMOTE_ADDR'] == "::1")) ? true : false);

// load program files
require_once(__GOOSE_LIB__);
require_once('func.php');

// set preferences
$pref = (object)[];
try
{
	$tmp = Spawn::item([
		'table' => Spawn::getTableName('JSON'),
		'field' => 'json',
		'where' => 'srl='.(int)$srl_json_pref
	])['json'];
	if (!$tmp) throw new Exception('not found preference data');

	// set pref
	$pref->string = $tmp;
	$pref->json = Util::jsonToArray($tmp, null, true);
}
catch(Exception $e)
{
	echo $e->getMessage();
	Goose::end();
}

// set blade
$blade = new Blade(__PWD__.'/view', __PWD__.'/cache');

// init router
$router = Module::load('Router');
$router->route->setBasePath(__ROOT__);
require_once('map.php');
$router->match = $router->route->match();

// route action
if ($router->match)
{
	$_target = $router->match['target'];
	$_params = $router->match['params'];
	$_name = $router->match['name'];
	$_method = $_SERVER['REQUEST_METHOD'];

	// set api
	require_once('API.class.php');
	$api = new API();

	switch ($_target) {
		case 'index':
			// set print
			$printData = 'nest,category,article';
			$printData .= ($pref->json['index']['print_paginate']) ? ',nav_paginate' : '';

			// get data
			$data = $api->index([
				'app_srl' => $pref->json['srl']['app'],
				'nest_id' => (isset($_params['nest'])) ? $_params['nest'] : null,
				'category_srl' => (isset($_params['category'])) ? (int)$_params['category'] : null,
				'page' => (isset($_GET['page']) && (int)$_GET['page'] > 1) ? (int)$_GET['page'] : 1,
				'print_data' => $printData,
				'root' => __ROOT__,
				'count' => $pref->json['index']['count']['item'],
				'pageScale' => $pref->json['index']['count']['pageScale'],
			]);

			// get category name
			if ($data['category'])
			{
				foreach($data['category'] as $k=>$v)
				{
					if ($v['active'] && ($v['srl'] > 0))
					{
						$data['category_name'] = $v['name'];
						break;
					}
				}
			}
			if ($data['state'] == 'error')
			{
				Goose::error(101, $data['message'], __ROOT_URL__);
			}

			// render
			$blade->render('index', [
				'pref' => $pref->json,
				'_params' => $_params,
				'_target' => $_target,
				'prefString' => $pref->string,
				'nest_id' => (isset($_params['nest'])) ? $_params['nest'] : null,
				'data' => $data,
			]);
			break;

		case 'article':
			// set article_srl
			$article_srl = (isset($_params['article'])) ? (int)$_params['article'] : null;

			// set update hit
			$updateHit = ($pref->json['article']['updateHit']) ? isCookieKey( $pref->json['article']['cookiePrefix'].'hit-'.$article_srl, 7 ) : false;

			// get article
			$data = $api->view([
				'app_srl' => $pref->json['srl']['app'],
				'article_srl' => $article_srl,
				'contentType' => $pref->json['article']['type'],
				'updateHit' => $updateHit,
				'print_data' => ($_GET['get']) ? $_GET['get'] : 'all',
			]);
			if ($data['state'] == 'error')
			{
				Goose::error(101, $data['message'], __ROOT_URL__);
			}

			// get another article data
			if (isset($data['anotherArticle']['prev']['srl']))
			{
				$data['anotherArticle']['prev'] = Spawn::item([
					'table' => Spawn::getTableName('Article'),
					'field' => 'srl,title',
					'where' => 'srl=' . (int)$data['anotherArticle']['prev']['srl'],
					'debug' => false
				]);
			}
			if (isset($data['anotherArticle']['next']['srl']))
			{
				$data['anotherArticle']['next'] = Spawn::item([
					'table' => Spawn::getTableName('article'),
					'field' => 'srl,title',
					'where' => 'srl='.(int)$data['anotherArticle']['next']['srl'],
					'debug' => false
				]);
			}

			// save referer
			if (strpos($_SERVER['HTTP_REFERER'], '/article/') === false)
			{
				$_SESSION['referer'] = $_SERVER['HTTP_REFERER'];
			}

			// render
			$blade->render('article', [
				'pref' => $pref->json,
				'prefString' => $pref->string,
				'data' => $data,
			]);
			break;

		case 'page':
			// render
			$blade->render('page', [
				'pref' => $pref->json,
				'prefString' => $pref->string,
				'pageName' => $_params['page'],
			]);
			break;
	}
}
else
{
	// 404 error
	Goose::error(404, null, __ROOT_URL__);
}