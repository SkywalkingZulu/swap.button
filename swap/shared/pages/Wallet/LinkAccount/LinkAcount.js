import React, { Fragment } from 'react'
import config from 'app-config'

import Href from 'components/Href/Href'


const LinkAccount = ({ type, children, address }) => (
  <Fragment>
    { type.toLowerCase() === 'eth' && <Href tab={`${config.link.etherscan}/address/${address}`} >{children}</Href> }
    { type.toLowerCase() === 'btc' && <Href tab={`${config.link.bitpay}/address/${address}`} >{children}</Href> }
    { type.toLowerCase() === 'swap' && <Href tab={`${config.link.etherscan}/token/${config.tokens.swap.address}?a=${address}`} >{children}</Href> }
    { type.toLowerCase() === 'noxon' && <Href tab={`${config.link.etherscan}/token/${config.tokens.noxon.address}?a=${address}`} >{children}</Href> }
    { type.toLowerCase() === 'eos' && <Href tab={`${config.link.eos}`} >{children}</Href> }
  </Fragment>
)

export default LinkAccount
