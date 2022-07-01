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
    $image['element']['attributes']['lazy'] = 'true';
    return $image;
  }

}
