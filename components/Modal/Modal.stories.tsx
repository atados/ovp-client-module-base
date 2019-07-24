import { withInfo } from '@storybook/addon-info'
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import { Modal } from './Modal'
import ModalCard from './ModalCard'

storiesOf('Components', module).add(
  'Modal',
  withInfo()(() => {
    let ref
    return (
      <div>
        <button
          className="btn btn-muted-dark"
          onClick={() => {
            ref.open()
          }}
        >
          Open modal
        </button>
        <Modal
          ref={node => {
            ref = node
          }}
        >
          <ModalCard>
            <div className="p-4">
              <h4>Modal</h4>
              <hr />
              <p>Lorem ipsum dolor iset</p>
            </div>
          </ModalCard>
        </Modal>
      </div>
    )
  }),
)
