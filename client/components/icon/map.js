import * as lucide from 'lucide-vue-next'

const icons = {
  'chevron-left': lucide.ChevronLeft,
  'chevrons-left': lucide.ChevronsLeft,
  'chevron-right': lucide.ChevronRight,
  'chevrons-right': lucide.ChevronsRight,
  'chevron-down': lucide.ChevronDown,
  'link': lucide.Link,
  'x': lucide.X,
  'search': lucide.Search,
  'image': lucide.Image,
}

export function iconRandomPick()
{
  const iconNames = Object.keys(icons)
  return iconNames[Math.floor(Math.random() * iconNames.length)]
}

export default icons
