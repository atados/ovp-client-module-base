import React, { useMemo } from 'react'
import cx from 'classnames'
import { Organization } from '~/redux/ducks/organization'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import Gallery from '../Gallery'
import { useModal } from '../Modal'
import { Color } from '~/common'
import Icon from '../Icon'
import { API } from '~/types/api'

const Row = styled.div`
  margin: 0 -5px;

  > div {
    padding: 0 5px;
    margin-bottom: 10px;
  }
`

interface OrganizationPagePhotosProps {
  readonly className?: string
  readonly organization: Organization
  readonly isViewerMember?: boolean
}

const OrganizationPagePhotos: React.FC<OrganizationPagePhotosProps> = ({
  className,
  organization,
  isViewerMember,
}) => {
  const openGallery = useModal({
    id: 'Gallery',
    component: Gallery,
    cardClassName: 'animation-none',
  })
  const photos = useMemo(() => {
    const photosList: API.ImageDict[] = []
    organization.galleries.forEach(gallery => {
      photosList.push(...gallery.images)
    })

    return photosList
  }, [organization && organization.galleries])

  if (photos.length === 0) {
    if (isViewerMember) {
      return (
        <div className={cx('bg-white rounded-lg shadow', className)}>
          <div className="px-4 pt-4">
            <h4 className="text-lg font-medium mb-4">
              <FormattedMessage
                id="organizationPagePhotos.title"
                defaultMessage="Fotos"
              />
            </h4>
            <div className="text-center">
              <Icon name="image" className="block text-4xl mb-1" />
            </div>
          </div>
          <svg
            viewBox="0 0 1100 40"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            className="block"
          >
            <g
              id="Artboard"
              stroke="none"
              strokeWidth="1"
              fill="none"
              fillRule="evenodd"
            >
              <g id="divider-2" fill={Color.gray[200]} fillRule="nonzero">
                <path
                  d="M0,0 C0,0 0,0 0,0 C5.83593225e-16,4.76540032 3.71405885,8.7050829 8.47118281,8.98581743 C8.68506253,8.99843826 8.86737677,9.01328944 9.01812555,9.03037095 C189.345417,29.463457 369.672708,39.68 550,39.68 C730.313224,39.68 910.626447,29.465051 1090.93967,9.03515285 C1091.09612,9.01742695 1091.28874,9.00192937 1091.51753,8.98866009 C1096.27968,8.71248671 1100,4.77015153 1100,0 C1100,0 1100,0 1100,0 L1100,40 L0,40 L0,0 Z"
                  id="Path"
                />
              </g>
            </g>
          </svg>
          <div className="bg-gray-200 p-3">
            <FormattedMessage
              id="organizationPagePhotos.addFirstPhotos"
              defaultMessage="Anexe fotos da sua ONG"
            />
          </div>
        </div>
      )
    }

    return null
  }

  return (
    <div className={cx(className, 'bg-white p-3 rounded-lg shadow')}>
      <h4 className="text-lg font-medium mb-4">
        <FormattedMessage
          id="organizationPagePhotos.title"
          defaultMessage="Fotos"
        />
      </h4>
      <Row className="flex flex-wrap -mx-2 mb-4">
        {photos.slice(0, 6).map(photo => (
          <div key={photo.id} className="px-2 w-full md:w-1/3">
            <div className="ratio">
              <div className="ratio-fill" style={{ paddingTop: '100%' }}></div>
              <div
                className="ratio-body rounded-lg bg-gray-300"
                style={{ backgroundImage: `url('${photo.image_medium_url}')` }}
              ></div>
            </div>
          </div>
        ))}
      </Row>
      <button
        type="button"
        onClick={openGallery}
        className="btn bg-gray-200 hover:bg-gray-300 btn--block"
      >
        Ver todas as fotos
      </button>
    </div>
  )
}

OrganizationPagePhotos.displayName = 'OrganizationPagePhotos'

export default OrganizationPagePhotos
