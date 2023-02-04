<div
  class="redgoose-body redgoose-body--dark"
  aria-hidden="true"
  on:click={onClickBody}>
  {#if _body}
    {@html _body}
  {/if}
</div>

<script lang="ts">
import { createEventDispatcher } from 'svelte'
import { marked, Renderer } from 'marked'
import hljs from 'highlight.js'
import { ICON_SHARP } from '../../../libs/assets'
import 'highlight.js/styles/github-dark.css'

const dispatch = createEventDispatcher()
export let body: string = undefined

$: _body = parsingMarkdown()

function onClickBody(e): void
{
  let _target: HTMLElement = e.target
  switch (_target.tagName?.toLowerCase())
  {
    case 'img':
      dispatch('openLightbox', {
        src: (_target as HTMLImageElement).src,
        alt: (_target as HTMLImageElement).alt,
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
  return marked.parse(body, {
    renderer,
    gfm: true,
    breaks: true,
    langPrefix: 'hljs language-',
    highlight: function(code, lang) {
      const language = (hljs as any).getLanguage(lang) ? lang : 'plaintext'
      return hljs.highlight(code, { language }).value
    },
  })
}
</script>

<style src="./content-body.scss" global lang="scss"></style>
