<li class="item">
  <a
    href={`/article/${srl}/`}
    class="item__wrap"
    on:mouseenter={onEnterItem}>
    <figure class="item__image">
      {#if image}
        <img src={image} alt={title} loading="lazy"/>
      {:else}
        <i>
          <EmptyIcon/>
        </i>
      {/if}
    </figure>
    <div class="item__body">
      <strong bind:this={elements[0]}>{title}</strong>
      <p bind:this={elements[1]}>{_description}</p>
    </div>
  </a>
</li>

<script lang="ts">
import shuffle from 'auto-writer/src/shuffle'
import { EmptyIcon } from '../../icons'

let elements = []
export let srl: number
export let image: string
export let title: string
export let date: string
export let nest: string
export let category: string

$: _description = computedDescription()

function onEnterItem(): void
{
  if (window.innerWidth < 768) return
  elements.forEach((el, k) => {
    setTimeout(() => shuffle(el, {
      text: el.innerText,
      pattern: 'abcdefghijklmnopqrstuvwxyz0123456789-_!@#$%^&*()+~<>ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎㄲㄸㅃㅆㅉ',
      randomTextType: k === 0 ? 'pattern' : 'unicode',
    }), 180 * k);
  })
}

function computedDescription(): string
{
  return [
    date && date,
    nest && nest,
    category && category,
  ].filter(Boolean).join(' / ')
}
</script>

<style src="./item.scss" lang="scss"></style>
