import baseConfig from './default.testnet.prod'
import config from './_testnet'


export default {
  env: 'production',
  entry: 'testnet',

  base: `${baseConfig.publicPath}`,
  publicPath: `${baseConfig.publicPath}`,

  ...config,
}
