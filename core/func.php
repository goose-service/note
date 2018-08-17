<?php
if(!defined("__GOOSE__")){exit();}


/**
 * Make query
 *
 * @param array $q
 * @return string
 */
function makeQuery($q)
{
	$str = '';
	foreach($q as $k=>$v)
	{
		$str .= ($v) ? '&'.$k.'='.$v : '';
	}
	$str = preg_replace('/^&/', '?', $str);
	return $str;
}


/**
 * Make link url
 * 라우터 값들을 이용해서 url을 만들어준다.
 *
 * @param string $target
 * @param array $params
 * @param array $queris
 * @return string
 */
function makeLinkUrl($target, $params, $queris)
{
	$str = __ROOT__.'/';
	switch($target)
	{
		case 'index':
			$str .= (isset($params['nest'])) ? $target.'/'.$params['nest'].'/' : '';
			$str .= (isset($params['nest']) && isset($params['category'])) ? $params['category'].'/' : '';
			$str .= ($queris) ? makeQuery($queris) : '';
			break;
		case 'article':
			$str .= (isset($params['article'])) ? $target.'/'.$params['article'].'/' : '';
			$str .= ($queris) ? makeQuery($queris) : '';
			break;
	}
	return $str;
}


/**
 * Cutting string
 * 글자를 특정자수만큼 잘라준다.
 *
 * @param string $str 자를문자
 * @param number $len 길이
 * @param string $tail 꼬리에 붙는 문자
 * @return string
 */
function bear3StrCut($str, $len, $tail="...")
{
	$rtn = [];
	return preg_match('/.{' . $len . '}/su', $str, $rtn) ? $rtn[0] . $tail : $str;
}


/**
 * Render description
 * 글 본문을 요약설명으로 변경해준다. 태그 없애고
 *
 * @param string $str content data
 * @param int $length
 * @return string
 */
function renderDescription($str, $length=120)
{
	$str = trim(strip_tags($str));
	$str = preg_replace('/\r\n|\r|\n|\t/','',$str);
	$str = preg_replace('/"/','\"',$str);
	$str = preg_replace("/'/","\'",$str);
	$str = preg_replace("/&nbsp;/"," ",$str);
	$str = bear3StrCut($str, $length);
	return $str;
}


/**
 * Search value in array
 *
 * @param array $array
 * @param string $key
 * @return bool
 */
function searchValueInArray($array, $key)
{
	return in_array($key, $array);
}


/**
 * Check cookie key
 *
 * @param string $keyName
 * @param int $day
 * @return bool
 */
function isCookieKey($keyName='', $day=1)
{
	if (!isset($_COOKIE[$keyName]))
	{
		// set cookie
		setcookie(
			$keyName,
			1,
			time() + 3600 * 24 * $day,
			(defined("__COOKIE_ROOT__")) ? __COOKIE_ROOT__ : '/'
		);
		return true;
	}
	else
	{
		return false;
	}
}


/**
 * set cookie key
 *
 * @param string $keyName
 * @param int $day
 */
function setCookieKey($keyName='', $day=1)
{
	setcookie(
		$keyName,
		1,
		time() + 3600 * 24 * $day,
		__COOKIE_ROOT__
	);
}


/**
 * call external api
 *
 * @param string $url
 * @param object $params
 * @param string $method
 * @return object
 */
function externalApi($url, $params=null, $method='get')
{
	try
	{
		$params = $params ? '?'.http_build_query($params) : '';

		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, __GOOSE_ROOT__.$url.$params);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_POST, ($method === 'post'));
		curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: ' . __TOKEN_PUBLIC__]);
		$response = curl_exec($ch);
		$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
		curl_close($ch);

		if (!$response)
		{
			throw new Exception('no response');
		}

		$response = json_decode($response);
		if (!$response->success) throw new Exception($response->message);
		return $response->data;
	}
	catch(Exception $e)
	{
		return null;
	}
}
