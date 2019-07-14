import makePrintDataTree from '../make-print-data-tree'

export default makePrintDataTree({
  attributeName: 'data-testid',
  filter: t => typeof t === 'string' && t.length > 0,
})
