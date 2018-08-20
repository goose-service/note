<?php if(!defined("__GOOSE__")){exit();} ?>
@extends('layout')

@section('contents')
<article class="page-error">
	<div class="page-error__wrap">
		<h1>{{$message ? $message : 'Service error'}}</h1>
		<nav>
			<a href="/">Home</a>
		</nav>
	</div>
</article>
@endsection