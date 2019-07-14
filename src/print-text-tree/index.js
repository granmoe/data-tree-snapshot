import makePrintDataTree from '../make-print-data-tree'

export default makePrintDataTree({
  propertyName: 'textContent',
  filter: t => typeof t === 'string' && t.length > 0,
})
