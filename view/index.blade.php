<?php
if(!defined("__GOOSE__")){exit();}

/** @var array $index */
/** @var int $nextPage */
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
<article class="index">
  <header class="index__header">
    <h2>{{$pageTitle}}</h2>
    @if(isset($categories) && count($categories) > 0)
    <nav>
      <ul>
        @foreach($categories as $k=>$item)
        <li{!!($category_srl === $item->srl || (!$category_srl && !$item->srl)) ? ' class="on"' : ''!!}>
          <a href="{{__ROOT__}}/index/{{$nest_id}}{{$item->srl ? '/'.$item->srl : ''}}">
            <span>{{$item->name}}</span>
            <em>{{$item->count_article ? $item->count_article : 0}}</em>
          </a>
        </li>
        @endforeach
      </ul>
    </nav>
    @endif
  </header>

  @if($index && count($index))
  <div class="index__articles">
    @foreach($index as $k=>$item)
    <div class="index-article">
      <a href="{{__ROOT__}}/article/{{$item->srl}}" class="index-article__wrap">
        <figure class="index-article__image">
          @if($item->image)
          <img src="{{__API__}}/{{$item->image}}" alt="{{$item->title}}">
          @else
          <span>
            <img src="{{__ROOT__}}/assets/images/empty/{{rand(0,20)}}.svg" alt="">
          </span>
          @endif
        </figure>
        <div class="index-article__body">
          <strong>{{$item->title}}</strong>
          <p>
            <span>{{$item->regdate}}</span>
            <span>{{$item->category_name}}</span>
          </p>
        </div>
      </a>
    </div>
    @endforeach
  </div>
  @else
  <article class="index__empty">
    <figure>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M0 0h24v24H0z" fill="none"/>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z" fill="currentColor"/>
      </svg>
    </figure>
    <h3>no item</h3>
  </article>
  @endif

  @if($navigation && ($navigation->desktop || $navigation->mobile) && $index && count($index))
  <div class="index__paginate">
    @if($navigation->desktop && isset($navigation->desktop->body))
    <nav class="index-paginate index-paginate--desktop">
      @if($navigation->desktop->prev)
			<a href="{{$url}}?{{$navigation->desktop->prev->url}}" class="index-paginate__unit">
				<img src="{{__ROOT__}}/assets/images/ico-arrow-left.svg" alt="prev">
			</a>
      @endif
      @foreach($navigation->desktop->body as $key=>$item)
        @if(isset($item->active))
				<strong class="index-paginate__unit active">
					<span>{{$item->name}}</span>
				</strong>
        @else
				<a href="{{$url ? $url : '/'}}{{$item->url ? '?'.$item->url : ''}}" class="index-paginate__unit">
					<span>{{$item->name}}</span>
				</a>
        @endif
      @endforeach
      @if($navigation->desktop->next)
			<a href="{{$url}}?{{$navigation->desktop->next->url}}" class="index-paginate__unit">
				<img src="{{__ROOT__}}/assets/images/ico-arrow-right.svg" alt="next">
			</a>
      @endif
    </nav>
    @endif
    @if($navigation->mobile && isset($navigation->mobile->body))
    <nav class="index-paginate index-paginate--mobile">
      @if($navigation->mobile->prev)
			<a href="{{$url}}?{{$navigation->mobile->prev->url}}" class="index-paginate__unit">
				<img src="{{__ROOT__}}/assets/images/ico-arrow-left.svg" alt="prev">
			</a>
      @endif
      @foreach($navigation->mobile->body as $key=>$item)
			@if(isset($item->active))
			<strong class="index-paginate__unit active">
				<span>{{$item->name}}</span>
			</strong>
			@else
			<a href="{{$url ? $url : '/'}}{{$item->url ? '?'.$item->url : ''}}" class="index-paginate__unit">
				<span>{{$item->name}}</span>
			</a>
			@endif
      @endforeach
      @if($navigation->mobile->next)
			<a href="{{$url}}?{{$navigation->mobile->next->url}}" class="index-paginate__unit">
				<img src="{{__ROOT__}}/assets/images/ico-arrow-right.svg" alt="next">
			</a>
      @endif
    </nav>
    @endif
  </div>
  @endif
</article>
@endsection