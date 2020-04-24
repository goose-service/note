<?php
namespace Core;
use Dotenv\Dotenv, redgoose\RestAPI, redgoose\Console, Exception;

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

    // init rest api
    $api = new RestAPI((object)[
      'url' => getenv('PATH_API'),
      'outputType' => 'json',
      'headers' => ['Authorization: ' . getenv('TOKEN_PUBLIC')],
      'timeout' => 30,
      'debug' => false,
    ]);

    switch($_target)
    {
      // index - intro
      case 'index':
        // get articles
        $res = $api->call('get', '/articles/', (object)[
          'field' => 'srl,category_srl,json,title,regdate,order',
          'order' => '`order` desc, `srl` desc',
          'app' => getenv('DEFAULT_APP_SRL'),
          'size' => getenv('DEFAULT_INDEX_SIZE'),
          'page' => Util::getPage(),
          'ext_field' => 'category_name',
        ]);
        if (!isset($res->response)) throw new Exception($res->message, $res->code);
        $res = $res->response;
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
          'pageTitle' => 'Newest articles',
          'index' => Util::convertArticleData($res->data->index),
          'page' => Util::getPage(),
          'paginate' => $navigation,
          'url' => Util::getUrlPath(),
        ]);
        break;

      // index - select nest
      case 'index/nest':
        $res = $api->call('get', '/external/note-redgoose-me-nest/', (object)[
          'app_srl' => getenv('DEFAULT_APP_SRL'),
          'nest_id' => isset($_params->nest) ? $_params->nest : null,
          'category_srl' => isset($_params->category) ? $_params->category : null,
          'ext_field' => 'item_all,count_article',
          'page' => Util::getPage(),
          'size' => getenv('DEFAULT_INDEX_SIZE'),
        ]);
        if (!isset($res->response)) throw new Exception($res->message, $res->code);
        $res = $res->response;
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
          'paginate' => $navigation,
          'url' => Util::getUrlPath(),
        ]);
        break;

      // index - search keyword
      case 'index/search':
        $res = $api->call('get', '/articles/', (object)[
          'field' => 'srl,nest_srl,category_srl,json,title,`order`',
          'order' => '`order`',
          'sort' => 'desc',
          'app' => getenv('DEFAULT_APP_SRL'),
          'size' => getenv('DEFAULT_INDEX_SIZE'),
          'page' => Util::getPage(),
          'ext_field' => 'category_name,nest_name',
          'q' => $_GET['q'],
        ]);
        if (!isset($res->response)) throw new Exception($res->message, $res->code);
        $res = $res->response;
        if (!($res && $res->success))
        {
          $res->data = (object)[
            'index' => [],
          ];
        }

        // set title
        $title = getenv('TITLE');
        if (isset($_GET['q'])) $title = $_GET['q'].' - '.$title;

        // set navigation
        if (isset($res->data->total))
        {
          $navigation = Util::makeNavigation(
            $res->data->total,
            Util::getPage(),
            getenv('DEFAULT_INDEX_SIZE'),
            [ 'q' => $_GET['q'] ]
          );
        }

        // render page
        $blade->render('index', (object)[
          'title' => $title,
          'pageTitle' => 'Search keyword: '.$_GET['q'],
          'index' => Util::convertArticleData($res->data->index),
          'page' => Util::getPage(),
          'paginate' => isset($navigation) ? $navigation : null,
          'url' => Util::getUrlPath(),
          'searchKeyword' => $_GET['q'],
        ]);
        break;

      // article
      case 'article':
        $parsedown = new \Parsedown();

        // get article
        $res = $api->call('get', '/articles/'.(int)$_params->srl.'/', (object)[
          'app' => getenv('DEFAULT_APP_SRL'),
          'hit' => Util::checkCookie('redgoose-hit-'.$_params->srl) ? 0 : 1,
          'ext_field' => 'category_name,nest_name'
        ]);
        if (!isset($res->response)) throw new Exception($res->message, $res->code);
        $res = $res->response;
        if (!($res && $res->success)) throw new Exception($res->message, $res->code);
        $article = $res->data;

        // add key in cookie
        if (!Util::checkCookie('redgoose-hit-'.$_params->srl))
        {
          Util::setCookie('redgoose-hit-'.$_params->srl, '1', 7);
        }

        // parse markdown article
        $article->content = $parsedown->text($article->content);

        // get comments
        $comments = null;
        $res = $api->call('get', '/comments/?article='.(int)$_params->srl);
        if (isset($res->response) && $res->response->success && isset($res->response->data->index))
        {
          $comments = $res->response->data->index;
          foreach ($comments as $key=>$item)
          {
            $comments[$key]->content = $parsedown->text($item->content);
            $comments[$key]->regdate = explode(' ', $item->regdate)[0];
          }
        }

        // set title
        $title = getenv('TITLE');
        $title = ($article->title === '.' ? 'Untitled work' : $article->title).' on '.$title;

        // set image
        $image = (isset($article->json->thumbnail->path)) ? __API__.'/'.$article->json->thumbnail->path : __API__.'/usr/icons/og-redgoose.jpg';

        // render page
        $blade->render('article', (object)[
          'title' => $title,
          'description' => Util::contentToShortText($article->content),
          'image' => $image,
          'data' => $article,
          'comments' => $comments,
          'onLike' => Util::checkCookie('redgoose-like-'.$_params->srl),
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
