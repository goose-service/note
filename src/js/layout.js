var log = function(o) { console.log(o); };


/* Article INDEX */

// header bar event
var $articleIndexBarItems = $('.article-index > header > nav > ul > li');
$articleIndexBarItems.children('button').on('click', function(){
	if ($(this).next().length)
	{
		var $parent = $(this).parent();
		if ($parent.hasClass('active'))
		{
			$parent.removeClass('active');
		}
		else
		{
			$articleIndexBarItems.removeClass('active');
			$parent.addClass('active');

			// focus keyword form
			var $keyword = $parent.find('input[name=keyword]');
			if ($keyword.length)
			{
				$keyword.focus();
			}
		}
	}
	else
	{
		if ($(this).attr('data-href'))
		{
			location.href = $(this).attr('data-href');
		}
	}
});


// toggle gnb for mobile
$('.toggle-button').on('click', function(){
	var $target = $(this).next();
	$(this).toggleClass('active');
	$target.toggleClass('active');
	var iconClass = (!$(this).hasClass('active')) ? 'lnr lnr-chevron-down' : 'lnr lnr-chevron-up';
	$(this).find('i').attr('class', iconClass);
});



/* Article VIEW */
var $article = $('#article');

// on like
$('[data-action=onLike]').on('click', function(){
	var $self = $(this);
	if (!$self.hasClass('active')) return false;
	jQuery.ajax({
		url: $(this).attr('href'),
		method: 'get',
		dataType: 'json',
		headers: { 'Accept' : 'application=' + pref.meta.headerKey + ';' }
	}).done(function(response){
		if (response.state == 'success')
		{
			var $like = $article.find('[data-like]');
			$like.text(parseInt($like.text(), 10) + 1);
			$self.removeClass('active');
		}
		else
		{
			log(response.state);
			log(response);
		}
	}).fail(function(e){
		log('server error');
		log(e.responseText);
	});

	return false;
});
