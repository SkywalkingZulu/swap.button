import baseConfig from './default.mainnet.prod'
import config from './_mainnet'


export default {
  env: 'production',
  entry: 'mainnet',

  base: './',
  publicPath: `./`,

  ...config,
}
