import { Icon } from 'lucide-vue-next'

export interface AdminNavigationItem {
  name: string
  icon: Icon
  content: string
  route: string
  roles: string[]
  count?: number
}
