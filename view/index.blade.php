<?php
if(!defined("__GOOSE__")){exit();}

/** @var int $_nest */
/** @var int $_category */
/** @var object $data */
/** @var string $nest_id */
/** @var string $_target */
/** @var array $_params */
?>

@extends('layout')

@section('contents')
<article class="article-index">
	<header>
		<h1>
			@if($_GET['keyword'])
			Search keyword : {{$_GET['keyword']}}
			@else
			{{ ($data->nest->name) ? $data->nest->name : $pref->string->intro_title }}
			@endif
		</h1>
		<nav>
			<ul>
				<li class="search-target">
					<button type="button" title="toggle search" class="search-control">
						<i class="lnr lnr-magnifier"></i>
					</button>
					<div class="search-content">
						<form action="{{__ROOT__}}" method="get" class="keyword-search">
							<fieldset>
								<legend class="blind">Keyword search form</legend>
								<span><input type="text" name="keyword" value="{{$_GET['keyword']}}" maxlength="20" placeholder="Search Keyword"></span>
								<button type="submit" class="reset"><i class="lnr lnr-chevron-right"></i></button>
							</fieldset>
						</form>
					</div>
				</li>
				@if($_GET['keyword'])
				<li>
					<a href="{{ ($nest_id) ? __ROOT__.'/index/'.$nest_id.'/' : __ROOT__.'/' }}" title="clear search keyword">
						<i class="lnr lnr-cross"></i>
					</a>
				</li>
				@endif
			</ul>
		</nav>
	</header>

	@if($data->categories && count($data->categories))
	<div>
		<ul class="category-index">
			@foreach($data->categories as $k=>$v)
			<li{!! ($v->active) ? ' class="active"' : '' !!}>
				<a href="{{__ROOT__}}/index/{{$nest_id}}/{{($v->srl > 0) ? $v->srl.'/' : ''}}" data-key="{{$v->srl}}">
					<span>{{$v->name}}</span>
					<em>{{$v->count_article}}</em>
				</a>
			</li>
			@endforeach
		</ul>
	</div>
	@endif

	@if($data->articles && count($data->articles))
	<ul class="index {{$pref->index->classNames->list}}">
		@foreach($data->articles as $k=>$v)
		<li>
			<a href="{{__ROOT__}}/article/{{$v->srl}}/">
				@if($pref->index->print_thumbnail)
					@if($v->json->thumbnail->path)
					<figure style="background-image: url('{{__GOOSE_ROOT__}}/{{$v->json->thumbnail->path}}')"></figure>
					@else
					<figure class="not-image"></figure>
					@endif
				@endif
				<div>
					<strong>{{$v->title}}</strong>
					<div class="meta">
						<p><span>{{$v->regdate}}</span></p>
						@if($v->category_name)
						<p>
							<span>Cateogry</span>
							<em>{{$v->category_name}}</em>
						</p>
						@endif
						<p>
							<span>Hit</span>
							<em>{{$v->hit}}</em>
						</p>
					</div>
				</div>
			</a>
		</li>
		@endforeach
	</ul>
	@else
	<div class="not-item">
		<i class="lnr lnr-inbox"></i>
		<span>Not found article</span>
	</div>
	@endif

	@if($data->pageNavigation)
	<?php
	$nav = $data->pageNavigation;
	$url_prev = ($nav->prev) ? makeLinkUrl($_target, $_params, [ 'keyword' => $_GET['keyword'], 'page' => $nav->prev->id ]) : '';
	$url_next = ($nav->next) ? makeLinkUrl($_target, $_params, [ 'keyword' => $_GET['keyword'], 'page' => $nav->next->id ]) : '';
	?>
	<nav class="paginate">
		@if($nav->prev)
		<a href="{{$url_prev}}" title="{{$nav->prev->name}}" data-key="{{$nav->prev->id}}" class="dir">
			<i class="lnr lnr-chevron-left"></i>
		</a>
		@endif
		@foreach($nav->body as $k=>$o)
			<?php
			/** @var array $o */
			$url = ($o['active'] == false) ? makeLinkUrl($_target, $_params, [ 'keyword' => $_GET['keyword'], 'page' => (($o['id'] != 1) ? $o['id'] : null) ]) : '';
			?>
			@if($o['active'] == true)
			<strong>{{$o['name']}}</strong>
			@else
			<a href="{{$url}}" data-key="{{$o['id']}}">{{$o['name']}}</a>
			@endif
		@endforeach
		@if($nav->next)
		<a href="{{$url_next}}" title="{{$nav->next->name}}" data-key="{{$nav->next->id}}" class="dir">
			<i class="lnr lnr-chevron-right"></i>
		</a>
		@endif
	</nav>
	@endif
</article>
@endsection