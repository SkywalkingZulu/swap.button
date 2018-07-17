import baseConfig from './default'
import config from './_testnet'


export default {
  env: 'production',
  entry: 'testnet',

  base: 'https://swaponline.github.io/swap.button/swap/build/',
  publicPath: `./`,

  ...config,
}
