import React from 'react'

import { Modal } from 'components/modal'
import { Button } from 'components/controls'
import { FieldLabel, Input } from 'components/forms'

import Link from 'sw-valuelink'

import actions from 'redux/actions'
import { constants } from 'helpers'

import cssModules from 'react-css-modules'
import styles from './ChangeBTC.scss'

@cssModules(styles)
export default class ChangeBTC extends React.Component {
  state = {
    privateKey: '',
    error: '',
  }

  handleSubmit = async () => {
    const {  privateKey } = this.state

    actions.loader.show()

    try {
		localStorage.setItem( constants.privateKeyNames.btc, privateKey );
		const btcPrivateKey = localStorage.getItem(constants.privateKeyNames.btc)
		actions.bitcoin.login(btcPrivateKey)
		actions.bitcoin.getBalance();
		
		actions.modals.close(constants.modals.ChangeBTC)
    } catch (e) {
      console.error(e)
      this.setState({ error: e.toString() })
    }

    actions.loader.hide()
  }

  render() {
    const { address, privateKey, error } = this.state
    const { name } = this.props

    const linked = Link.all(this, 'privateKey')
    const isDisabled = !privateKey

    return (
      <Modal name={name} title="Change BTC Address">
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
