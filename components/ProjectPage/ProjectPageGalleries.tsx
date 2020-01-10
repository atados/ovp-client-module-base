import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Project } from '~/redux/ducks/project'
import Gallery from '../Gallery'
import { useModal } from '../Modal'
import { defineMessages } from 'react-intl'
import { useIntl } from 'react-intl'
import { API } from '~/types/api'

const Photos = styled.div`
  &.row {
    margin: 0 -5px;
  }

  .col-4 {
    padding: 0 5px;
  }
`

const Photo = styled.figure`
  margin-bottom: 10px;
`

const PhotoImage = styled.div`
  background: rgba(0, 0, 0, 0.05);
  background-size: cover;
  background-position: center;
  cursor: pointer;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
`

interface ProjectPageGalleriesProps {
  readonly project: Project
}

const { FOTOS } = defineMessages({
  FOTOS: {
    id: 'FOTOS',
    defaultMessage: 'Fotos',
  },
})

const ProjectPageGalleries: React.FC<ProjectPageGalleriesProps> = ({
  project,
}) => {
  const intl = useIntl()

  const openGallery = useModal({
    id: 'Gallery',
    component: Gallery,
    cardClassName: 'animation-none',
  })
  const images = useMemo(() => {
    const imagesList: API.ImageDict[] = []
    project.galleries.forEach(gallery => {
      imagesList.push(...gallery.images)
    })

    return imagesList
  }, [project && project.galleries])

  if (images.length === 0) {
    return null
  }

  return (
    <>
      <h4 className="mb-6">{intl.formatMessage(FOTOS)}</h4>
      <Photos className="row">
        {images.map(image => (
          <div key={image.id} className="col-4">
            <Photo className="ratio">
              <span className="ratio-fill" style={{ paddingTop: '100%' }} />
              <PhotoImage
                className="ratio-body"
                style={
                  image && {
                    backgroundImage: `url('${image.image_url ||
                      image.image_medium}')`,
                  }
                }
                onClick={() =>
                  openGallery({ images, defaultImageId: image.id })
                }
              />
            </Photo>
          </div>
        ))}
      </Photos>
      <hr className="mt-6 mb-6" />
    </>
  )
}

ProjectPageGalleries.displayName = 'ProjectPageGalleries'

export default React.memo(ProjectPageGalleries)
