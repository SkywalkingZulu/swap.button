import baseConfig from './default.mainnet.dev'
import config from './_mainnet'


export default {
  env: 'development',
  entry: 'mainnet',

  base: `http://localhost:${baseConfig.http.port}/`,
  publicPath: `http://localhost:${baseConfig.http.port}${baseConfig.publicPath}`,

  ...config,
}
