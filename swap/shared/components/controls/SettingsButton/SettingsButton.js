import React from 'react'

import CSSModules from 'react-css-modules'
import styles from './SettingsButton.scss'

import SettingsIcon from 'components/ui/SettingsIcon/SettingsIcon'


const SettingsButton = ({ className, onClick }) => (
  <div styleName="settingsButton" title="Change address" className={className} onClick={onClick}>
    <SettingsIcon styleName="icon" />
  </div>
)

export default CSSModules(SettingsButton, styles)
