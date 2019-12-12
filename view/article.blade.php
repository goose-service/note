<?php
namespace Core;
if(!defined("__GOOSE__")){exit();}

/** @var string $title */
/** @var string $description */
/** @var string $image */
/** @var object $data */
/** @var bool $onLike */
?>

@extends('layout')

@section('meta')
<title>{{ $title }}</title>
<meta name="description" content="{{ getenv('DESCRIPTION') }}"/>
<meta property="og:title" content="{{ $title }}"/>
<meta property="og:description" content="{{ $description }}">
<meta property="og:image" content="{{ $image }}">
@endsection

@section('contents')
<article class="article" id="article">
	<header class="article__header">
		<h2>{{$data->title}}</h2>
		<p>
			<span>Nest: {{$data->nest_name}}</span>
			<span>Category: {{$data->category_name}}</span>
			<span>{{$data->order}}</span>
		</p>
	</header>
	<div class="article__content" id="article_content">
		{!! $data->content !!}
	</div>
	<nav class="article__nav">
		<div class="wrap">
			<a href="{{$refererUrl}}" class="list">
				<svg xmlns="http://www.w3.org/2000/svg" width="8" height="12" viewBox="0 0 8 12">
					<g fill="none" fill-rule="evenodd">
						<path fill="#000" d="M7.41 1.41L6 0 0 6l6 6 1.41-1.41L2.83 6z"/>
						<path d="M-8-6h24v24H-8z"/>
					</g>
				</svg>
				<em>back</em>
			</a>
			<button type="button" id="button_like" data-srl="{{$data->srl}}"{!! $onLike ? ' class="like on" disabled' : 'class="like"' !!}>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="129.184 102.606 25.632 23.517">
					<path d="M13,24.123l-1.858-1.692C4.542,16.446.184,12.5.184,7.655A6.981,6.981,0,0,1,7.233.606,7.673,7.673,0,0,1,13,3.285,7.676,7.676,0,0,1,18.767.606a6.981,6.981,0,0,1,7.049,7.049c0,4.844-4.358,8.791-10.958,14.789Z" transform="translate(129 102)"></path>
				</svg>
				<em>{{$data->star}}</em>
			</button>
		</div>
	</nav>
</article>
@endsection

@section('script')
<script>
window.redgoose.mergeOptions({ token: '{{getenv('TOKEN_PUBLIC')}}' });
window.redgoose.initialArticle();
</script>
@endsection