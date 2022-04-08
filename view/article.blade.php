<?php
namespace Core;
if(!defined("__GOOSE__")){exit();}

/** @var string $title */
/** @var string $description */
/** @var string $image */
/** @var object $data */
/** @var array $comments */
/** @var bool $onLike */
?>

@extends('layout')

@section('meta')
<title>{{ $title }}</title>
<meta name="description" content="{{$description}}"/>
<meta property="og:title" content="{{$title}}"/>
<meta property="og:description" content="{{$description}}">
<meta property="og:image" content="{{$image}}">
@endsection

@section('contents')
<article class="article" id="article">
  <header class="article__header">
    <h1>{{$data->title}}</h1>
    <p>
      @if(isset($data->nest_name))<span>Nest: {{$data->nest_name}}</span>@endif
      @if(isset($data->category_name))<span>Category: {{$data->category_name}}</span>@endif
      <span>{{$data->order}}</span>
    </p>
  </header>
  <div class="article__content redgoose-body redgoose-body--dark" id="article_content">
    {!! $data->content !!}
  </div>
  <nav class="article__nav">
    <div class="wrap">
      <button type="button" id="button_like" data-srl="{{$data->srl}}"{!! $onLike ? ' class="like on" disabled' : 'class="like"' !!}>
        <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 38 38">
          <defs>
            <linearGradient id="a" x1="20%" y1="0%" y2="100%">
              <stop offset="0%" stop-color="currentColor" class="step-1"/>
              <stop offset="50%" stop-color="currentColor" class="step-2"/>
              <stop offset="100%" stop-color="currentColor" class="step-3"/>
            </linearGradient>
          </defs>
          <g fill="none" fill-rule="evenodd">
            <path fill="url(#a)" fill-rule="nonzero" d="M18.5 33l-2.247-2.086C8.27 23.534 3 18.666 3 12.692 3 7.825 6.751 4 11.525 4c2.697 0 5.286 1.28 6.975 3.303C20.19 5.28 22.778 4 25.475 4 30.249 4 34 7.825 34 12.692c0 5.974-5.27 10.842-13.253 18.238L18.5 33z"/>
          </g>
        </svg>
        <em>{{$data->star}}</em>
      </button>
    </div>
  </nav>
  @if ($comments && count($comments) > 0)
  <article class="comments">
    <h3 class="comments__title">Comments</h3>
    <ul class="comments__index">
      @foreach($comments as $k=>$item)
      <li class="comment">
        <div class="comment__body redgoose-body redgoose-body--dark">{!! $item->content !!}</div>
        <em class="comment__date">Written on {{$item->regdate}}</em>
      </li>
      @endforeach
    </ul>
  </article>
  @endif
</article>
@endsection

@section('script')
<script type="module">
window.app.initialArticle();
</script>
@endsection
