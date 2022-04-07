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
function ajax(url = null, method = "get", params = null, headers = null) {
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
var app = "";
class Redgoose {
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
      buttonLike: document.getElementById("button_like")
    };
    this.articleElements.buttonLike.addEventListener("click", (e) => {
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
    const $images = this.articleElements.content.querySelectorAll("img");
    $images.forEach((o) => {
      o.addEventListener("click", (e) => {
        if (!e.target.src)
          return;
        lightbox.open(e.target.src, e.target.name);
      });
    });
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
export { Redgoose as default };
