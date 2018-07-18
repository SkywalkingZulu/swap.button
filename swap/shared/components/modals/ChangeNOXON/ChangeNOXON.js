import React from 'react'

import { Modal } from 'components/modal'
import { Button } from 'components/controls'
import { FieldLabel, Input } from 'components/forms'

import Link from 'sw-valuelink'

import actions from 'redux/actions'
import { constants } from 'helpers'

import cssModules from 'react-css-modules'
import styles from './ChangeNOXON.scss'
/* imports for change */
import { constants as privateKeys } from 'helpers'
import config from 'app-config'

@cssModules(styles)
export default class ChangeNOXON extends React.Component {
  state = {
    privateKey: '',
    error: '',
  }

  handleSubmit = async () => {
    const { privateKey } = this.state

    actions.loader.show()

    try {
		localStorage.setItem(constants.privateKeyNames.noxon,privateKey)
		actions.token.login(privateKey, config.tokens.noxon.address, 'noxon', config.tokens.noxon.decimals)
		actions.token.getBalance(config.tokens.noxon.address, 'noxon', config.tokens.noxon.decimals)
		
		actions.modals.close(constants.modals.ChangeNOXON)
    } catch (e) {
      console.error(e)
      this.setState({ error: e.toString() })
    }

    actions.loader.hide()
  }

  render() {
    const { privateKey, error } = this.state
    const { name } = this.props

    const linked = Link.all(this, 'privateKey')
    const isDisabled = !privateKey

    return (
      <Modal name={name} title="Change ETH Address for NOXON Tokens">
        <FieldLabel inRow>Private key</FieldLabel>
        <Input valueLink={linked.privateKey} />
        { error && (
            <div styleName="error">Sorry, error occured during activation</div>
          )
        }
        <Button
          styleName="button"
          brand
          fullWidth
          disabled={isDisabled}
          onClick={this.handleSubmit}
        >
          Change
        </Button>
      </Modal>
    )
  }
}
