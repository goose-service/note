<?php if(!defined("__GOOSE__")){exit();} ?>
@extends('layout')

<?php
/** @var array $pref */
/** @var object $data */
?>

@section('contents')
<article class="article-view" id="article">
	<header>
		<h1>{{$data['article']['title']}}</h1>
		<div class="metas">
			<p>
				<span>Category</span>
				<em>{{$data['category']['name']}}</em>
			</p>
			<p>
				<span>Date</span>
				<em>{{$data['article']['regdate']}}</em>
			</p>
			<p>
				<span>Hit</span>
				<em>{{$data['article']['hit']}}</em>
			</p>
		</div>
	</header>

	<div class="body">
		{!! $data['article']['content'] !!}
	</div>

	<nav class="bottom">
		<a href="{{(isset($_SESSION['referer'])) ? $_SESSION['referer'] : __ROOT__.'/'}}" class="active" title="go to list">
			<i class="lnr lnr-menu"></i>
		</a>
	</nav>
</article>
@endsection