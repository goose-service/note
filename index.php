<?php
if (is_file('index.user.php'))
{
	require_once('index.user.php');
}
else
{
	echo "not exist 'index.user.php' file";
	exit;
}

@error_reporting(E_ALL ^ E_NOTICE);
if (is_bool(DEBUG) && DEBUG)
{
	@define(__StartTime__, array_sum(explode(' ', microtime())));
}


// is localhost
define('__IS_LOCAL__', (preg_match("/(192.168)/", $_SERVER['REMOTE_ADDR']) || ($_SERVER['REMOTE_ADDR'] == "::1")) ? true : false);


// load program files
require_once(__GOOSE_LIB__);
require_once('libs/func.php');


// get preferences
try
{
	$tmp = Spawn::item([
		'table' => Spawn::getTableName('json'),
		'field' => 'json',
		'where' => 'srl='.(int)$srl_json_pref,
	])['json'];
	if (!$tmp) throw new Exception('not found preference data');
	$pref = new Object([
		'string' => $tmp,
		'json' => Util::jsonToArray($tmp, true, true),
	]);
	// get GNB data
	if ($pref->json['srl']['json_gnb'])
	{
		$tmp = Spawn::item([
			'table' => Spawn::getTableName('json'),
			'field' => 'json',
			'where' => 'srl='.(int)$pref->json['srl']['json_gnb'],
		])['json'];
		if (!$tmp) throw new Exception('not found global navigation data');
		$gnb = new Object([
			'string' => $tmp,
			'json' => Util::jsonToArray($tmp, true, true),
		]);
	}
}
catch(Exception $e)
{
	echo $e->getMessage();
	Goose::end();
}


// init router
$router = Module::load('router');
$router->route->setBasePath(__ROOT__);
require_once('libs/map.php');
$router->match = $router->route->match();


// route action
if ($router->match)
{
	$_target = $router->match['target'];
	$_params = $router->match['params'];
	$_name = $router->match['name'];
	$_method = $_SERVER['REQUEST_METHOD'];

	switch ($_target) {
		case 'index':

			// set api
			require_once('libs/ClientAPI.class.php');
			$api = new ClientAPI();

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
				Goose::end();
			}

			$loc_container = 'view/index.html';

			break;

		case 'article':

			// set api
			require_once('libs/ClientAPI.class.php');
			$api = new ClientAPI();

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
				Goose::end();
			}

			// get another article data
			if (isset($data['anotherArticle']['prev']['srl']))
			{
				$data['anotherArticle']['prev'] = Spawn::item([
					'table' => Spawn::getTableName('article'),
					'field' => 'srl,title',
					'where' => 'srl='.(int)$data['anotherArticle']['prev']['srl'],
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

			$loc_container = 'view/article.html';

			if ($_GET['popup'])
			{
				require_once($loc_container);
				Goose::end();
			}

			break;

		case 'page':

			$loc_container = 'view/page.html';

			break;

		case 'upLike':

			// set api
			require_once('libs/ClientAPI.class.php');
			$api = new ClientAPI();

			$srl = (isset($_params['article'])) ? (int)$_params['article'] : null;

			if ($pref->json['article']['updateLike'] && isCookieKey( $pref->json['article']['cookiePrefix'].'like-'.$srl, 7 ))
			{
				$data = $api->upLike([
					'article_srl' => $srl,
					'header_key' => ((isset($pref->json['meta']['headerKey'])) ? $pref->json['meta']['headerKey'] : null),
				]);
			}
			else
			{
				$data = [
					'state' => 'error',
					'message' => 'exist cookie key'
				];
			}

			header('Content-Type: text/plain; charset=utf-8');
			$render_data = json_encode($data, JSON_PRETTY_PRINT);
			print_r($render_data);

			Goose::end();
			break;
	}

	require_once('view/layout.html');
}
else
{
	// 404 error
	Goose::error(404, null, __ROOT_URL__);
	Goose::end();
}