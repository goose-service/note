<meta charset="utf-8">
<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="ie=edge">
<meta name="author" content="redgoose-note">
<meta name="keywords" content="redgoose,redgoose-note,development,graphics,review">
<link rel="canonical" href="{{core\Util::urlHttp()}}://{{$_SERVER['HTTP_HOST']}}{{$_SERVER['REQUEST_URI']}}">

<meta property="og:site_name" content="redgoose-note"/>
<meta property="og:url" content="{{core\Util::urlHttp()}}://{{$_SERVER['HTTP_HOST']}}{{$_SERVER['REQUEST_URI']}}"/>
<meta property="og:locale" content="ko_KR"/>
<meta property="og:type" content="website"/>

<meta name="apple-mobile-web-app-capable" content="yes"/>
<meta name="mobile-web-app-capable" content="yes"/>
<meta name="apple-mobile-web-app-status-bar-style" content="light"/>

@yield('meta')

<link rel="shortcut icon" href="{{__ROOT__}}/favicon.ico"/>
<link rel="icon" type="image/x-icon" href="{{__ROOT__}}/assets/images/icon/redgoose-256x256.png"/>
<link rel="apple-touch-icon" href="{{__ROOT__}}/assets/images/icon/redgoose-256x256.png"/>
<link rel="apple-touch-startup-image" href="{{__ROOT__}}/assets/images/icon/redgoose-256x256.png"/>

<link rel="stylesheet" href="{{__ROOT__}}/assets/dist/app.css" media="screen"/>
<link rel="manifest" href="{{__ROOT__}}/manifest.json"/>