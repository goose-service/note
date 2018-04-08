<!doctype html>
<?php
if(!defined("__GOOSE__")){exit();}

/** @var array $data */
/** @var array $pref */
/** @var string $prefString */
?>
<html lang="{{$pref['meta']['lang']}}">
<head>
@include('head')
@yield('style')
@if (file_exists(__PWD__.'/view/head--user.blade.php'))
@include('head--user')
@endif
</head>
<body>
<main>
	<header class="header">
		<h1>
			<a href="{{__ROOT__}}/">{{$pref['string']['title']}}</a>
		</h1>
		<nav class="gnb">
			<button type="button" class="toggle-button">
				<span>NAVIGATION</span>
				<i class="lnr lnr-chevron-down"></i>
			</button>
			@if (count($pref['navigation']))
			<div>
				<ul class="dep-1">
					@foreach($pref['navigation'] as $item)
					<?php
					/** @var array $item */
					$url = ($item['external']) ? $item['url'] : __ROOT__.$item['url'];
					$url = ($item['url'] != '#') ? $url : 'javascript:;';
					$active = (preg_match("|".preg_quote($item['url'])."|", $_SERVER['REQUEST_URI'], $arr)) ? ' class="active"' : '';
					?>
					<li{{$active}}>
						<a href="{{$url}}"{{$item['external'] ? 'target="_blank"' : ''}}>{{$item['name']}}</a>
						@if(count($item['children']))
						<div>
							<ul class="dep-2">
								@foreach($item['children'] as $item2)
								<?php
								/** @var array $item2 */
								$url = ($item2['external']) ? $item2['url'] : __ROOT__.$item2['url'];
								$url = ($item2['url'] != '#') ? $url : 'javascript:;';
								$active = (preg_match("|".preg_quote($item2['url'])."|", $_SERVER['REQUEST_URI'], $arr)) ? ' class="active"' : '';
								?>
								<li{{$active}}>
									<a href="{{$url}}"{{$item2['external'] ? 'target="_blank"' : ''}}>{{$item2['name']}}</a>
								</li>
								@endforeach
							</ul>
						</div>
						@endif
					</li>
					@endforeach
				</ul>
			</div>
			@endif
		</nav>
	</header>

	<div class="container">
		@yield('contents')
	</div>

	<footer class="footer">
		<p class="copyright">{{$pref['string']['copyright']}}</p>
	</footer>
</main>
<script>window.pref = JSON.parse(decodeURIComponent('{{$prefString}}'));</script>
<script src="{{__ROOT__}}/vendor/jquery/jquery-3.3.1.slim.min.js"></script>
<script src="{{__ROOT__}}/assets/js/app.js"></script>
@yield('script')
</body>
</html>