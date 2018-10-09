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
				<button type="button" title="toggle navigation">
					<img src="{{__ROOT__}}/assets/images/ico-menu.svg" class="on" alt="menu">
					<img src="{{__ROOT__}}/assets/images/ico-close.svg" class="off" alt="close menu">
				</button>
				<div class="header-navigation">
					<ul>
						<li>
							<a href="{{__ROOT__}}/index/development">Development</a>
						</li>
						<li>
							<a href="{{__ROOT__}}/index/tipLibrary">Tips</a>
						</li>
						<li>
							<a href="{{__ROOT__}}/index/cinema4d">Cinema4d</a>
						</li>
						<li>
							<a href="{{__ROOT__}}/index/diray">Diray</a>
						</li>
						<li>
							<a href="{{__ROOT__}}/index/review">Review</a>
						</li>
						<li>
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
			<button type="button" title="toggle search form">
				<img src="{{__ROOT__}}/assets/images/ico-search.svg" class="on" alt="search">
				<img src="{{__ROOT__}}/assets/images/ico-close.svg" class="off" alt="close menu">
			</button>
			<div class="header-search">
				<form action="{{__ROOT__}}/search" method="get" id="search_keyword">
					<fieldset>
						<legend>search keyword form</legend>
						<input
							type="text"
							name="keyword"
							placeholder="Please search keyword">
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
window.redgoose = new Redgoose({});
</script>
</body>
</html>