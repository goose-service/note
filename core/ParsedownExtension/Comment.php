<?php
namespace Core\ParsedownExtension;
use Parsedown;

/**
 * ParsedownExtension Comment
 * 댓글용 마크다운 파서 확장
 */
class Comment extends Parsedown
{

  protected function inlineImage($excerpt): ?array
  {
    $image = parent::inlineImage($excerpt);
    if (!($image ?? false)) return null;
    $image['element']['attributes']['loading'] = 'lazy';
    return $image;
  }

  protected function inlineUrl($Excerpt): ?array
  {
    $url = parent::inlineUrl($Excerpt);
    if (preg_match('/^http/', $url['element']['attributes']['href']) > 0)
    {
      $url['element']['attributes']['target'] = '_blank';
    }
    return $url;
  }

  protected function inlineLink($Excerpt): ?array
  {
    $type = (preg_match('/^!\[/', $Excerpt['context']) > 0) ? 'image': 'a';
    $link = parent::inlineLink($Excerpt);
    if ($type === 'a')
    {
      if (preg_match('/^http/', $link['element']['attributes']['href']) > 0)
      {
        $link['element']['attributes']['target'] = '_blank';
      }
    }
    return $link;
  }

}
