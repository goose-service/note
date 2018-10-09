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

		// search form event
		console.log(this.headerElements.searchForm);
		this.headerElements.searchForm.addEventListener('submit', this.onSubmitSearchKeyword);
	}

	/**
	 * initial header events
	 */
	initialHeaderEvents()
	{
		const self = this;
		const navigation = this.headerElements.navigation.children[0];
		const search = this.headerElements.search.children[0];

		navigation.addEventListener('click', function(e) {
			self.headerElements.search.classList.remove('active');
			e.currentTarget.parentNode.classList.toggle('active');
		});
		search.addEventListener('click', function(e) {
			self.headerElements.navigation.classList.remove('active');
			e.currentTarget.parentNode.classList.toggle('active');
			// on focus input form
			if (e.currentTarget.parentNode.classList.contains('active'))
			{
				e.currentTarget.parentNode.querySelector('input[type=text]').focus();
			}
		});
	}

	onSubmitSearchKeyword(e)
	{
		console.log(e);
		// TODO: 검색 이벤트를 왜 만들었는지 갑자기 생각 안나지만 생각나면 작업하기
		//e.preventDefault();
	}

}

module.exports = Redgoose;
