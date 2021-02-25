import { ajax } from 'rxjs/ajax'

const getJSON = ajax.getJSON

const searchInput = (apiBase: string, perPage: number, term: string) => 
  `${apiBase}?beer_name=${encodeURIComponent(term)}&per_page=${perPage}`

const random = (apiBase: string) => `${apiBase}/random`

export { getJSON, searchInput, random }