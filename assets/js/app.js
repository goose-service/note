import shuffle from 'auto-writer/src/shuffle';
import ajax from './ajax';
import LightBox from './LightBox';
import '../css/app.scss';

class Redgoose {

	/**
	 * constructor
	 */
	constructor()
	{
		// init header events
		this.initialHeaderEvents();
	}

	/**
	 * initial header events
	 */
	initialHeaderEvents()
	{
		// set elements
		this.headerElements = {
			navigation: document.getElementById('headerNavigation'),
			search: document.getElementById('headerSearch'),
			searchForm: document.getElementById('search_keyword'),
		};

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
		if (searchInput.value.length)
		{
			searchInput.parentNode.classList.add('is-word');
			search.parentNode.classList.add('active-bg');
		}
		searchInput.addEventListener('keyup', function(e) {
			if (searchInput.value.length)
			{
				searchInput.parentNode.classList.add('is-word');
				search.parentNode.classList.add('active-bg');
			}
			else
			{
				searchInput.parentNode.classList.remove('is-word');
				search.parentNode.classList.remove('active-bg');
			}
		});
		// reset event from search input
		const searchReset = this.headerElements.searchForm.querySelector('button[type=reset]');
		searchReset.addEventListener('click', function(e) {
			e.preventDefault();
			searchInput.value = '';
			searchInput.parentNode.classList.remove('is-word');
			search.parentNode.classList.remove('active-bg');
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

	/**
	 * initial article
	 */
	initialArticle()
	{
		// set elements
		this.articleElements = {
			main: document.getElementById('article'),
			content: document.getElementById('article_content'),
			buttonLike: document.getElementById('button_like'),
		};

		// button like event
		this.articleElements.buttonLike.addEventListener('click', (e) => {
			const button = e.currentTarget;
			let srl = parseInt(button.dataset.srl);
			// update button
			button.setAttribute('disabled', true);
			button.classList.add('on');
			// update count
			let em = button.querySelector('em');
			let cnt = parseInt(em.textContent);
			em.innerHTML = String(cnt + 1);
			// call xhr
			ajax(`/on-like/${srl}/`, 'post', null)
				.then((res) => {
					if (!res.success) throw new Error();
					em.innerHTML = String(res.star);
				})
				.catch((e) => {
					alert('Failed update like');
					button.removeAttribute('disabled');
					button.classList.remove('on');
					em.innerHTML = String(cnt);
				});
		});

		// image lightbox
		const lightbox = new LightBox();
		const $images = this.articleElements.content.querySelectorAll('img');
		$images.forEach((o) => {
			o.addEventListener('click', (e) => {
				if (!e.target.src) return;
				lightbox.open(e.target.src, e.target.name);
			});
		});
	}

	/**
	 * initial articles
	 */
	initialArticles()
	{
		// mouse over items
		const $items = document.querySelectorAll('.index-article__wrap');
		$items.forEach((o) => {
			o.addEventListener('mouseenter', (e) => {
				if (window.innerWidth < 768) return true;
				const bd = '.index-article__body';
				const $elements = e.target.querySelectorAll(`${bd} > strong, ${bd} > p > span:first-child, ${bd} > p > span:nth-child(2) > em`);
				$elements.forEach((o, k) => {
					let time = 0;
					switch (k)
					{
						case 0: time = 0; break; // title
						case 1: time = 120; break; // date
						case 2: time = 180; break; // nest name
						case 3: time = 180; break; // category name
					}
					setTimeout(() => shuffle(o, {
						text: o.innerText,
						pattern: 'abcdefghijklmnopqrstuvwxyz0123456789-_!@#$%^&*()+~<>ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎㄲㄸㅃㅆㅉ',
						randomTextType: k === 0 ? 'pattern' : 'unicode',
					}), time);
				});
			});
		});
	}

}

module.exports = Redgoose;
