# Simple Note from goose

노트로 사용하기 위한 목적으로 이 앱을 만들게 되었습니다.  
여유로운 여백과 글에 집중할 수 있는 형태로 표현을 할 수 있다는 목표를 가지고 디자인했습니다.

이 앱의 설정은 대략적으로 적어두겠습니다. 앱을 설정하는 법에대한 흐름은 [First Gallery Wiki](https://github.com/dev-goose/app-first-gallery/wiki) 링크를 참고하여 아래 설정 소스를 활용하여 세팅하시면 됩니다.


------------------------

__GOOSE GitHub : https://github.com/RedgooseDev/goose__  
__DEMO : http://projects.redgoose.me/2015/goose/app/simple-note/__  
__goose-dev article : http://src.goose-dev.com/article/7/__

------------------------


### `index.user.php`

다음과 같은 내용을 참고하여 `{GOOSE}/index.user.php` 파일을 만듭니다.

```
<?php
define('__GOOSE__', true);
define('__USE_GOOSE_SESSION__', true);
define('__GOOSE_ROOT__', '/goose'); // goose 경로
define('__GOOSE_LIB__', '../goose/bootstrap/lib.php'); // goose 라이브러리 파일 경로 (상대경로)
define('__PWD__', dirname(__FILE__)); // App 경로 (절대경로)
define('__ROOT__', '/simple-note'); // App 경로
define('__ROOT_URL__', 'http://domain-name.com/simple-note'); // App 경로 (http://... 포함된 전체경로)
define('__COOKIE_ROOT__', '/simple-note'); // 쿠키가 저장되는 경로

define('DEBUG', true);

// set preference srl in json
$srl_json_pref = 1;
```


### JSON - Preference

앱에대한 환경설정을 합니다. 거기에서 사용되는 설정값은 Goose의 JSON모듈에서 글을 등록합니다. 샘플로 사용할 수 있는 json 트리는 다음과 같습니다.

```
{
	"srl": {
		"app": 1
	},
	"meta": {
		"lang": "ko",
		"title": "Simple Note",
		"author": "redgoose",
		"keywords": "note documents",
		"description": "Note style app from goose",
		"headerKey": "goose",
		"locale": "ko_KR"
	},
	"string": {
		"copyright": "Copyright 2016 Redgoose. All right reserved.",
		"intro_title": "Newstest",
		"title": "Simple Note"
	},
	"index": {
		"count": {
			"item": 20,
			"pageScale": 5
		},
		"classNames": {
			"list": "style-card"
		},
		"print_thumbnail" : true,
		"print_paginate": true
	},
	"article": {
		"type": "markdown",
		"updateHit": true,
		"updateLike": false,
		"cookiePrefix": "goose-"
	},
	"navigation": [
		{
			"name": "Notes",
			"url": "#",
			"children": [
				{
					"name": "Note-1",
					"url": "/index/note-1/"
				},
				{
					"name": "Note-2",
					"url": "/index/note-2/"
				}
			]
		},
		{
			"name": "About iMac",
			"url": "/page/iMac/"
		},
		{
			"name": "External-Link",
			"url": "#",
			"children": [
				{
					"name": "GitHub project",
					"target": "_blank",
					"external": true,
					"url": "https://github.com/dev-goose/simple-note"
				},
				{
					"name": "goose-dev article",
					"target": "_blank",
					"external": true,
					"url": "http://src.goose-dev.com/article/7/"
				},
				{
					"name": "redgoose.me",
					"target": "_blank",
					"external": true,
					"url": "http://redgoose.me"
				}
			]
		},
		{
			"name": "none link",
			"url": "#"
		}
	]
}
```

preference 설정에 대한 소개는 다음과 같습니다.

* srl {object} goose 모듈과 연결하기위한 srl값 설정
  * json_gnb {int} 네비게이션에 사용되는 json모듈의 srl값
  * app {int} app모듈의 srl값
* meta {object} &lt;meta>태그의 값 설정
* index {object} 목록 페이지
  * count {object}
    * item {int} : 한페이지에 출력되는 글 갯수입니다.
    * pageScale {int} : 페이지 네비게이션에서 출력하는 숫자의 갯수입니다.
  * classNames {object}
    * list {string} : 목록 스타일
      "" : list
      "style-card" : card style
      "style-thumbnail" : thumbnail style
      "color-dark" : dark theme
  * print_thumbnail {boolean} 썸네일 이미지 출력
  * print_paginate {boolean} 페이지 네비게이션 출력
* article {object} 상세페이지
  * type {string} 글 내용 출력방식
    "markdown" : 마크다운 형식
  * updateHit {boolean} 조회수 업데이트 기능
  * updateLike {boolean} 좋아요 업데이트 기능
  * cookiePrefix {string} cookie key name(prefix)
* navigation {array} Navigation tree


### 사용자 head 사용하기

`<head/>` 엘리먼트 속의 내용을 git에 영향을 받지않고 사용자 사용자 공간을 만들어 수정할 수 있도록 장치를 마련했습니다.  
`{GOOSE}/view/layout-head.user.html` 파일을 만들어서 원하는대로 소스를 넣어서 사용할 수 있습니다.

이렇게 하는 이유는 git 업데이트에 영향을 받지 않으면서 js,css,meta에 기능을 더할 수 있습니다.