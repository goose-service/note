(function($) {

	// set gnb
	var $gnb = $('.header .gnb');

	// active dep-1 item
	$gnb.find('.dep-2 .active').parent().closest('li').addClass('active');


	/**
	 * Article index
	 */

	// toggle search form
	(function() {
		const searchElementNames = {
			button: 'search-control',
			target: 'search-target',
			content: 'search-content'
		};

		if (!document.querySelector('.' + searchElementNames.button)) return;

		// toggle dropdown
		document.querySelector('.' + searchElementNames.button).addEventListener('click', function(e) {
			this.parentNode.classList.toggle('active');
		});

		// close dropdown
		window.onclick = function(e)
		{
			if ($(e.target).closest('.' + searchElementNames.content).length) return;
			if (e.target.matches('.' + searchElementNames.button)) return;

			const dropdowns = document.getElementsByClassName(searchElementNames.content);
			for (let i = 0; i < dropdowns.length; i++)
			{
				let openDropdown = dropdowns[i];
				if (openDropdown.parentNode.classList.contains('active'))
				{
					openDropdown.parentNode.classList.remove('active');
				}
			}
		};
	})();

	// toggle gnb for mobile
	$('.toggle-button').on('click', function(){
		const $target = $(this).next();
		$(this).toggleClass('active');
		$target.toggleClass('active');
		const iconClass = (!$(this).hasClass('active')) ? 'lnr lnr-chevron-down' : 'lnr lnr-chevron-up';
		$(this).find('i').attr('class', iconClass);
	});

})(jQuery);