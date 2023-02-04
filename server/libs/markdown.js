import { marked, Renderer } from 'marked'

/**
 * parsing content
 *
 * @param {string} src
 * @return {string}
 */
export function parsingContent(src)
{
  const renderer = new Renderer()
  renderer.heading = (text, level, raw) => {
    const id = text.replace(/\s+/g, '_')
    return `<h${level} id="${id}">${text}</h${level}>`
  }
  renderer.image = (href, title, text) => {
    return `<img src="${href}" alt="${title || text}" loading="lazy"/>`
  }
  renderer.link = (href, title, text) => {
    const _target = /^http/.test(href) ? ' target="_blank"' : ''
    const _title = title ? ` title="${title}"` : ''
    return `<a href="${href}"${_target}${_title}>${text}</a>`
  }
  return marked.parse(src, {
    renderer,
  })
}
