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
				<a href="{{__ROOT__}}" title="{{getenv('TITLE')}}">
					<img src="{{__ROOT__}}/assets/images/ico-logo.svg" alt="redgoose">
				</a>
			</h1>
			<nav class="header__navigation">
				<button type="button" title="toggle navigation">
					<img src="{{__ROOT__}}/assets/images/ico-menu.svg" alt="menu">
				</button>
				<div>
					<ul>
						<li>
							<a href="#">Development</a>
						</li>
						<li>
							<a href="#">Tips</a>
						</li>
						<li>
							<a href="#">Cinema4d</a>
						</li>
						<li>
							<a href="#">Diray</a>
						</li>
						<li>
							<a href="#">Review</a>
						</li>
						<li>
							<a href="#">Graphics</a>
						</li>
						<li>
							<a href="#">redgoose</a>
						</li>
					</ul>
				</div>
			</nav>
		</div>
		<div class="header__search">
			<nav>
				<button type="button" title="toggle search form">
					<img src="{{__ROOT__}}/assets/images/ico-search.svg" alt="search">
				</button>
			</nav>
			<form action="#" class="header-search">
				<span>
					<input
						type="text"
						name="search_keyword"
						placeholder="Please search keyword">
				</span>
				<nav>
					<button type="submit">
						<img src="{{__ROOT__}}/assets/images/ico-search.svg" alt="search">
					</button>
				</nav>
			</form>
		</div>
	</header>

	<div class="container">
		@yield('contents')
	</div>

	<footer class="footer">
		.footer
	</footer>
</main>
@yield('script')
</body>
</html>