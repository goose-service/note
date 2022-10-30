interface Query {
  page?: number
  categorySrl?: string
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
  articles: {
    total: number
    items: Article[]
  }
}
