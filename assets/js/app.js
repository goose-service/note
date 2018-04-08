(function($) {

	// set gnb
	var $gnb = $('.header .gnb');

	// active dep-1 item
	$gnb.find('.dep-2 .active').parent().closest('li').addClass('active');


	/**
	 * Article index
	 */

	// header bar event
	const $articleIndexBarItems = $('.article-index > header > nav > ul > li');
	$articleIndexBarItems.children('button').on('click', function(){
		const $this = $(this);

		if ($this.next().length)
		{
			const $parent = $this.parent();
			if ($parent.hasClass('active'))
			{
				$parent.removeClass('active');
			}
			else
			{
				$articleIndexBarItems.removeClass('active');
				$parent.addClass('active');

				// focus keyword form
				const $keyword = $parent.find('input[name=keyword]');
				if ($keyword.length)
				{
					$keyword.focus();
				}
			}
		}
		else
		{
			if ($this.attr('data-href'))
			{
				location.href = $this.attr('data-href');
			}
		}
	});


	// toggle gnb for mobile
	$('.toggle-button').on('click', function(){
		const $target = $(this).next();
		$(this).toggleClass('active');
		$target.toggleClass('active');
		const iconClass = (!$(this).hasClass('active')) ? 'lnr lnr-chevron-down' : 'lnr lnr-chevron-up';
		$(this).find('i').attr('class', iconClass);
	});


	/**
	 * Article view
	 */

	const $article = $('#article');

	// on like
	$article.find('[data-action=onLike]').on('click', function(){
		const $this = $(this);
		if (!$this.hasClass('active')) return false;
		$.ajax({
			url: $(this).attr('href'),
			method: 'get',
			dataType: 'json',
			headers: { 'Accept' : 'application=' + pref.meta.headerKey + ';' }
		}).done(function(response){
			if (response.state === 'success')
			{
				const $like = $article.find('[data-like]');
				$like.text(parseInt($like.text(), 10) + 1);
				$this.removeClass('active');
			}
			else
			{
				console.log(response.state);
				console.log(response);
			}
		}).fail(function(e){
			console.error('server error');
			console.error(e.responseText);
		});

		return false;
	});

})(jQuery);