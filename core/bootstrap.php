<?php
namespace Core;
use Dotenv\Dotenv, redgoose\Console, Exception;

if (!defined('__GOOSE__')) exit();

// load autoload
require __PATH__.'/./vendor/autoload.php';

// set dotenv
try
{
  $dotenv = Dotenv::createImmutable(__PATH__);
  $dotenv->load();
}
catch(Exception $e)
{
  echo 'ERROR: .env error';
  exit;
}

// ini_set
if ($_ENV['APP_USE_DEBUG'] === '1')
{
  error_reporting(E_ALL & ~E_NOTICE);
}

// set values
define('__ROOT__', $_ENV['APP_PATH_RELATIVE']);
define('__URL__', $_ENV['APP_PATH_URL']);
define('__APP_DEBUG__', $_ENV['APP_USE_DEBUG'] === '1');

// set default timezone
if ($_ENV['APP_TIMEZONE'])
{
  date_default_timezone_set($_ENV['APP_TIMEZONE']);
}

// set blade
$blade = new Blade(__PATH__.'/view', __PATH__.'/cache');

// set router
try {
  $router = new AppRouter();

  // not found page
  if (!$router->match)
  {
    throw new Exception('Not found page', 404);
  }

  $_target = (string)$router->match['target'];
  $_params = (object)$router->match['params'];

  switch($_target)
  {
    // index - intro
    case 'index':
      // get data
      $connect = new AppModel();
      $res = $connect->index();

      // set page title
      $pageTitle = (isset($_GET['q']) && $_GET['q']) ? 'Keyword: '.$_GET['q'] : 'Newest articles';

      // render page
      $blade->render('index', (object)[
        'title' => $_ENV['APP_TITLE'],
        'pageTitle' => $pageTitle,
        'index' => $res->articles,
        'page' => $res->page,
        'paginate' => $res->paginate,
      ]);
      break;

    // index - select nest
    case 'index/nest':
      if (!(isset($_params->nest) && $_params->nest))
      {
        throw new Exception('Not found nest id.');
      }

      // get data
      $connect = new AppModel();
      $res = $connect->indexNest((object)[
        'nest_id' => $_params->nest,
        'category_srl' => $_params->category ?? null,
      ]);

      // set title
      $title = $_ENV['APP_TITLE'];
      if (isset($res->nest->name)) $title = $res->nest->name.' - '.$title;
      if (isset($res->category->name)) $title = $res->category->name.' - '.$title;

      // render page
      $blade->render('index', (object)[
        'title' => $title,
        'pageTitle' => $res->nest->name,
        'categories' => $res->categories,
        'index' => $res->articles,
        'page' => $res->page,
        'nest_id' => $_params->nest ?? null,
        'nest_srl' => $res->nest->srl ?? null,
        'category_srl' => $_params->category ?? null,
        'category_name' => $res->category->name ?? null,
        'paginate' => $res->paginate,
      ]);
      break;

    // article
    case 'article':
      // get items
      $connect = new AppModel();
      $res = $connect->article((int)$_params->srl);

      // set title
      $title = $_ENV['APP_TITLE'];
      $title = ($res->article->title === '.' ? 'Untitled work' : $res->article->title).' on '.$title;

      // set image
      $image = (isset($res->article->json->thumbnail->path)) ? $_ENV['APP_PATH_API_URL'].'/'.$res->article->json->thumbnail->path : __URL__.'/assets/images/og-redgoose.jpg';

      // render page
      $blade->render('article', (object)[
        'title' => $title,
        'description' => AppUtil::contentToShortText($res->article->content),
        'image' => $image,
        'data' => $res->article,
        'comments' => $res->comments,
        'onLike' => AppUtil::checkCookie('redgoose-like-'.$_params->srl),
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

    // like
    case 'on-like':
      $connect = new AppModel();
      echo json_encode($connect->like((int)$_params->srl));
      break;
  }
}
catch (Exception $e)
{
  try
  {
    AppUtil::error($e, $blade);
  }
  catch(Exception $e)
  {
    echo "Failed Error page";
  }
}
