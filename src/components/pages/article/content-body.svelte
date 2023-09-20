<div
  class="redgoose-body redgoose-body--dark"
  aria-hidden="true"
  on:click={onClickBody}>
  {#if _body}
    {@html _body}
  {/if}
</div>

<script>
import { createEventDispatcher } from 'svelte'
import { Marked, Renderer } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js'
import { ICON_SHARP } from '../../../libs/assets'
import 'highlight.js/styles/github-dark.css'

const dispatch = createEventDispatcher()
export let body = undefined

// setup marked
const marked = new Marked({
  gfm: true,
  breaks: true,
  silent: true,
})
marked.use(markedHighlight({
  langPrefix: 'hljs language-',
  highlight: function(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext'
    return hljs.highlight(code, { language }).value
  },
}))

$: _body = parsingMarkdown()

function onClickBody(e)
{
  let _target = e.target
  switch (_target.tagName?.toLowerCase())
  {
    case 'img':
      dispatch('openLightbox', {
        src: _target.src,
        alt: _target.alt,
      })
      break
    case 'goose-dark-mode-image':
      dispatch('openLightbox', {
        src: _target.getAttribute('src-light'),
        srcDark: _target.getAttribute('src-dark'),
        alt: _target.getAttribute('alt'),
      })
      break
  }
}

function parsingMarkdown()
{
  if (!body) return null
  const renderer = new Renderer()
  renderer.heading = (text, level, raw) => {
    const id = text.replace(/\s+/g, '_')
    return `<h${level} id="${id}"><a href="#${id}" class="anchor">${ICON_SHARP}</a>${text}</h${level}>`
  }
  renderer.image = (href, title, text) => {
    return `<img src="${href}" alt="${title || text}" loading="lazy"/>`
  }
  renderer.link = (href, title, text) => {
    const _target = /^http/.test(href) ? ' target="_blank"' : ''
    const _title = title ? ` title="${title}"` : ''
    return `<a href="${href}"${_target}${_title}>${text}</a>`
  }
  marked.use({ renderer })
  return marked.parse(body)
}
</script>

<style src="./content-body.scss" lang="scss"></style>
