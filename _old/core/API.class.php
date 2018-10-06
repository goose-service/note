<?php
if(!defined("__GOOSE__")){exit();}


class API {

	public $ajax;

	public function __construct()
	{
		$this->ajax = isset($_SERVER['HTTP_X_REQUESTED_WITH']) || (isset($_SERVER['HTTP_ORIGIN']) && $_SERVER['REQUEST_METHOD'] == 'GET');
	}

	/**
	 * Search key in array
	 *
	 * @param array $get
	 * @param string $key
	 * @return bool
	 */
	private function searchKeyInArray($get, $key)
	{
		return in_array($key, $get);
	}

	/**
	 * Update hit
	 *
	 * @param int $article_srl
	 * @return bool
	 */
	private function updateHit($article_srl)
	{
		$result = externalApi('/articles/'.$article_srl.'/update', (object)[ 'type' => 'hit' ]);
		if ($result->hit)
		{
			// writing cookie
			setCookieKey('redgoose-hit-'.(int)$article_srl, 7);
			return ($result == 'success');
		}
		else
		{
			return false;
		}
	}

	/**
	 * Index
	 *
	 * @param object $options
	 * @return object
	 */
	public function index($options)
	{
		try
		{
			$result = (object)[
				'nest' => null,
				'category' => null,
				'articles' => null,
				'pageNavigation' => null,
				'nextpage' => null,
			];
			$print = explode(',', $options->print_data);

			// get nests
			if ($options->nest_id)
			{
				$result->nest = externalApi('/nests/id/'.$options->nest_id);
				if (!isset($result->nest->srl))
				{
					throw new Exception('not found nest data', 500);
				}

				// get categories list
				if ($result->nest->json->useCategory && $this->searchKeyInArray($print, 'category'))
				{
					$result->categories = externalApi('/categories', (object)[
						'nest' => (int)$result->nest->srl,
						'field' => 'srl,name',
						'order' => 'turn',
						'sort' => 'asc',
						'ext_field' => 'count_article,item_all'
					]);

					if ($result->categories && $result->categories->index && count($result->categories->index))
					{
						$result->categories = $result->categories->index;

						$check_active = false;
						foreach($result->categories as $k=>$v)
						{
							if ($options->category_srl === (int)$v->srl)
							{
								$check_active = true;
								$result->categories[$k]->active = true;
								$result->category_name = $v->name;
								break;
							}
						}
						if (!$check_active)
						{
							$result->categories[0]->active = true;
						}
					}
				}
			}

			// set params for get articles
			$opts = (object)[];
			$opts->app = $options->app_srl;
			$nest_srl = ($options->nest_id) ? ((isset($result->nest->srl)) ? $result->nest->srl : -1) : null;
			if ($nest_srl) $opts->nest = $nest_srl;
			if ($options->category_srl) $opts->category = (int)$options->category_srl;
			$opts->field = $options->field ? $options->field : 'srl,nest_srl,category_srl,title,hit,regdate,json';
			if ($_GET['keyword'] && mb_strlen($_GET['keyword']) > 1)
			{
				$opts->title = $_GET['keyword'];
				$opts->content = $_GET['keyword'];
			}
			$opts->size = $options->size;
			$opts->page = (isset($options->page) && $options->page > 1) ? $options->page : 1;
			$opts->order = 'srl';
			$opts->sort = 'desc';
			$opts->ext_field = 'category_name';

			// call api for get articles
			$result->articles = externalApi('/articles', $opts);

			// check article
			if (!$result->articles)
			{
				throw new Exception('Not found article', 404);
			}

			// set paginate instance
			$params = [ 'keyword' => ($_GET['keyword']) ? $_GET['keyword'] : '' ];
			$paginate = new Paginate($result->articles->total, $_GET['page'], $params, $options->size, 10);

			// adjustment articles
			if ($this->searchKeyInArray($print, 'article'))
			{
				foreach ($result->articles as $k=>$v)
				{
					if (isset($v->regdate)) $result->articles[$k]->regdate = Util::convertDate($v->regdate);
				}
			}

			// set paginate
			if ($this->searchKeyInArray($print, 'nav_paginate'))
			{
				$result->pageNavigation = $paginate->createNavigationToObject();
			}

			$result->nest = ($this->searchKeyInArray($print, 'nest')) ? $result->nest : null;
			$result->articles = ($this->searchKeyInArray($print, 'article')) ? $result->articles->index : null;
			$result->state = 'success';

			return $result;
		}
		catch(Exception $e)
		{
			return (object)[
				'state' => 'error',
				'code' => $e->getCode(),
				'message' => $e->getMessage(),
			];
		}
	}

	/**
	 * View
	 *
	 * @param object $options
	 * @return object
	 */
	public function view($options)
	{
		try
		{
			// check article_srl
			if (!$options->article_srl)
			{
				throw new Exception('Not found article_srl', 404);
			}

			// get article data
			$article = externalApi('/articles/'.$options->article_srl, (object)[
				'field' => $options->field ? $options->field : '',
				'ext_field' => 'category_name',
			]);
			if (!$article)
			{
				throw new Exception('not found article data', 404);
			}

			$article->regdate = Util::convertDate($article->regdate);
			$article->modate = Util::convertDate($article->modate);

			// convert content
			require_once(__PWD__.'vendor/parsedown/Parsedown.php');
			$parseDown = new Parsedown();
			$article->content = '<div class="markdown-body">'.$parseDown->text($article->content).'</div>';

			// get nest data
			$nest = externalApi('/nests/'.(int)$article->nest_srl, (object)[
				'field' => 'srl,name,id,json'
			]);

			return (object)[
				'state' => 'success',
				'article' => $article,
				'nest' => $nest,
				'anotherArticle' => [
					'prev' => null,
					'next' => null,
				],
				'checkUpdateHit' => ($options->updateHit) ? ($this->updateHit((int)$options->article_srl)) : null,
			];
		}
		catch(Exception $e)
		{
			return (object)[
				'state' => 'error',
				'code' => $e->getCode(),
				'message' => $e->getMessage(),
			];
		}
	}

	/**
	 * Up like
	 *
	 * @param array $options : [
	 *   article_srl
	 *   header_key
	 * ]
	 * @return array
	 */
	public function upLike($options)
	{
		if (!$options['article_srl']) return [ 'state' => 'error', 'message' => 'not found article_srl' ];
		$article = Spawn::item([
			'table' => Spawn::getTableName('article'),
			'where' => 'srl='.$options['article_srl'],
			'field' => 'srl,json',
		]);
		if (!isset($article['json'])) return [ 'state' => 'error', 'message' => 'not found article data' ];

		$article['json'] = Util::jsonToArray($article['json'], null, true);
		$like = (isset($article['json']['like'])) ? ((int)$article['json']['like']) : 0;
		$article['json']['like'] = $like + 1;
		$json = Util::arrayToJson($article['json'], true);

		$result = Spawn::update([
			'table' => Spawn::getTableName('article'),
			'data' => [ 'json=\''.$json.'\'' ],
			'where' => 'srl=' . (int)$options['article_srl'],
		]);

		return ($result == 'success') ? [
			'state' => 'success',
			'message' => 'update complete',
		] : [
			'state' => 'error',
			'message' => 'fail update complete',
		];
	}

}


