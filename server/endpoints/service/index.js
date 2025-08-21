import Home from './Home.jsx'
import Nest from './Nest.jsx'
import Article from './Article.jsx'

export default {
  '/': Home, // 첫페이지
  '/nest/:code/': Nest, // 둥지
  '/nest/:code/:category_srl/': Nest, // 둥지에서 카테고리 선택
  '/article/:srl/': Article, // 아티클
}
