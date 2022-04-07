<!doctype html>
<?php
if(!defined("__GOOSE__")){exit();}

/** @var string $title */
/** @var string $keyword */
?>
<html lang="ko">
<head>
@include('head')
</head>
<body ontouchstart="">
<h1 class="heading-title">{{$title}}</h1>
<main>
  <header class="header">
    <div class="header__wrap">
      <div class="header__body">
        <div class="header__logo">
          <a href="{{__ROOT__}}/" title="{{$_ENV['APP_TITLE']}}">
            <img src="{{__ROOT__}}/assets/images/ico-logo.svg" alt="redgoose">
          </a>
        </div>
        <nav class="header__navigation" id="headerNavigation">
          <button type="button" title="toggle navigation" class="dropdown-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="12" viewBox="0 0 18 12" fill="currentColor">
              <g fill="none" fill-rule="evenodd">
                <path fill="currentColor" fill-rule="nonzero" d="M0 12h18v-2H0v2zm0-5h18V5H0v2zm0-7v2h18V0H0z"/>
              </g>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
              <g fill="none" fill-rule="evenodd">
                <path fill="currentColor" d="M14 1.41L12.59 0 7 5.59 1.41 0 0 1.41 5.59 7 0 12.59 1.41 14 7 8.41 12.59 14 14 12.59 8.41 7z"/>
              </g>
            </svg>
          </button>
          <div class="header-navigation dropdown-content">
            <ul>
              <li{!! isset($nest_id) && $nest_id === 'blog' ? ' class="on"' : '' !!}>
                <a href="{{__ROOT__}}/index/blog/">Blog</a>
              </li>
              <li{!! isset($nest_id) && $nest_id === 'development' ? ' class="on"' : '' !!}>
                <a href="{{__ROOT__}}/index/development/">Development</a>
              </li>
              <li{!! isset($nest_id) && $nest_id === 'graphics' ? ' class="on"' : '' !!}>
                <a href="{{__ROOT__}}/index/graphics/">Graphics</a>
              </li>
              <li{!! isset($nest_id) && $nest_id === 'concept' ? ' class="on"' : '' !!}>
                <a href="{{__ROOT__}}/index/concept/">Concept</a>
              </li>
              <li{!! isset($nest_id) && $nest_id === 'note-etc' ? ' class="on"' : '' !!}>
                <a href="{{__ROOT__}}/index/note-etc/">ETC</a>
              </li>
              <li>
                <a href="https://redgoose.me" target="_blank">redgoose</a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
      <div class="header__search" id="headerSearch">
        <?php
        $className = ['dropdown-button'];
        if (isset($keyword) && $keyword) $className[] = 'on';
        ?>
        <button type="button" title="toggle search form" class="{{join(' ', $className)}}">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
            <g fill="none" fill-rule="evenodd">
              <path fill="currentColor" fill-rule="nonzero" d="M12.5 11h-.79l-.28-.27A6.471 6.471 0 0 0 13 6.5 6.5 6.5 0 1 0 6.5 13c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L17.49 16l-4.99-5zm-6 0C4.01 11 2 8.99 2 6.5S4.01 2 6.5 2 11 4.01 11 6.5 8.99 11 6.5 11z"/>
            </g>
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <g fill="none" fill-rule="evenodd">
              <path fill="currentColor" d="M14 1.41L12.59 0 7 5.59 1.41 0 0 1.41 5.59 7 0 12.59 1.41 14 7 8.41 12.59 14 14 12.59 8.41 7z"/>
            </g>
          </svg>
        </button>
        <div class="header-search dropdown-content">
          <form action="{{__ROOT__}}/" method="get" id="search_keyword">
            <fieldset>
              <legend>search keyword form</legend>
              <span>
                <input type="text" name="q" placeholder="Please search keyword" value="{{isset($keyword) ? $keyword : ''}}">
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
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
                  <g fill="none" fill-rule="evenodd">
                    <path fill="currentColor" fill-rule="nonzero" d="M12.5 11h-.79l-.28-.27A6.471 6.471 0 0 0 13 6.5 6.5 6.5 0 1 0 6.5 13c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L17.49 16l-4.99-5zm-6 0C4.01 11 2 8.99 2 6.5S4.01 2 6.5 2 11 4.01 11 6.5 8.99 11 6.5 11z"/>
                  </g>
                </svg>
              </button>
            </nav>
          </form>
        </div>
      </div>
    </div>
  </header>
  <div class="container">
    @yield('contents')
  </div>
  <footer class="footer">
    <p class="footer__copyright">Copyright {{date('Y')}} redgoose. All right reserved.</p>
  </footer>
</main>
<script type="module">
import Redgoose from '{{__ROOT__}}/assets/dist/app.es.js';
window.app = new Redgoose();
</script>
@yield('script')
</body>
</html>
