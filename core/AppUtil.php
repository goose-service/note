<?php
namespace Core;
use Exception, redgoose\Console;

/**
 * App util
 */
class AppUtil {

  /**
   * error
   * @param Exception $error
   * @param Blade $blade
   * @throws Exception
   */
  static public function error(Exception $error, Blade $blade): void
  {
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

    // debug
    if ($_ENV['APP_USE_DEBUG'] === '1')
    {
      Console::log((object)[
        'message' => $error->getMessage(),
        'code' => $error->getCode(),
      ]);
    }

    // exit app
    exit;
  }

  /**
   * get page number
   * @return int
   */
  static public function getPage(): int
  {
    return (isset($_GET['page']) && (int)$_GET['page'] > 1) ? (int)$_GET['page'] : 1;
  }

  /**
   * content to short text
   * @param string $con
   * @param int $len
   * @return string|null
   */
  static public function contentToShortText(string $con, int $len = 120): ?string
  {
    /**
     * Cutting string
     * 글자를 특정자수만큼 잘라준다.
     * @param string $str 자를문자
     * @param int $len 길이
     * @param string $tail 꼬리에 붙는 문자
     * @return string 잘려서 나온문자
     */
    function bear3StrCut(string $str, int $len, string $tail = '...'): string
    {
      $rtn = [];
      return preg_match('/.{'.$len.'}/su', $str, $rtn) ? $rtn[0].$tail : $str;
    }

    if (!$con) return null;
    $con = trim(strip_tags($con));
    $con = preg_replace('/\r\n|\r|\n|\t/', ' ', $con);
    $con = preg_replace('/"/', '\"', $con);
    $con = preg_replace("/'/", "\'", $con);
    $con = preg_replace("/&nbsp;/"," ", $con);
    $con = preg_replace("/  /"," ", $con);
    return bear3StrCut($con, $len);
  }

  /**
   * check cookie key
   * @param string $key
   * @return bool
   */
  static public function checkCookie(string $key = ''): bool
  {
    return $_COOKIE[$key] ?? false;
  }

  /**
   * set cookie
   * @param string $key
   * @param string $value
   * @param int $day
   */
  static public function setCookie(string $key = '', string $value = '1', int $day = 1): void
  {
    setcookie(
      $key,
      $value,
      time() + 3600 * 24 * $day,
      $_ENV['APP_PATH_COOKIE']
    );
  }

}
