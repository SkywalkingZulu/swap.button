import baseConfig from './default.local.prod'
import config from './_testnet'


export default {
  env: 'production',
  entry: 'local',

  base: `./`,
  publicPath: `./`,

  ...config,
}