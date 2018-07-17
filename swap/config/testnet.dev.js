import baseConfig from './default.testnet.dev'
import config from './_testnet'


export default {
  env: 'development',
  entry: 'testnet',

  base: `http://localhost:${baseConfig.http.port}`,
  publicPath: `${baseConfig.publicPath}`,

  ...config,
}
/*
http://localhost:${baseConfig.http.port}/
http://localhost:${baseConfig.http.port}${baseConfig.publicPath}
*/
