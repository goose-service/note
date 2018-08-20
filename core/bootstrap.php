<?php
if(!defined("__GOOSE__")){exit();}

@error_reporting(E_ALL ^ E_NOTICE);
@ini_set("display_errors", (is_bool(DEBUG) && DEBUG) ? 1 : 0);

// is localhost
define('__IS_LOCAL__', (preg_match("/(192.168)/", $_SERVER['REMOTE_ADDR']) || ($_SERVER['REMOTE_ADDR'] == "::1")) ? true : false);

// load program files
require_once(__PWD__.'/vendor/Router/AltoRouter.php');
require_once(__PWD__.'/vendor/BladeOne/BladeOne.php');
require_once(__PWD__.'/core/Paginate.class.php');
require_once(__PWD__.'/core/Util.class.php');
require_once('func.php');

Use eftec\bladeone;


// set preferences
$pref = externalApi('/json/'.__JSON_SRL_PREFERENCE__);
$prefString = '';
if (!$pref)
{
	echo 'not found pref data';
	exit;
}
else
{
	$pref = $pref->json;
	$prefString = urlencode(json_encode($pref));
}


// set blade
$blade = new bladeone\BladeOne(__PWD__.'view', __PWD__.'cache');


// router
$router = new AltoRouter();
$router->setBasePath(__ROOT__);
require_once('map.php');

if ($router->match())
{
	$match = $router->match();
	$_target = $match['target'];
	$_params = $match['params'];
	$_name = $match['name'];
	$_method = $_SERVER['REQUEST_METHOD'];

	// set api
	require_once('API.class.php');
	$api = new API();

	switch ($_target) {
		case 'index':
			// set values
			$errorMessage = null;
			$printData = 'nest,category,article';
			$printData .= ($pref->index->print_paginate) ? ',nav_paginate' : '';

			// get data
			$data = $api->index((object)[
				'app_srl' => $pref->srl->app,
				'nest_id' => (isset($_params['nest'])) ? $_params['nest'] : null,
				'category_srl' => (isset($_params['category'])) ? (int)$_params['category'] : null,
				'page' => (isset($_GET['page']) && (int)$_GET['page'] > 1) ? (int)$_GET['page'] : 1,
				'print_data' => $printData,
				'root' => __ROOT__,
				'size' => $pref->index->count->item,
				'pageScale' => $pref->index->count->pageScale,
			]);

			// get category name
			if ($data->categories)
			{
				foreach($data->categories as $k=>$v)
				{
					if ($v->active && ($v->srl > 0))
					{
						$data->category_name = $v->name;
						break;
					}
				}
			}
			if ($data->state !== 'success')
			{
				switch ($data->code)
				{
					case 404:
						$errorMessage = 'Not found article';
						break;
					case 500:
					default:
						$errorMessage = 'Service error';
						break;
				}
			}

			// render
			echo $blade->run('index', [
				'_params' => $_params,
				'_target' => $_target,
				'pref' => $pref,
				'prefString' => $prefString,
				'nest_id' => (isset($_params['nest'])) ? $_params['nest'] : null,
				'data' => $data,
				'errorMessage' => $errorMessage,
			]);
			break;

		case 'article':
			// set values
			$errorMessage = null;
			$article_srl = (isset($_params['article'])) ? (int)$_params['article'] : null;

			// get article
			$data = $api->view((object)[
				'app_srl' => $pref->srl->app,
				'article_srl' => $article_srl,
				'updateHit' => !isCookieKey( 'redgoose-hit-'.$_article ),
				'print_data' => ($_GET['get']) ? $_GET['get'] : 'all',
			]);
			if ($data->state !== 'success')
			{
				switch ($data->code)
				{
					case 404:
						$errorMessage = 'Not found article';
						break;
					case 500:
					default:
						$errorMessage = 'Service error';
						break;
				}
			}

			// save referer
			if (strpos($_SERVER['HTTP_REFERER'], '/article/') === false)
			{
				$_SESSION['referer'] = $_SERVER['HTTP_REFERER'];
			}

			// render
			echo $blade->run('article', [
				'pref' => $pref,
				'prefString' => $prefString,
				'data' => $data,
				'errorMessage' => $errorMessage
			]);
			break;

		case 'page':
			// render
			$blade->render('page', [
				'pref' => $pref,
				'prefString' => $prefString,
				'pageName' => $_params['page'],
			]);
			break;
	}
}
else
{
	// 404 error
	echo '404';
	exit;
}