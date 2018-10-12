<?php
if(!defined("__GOOSE__")){exit();}
?>

@extends('layout')

@section('meta')
<title>{{ $title }}</title>
<meta name="description" content="{{ getenv('DESCRIPTION') }}"/>
<meta property="og:title" content="{{ $title }}"/>
<meta property="og:description" content="{{ getenv('DESCRIPTION') }}">
<meta property="og:image" content="{{ __API__ }}/usr/icons/og-redgoose.jpg">
@endsection

@section('contents')
<article class="error">
	<figure class="error__image">
		<img src="{{__ROOT__}}/assets/images/img-symbol-line.png" alt="redgoose">
	</figure>
	<p class="error__code">{{$code}}</p>
	<h1 class="error__message">{{$message}}</h1>
</article>
@endsection