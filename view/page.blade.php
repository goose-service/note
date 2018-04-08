<?php if(!defined("__GOOSE__")){exit();} ?>
@extends('layout')

<?php
/** @var array $pref */
/** @var string $pageName */
?>

@section('contents')
<div class="page-view">
	<?php
	if (file_exists('pages/'.$pageName.'.html'))
	{
		$path = 'pages/'.$pageName.'.html';
		require_once($path);
	}
	?>
</div>
@endsection