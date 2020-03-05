import { formatDisponibility } from '~/lib/project/utils'
import { styles } from './ProjectCard'
import Icon from '~/components/Icon'
import React from 'react'

const ProjectCardFooter = props => {
  const { Footer } = styles
  const { address, disponibility, intl } = props

  return (
    <Footer className="flex -mx-1">
      {address && (
        <div className="px-1 w-1/2 mb-2 md:mb-0">
          <span
            title={`${address.city_state && `${address.city_state}, `} ${
              address.typed_address
            }`}
            className="text-sm block text-gray-600 truncate"
          >
            <Icon name="place" />{' '}
            {address.city_state && `${address.city_state}, `}
            {address.typed_address}
          </span>
        </div>
      )}
      {disponibility && (
        <div className="px-1 w-1/2">
          <span className="text-sm block text-secondary-600 truncate">
            <Icon name="date_range" />{' '}
            {formatDisponibility(disponibility, intl)}
          </span>
        </div>
      )}
    </Footer>
  )
}

export default ProjectCardFooter
