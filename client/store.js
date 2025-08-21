import { reactive } from 'vue'
import { storageControl } from './libs/util.js'

const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
}
const STORAGE_KEY_THEME = 'note:theme'

class Store {

  data = reactive({
    theme: THEME.LIGHT,
    openDropdown: '',
  })

  constructor()
  {
    this.data.theme = storageControl(STORAGE_KEY_THEME) || THEME.LIGHT
    this.changeTheme(this.data.theme)
  }

  changeTheme(value)
  {
    if (![ THEME.LIGHT, THEME.DARK ].includes(value)) return
    const $html = document.documentElement
    this.data.theme = value
    $html.dataset.theme = value
    storageControl(STORAGE_KEY_THEME, value)
  }

  changeOpenDropdown(type)
  {
    if (this.data.openDropdown === type)
    {
      this.data.openDropdown = ''
    }
    else
    {
      this.data.openDropdown = type
    }
  }
  get openSearch()
  {
    return this.data.openDropdown === 'search'
  }
  get openNavigation()
  {
    return this.data.openDropdown === 'navigation'
  }

}

export default Store
