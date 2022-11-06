interface Query {
  page?: number
  categorySrl?: string
  q?: string
}

interface Nest {
  srl?: number
  title?: string
}

interface Category {
  srl: string|number
  name: string
  count_article: number
  active: boolean
}

interface Article {
  srl: number
  title: string
  date: string
  nest?: string
  category?: string
  image?: string
}

interface ResponseIndex {
  total: number
  items: Article[]
}

interface ResponseNest {
  nest: Nest
  categories: Category[]
  categoryName: string
  articles: {
    total: number
    items: Article[]
  }
}

interface ResponseArticles {
  total: number
  items: Article[]
}
