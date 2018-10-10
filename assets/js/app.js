import '../css/app.scss';

class Redgoose {

	/**
	 * constructor
	 *
	 * @param {Object} options
	 */
	constructor(options={})
	{
		this.headerElements = {
			navigation: document.getElementById('headerNavigation'),
			search: document.getElementById('headerSearch'),
			searchForm: document.getElementById('search_keyword'),
		};

		// init events
		this.initialHeaderEvents();
	}

	/**
	 * initial header events
	 */
	initialHeaderEvents()
	{
		const self = this;
		const navigation = this.headerElements.navigation.children[0];
		const search = this.headerElements.search.children[0];

		// navigation dropdown event
		navigation.addEventListener('click', function(e) {
			self.headerElements.search.classList.remove('active');
			e.currentTarget.parentNode.classList.toggle('active');
			e.currentTarget.parentNode.querySelector('.dropdown-content').classList.toggle('active');
		});
		// search dropdown event
		search.addEventListener('click', function(e) {
			self.headerElements.navigation.classList.remove('active');
			e.currentTarget.parentNode.classList.toggle('active');
			e.currentTarget.parentNode.querySelector('.dropdown-content').classList.toggle('active');
			// on focus input form
			if (e.currentTarget.parentNode.classList.contains('active'))
			{
				e.currentTarget.parentNode.querySelector('input[type=text]').focus();
			}
		});

		// input keyword event from search input
		const searchInput = this.headerElements.searchForm.q;
		if (searchInput.value.length) searchInput.parentNode.classList.add('is-word');
		searchInput.addEventListener('keyup', function(e) {
			if (searchInput.value.length)
			{
				searchInput.parentNode.classList.add('is-word');
			}
			else
			{
				searchInput.parentNode.classList.remove('is-word');
			}
		});
		// reset event from search input
		const searchReset = this.headerElements.searchForm.querySelector('button[type=reset]');
		searchReset.addEventListener('click', function(e) {
			e.preventDefault();
			searchInput.value = '';
			searchInput.parentNode.classList.remove('is-word');
			searchInput.focus();
		});

		// dropdown content 닫기에 관련된 이벤트
		window.addEventListener('click', function(e) {
			if (!e.target.matches('.dropdown-button'))
			{
				if (!!e.target.closest('.dropdown-content')) return;

				const dropdowns = document.getElementsByClassName('dropdown-content');
				for (let i = 0; i< dropdowns.length; i++)
				{
					let openDropdown = dropdowns[i];
					if (openDropdown.classList.contains('active'))
					{
						openDropdown.parentNode.classList.remove('active');
						openDropdown.classList.remove('active');
					}
				}
			}
		});
	}

}


module.exports = Redgoose;
