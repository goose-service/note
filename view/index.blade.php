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
		<h1>{{$pageTitle}}</h1>
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
					<span></span>
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
	<div>.empty</div>
	@endif

	@if($navigation && ($navigation->desktop || $navigation->mobile))
	<?php
	\Core\Util::console($navigation);
	?>
	<div class="index__paginate">
		@if($navigation->desktop)
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
		@if($navigation->mobile)
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