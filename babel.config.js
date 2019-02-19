module.exports = function(api) {
  api.cache(true)

  const presets = [
    ['@babel/env',{
      targets: {
        node: 'current'
      },
      loose: true
    }],
    '@babel/preset-typescript'
  ]

  const plugins = [
    '@babel/proposal-class-properties',
    '@babel/proposal-object-rest-spread',
    ['@babel/plugin-transform-modules-commonjs', {
      loose: true,
      strict: true
    }]
  ]

  return {
    presets,
    plugins,
  }
}
