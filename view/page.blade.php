<?php if(!defined("__GOOSE__")){exit();} ?>
@extends('layout')

<?php
/** @var array $pref */
/** @var string $pageName */
?>

@section('contents')
<div class="page-view">
	<?php
	if (file_exists('pages--user/'.$pageName.'.php'))
	{
		$path = 'pages--user/'.$pageName.'.php';
		require_once($path);
	}
	?>
</div>
@endsection