<li id={`c${srl}`} class="comment">
  <ContentBody
    body={_contentBody}
    on:openLightbox={onOpenLightbox}/>
  <div class="comment__meta">
    <em>Written on {date}</em>
    <a href={`#c${srl}`}>
      <Icon name="link"/>
    </a>
  </div>
</li>

<script lang="ts">
import { Icon } from '../../icons'
import ContentBody from './content-body.svelte'

export let srl: number
export let content: string
export let date: string

$: _contentBody = content

function onOpenLightbox({ detail: { src, alt } }): void
{
  console.log('onOpenLightbox()')
}
</script>

<style src="./comment.scss" lang="scss"></style>
