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
				if (!($res && $res->success)) throw new Exception($res->message);

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

			case 'index/nest':
				$res = Util::api('/external/note-redgoose-me-nest', (object)[
					'nest_id' => isset($_params->nest) ? $_params->nest : null,
					'category_srl' => isset($_params->category) ? $_params->category : null,
					'ext_field' => 'item_all,count_article',
					'page' => Util::getPage(),
					'size' => getenv('DEFAULT_INDEX_SIZE'),
				]);
				if (!($res && $res->success)) throw new Exception($res->message);

				// set title
				$title = getenv('TITLE');
				if (isset($res->data->nest->name)) $title = $res->data->nest->name.' - '.$title;
				if ($res->data->category) $title = $res->data->category->name.' - '.$title;

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

			case 'index/search':
				// TODO
				var_dump('TODO: search page', $_GET['q']);
				break;

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

				// parse markdown
				$parsedown = new \Parsedown();
				$res->data->content = $parsedown->text($res->data->content);

				// TODO: render page
				break;

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
		// TODO: 오류 페이지 작업하기
		Util::error($e, $blade);
	}
	catch(Exception $e)
	{
		echo "Failed Error page";
	}
}
