import makeGetDataTree from '../make-get-data-tree'
import { getConfig } from '../configure'

const { testIdAttribute } = getConfig()

let getTestIdTree = makeGetDataTree({
  attributeName: getConfig().testIdAttribute,
  filter: t => typeof t === 'string' && t.length > 0,
})

export default function(...args) {
  if (getConfig().testIdAttribute !== testIdAttribute) {
    getTestIdTree = makeGetDataTree({
      attributeName: getConfig().testIdAttribute,
      filter: t => typeof t === 'string' && t.length > 0,
    })
  }

  return getTestIdTree(...args)
}
