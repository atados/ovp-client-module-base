import { withInfo } from '@storybook/addon-info'
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import { Icon } from './Icon'

storiesOf('Components', module).add(
  'Icon',
  withInfo({
    text: 'All icons are from https://material.io/tools/icons/?style=baseline',
    propTablesExclude: [React.Fragment],
  })(() => (
    <div>
      <Icon name="favorite" />
      <br />
      <Icon name="arrow_forward" />
      <br />
      <Icon name="history" />
      <br />
      <Icon name="person" />
    </div>
  )),
)
