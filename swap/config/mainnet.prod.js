import baseConfig from './default'
import config from './_mainnet'


export default {
  env: 'production',
  entry: 'mainnet',

  base: './',
  publicPath: `./`,

  ...config,
}
