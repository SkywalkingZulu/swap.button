import config from 'app-config'

export default {
  home: config.publicPath,
  wallet: config.publicPath+'wallet',
  history: config.publicPath+'history',
  swap: config.publicPath+'swap',
  feed: config.publicPath+'feed',
  affiliate: config.publicPath+'affiliate', /* /swap.button/swap/build */
}
