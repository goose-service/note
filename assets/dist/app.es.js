function shuffle($el, options) {
  options = Object.assign({}, {
    text: "",
    waitChar: "-",
    charSpeed: 1,
    moveFix: 25,
    moveRange: 10,
    moveTrigger: 25,
    fps: 60,
    pattern: "abcdefghijklmnopqrstuvwxyz0123456789-_!@#$%^&*()+~<>",
    randomTextType: null,
    callback: null
  }, options);
  options.text = options.text.trim();
  let textKeys = [];
  let frame;
  let position;
  let currentText;
  let checkLast;
  let checkPlay = false;
  function stack() {
    let str = currentText;
    checkLast = true;
    for (let tick = position; tick <= frame; tick++) {
      if (textKeys[tick] !== 0 && textKeys[tick] != null) {
        checkLast = false;
        const selectKey = textKeys[tick];
        if (Math.abs(selectKey) <= options.moveTrigger) {
          let txt = "";
          switch (options.randomTextType) {
            case "pattern":
              txt = randomWord(options.pattern);
              break;
            case "unicode":
            default:
              const unicode = Math.min(Math.max(options.text.charCodeAt(tick) + selectKey, 33), 126);
              txt = String.fromCharCode(unicode);
              break;
          }
          str += txt;
        } else {
          str += options.waitChar;
        }
        selectKey > 0 ? textKeys[tick] -= 1 : textKeys[tick] += 1;
      } else {
        if (position === tick - 1) {
          position = tick;
          currentText = options.text.substring(0, position);
        }
        str += options.text.charAt(tick);
      }
      $el.textContent = str;
    }
    if (frame <= options.text.length) {
      frame += options.charSpeed;
    } else {
      checkPlay = true;
    }
    if (checkLast && checkPlay) {
      if ($el.dataset.id)
        clearInterval(parseInt($el.dataset.id));
      $el.textContent = currentText;
      $el.dataset.run = "false";
      if (options.callback)
        options.callback();
    }
  }
  function randomWord(pattern) {
    const n = Math.floor(Math.random() * pattern.length);
    return pattern.substring(n, n + 1);
  }
  if (options.text && $el.dataset.run !== "true") {
    $el.dataset.run = "true";
    $el.textContent = options.waitChar;
    for (let i = 0; i <= options.text.length - 1; i++) {
      if (options.text.charAt(0) !== " ") {
        textKeys[i] = (options.moveFix + Math.round(Math.random() * options.moveRange)) * (Math.round(Math.random()) - 0.5) * 2;
      } else {
        textKeys[i] = 0;
      }
    }
    frame = 0;
    position = 0;
    currentText = "";
    clearInterval(parseInt($el.dataset.id));
    const intervalId = setInterval(stack, 1e3 / options.fps);
    $el.dataset.id = intervalId.toString();
  }
}
function ajax(url = "", method = "get", params = null, headers = null) {
  return new Promise(function(resolve, reject) {
    if (!url)
      reject("not found url");
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (!(this.readyState === 4 && this.status === 200))
        return;
      try {
        resolve(JSON.parse(this.responseText));
      } catch (e) {
        reject("parse error");
      }
    };
    xhr.open(method.toUpperCase(), url, true);
    if (headers) {
      const keys = Object.keys(headers);
      for (let i = 0; i < keys.length; i++) {
        xhr.setRequestHeader(keys[i], headers[keys[i]]);
      }
    }
    xhr.send();
  });
}
function LightBox() {
  const id = "lightbox";
  const htmlClass = "popup-lightbox";
  this.$body = null;
  function template(src, alt) {
    const template2 = document.createElement("template");
    let html = `<div id="${id}" class="lightbox">`;
    html += `<figure class="lightbox__body">`;
    html += `<img src="${src}" alt="${alt}"/>`;
    html += `</figure>`;
    html += `</div>`;
    html = html.trim();
    template2.innerHTML = html;
    return template2.content.firstChild;
  }
  this.open = function(src, alt) {
    if (!!this.$body) {
      this.$body.remove();
      this.$body = null;
    }
    this.$body = template(src, alt);
    this.$body.addEventListener("click", () => this.close());
    document.body.appendChild(this.$body);
    document.querySelector("html").classList.add(htmlClass);
  };
  this.close = function() {
    if (!this.$body)
      return;
    this.$body.remove();
    this.$body = null;
    document.querySelector("html").classList.remove(htmlClass);
  };
}
var app = /* @__PURE__ */ (() => '/*! normalize.css v8.0.0 | MIT License | github.com/necolas/normalize.css */html{line-height:1.15;-webkit-text-size-adjust:100%}body{margin:0}h1{font-size:2em;margin:.67em 0}hr{box-sizing:content-box;height:0;overflow:visible}pre{font-family:monospace,monospace;font-size:1em}a{background-color:transparent}abbr[title]{border-bottom:none;text-decoration:underline;text-decoration:underline dotted}b,strong{font-weight:bolder}code,kbd,samp{font-family:monospace,monospace;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}img{border-style:none}button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;line-height:1.15;margin:0}button,input{overflow:visible}button,select{text-transform:none}button,[type=button],[type=reset],[type=submit]{-webkit-appearance:button}button::-moz-focus-inner,[type=button]::-moz-focus-inner,[type=reset]::-moz-focus-inner,[type=submit]::-moz-focus-inner{border-style:none;padding:0}button:-moz-focusring,[type=button]:-moz-focusring,[type=reset]:-moz-focusring,[type=submit]:-moz-focusring{outline:1px dotted ButtonText}fieldset{padding:.35em .75em .625em}legend{box-sizing:border-box;color:inherit;display:table;max-width:100%;padding:0;white-space:normal}progress{vertical-align:baseline}textarea{overflow:auto}[type=checkbox],[type=radio]{box-sizing:border-box;padding:0}[type=number]::-webkit-inner-spin-button,[type=number]::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}[type=search]::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}details{display:block}summary{display:list-item}template{display:none}[hidden]{display:none}:root{--color-text-hsl: 0 0% 13%;--color-text: hsl(var(--color-text-hsl));--color-text-blur-hsl: 0 0% 47%;--color-text-blur: hsl(var(--color-text-blur-hsl));--color-key-hsl: 350 70% 41%;--color-key: hsl(var(--color-key-hsl));--color-bg-hsl: 210 25% 98%;--color-bg: hsl(var(--color-bg-hsl));--color-text-code-hsl: 233 100% 65%;--color-text-code: hsl(var(--color-text-code-hsl));--font-base: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";--font-eng: "ortsa", Helvetica, Arial, sans-serif;--font-title: "AritaBuri", sas-serif;--font-code: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace}@media (prefers-color-scheme: dark){:root{color-scheme:dark;--color-text-hsl: 0 0% 87%;--color-key-hsl: 142 76% 46%;--color-bg-hsl: 0 0% 13%;--color-text-code-hsl: 45 100% 61%}}body{margin:0;min-width:320px;font-size:1rem;line-height:1.62;-webkit-text-size-adjust:100%;text-size-adjust:100%;background:var(--color-bg);color:var(--color-text);overflow-x:hidden}body,button,input,textarea,select{font-family:var(--font-base);text-size-adjust:none}a{color:var(--color-key)}code,kbd,pre,samp{font-family:var(--font-code)}::selection{background:var(--color-key);color:#fff}main{--size-header-height: 50px}.heading-title{font-size:0;width:0;height:0;overflow:hidden;margin:0;position:absolute;visibility:hidden}.header{--color-header-fill: #222;--color-header-button-active: #eee;--color-header-bg: rgba(255,255,255,.75);--color-header-line: rgba(0,0,0,.15)}.header:before{content:"";display:block;height:var(--size-header-height)}.header__wrap{position:fixed;z-index:10;left:0;right:0;top:0;height:var(--size-header-height);background:var(--color-header-bg);user-select:none}@supports (backdrop-filter: blur(5px)){.header__wrap{backdrop-filter:blur(5px)}}.header__wrap:before{content:"";display:block;position:absolute;left:0;right:0;bottom:0;height:1px;background:var(--color-header-line);pointer-events:none;transform:scaleY(.5);transform-origin:0 100%}.header__body{display:flex;justify-content:center}.header__logo{margin:0;position:absolute;left:0;right:0;top:0;display:flex;justify-content:center}.header__logo a{position:relative;z-index:2;display:block;padding:8px;outline:none;user-select:none;cursor:pointer;-webkit-tap-highlight-color:hsla(0deg,0%,0%,0)}.header__logo img{display:block;width:68px}.header__navigation{position:absolute;top:0;bottom:0;left:0;width:var(--size-header-height);height:var(--size-header-height)}.header__navigation>button{display:block;border:none;width:100%;height:100%;background-color:#0000;transition:background-color .2s ease-out;font-size:0;outline:none;user-select:none;cursor:pointer;-webkit-tap-highlight-color:hsla(0deg,0%,0%,0)}.header__navigation>button svg{display:block;position:absolute;left:50%;top:50%;color:var(--color-header-fill);pointer-events:none;transition:transform .3s ease-out;transform-origin:50% 50%}.header__navigation>button svg:nth-child(1){transform:translate(-50%,-50%) scale(1)}.header__navigation>button svg:nth-child(2){transform:translate(-50%,-50%) scale(0)}.header__navigation>button:active{background:var(--color-header-button-active)}.header__navigation>div{position:relative;opacity:0;pointer-events:none}.header__navigation.active>button{background:var(--color-header-button-active)}.header__navigation.active>button svg:nth-child(1){transform:translate(-50%,-50%) scale(0)}.header__navigation.active>button svg:nth-child(2){transform:translate(-50%,-50%) scale(1)}.header__navigation.active>div{opacity:1;pointer-events:auto}.header__search{position:absolute;top:0;bottom:0;right:0;width:var(--size-header-height);height:var(--size-header-height)}.header__search>button{display:block;border:none;width:100%;height:100%;background:rgba(0,0,0,0);transition:background .2s ease-out;font-size:0;outline:none;user-select:none;cursor:pointer;-webkit-tap-highlight-color:hsla(0deg,0%,0%,0)}.header__search>button svg{display:block;position:absolute;left:50%;top:50%;color:var(--color-header-fill);pointer-events:none;transition:transform .3s ease-out;transform-origin:50% 50%}.header__search>button svg:nth-child(1){transform:translate(-50%,-50%) scale(1)}.header__search>button svg:nth-child(2){transform:translate(-50%,-50%) scale(0)}.header__search>button:active{background:var(--color-header-button-active)}.header__search>button.on svg{color:var(--color-key)}.header__search>div{position:relative;opacity:0;pointer-events:none}.header__search.active>button{background:var(--color-header-button-active)}.header__search.active>button svg:nth-child(1){transform:translate(-50%,-50%) scale(0)}.header__search.active>button svg:nth-child(2){transform:translate(-50%,-50%) scale(1)}.header__search.active>div{opacity:1;pointer-events:auto}@media (min-width: 768px){.header{--size-header-height: 48px}.header__wrap{display:flex}.header__logo{position:relative;width:110px;box-sizing:border-box}.header__logo a{position:absolute;left:25px;top:4px;padding:5px}.header__logo img{width:64px}.header__navigation{position:static;width:auto;height:auto;margin:0 0 0 15px}.header__navigation>button{display:none}.header__navigation>div{opacity:1;pointer-events:auto;position:static}.header__search>button{cursor:pointer}}@media (prefers-color-scheme: dark){.header{--color-header-fill: #fff;--color-header-button-active: #111;--color-header-bg: rgba(20,20,20,.75);--color-header-line: rgba(0,0,0,.2)}}.header-navigation ul{margin:0;padding:30px 0;box-sizing:border-box;list-style:none;position:fixed;left:0;right:0;display:flex;align-items:center;flex-wrap:wrap;background:var(--color-header-button-active)}.header-navigation li{position:relative;width:50%}.header-navigation a{display:block;box-sizing:border-box;padding:8px 12px 8px 24px;text-decoration:none;color:var(--color-text);font-size:14px;font-weight:600;font-family:var(--font-eng);border-radius:0;-webkit-tap-highlight-color:transparent}.header-navigation a:active{opacity:.5}.header-navigation li.on a{cursor:default;color:var(--color-key)}.header-navigation li.on a:active{opacity:1}@media (min-width: 768px){.header-navigation ul{position:static;background:none;padding:0;flex-wrap:initial}.header-navigation ul:before{display:none}.header-navigation li{position:static;width:auto}.header-navigation a{display:flex;align-items:center;margin:0;padding:0 15px;font-size:14px;font-weight:500;height:var(--size-header-height);transition:opacity .2s ease-out}.header-navigation a:hover{opacity:.5}.header-navigation li.on a:hover{opacity:1}}.header-search{--size-dropdown: 54px}.header-search form{margin:0;position:fixed;left:0;right:0;padding:0;background:var(--color-header-button-active);display:flex;align-items:center}.header-search fieldset{position:relative;margin:0;padding:0;border:none;flex:1}.header-search legend{font-size:0;width:0;height:0;margin:0;position:absolute;overflow:hidden}.header-search span{position:relative;display:block;box-sizing:border-box}.header-search span input{display:block;width:100%;height:var(--size-dropdown);box-sizing:border-box;border:none;background:none;outline:none;font-family:var(--font-eng);color:var(--color-text);padding:0 20px}.header-search span input::placeholder{color:var(--color-text-blur)}.header-search span button{position:absolute;right:-10px;top:0;display:block;width:var(--size-dropdown);height:100%;background:none;border:none;font-size:0;outline:none;transition:opacity .15s ease-out;pointer-events:none;opacity:0}.header-search span button svg{color:var(--color-text-blur);width:18px;height:18px}.header-search span button:active{opacity:.5}.header-search span.is-word input{padding-right:48px}.header-search span.is-word button{pointer-events:auto;opacity:1;cursor:pointer}.header-search button[type=submit]{position:relative;display:block;width:calc(var(--size-dropdown) - 4px);height:var(--size-dropdown);background:none;border:none;font-size:0;box-sizing:border-box;outline:none;cursor:pointer}.header-search button[type=submit]:active{opacity:.5}.header-search button[type=submit] svg{color:var(--color-header-fill)}@media (min-width: 768px){.header-search form{left:auto;width:340px;border-bottom-left-radius:4px}}.footer{padding:50px 0 20px;user-select:none}.footer__copyright{text-align:center;margin:0;font-size:11px;color:var(--color-text-blur);font-family:var(--font-eng)}@media (min-width: 768px){.footer{padding:72px 0 24px}}.container{padding:32px 0 0}@media (min-width: 768px){.container{padding:52px 0 0}}.error{padding:0;text-align:center}.error__image{margin:0}.error__image img{display:block;width:60vw;min-width:240px;margin:0 auto}.error__code{margin:10px 0 0;font-size:14px;font-family:var(--font-code);line-height:1}.error__message{margin:5px 0 0;font-size:24px;font-family:var(--font-eng);line-height:1.25}@media (min-width: 768px){.error__image img{width:40vw;max-width:400px}}.index{--index-padding: 0px;padding:var(--index-padding)}.index__header h2{margin:0 0 16px;padding:0 20px;font-family:var(--font-eng);font-size:28px;font-weight:500;letter-spacing:-.5px;text-align:center;line-height:1.25}.index__articles{--articles-column: 1;--articles-gap: 0;--articles-line: 1px solid #eee;display:grid;grid-template-columns:repeat(var(--articles-column),1fr);grid-gap:var(--articles-gap);border-top:var(--articles-line);border-bottom:var(--articles-line);box-sizing:border-box;max-width:1440px;padding:0;margin:0 auto;list-style:none}.index__empty{text-align:center;padding:10vh 0 5vh}.index__empty figure{margin:0}.index__empty figure svg{color:var(--color-key);width:100px;height:100px}.index__empty h3{margin:2px 0 0;font-size:16px;font-weight:500;font-family:var(--font-eng)}.index__paginate{user-select:none}.index__paginate .paginate{--size-paginate-item: 48px;--color-paginate-active: #e2e2e2;align-items:center;justify-content:center}.index__paginate .paginate>strong,.index__paginate .paginate>a{display:flex;align-items:center;justify-content:center;font-family:var(--font-eng);font-size:14px;line-height:1.25;font-weight:600;padding:0 8px;color:var(--color-text);min-width:var(--size-paginate-item);height:var(--size-paginate-item);box-sizing:border-box;-webkit-tap-highlight-color:transparent}.index__paginate .paginate>strong svg,.index__paginate .paginate>a svg{display:block;width:22px;height:22px}.index__paginate .paginate>a{text-decoration:none;transition:background .15s ease-out}.index__paginate .paginate>a:active{background:var(--color-paginate-active)}.index__paginate .paginate>strong{color:var(--color-key)}.index__paginate .paginate--desktop{display:none}.index__paginate .paginate--mobile{display:flex;padding:25px 0 0}@media (min-width: 768px){.index{--index-padding: 0 24px}.index__header h2{margin:0 0 16px;padding:0;font-size:36px}.index__articles{--articles-column: 2;--articles-gap: 16px;--articles-line: none;margin-top:24px;margin-bottom:24px}.index__empty{margin-top:30px;padding:12vh 0}.index__paginate .paginate{--size-paginate-item: 40px}.index__paginate .paginate--mobile{display:none}.index__paginate .paginate--desktop{display:flex;padding:30px 0 0}}@media (min-width: 1024px){.index{--index-padding: 0 64px}}@media (min-width: 1440px){.index__articles{--articles-column: 3}}@media (prefers-color-scheme: dark){.index__header h2{color:#fff}.index__articles{--articles-line: 1px solid #111}.index__paginate .paginate{--color-paginate-active: #1a1a1a}}@media (prefers-color-scheme: dark) and (min-width: 768px){.index__header nav{background:none}.index__articles{--articles-line: none}.index__empty{background:transparent}}.categories{--color-categories-bg: #ecedef;margin:-5px auto 0;padding:10px 20px;box-sizing:border-box;background:var(--color-categories-bg);user-select:none}.categories__index{margin:0 -10px;padding:0;list-style:none;display:flex;justify-content:center;flex-wrap:wrap}.categories__item{display:block}.categories__item a{display:block;padding:5px 10px;text-decoration:none;color:var(--color-text);font-size:0;font-family:var(--font-eng)}.categories__item a:active{opacity:.5}.categories__item span{font-size:12px}.categories__item em{font-style:normal;font-size:12px;margin-left:1px}.categories__item em:before{content:"("}.categories__item em:after{content:")"}.categories__item.on a{color:var(--color-key);cursor:default;text-decoration:underline}.categories__item.on a:active{opacity:1}@media (min-width: 768px){.categories{--color-categories-bg: none;margin-top:-12px;padding:0}.categories__index{margin:0 -8px}.categories__item a{padding:4px 8px}.categories__item a:hover{opacity:.5}.categories__item.on a:hover{opacity:1}}@media (prefers-color-scheme: dark){.categories{--color-categories-bg: #111}}.index-article{--size-article-item-height: 100px;--size-article-radius: 0;position:relative;margin:0;box-sizing:border-box;min-width:0}.index-article:nth-child(n+2){border-top:var(--articles-line)}.index-article__wrap{display:flex;align-items:center;height:var(--size-article-item-height);background:#fff;text-decoration:none;border-radius:var(--size-article-radius);box-sizing:border-box;transition:background .2s ease-out;-webkit-tap-highlight-color:transparent}.index-article__wrap:active{background:#f4f4f4}.index-article__image{position:relative;margin:0;width:var(--size-article-item-height);height:100%;background:#fafafa}.index-article__image>img{display:block;width:100%;height:100%;object-fit:cover}.index-article__image>svg{--size-article-item-empty-icon: 34px;position:absolute;display:block;left:50%;top:50%;width:var(--size-article-item-empty-icon);height:var(--size-article-item-empty-icon);user-select:none;transform:translate(-50%,-50%);color:var(--color-text-blur);opacity:.75}.index-article__body{flex:1;min-width:0;padding:0 16px}.index-article__body strong{display:block;font-size:14px;color:var(--color-text);font-weight:600;overflow:hidden;line-height:18px;text-overflow:ellipsis;white-space:nowrap}.index-article__body p{margin:2px 0 0;font-size:0;display:flex;align-items:center}.index-article__body p span{display:flex;align-items:center;font-family:var(--font-eng);font-size:11px;color:var(--color-text-blur);font-weight:400}.index-article__body p span:nth-child(n+2):before{content:", ";display:block;margin:0 5px 0 0}.index-article__body p em{font-style:normal}.index-article__body p em:nth-child(n+2):before{content:"/";padding:0 2px}@media (min-width: 768px){.index-article{--size-article-radius: 2px}.index-article__wrap{position:relative;box-shadow:0 3px 20px #0000001a;overflow:hidden}.index-article__wrap:after{content:"";position:absolute;left:0;right:0;top:0;bottom:0;pointer-events:none;border:1px solid var(--color-key);opacity:0;transition:opacity .15s ease-out;border-radius:var(--size-article-radius)}.index-article__wrap:hover:after{opacity:1}.index-article__wrap:active{background:none}.index-article__image>span{background:#ccc}.index-article__image>span>img{opacity:.1}.index-article__body{padding:0 20px}}@media (prefers-color-scheme: dark){.index-article__wrap{background:#2e2e2e}.index-article__wrap:active{background:#222}.index-article__image{background:#000}.index-article__image>span{background:#444}.index-article__image>span>img{opacity:.3}}@media (prefers-color-scheme: dark) and (min-width: 768px){.index-article__wrap:active{background:#2e2e2e}}.redgoose-body{--color-text: #222;--color-text-key: #b31f37;--color-text-title: #111;--color-text-code: #4f64ff;--color-content-bg: #f3f4f5;--color-content-line: #ddd;--color-blockqueote-bg: rgb(0 0 0 / 10%);--size-text: 1rem;--size-text-length: 1.75;--size-margin-vertical: 2rem;font-size:var(--size-text);line-height:var(--size-text-length);color:var(--color-text)}.redgoose-body h1,.redgoose-body h2,.redgoose-body h3,.redgoose-body h4,.redgoose-body h5,.redgoose-body h6{line-height:1.25;font-weight:600;color:var(--color-text-title)}.redgoose-body h1,.redgoose-body h2{margin:2.5rem 0 1.5rem;font-weight:800}.redgoose-body h3,.redgoose-body h4{margin:2rem 0 1.25rem;font-weight:700}.redgoose-body h5,.redgoose-body h6{margin:1.5rem 0 1rem}.redgoose-body h1{font-size:2em;letter-spacing:-1px}.redgoose-body h2{font-size:1.75em;letter-spacing:-.75px}.redgoose-body h3{font-size:1.5em;letter-spacing:-.5px}.redgoose-body h4{font-size:1.25em;letter-spacing:-.25px}.redgoose-body h5{font-size:1em}.redgoose-body h6{font-size:.9375em}.redgoose-body p{margin:var(--size-margin-vertical) 0}.redgoose-body ul,.redgoose-body ol{margin:var(--size-margin-vertical) 0;padding-left:1.125rem}.redgoose-body ul li,.redgoose-body ol li{margin:.25rem 0}.redgoose-body a{color:var(--color-text-key)}.redgoose-body picture,.redgoose-body img{display:block;margin:calc(var(--size-margin-vertical) * 2.5) auto var(--size-margin-vertical);max-width:100%}.redgoose-body h1+*>img:first-child,.redgoose-body h1+*>picture:first-child,.redgoose-body h1+img,.redgoose-body h1+picture,.redgoose-body h2+*>img:first-child,.redgoose-body h2+*>picture:first-child,.redgoose-body h2+img,.redgoose-body h2+picture,.redgoose-body h3+*>img:first-child,.redgoose-body h3+*>picture:first-child,.redgoose-body h3+img,.redgoose-body h3+picture{margin-top:1rem}.redgoose-body picture>img{margin:0 auto}.redgoose-body hr{--size: 1.25em;display:block;margin:calc(var(--size-margin-vertical) * 2.5) 0;padding:0 0 calc(var(--size) * .5);border:none}.redgoose-body hr:after{content:"...";position:relative;display:block;top:calc(var(-1) * var(--size) * .5);text-align:center;font-family:Georgia,Cambria,Times New Roman,Times,serif;font-size:var(--size);text-indent:calc(var(--size) * .5);letter-spacing:8px;font-weight:800;line-height:1;color:var(--color-text)}.redgoose-body table{margin:var(--size-margin-vertical) 0;border-collapse:collapse;font-size:.875em;box-sizing:border-box}.redgoose-body table th,.redgoose-body table td{padding:.5rem 1rem;border:1px solid var(--color-content-line);box-sizing:border-box}.redgoose-body table thead th,.redgoose-body table thead td{background-color:var(--color-content-bg)}.redgoose-body table tbody td{word-break:keep-all;word-wrap:break-word}.redgoose-body a{word-break:break-all}.redgoose-body code{word-break:break-word;font-size:92.5%;color:var(--color-text-code)}.redgoose-body pre{margin:var(--size-margin-vertical) 0;padding:1rem;background:var(--color-content-bg);font-size:.9375em;line-height:1.5;overflow:auto;-webkit-overflow-scrolling:touch;border-radius:2px}.redgoose-body pre::-webkit-scrollbar{width:4px;height:4px}.redgoose-body pre::-webkit-scrollbar-track{background:transparent}.redgoose-body pre::-webkit-scrollbar-thumb{background:rgba(0,0,0,.3);border-radius:4px}.redgoose-body pre::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,.4)}html[data-theme=dark] .redgoose-body pre::-webkit-scrollbar-thumb{background:rgba(255,255,255,.2)}html[data-theme=dark] .redgoose-body pre::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,.3)}@media (prefers-color-scheme: dark){html[data-theme=system] .redgoose-body pre::-webkit-scrollbar-thumb,html:not([data-theme]) .redgoose-body pre::-webkit-scrollbar-thumb,html[data-theme=""] .redgoose-body pre::-webkit-scrollbar-thumb{background:rgba(255,255,255,.2)}html[data-theme=system] .redgoose-body pre::-webkit-scrollbar-thumb:hover,html:not([data-theme]) .redgoose-body pre::-webkit-scrollbar-thumb:hover,html[data-theme=""] .redgoose-body pre::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,.3)}}.redgoose-body pre>code{margin:0;padding:0;background:none;white-space:pre;border-radius:0;color:var(--color-text-base);font-size:1em}.redgoose-body input[type=checkbox]{margin-right:3px}.redgoose-body iframe{display:block;margin:var(--size-margin-vertical) auto;max-width:100%}.redgoose-body .iframe{position:relative;margin:var(--size-margin-vertical) 0;aspect-ratio:var(--size-aspect-ratio, 16/9)}.redgoose-body .iframe>iframe{width:100%;height:100%}.redgoose-body embed{display:block;max-width:100%;margin:var(--size-margin-vertical) auto;background:var(--color-content-bg)}.redgoose-body blockquote{position:relative;margin:var(--size-margin-vertical) 0;padding:1rem 1rem 1rem calc(1rem + var(--blockquote-size, 6px));box-shadow:inset 0 0 0 1px var(--color-content-line);box-sizing:border-box;background-color:var(--color-blockqueote-bg)}.redgoose-body blockquote:before{content:"";display:block;position:absolute;left:0;right:0;top:0;bottom:0;border:1px solid rgba(0,0,0,.025);pointer-events:none}.redgoose-body blockquote:after{content:"";position:absolute;left:0;top:0;bottom:0;width:var(--blockquote-size, 6px);background:var(--color-text-key)}.redgoose-body blockquote p,.redgoose-body blockquote pre,.redgoose-body blockquote table,.redgoose-body blockquote ul,.redgoose-body blockquote ol{margin:calc(var(--size-margin-vertical) * .5) 0}.redgoose-body blockquote *:first-child{margin-top:0}.redgoose-body blockquote *:last-child{margin-bottom:0}.redgoose-body>*:first-child{margin-top:0}.redgoose-body>*:first-child *:first-child{margin-top:0}.redgoose-body>*:last-child{margin-bottom:0}.redgoose-body>*:last-child *:last-child{margin-bottom:0}html[data-theme=dark] .redgoose-body--dark{--color-text: #d4d4d4;--color-text-key: #1ccd5c;--color-text-title: #fff;--color-text-code: #ffcd3a;--color-content-bg: #1a1a1a;--color-content-line: #383838;--color-blockqueote-bg: rgb(0 0 0 / 15%)}@media (prefers-color-scheme: dark){html[data-theme=system] .redgoose-body--dark,html:not([data-theme]) .redgoose-body--dark,html[data-theme=""] .redgoose-body--dark{--color-text: #d4d4d4;--color-text-key: #1ccd5c;--color-text-title: #fff;--color-text-code: #ffcd3a;--color-content-bg: #1a1a1a;--color-content-line: #383838;--color-blockqueote-bg: rgb(0 0 0 / 15%)}}@media (min-width: 1280px) and (-webkit-min-device-pixel-ratio: 2){.redgoose-body img{zoom:.75}}.article{--size-article-side-padding: 24px;--color-article-like-step-1: #EB6635;--color-article-like-step-2: #B31E36;--color-article-like-step-3: #3422FF;margin:0;padding:20px var(--size-article-side-padding) 0;box-sizing:border-box}.article__header{text-align:center}.article__header h1{margin:0;font-size:1.75rem;line-height:1.15;letter-spacing:-.5px;word-break:break-all;font-family:var(--font-title);font-weight:600}.article__header p{margin:2px 0 0;font-size:0}.article__header p span{display:inline-block;font-size:11px;color:var(--color-text-blur);font-family:var(--font-eng)}.article__header p span:nth-child(n+2):before{content:", "}.article__content{margin:30px 0 0}.article__content.redgoose-body h1:target,.article__content.redgoose-body h2:target,.article__content.redgoose-body h3:target,.article__content.redgoose-body h4:target,.article__content.redgoose-body h5:target,.article__content.redgoose-body h6:target{scroll-margin-top:calc(var(--size-header-height) + 30px)}.article__nav{margin:32px 0 0;text-align:center;display:flex;justify-content:center;align-items:flex-start;user-select:none}.article__nav .wrap{position:relative;box-sizing:border-box;font-size:0}.article__nav .like{display:block;margin:0 auto;padding:10px;border:none;background:transparent;font-size:0;-webkit-tap-highlight-color:transparent;cursor:pointer;outline:none;width:90px;height:90px;border-radius:50%;transition:box-shadow .1s ease-out,background-color .25s ease-out;user-select:none}.article__nav .like span{display:block}.article__nav .like svg{display:block;margin:0 auto;width:38px;height:38px;transition:transform .3s cubic-bezier(.24,1.35,.8,1.22)}.article__nav .like svg .step-1{color:var(--color-article-like-step-1)}.article__nav .like svg .step-2{color:var(--color-article-like-step-2)}.article__nav .like svg .step-3{color:var(--color-article-like-step-3)}.article__nav .like em{display:block;margin:0;font-style:normal;font-family:var(--font-eng);font-size:11px;font-weight:400;color:var(--color-text-blur);transition:opacity .15s ease-out}.article__nav .like.on,.article__nav .like:disabled{cursor:default;--color-article-like-step-1: #ddd;--color-article-like-step-2: #bbb;--color-article-like-step-3: #aaa}.article__nav .like.on:focus,.article__nav .like:disabled:focus{outline:none}.article__nav .like.on:active svg,.article__nav .like:disabled:active svg{transform:none}.article__nav .like:active,.article__nav .like:focus{background:rgba(0,0,0,.05)}.article__nav .like:active svg,.article__nav .like:focus svg{transform:scale(1.4) translateY(6px)}.article__nav .like:active em,.article__nav .like:focus em{opacity:0}.article__nav .like:disabled:active{background:none}.article__nav .like:disabled:active em{opacity:1}@media (min-width: 768px){.article{--size-article-side-padding: 62px;padding-top:15px}.article__header h1{font-size:40px}.article__header p{margin-top:6px}.article__content{margin:50px auto 0;max-width:768px}.article__nav{margin-top:50px}}@media (prefers-color-scheme: dark){.article{--color-article-like-step-1: #8ef01f;--color-article-like-step-2: var(--color-key);--color-article-like-step-3: #033615}.article__header h1{color:#fff}.article__nav .like:disabled{--color-article-like-step-1: #666;--color-article-like-step-2: #444;--color-article-like-step-3: #333}.article__nav .like:active,.article__nav .like:focus{background:rgba(0,0,0,.15)}}.comments{margin:40px 0 0}.comments__title{margin:0;font-size:0}.comments__index{margin:0;padding:0;list-style:none}.comments__index>li:nth-child(n+2){margin-top:1rem}@media (min-width: 768px){.comments{margin:72px auto 0;max-width:768px}.comments__index>li:nth-child(n+2){margin-top:1.5rem}}.comment{padding:24px;border-radius:4px;box-sizing:border-box;background-color:hsl(var(--color-text-hsl)/5%);transition:box-shadow .2s ease-out}@media (hover: hover){.comment:hover{box-shadow:0 0 0 .5px hsl(var(--color-key-hsl)/100%)}}.comment:target{scroll-margin-top:calc(var(--size-header-height) + 30px)}.comment__body{font-size:15px;line-height:1.62}.comment__body p{margin:1rem 0}.comment__bottom{display:flex;justify-content:space-between;align-items:center;margin:24px 0 0}.comment__bottom em{display:block;font-family:var(--font-eng);font-size:12px;color:var(--color-text-blur);font-style:normal}.comment__bottom a{display:block;margin:-10px;padding:10px;border:none;background:none;box-sizing:border-box;outline:none;user-select:none;cursor:pointer;-webkit-tap-highlight-color:hsla(0deg,0%,0%,0)}.comment__bottom a:active{opacity:.6}.comment__bottom a svg{display:block;width:18px;height:18px;stroke-width:1.5;color:hsl(var(--color-text-blur-hsl))}.comment .redgoose-body{--size-margin-vertical: 1.25rem}.comment .redgoose-body pre{background:#dfdfdf}.comment .redgoose-body img{position:static;left:unset;max-width:100%;transform:none}@media (prefers-color-scheme: dark){.comment{background:#2c2c2c}.comment .redgoose-body pre{background:#222}}.redgoose-body h1,.redgoose-body h2,.redgoose-body h3,.redgoose-body h4,.redgoose-body h5,.redgoose-body h6{font-family:var(--font-title);font-weight:400}.redgoose-body h1 .anchor,.redgoose-body h2 .anchor,.redgoose-body h3 .anchor,.redgoose-body h4 .anchor,.redgoose-body h5 .anchor,.redgoose-body h6 .anchor{display:none}.redgoose-body img{display:block;position:relative;left:50%;max-width:100vw;transform:translate(-50%);transform-origin:50% 50%;margin:calc(var(--size-margin-vertical) * 2.5) 0 var(--size-margin-vertical);transition:opacity .2s ease-out;cursor:pointer}.redgoose-body img:active{opacity:.75}.redgoose-body .grid-item{--grid-item-columns: 1;--grid-item-gap: 10px;position:relative;display:grid;grid-template-columns:repeat(var(--grid-item-columns, 1),1fr);grid-gap:var(--grid-item-gap);margin:calc(var(--size-margin-vertical) * 2.5) auto var(--size-margin-vertical);left:50%;transform:translate(-50%);width:100vw;max-width:1280px;transform-origin:50% 50%}.redgoose-body .grid-item>p{position:relative;margin:0;box-sizing:border-box;padding-top:var(--padding-top, 100%);grid-column:var(--grid-column, auto)}.redgoose-body .grid-item>p>img{position:absolute;margin:0;left:0;top:0;width:100%;height:100%;max-width:none;max-height:none;transform:none;box-sizing:border-box;object-fit:cover}.redgoose-body .grid-item[data-mobile="1"]{--grid-item-columns: 1}.redgoose-body .grid-item>p[col="1"]{--grid-column: span 1;--padding-top:100%}.redgoose-body .grid-item[data-mobile="2"]{--grid-item-columns: 2}.redgoose-body .grid-item>p[col="2"]{--grid-column: span 2;--padding-top:50%}.redgoose-body .grid-item[data-mobile="3"]{--grid-item-columns: 3}.redgoose-body .grid-item>p[col="3"]{--grid-column: span 3;--padding-top: calc(100% / 3)}.redgoose-body .grid-item[data-mobile="4"]{--grid-item-columns: 4}.redgoose-body .grid-item>p[col="4"]{--grid-column: span 4;--padding-top:25%}.redgoose-body .grid-item[data-mobile="5"]{--grid-item-columns: 5}.redgoose-body .grid-item>p[col="5"]{--grid-column: span 5;--padding-top:20%}.redgoose-body .grid-item[data-mobile="6"]{--grid-item-columns: 6}.redgoose-body .grid-item>p[col="6"]{--grid-column: span 6;--padding-top: calc(100% / 6)}@media (min-width: 768px){.redgoose-body .grid-item[data-tablet="1"]{--grid-item-columns: 1}.redgoose-body .grid-item>p[col-tablet="1"]{--grid-column: span 1;--padding-top:100%}.redgoose-body .grid-item[data-tablet="2"]{--grid-item-columns: 2}.redgoose-body .grid-item>p[col-tablet="2"]{--grid-column: span 2;--padding-top:50%}.redgoose-body .grid-item[data-tablet="3"]{--grid-item-columns: 3}.redgoose-body .grid-item>p[col-tablet="3"]{--grid-column: span 3;--padding-top: calc(100% / 3)}.redgoose-body .grid-item[data-tablet="4"]{--grid-item-columns: 4}.redgoose-body .grid-item>p[col-tablet="4"]{--grid-column: span 4;--padding-top:25%}.redgoose-body .grid-item[data-tablet="5"]{--grid-item-columns: 5}.redgoose-body .grid-item>p[col-tablet="5"]{--grid-column: span 5;--padding-top:20%}.redgoose-body .grid-item[data-tablet="6"]{--grid-item-columns: 6}.redgoose-body .grid-item>p[col-tablet="6"]{--grid-column: span 6;--padding-top: calc(100% / 6)}}@media (min-width: 1024px){.redgoose-body .grid-item{width:90vw}.redgoose-body .grid-item[data-desktop="1"]{--grid-item-columns: 1}.redgoose-body .grid-item>p[col-desktop="1"]{--grid-column: span 1;--padding-top:100%}.redgoose-body .grid-item[data-desktop="2"]{--grid-item-columns: 2}.redgoose-body .grid-item>p[col-desktop="2"]{--grid-column: span 2;--padding-top:50%}.redgoose-body .grid-item[data-desktop="3"]{--grid-item-columns: 3}.redgoose-body .grid-item>p[col-desktop="3"]{--grid-column: span 3;--padding-top: calc(100% / 3)}.redgoose-body .grid-item[data-desktop="4"]{--grid-item-columns: 4}.redgoose-body .grid-item>p[col-desktop="4"]{--grid-column: span 4;--padding-top:25%}.redgoose-body .grid-item[data-desktop="5"]{--grid-item-columns: 5}.redgoose-body .grid-item>p[col-desktop="5"]{--grid-column: span 5;--padding-top:20%}.redgoose-body .grid-item[data-desktop="6"]{--grid-item-columns: 6}.redgoose-body .grid-item>p[col-desktop="6"]{--grid-column: span 6;--padding-top: calc(100% / 6)}}@media (min-width: 1440px){.redgoose-body .grid-item[data-desktop-large="1"]{--grid-item-columns: 1}.redgoose-body .grid-item>p[col-desktop-large="1"]{--grid-column: span 1;--padding-top:100%}.redgoose-body .grid-item[data-desktop-large="2"]{--grid-item-columns: 2}.redgoose-body .grid-item>p[col-desktop-large="2"]{--grid-column: span 2;--padding-top:50%}.redgoose-body .grid-item[data-desktop-large="3"]{--grid-item-columns: 3}.redgoose-body .grid-item>p[col-desktop-large="3"]{--grid-column: span 3;--padding-top: calc(100% / 3)}.redgoose-body .grid-item[data-desktop-large="4"]{--grid-item-columns: 4}.redgoose-body .grid-item>p[col-desktop-large="4"]{--grid-column: span 4;--padding-top:25%}.redgoose-body .grid-item[data-desktop-large="5"]{--grid-item-columns: 5}.redgoose-body .grid-item>p[col-desktop-large="5"]{--grid-column: span 5;--padding-top:20%}.redgoose-body .grid-item[data-desktop-large="6"]{--grid-item-columns: 6}.redgoose-body .grid-item>p[col-desktop-large="6"]{--grid-column: span 6;--padding-top: calc(100% / 6)}}@media (max-width: 320px){.redgoose-body .grid-item{max-width:100%;transform:none;left:auto}}.redgoose-body .grid-item:first-child{margin-top:0}.redgoose-body .grid-item:last-child{margin-bottom:0}.redgoose-body .grid-group{margin:calc(var(--size-margin-vertical) * 2.5) auto var(--size-margin-vertical)}.redgoose-body .grid-group>.grid-item{margin-top:var(--grid-item-gap);margin-bottom:var(--grid-item-gap)}.redgoose-body .grid-group>.grid-item:first-child{margin-top:0}.redgoose-body .grid-group>.grid-item:last-child{margin-bottom:0}@media (min-width: 768px){.redgoose-body h1,.redgoose-body h2,.redgoose-body h3,.redgoose-body h4,.redgoose-body h5,.redgoose-body h6{position:relative}.redgoose-body h1 .anchor,.redgoose-body h2 .anchor,.redgoose-body h3 .anchor,.redgoose-body h4 .anchor,.redgoose-body h5 .anchor,.redgoose-body h6 .anchor{display:block;position:absolute;left:-42px;top:50%;opacity:0;transition:opacity .1s ease-out;transform:translateY(-50%);padding:10px;box-sizing:border-box}.redgoose-body h1 .anchor svg,.redgoose-body h2 .anchor svg,.redgoose-body h3 .anchor svg,.redgoose-body h4 .anchor svg,.redgoose-body h5 .anchor svg,.redgoose-body h6 .anchor svg{display:block;width:20px;aspect-ratio:1/1;color:hsl(var(--color-text-blur-hsl));stroke-width:1.75}}@media (min-width: 768px) and (hover: hover){.redgoose-body h1:hover .anchor,.redgoose-body h2:hover .anchor,.redgoose-body h3:hover .anchor,.redgoose-body h4:hover .anchor,.redgoose-body h5:hover .anchor,.redgoose-body h6:hover .anchor{opacity:1}}@media (min-width: 1024px){.redgoose-body img{max-width:1024px}}@media (min-width: 1024px) and (-webkit-min-device-pixel-ratio: 2){.redgoose-body img{zoom:.75}}@media (min-width: 1440px){.redgoose-body img{max-width:1440px}}@media (max-width: 320px){.redgoose-body img{max-width:100%}}html.popup-lightbox,html.popup-lightbox>body{overflow:hidden}.lightbox{position:fixed;z-index:99999;left:0;right:0;top:0;bottom:0;background:rgba(255,255,255,.75);cursor:zoom-out}@supports (backdrop-filter: blur(10px)){.lightbox{background:rgba(255,255,255,.75);backdrop-filter:blur(10px)}}.lightbox__body{margin:0;display:flex;align-items:center;justify-content:center;width:100%;height:100%;box-sizing:border-box;padding:0}.lightbox__body img{display:block;max-width:100%;max-height:100%;box-sizing:border-box;object-fit:contain;background:var(--color-bg)}@media (prefers-color-scheme: dark){.lightbox{background:rgba(0,0,0,.75)}}@media (min-width: 1024px){.lightbox__body{padding:40px}}@media (min-width: 1024px) and (-webkit-min-device-pixel-ratio: 2){.lightbox__body img{zoom:.75}}\n')();
class RedgooseApp {
  constructor() {
    this.initialHeaderEvents();
  }
  initialHeaderEvents() {
    this.headerElements = {
      navigation: document.getElementById("headerNavigation"),
      search: document.getElementById("headerSearch"),
      searchForm: document.getElementById("search_keyword")
    };
    const self = this;
    const navigation = this.headerElements.navigation.children[0];
    const search = this.headerElements.search.children[0];
    navigation.addEventListener("click", function(e) {
      self.headerElements.search.classList.remove("active");
      e.currentTarget.parentNode.classList.toggle("active");
      e.currentTarget.parentNode.querySelector(".dropdown-content").classList.toggle("active");
    });
    search.addEventListener("click", function(e) {
      self.headerElements.navigation.classList.remove("active");
      e.currentTarget.parentNode.classList.toggle("active");
      e.currentTarget.parentNode.querySelector(".dropdown-content").classList.toggle("active");
      if (e.currentTarget.parentNode.classList.contains("active")) {
        e.currentTarget.parentNode.querySelector("input[type=text]").focus();
      }
    });
    const searchInput = this.headerElements.searchForm.q;
    if (searchInput.value.length) {
      searchInput.parentNode.classList.add("is-word");
      search.parentNode.classList.add("active-bg");
    }
    searchInput.addEventListener("keyup", function(e) {
      if (searchInput.value.length) {
        searchInput.parentNode.classList.add("is-word");
        search.parentNode.classList.add("active-bg");
      } else {
        searchInput.parentNode.classList.remove("is-word");
        search.parentNode.classList.remove("active-bg");
      }
    });
    const searchReset = this.headerElements.searchForm.querySelector("button[type=reset]");
    searchReset.addEventListener("click", function(e) {
      e.preventDefault();
      searchInput.value = "";
      searchInput.parentNode.classList.remove("is-word");
      search.parentNode.classList.remove("active-bg");
      searchInput.focus();
    });
    window.addEventListener("click", function(e) {
      if (!e.target.matches(".dropdown-button")) {
        if (!!e.target.closest(".dropdown-content"))
          return;
        const dropdowns = document.getElementsByClassName("dropdown-content");
        for (let i = 0; i < dropdowns.length; i++) {
          let openDropdown = dropdowns[i];
          if (openDropdown.classList.contains("active")) {
            openDropdown.parentNode.classList.remove("active");
            openDropdown.classList.remove("active");
          }
        }
      }
    });
  }
  initialArticle() {
    this.articleElements = {
      main: document.getElementById("article"),
      content: document.getElementById("article_content"),
      buttonLike: document.getElementById("button_like"),
      comments: document.getElementById("comments")
    };
    this.articleElements.buttonLike.addEventListener("click", async (e) => {
      const button = e.currentTarget;
      let srl = parseInt(button.dataset.srl);
      button.setAttribute("disabled", true);
      button.classList.add("on");
      let em = button.querySelector("em");
      let cnt = parseInt(em.textContent);
      em.innerHTML = String(cnt + 1);
      ajax(`/on-like/${srl}/`, "post", null).then((res) => {
        if (!res.success)
          throw new Error();
        em.innerHTML = String(res.star);
      }).catch((e2) => {
        alert("Failed update like");
        button.removeAttribute("disabled");
        button.classList.remove("on");
        em.innerHTML = String(cnt);
      });
    });
    const lightbox = new LightBox();
    setImagesEvent(this.articleElements.content.querySelectorAll("img"));
    if (this.articleElements.comments) {
      setImagesEvent(this.articleElements.comments.querySelectorAll(".comment__body img"));
    }
    setHeadings(this.articleElements.content.querySelectorAll("h1,h2,h3,h4,h5,h6"));
    function setImagesEvent($elements) {
      $elements.forEach(($el) => {
        $el.addEventListener("click", (e) => {
          if (!e.target.src)
            return;
          lightbox.open(e.target.src, e.target.name);
        });
      });
    }
    function setHeadings($elements) {
      const { origin, pathname } = location;
      $elements.forEach(($el) => {
        let text = $el.innerText.replace(/\s+/g, "-").toLowerCase();
        const el = document.createElement("a");
        el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`;
        el.href = `${origin}${pathname}#${text}`;
        el.className = "anchor";
        $el.insertBefore(el, $el.firstChild);
      });
    }
  }
  initialArticles() {
    const $items = document.querySelectorAll(".index-article__wrap");
    $items.forEach((o) => {
      o.addEventListener("mouseenter", (e) => {
        if (window.innerWidth < 768)
          return true;
        const bd = ".index-article__body";
        const $elements = e.target.querySelectorAll(`${bd} > strong, ${bd} > p > span:first-child, ${bd} > p > span:nth-child(2) > em`);
        $elements.forEach((o2, k) => {
          let time = 0;
          switch (k) {
            case 0:
              time = 0;
              break;
            case 1:
              time = 120;
              break;
            case 2:
              time = 180;
              break;
            case 3:
              time = 180;
              break;
          }
          setTimeout(() => shuffle(o2, {
            text: o2.innerText,
            pattern: "abcdefghijklmnopqrstuvwxyz0123456789-_!@#$%^&*()+~<>\u3131\u3134\u3137\u3139\u3141\u3142\u3145\u3147\u3148\u314A\u314B\u314C\u314D\u314E\u3132\u3138\u3143\u3146\u3149",
            randomTextType: k === 0 ? "pattern" : "unicode"
          }), time);
        });
      });
    });
  }
}
export { RedgooseApp as default };
