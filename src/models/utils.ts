export interface Pagination<Item> {
  items: Array<Item>
  total: number
  page: number
  size: number
  pages: number
}
