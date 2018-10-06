<?php
/** @var array $data */
/** @var array $pref */
/** @var string $_target */
$title = $pref->meta->title;
$title .= ($_target == 'index' && isset($data->nest->name)) ? ' / '.$data->nest->name : '';
$title .= ($_target == 'index' && isset($data->category_name)) ? ' / '.$data->category_name : '';
$title .= ($_target == 'article' && isset($data->article->title)) ? ' / '.$data->article->title : '';
$description = ($_target == 'article' && isset($data->article->content)) ? renderDescription($data->article->content) : $pref->meta->description;
?>

<meta charset="utf-8"/>
<title>{{$title}}</title>

<meta name="viewport" content="user-scalable=yes, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"/>
<meta name="author" content="{{$pref->meta->author}}"/>
<meta name="keywords" content="{{$pref->meta->keywords}}"/>
<meta name="description" content="{{$description}}"/>

<meta property="og:title" content="{{$title}}"/>
<meta property="og:site_name" content="{{__ROOT_URL__}}"/>
<meta property="og:url" content="{{__ROOT_URL__.$_SERVER['REQUEST_URI']}}"/>
<meta property="og:description" content="{{$description}}"/>
<meta property="og:locale" content="{{$pref->meta->locale}}"/>
@if (isset($data->article->json->thumbnail->path))
<meta property="og:image" content="{{__GOOSE_ROOT__}}/{{$data->article->json->thumbnail->path}}"/>
@endif
<link rel="shortcut icon" href="{{__REDGOOSE_ROOT__}}/assets/icons/favicon.ico">
<link rel="icon" type="image/x-icon" href="{{__REDGOOSE_ROOT__}}/assets/icons/redgoose_256x256x32.png" />
<link rel="apple-touch-icon" href="{{__REDGOOSE_ROOT__}}/assets/icons/redgoose_app_256x256x32.png">

<link rel="stylesheet" href="{{__ROOT__}}/assets/css/app.css"/>