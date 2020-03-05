import Tooltip from '~/components/Tooltip'
import { styles } from './ProjectCard'
import styled from 'styled-components'
import Icon from '~/components/Icon'
import React from 'react'

const Pills = styled.div`
  position: absolute;
  right: 8px;
  bottom: 8px;
`

const ProjectCardPills = ({ disponibility }) => {
  const { Pill } = styles

  return (
    <Pills>
      {disponibility &&
        disponibility.type === 'work' &&
        disponibility.work.can_be_done_remotely && (
          <Tooltip value="Pode ser feito à distância">
            <Pill className="pill-secondary t-nowrap">
              <Icon name="public" />
            </Pill>
          </Tooltip>
        )}
    </Pills>
  )
}

export default ProjectCardPills
