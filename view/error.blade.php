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
	<h1>TODO: error page</h1>
	<p>{{$code}}</p>
	<p>{{$message}}</p>
</article>
@endsection