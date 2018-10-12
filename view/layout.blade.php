<!doctype html>
<?php
if(!defined("__GOOSE__")){exit();}
?>
<html lang="ko">
<head>
@include('head')
</head>
<body ontouchstart="">
<main>
	<header class="header">
		<div class="header__body">
			<h1 class="header__logo">
				<a href="{{__ROOT__}}/" title="{{getenv('TITLE')}}">
					<img src="{{__ROOT__}}/assets/images/ico-logo.svg" alt="redgoose">
				</a>
			</h1>
			<nav class="header__navigation" id="headerNavigation">
				<button type="button" title="toggle navigation" class="dropdown-button">
					<img src="{{__ROOT__}}/assets/images/ico-menu.svg" class="on" alt="menu">
					<img src="{{__ROOT__}}/assets/images/ico-close.svg" class="off" alt="close menu">
				</button>
				<div class="header-navigation dropdown-content">
					<ul>
						<li{!! $nest_id === 'development' ? ' class="on"' : '' !!}>
							<a href="{{__ROOT__}}/index/development">Development</a>
						</li>
						<li{!! $nest_id === 'tipLibrary' ? ' class="on"' : '' !!}>
							<a href="{{__ROOT__}}/index/tipLibrary">Tips</a>
						</li>
						<li{!! $nest_id === 'diray' ? ' class="on"' : '' !!}>
							<a href="{{__ROOT__}}/index/diray">Diray</a>
						</li>
						<li{!! $nest_id === 'review' ? ' class="on"' : '' !!}>
							<a href="{{__ROOT__}}/index/review">Review</a>
						</li>
						<li{!! $nest_id === 'graphics' ? ' class="on"' : '' !!}>
							<a href="{{__ROOT__}}/index/graphics">Graphics</a>
						</li>
						<li>
							<a href="https://redgoose.me" target="_blank">redgoose</a>
						</li>
					</ul>
				</div>
			</nav>
		</div>
		<div class="header__search" id="headerSearch">
			<button type="button" title="toggle search form" class="dropdown-button">
				<img src="{{__ROOT__}}/assets/images/ico-search.svg" class="on" alt="search">
				<img src="{{__ROOT__}}/assets/images/ico-close.svg" class="off" alt="close menu">
			</button>
			<div class="header-search dropdown-content">
				<form action="{{__ROOT__}}/search" method="get" id="search_keyword">
					<fieldset>
						<legend>search keyword form</legend>
						<span>
							<input type="text" name="q" placeholder="Please search keyword" value="{{isset($searchKeyword) ? $searchKeyword : ''}}">
							<button type="reset" title="clear search keyword">
								<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
									<path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" fill="currentColor"/>
									<path d="M0 0h24v24H0z" fill="none"/>
								</svg>
							</button>
						</span>
					</fieldset>
					<nav>
						<button type="submit">
							<img src="{{__ROOT__}}/assets/images/ico-search.svg" alt="search">
						</button>
					</nav>
				</form>
			</div>
		</div>
	</header>

	<div class="container">
		@yield('contents')
	</div>

	<footer class="footer">
		<p class="footer__copyright">
			Copyright {{date('Y')}} Redgoose. All right reserved.
		</p>
	</footer>
</main>
<script src="{{__ROOT__}}/assets/dist/app.js"></script>
<script>
window.redgoose = new Redgoose({
	url_api: '{{__API__}}',
	url_root: '{{__ROOT__}}',
	url_cookie: '{{__COOKIE_ROOT__}}',
});
</script>
@yield('script')
</body>
</html>