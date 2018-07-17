import baseConfig from './default'
import config from './_testnet'


export default {
  env: 'production',
  entry: 'testnet',

  base: './',
  publicPath: `./`,

  ...config,
}
