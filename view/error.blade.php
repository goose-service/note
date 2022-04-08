<?php
if(!defined("__GOOSE__")){exit();}
?>

@extends('layout')

@section('meta')
<title>{{ $title }}</title>
<meta name="description" content="{{$_ENV['APP_DESCRIPTION']}}"/>
<meta property="og:title" content="{{$title}}"/>
<meta property="og:description" content="{{$_ENV['APP_DESCRIPTION']}}">
<meta property="og:image" content="{{__ROOT__}}/assets/images/og-redgoose.jpg">
@endsection

@section('contents')
<article class="error">
  <figure class="error__image">
    <img src="{{__ROOT__}}/assets/images/img-symbol-line.png" alt="redgoose">
  </figure>
  <p class="error__code">{{$code}}</p>
  <h2 class="error__message">{{$message}}</h2>
</article>
@endsection