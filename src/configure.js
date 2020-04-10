let config = {
  testIdAttribute: 'data-testid',
}

// TODO: Remember to use personal email in this repo
export default configOverrides => {
  config = {
    ...config,
    ...configOverrides,
  }
}

export const getConfig = () => config
