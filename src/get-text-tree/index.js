import makeGetDataTree from '../make-get-data-tree'

export default makeGetDataTree({
  propertyName: 'textContent',
  filter: t => typeof t === 'string' && t.length > 0,
})
