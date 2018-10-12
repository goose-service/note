<?php
namespace Core;
use Dotenv\Dotenv, Exception;

if (!defined('__GOOSE__')) exit();

// load autoload
require __PATH__.'/./vendor/autoload.php';

// set dotenv
try
{
	$dotenv = new Dotenv(__PATH__);
	$dotenv->load();
}
catch(Exception $e)
{
	throw new Exception('.env error');
}

// set values
define('__ROOT__', getenv('PATH_RELATIVE'));
define('__API__', getenv('PATH_API'));
define('__COOKIE_ROOT__', getenv('PATH_COOKIE'));

// set default timezone
if (getenv('TIMEZONE'))
{
	date_default_timezone_set(getenv('TIMEZONE'));
}

// set blade
$blade = new Blade(__PATH__.'/view', __PATH__.'/cache');

// set router
try {
	$router = new Router();

	// play route
	if ($router->match)
	{
		$_target = $router->match['target'];
		$_params = (object)$router->match['params'];
		$_method = $_SERVER['REQUEST_METHOD'];

		switch($_target)
		{
			// index - intro
			case 'index':
				// get articles
				$res = Util::api('/articles', (object)[
					'field' => 'srl,category_srl,json,title,regdate',
					'order' => 'regdate',
					'sort' => 'desc',
					'app' => getenv('DEFAULT_APP_SRL'),
					'size' => getenv('DEFAULT_INDEX_SIZE'),
					'page' => Util::getPage(),
					'ext_field' => 'category_name',
				]);
				if (!($res && $res->success)) throw new Exception($res->message, $res->code);

				// set title
				$title = getenv('TITLE');

				// set navigation
				$navigation = Util::makeNavigation(
					$res->data->total,
					Util::getPage(),
					getenv('DEFAULT_INDEX_SIZE')
				);

				// render page
				$blade->render('index', (object)[
					'title' => $title,
					'pageTitle' => 'Newstest articles',
					'index' => Util::convertArticleData($res->data->index),
					'page' => Util::getPage(),
					'navigation' => $navigation,
					'url' => isset($_SERVER['PATH_INFO']) ? $_SERVER['PATH_INFO'] : '',
				]);
				break;

			// index - select nest
			case 'index/nest':
				$res = Util::api('/external/note-redgoose-me-nest', (object)[
					'app_srl' => getenv('DEFAULT_APP_SRL'),
					'nest_id' => isset($_params->nest) ? $_params->nest : null,
					'category_srl' => isset($_params->category) ? $_params->category : null,
					'ext_field' => 'item_all,count_article',
					'page' => Util::getPage(),
					'size' => getenv('DEFAULT_INDEX_SIZE'),
				]);
				if (!($res && $res->success)) throw new Exception($res->message, $res->code);

				// set title
				$title = getenv('TITLE');
				if (isset($res->data->nest->name)) $title = $res->data->nest->name.' - '.$title;
				if (isset($res->data->category->name)) $title = $res->data->category->name.' - '.$title;

				$navigation = Util::makeNavigation(
					$res->data->articles->total,
					Util::getPage(),
					getenv('DEFAULT_INDEX_SIZE')
				);

				// render page
				$blade->render('index', (object)[
					'title' => $title,
					'pageTitle' => $res->data->nest->name,
					'categories' => $res->data->categories,
					'index' => Util::convertArticleData($res->data->articles->index),
					'page' => Util::getPage(),
					'nest_id' => isset($_params->nest) ? $_params->nest : null,
					'nest_srl' => isset($res->data->nest->srl) ? $res->data->nest->srl : null,
					'category_srl' => isset($_params->category) ? $_params->category : null,
					'category_name' => isset($res->data->category->name) ? $res->data->category->name : null,
					'navigation' => $navigation,
					'url' => isset($_SERVER['PATH_INFO']) ? $_SERVER['PATH_INFO'] : '',
				]);
				break;

			// index - search keyword
			case 'index/search':
				$res = Util::api('/articles', (object)[
					'field' => 'srl,nest_srl,category_srl,json,title,regdate',
					'order' => 'regdate',
					'sort' => 'desc',
					'app' => getenv('DEFAULT_APP_SRL'),
					'size' => getenv('DEFAULT_INDEX_SIZE'),
					'page' => Util::getPage(),
					'ext_field' => 'category_name,nest_name',
					'keyword' => $_GET['q'],
				]);
				if (!($res && $res->success)) throw new Exception($res->message, $res->code);

				// set title
				$title = getenv('TITLE');
				if (isset($_GET['q'])) $title = $_GET['q'].' - '.$title;

				// set navigation
				$navigation = Util::makeNavigation(
					$res->data->total,
					Util::getPage(),
					getenv('DEFAULT_INDEX_SIZE'),
					[ 'q' => $_GET['q'] ]
				);

				// render page
				$blade->render('index', (object)[
					'title' => $title,
					'pageTitle' => 'Search results: '.$_GET['q'],
					'index' => Util::convertArticleData($res->data->index),
					'page' => Util::getPage(),
					'navigation' => $navigation,
					'url' => isset($_SERVER['PATH_INFO']) ? $_SERVER['PATH_INFO'] : '',
					'searchKeyword' => $_GET['q'],
				]);
				break;

			// article
			case 'article':
				$res = Util::api('/articles/'.(int)$_params->srl, (object)[
					'hit' => Util::checkCookie('redgoose-hit-'.$_params->srl) ? 0 : 1,
					'ext_field' => 'category_name,nest_name'
				]);
				if (!($res && $res->success)) throw new Exception($res->message, $res->code);
				$res->data->regdate = Util::convertDate($res->data->regdate);

				// add key in cookie
				if (!Util::checkCookie('redgoose-hit-'.$_params->srl))
				{
					Util::setCookie('redgoose-hit-'.$_params->srl, '1', 7);
				}

				// set referer url
				$refererUrl = __ROOT__.'/';
				if (isset($_SERVER['HTTP_REFERER']))
				{
					preg_match('/'.$_SERVER['HTTP_HOST'].'/', $_SERVER['HTTP_REFERER'], $match);
					if ($match && count($match))
					{
						$refererUrl = $_SERVER['HTTP_REFERER'];
					}
				}

				// parse markdown
				$parsedown = new \Parsedown();
				$res->data->content = $parsedown->text($res->data->content);

				// set title
				$title = getenv('TITLE');
				$title = ($res->data->title === '.' ? 'Untitled work' : $res->data->title).' - '.$title;

				// set image
				$image = (isset($res->data->json->thumbnail->path)) ? __API__.'/'.$res->data->json->thumbnail->path : __API__.'/usr/icons/og-redgoose.jpg';

				// render page
				$blade->render('article', (object)[
					'title' => $title,
					'description' => Util::contentToShortText($res->data->content),
					'image' => $image,
					'data' => $res->data,
					'onLike' => Util::checkCookie('redgoose-like-'.$_params->srl),
					'refererUrl' => $refererUrl,
				]);
				break;

			// page
			case 'page':
				$_page = $_params->name;
				// check page file
				if (!file_exists(__PATH__.'/view/pages/'.$_page.'.blade.php'))
				{
					throw new Exception('Not found page', 404);
				}
				$blade->render('pages.'.$_page);
				break;
		}
	}
	else
	{
		throw new Exception('Not found page', 404);
	}
}
catch (Exception $e)
{
	try
	{
		Util::error($e, $blade);
	}
	catch(Exception $e)
	{
		echo "Failed Error page";
	}
}
