<?php
namespace Core;
use Exception, redgoose\Paginate, redgoose\Console;

/**
 * Util
 */

class Util {

  /**
   * request api interface
   *
   * @param string $url
   * @param string $params
   * @param string $method
   * @param boolean $useExternalApi
   * @return object
   * @throws Exception
   */
  static public function api($url, $params=null, $method='get', $useExternalApi=false)
  {
    try
    {
      $params = $params ? '?'.http_build_query($params) : '';

      // set prefix url
      $prefix = ($useExternalApi) ? '' : $_ENV['APP_PATH_API'];

      $ch = curl_init();
      curl_setopt($ch, CURLOPT_URL, $prefix.$url.$params);
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
      curl_setopt($ch, CURLOPT_POST, ($method === 'post'));
      curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: ' . $_ENV['APP_TOKEN_PUBLIC']]);
      $response = curl_exec($ch);
      $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
      curl_close($ch);

      if (!$response)
      {
        throw new Exception('no response');
      }

      return json_decode($response);
    }
    catch(Exception $e)
    {
      return null;
    }
  }

  /**
   * error
   *
   * @param Exception $error
   * @param Blade $blade
   * @throws Exception
   */
  static public function error($error, $blade)
  {
    // debug
    if ($_ENV['APP_USE_DEBUG'] === '1')
    {
      Console::log((object)[
        'message' => $error->getMessage(),
        'code' => $error->getCode(),
      ]);
    }

    $code = $error->getCode();
    switch ($code)
    {
      case 404:
        $message = 'Not found page';
        break;
      case 500:
      default:
        $code = 500;
        $message = 'Service error';
        break;
    }

    // render
    $blade->render('error', (object)[
      'title' => $_ENV['APP_TITLE'],
      'code' => $code,
      'message' => $message,
    ]);
    exit;
  }

  /**
   * get page number
   *
   * @return int
   */
  static public function getPage()
  {
    return (isset($_GET['page']) && (int)$_GET['page'] > 1) ? (int)$_GET['page'] : 1;
  }

  /**
   * content to short text
   *
   * @param string $con
   * @param int $len
   * @return string
   */
  static public function contentToShortText($con, $len=120)
  {
    /**
     * Cutting string
     * 글자를 특정자수만큼 잘라준다.
     *
     * @param string $str 자를문자
     * @param number $len 길이
     * @param string $tail 꼬리에 붙는 문자
     * @return string 잘려서 나온문자
     */
    function bear3StrCut($str, $len, $tail="...")
    {
      $rtn = [];
      return preg_match('/.{'.$len.'}/su', $str, $rtn) ? $rtn[0].$tail : $str;
    }

    if (!$con) return null;

    $con = trim( strip_tags($con) );

    $con = preg_replace('/\r\n|\r|\n|\t/', ' ', $con);
    $con = preg_replace('/"/', '\"', $con);
    $con = preg_replace("/'/", "\'", $con);
    $con = preg_replace("/&nbsp;/"," ", $con);
    $con = preg_replace("/  /"," ", $con);
    $con = bear3StrCut($con, $len);

    return $con;
  }

  /**
   * check cookie key
   *
   * @param string $key
   * @return bool
   */
  static public function checkCookie($key='')
  {
    return isset($_COOKIE[$key]);
  }

  /**
   * set cookie
   *
   * @param string $key
   * @param string $value
   * @param int $day
   */
  static public function setCookie($key='', $value='1', $day=1)
  {
    setcookie(
      $key,
      $value,
      time() + 3600 * 24 * $day,
      $_ENV['APP_PATH_COOKIE']
    );
  }

  /**
   * convert article data
   *
   * @param array $src
   * @return array
   */
  static public function convertArticleData($src)
  {
    $result = [];

    foreach ($src as $key=>$item)
    {
      $result[] = (object)[
        'srl' => (int)$item->srl,
        'title' => $item->title === '.' ? 'untitled article' : $item->title,
        'image' => isset($item->json->thumbnail->path) ? $item->json->thumbnail->path : null,
        'category_name' => isset($item->category_name) ? $item->category_name : null,
        'regdate' => $item->order,
      ];
    }

    return $result;
  }

  /**
   * make navigation
   *
   * @param int $total
   * @param int $page
   * @param int $size
   * @param array $params
   * @return object
   */
  static public function makeNavigation($total, $page=1, $size=10, $params=[])
  {
    $result = (object)[
      'total' => $total,
      'page' => $page,
    ];
    $paginate = new Paginate((object)[
      'total' => $total,
      'page' => $page,
      'size' => $size,
      'params' => $params,
      'scale' => $_ENV['APP_DEFAULT_NAVIGATION_SCALE_MOBILE'],
    ]);
    $result->mobile = $paginate->createElements(['paginate', 'paginate--mobile'], './');
    $paginate->update((object)[
      'scale' => $_ENV['APP_DEFAULT_NAVIGATION_SCALE_DESKTOP'],
    ]);
    $result->desktop = $paginate->createElements(['paginate', 'paginate--desktop'], './');
    return $result;
  }

  /**
   * get url path
   *
   */
  static public function getUrlPath()
  {
    $str = '';
    if ($_SERVER['REQUEST_URI'])
    {
      $str = $_SERVER['REQUEST_URI'];
      $str = preg_replace('/\?.*/', '', $str);
    }
    return $str;
  }

  static public function urlHttp() {
    return isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' ? 'https' : 'http';
  }

}
