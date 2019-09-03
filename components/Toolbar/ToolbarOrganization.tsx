import cx from 'classnames'
import React from 'react'
import styled from 'styled-components'
import { channel } from '~/common/constants'
import { UserOrganization } from '~/redux/ducks/user'
import { DropdownMenu, DropdownToggler } from '../Dropdown'
import DropdownWithContext from '../Dropdown/DropdownWithContext'
import Icon from '../Icon'

const Avatar = styled.div`
  float: left;
  margin-left: -41px;
  margin-top: -4px;
`
const Toggler = styled.a`
  padding-left: 45px;
  padding-right: 40px;
  height: 40px;

  .icon {
    position: absolute;
    right: 20px;
    font-size: 20px;
    line-height: 1.2;
  }
`

const Menu: React.FC<{ className?: string }> = styled(DropdownMenu)`
  left: auto;
  width: 300px;

  > a {
    padding: 7px 16px !important;
  }

  > a .icon {
    font-size: 18px;
    vertical-align: middle;
    margin-right: 10px;
    width: 20px;
    color: #666;
  }

  > a:hover .icon {
    color: ${channel.theme.color.primary[500]};
  }
`

interface ToolbarOrganizationProps {
  readonly organization: UserOrganization
  readonly className?: string
  readonly theme?: 'dark' | 'light'
}

const ToolbarOrganization: React.FC<ToolbarOrganizationProps> = ({
  className,
  organization,
}) => (
  <DropdownWithContext>
    <DropdownToggler>
      <Toggler
        href={`/ong/${organization.slug}`}
        className={cx(
          className,
          'block bg-white rounded-full py-1 shadow tc-base tw-medium text-truncate',
        )}
      >
        <Avatar
          className="d-inline-block w-32 h-32  bg-cover rounded-circle"
          style={
            organization.image
              ? {
                  backgroundImage: `url('${organization.image.image_small_url}')`,
                }
              : { backgroundColor: '#ddd' }
          }
        />
        {organization.name}
        <Icon name="keyboard_arrow_down" className="dropdownArrow" />
      </Toggler>
    </DropdownToggler>
    <Menu className="mt-1 py-2">qwew</Menu>
  </DropdownWithContext>
)

ToolbarOrganization.displayName = 'ToolbarOrganization'

export default ToolbarOrganization
