import makePrintDataTree from '../make-print-data-tree'

// This is exactly the same as printTestIdTree, so no test coverage is needed here
export default makePrintDataTree({
  attributeName: 'data-qa',
  filter: t => typeof t === 'string' && t.length > 0,
})
