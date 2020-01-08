import nanoid from 'nanoid'
import React, { useCallback, useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import { fetchAPI } from '~/lib/fetch/fetch.server'
import { Color } from '~/common/channel'
import { Project, updateProject } from '~/redux/ducks/project'
import { RootState } from '~/redux/root-reducer'
import ActivityIndicator from '../ActivityIndicator'
import Icon from '../Icon'
import Tooltip from '../Tooltip'
import { defineMessages, useIntl } from 'react-intl'
import { API } from '~/types/api'

const PhotoImage = styled.div`
  background: rgba(0, 0, 0, 0.05);
  background-size: cover;
  background-position: center;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);

  > svg {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto !important;
  }
`

const Photos = styled.div`
  > .row {
    margin: 0 -5px;
  }

  .photo-col {
    padding: 0 5px;
  }
`

const Container = styled.div`
  transition: box-shadow 0.2s;

  &.active {
    box-shadow: 0 0 0 3px ${Color.primary[500]};
  }
`

const PhotoImageInputWrapper = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  cursor: pointer;
  border: 2px dashed ${Color.primary[500]};

  &:hover {
    background: #e0e1e2;
  }
`

const PhotoImageInputLabel = styled.div`
  height: 100px;
  line-height: 1;
  text-align: center;
  position: absolute;
  color: ${Color.primary[500]};
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  display: block;

  > .icon {
    font-size: 48px;
    display: block;
  }
`

const PlaceholderIcon = styled(Icon)`
  font-size: 64px;
  color: #999;
`

const ToogleRemovedButton = styled.button`
  position: absolute;
  right: -15px;
  top: -15px;
  border-radius: 50%;
  z-index: 50;
  width: 36px;
  height: 36px;
  padding: 4px;
  border: 2px solid #fff !important;
  display: none;
`

const Photo = styled.figure`
  margin-bottom: 10px;

  &:hover ${ToogleRemovedButton} {
    display: block;
  }
`

interface GalleryItem {
  id: string | number
  isDraft?: boolean
  uploading?: boolean
  image?: API.ImageDict
  removed?: boolean
}

interface ProjectManagePagePhotosProps {
  readonly className?: string
  readonly project: Project
}

const {
  CANCELAR,
  SALVAR,
  ADICIONAR,
  FOTOS,
  CLIQUE,
  ADICIONAR_FOTOS,
  FOTOS_VAGA,
  VAGA_ATRATIVA,
  PRIMEIRAS_FOTOS,
} = defineMessages({
  CANCELAR: {
    id: 'CANCELAR',
    defaultMessage: 'Cancelar',
  },
  SALVAR: {
    id: 'SALVAR',
    defaultMessage: 'Salvar alterações',
  },
  ADICIONAR: {
    id: 'ADICIONAR',
    defaultMessage: 'Adicionar fotos',
  },
  FOTOS: {
    id: 'FOTOS',
    defaultMessage: 'Fotos',
  },
  CLIQUE: {
    id: 'CLIQUE',
    defaultMessage: 'Clique para',
  },
  ADICIONAR_FOTOS: {
    id: 'ADICIONAR_FOTOS',
    defaultMessage: 'adicionar mais fotos',
  },
  FOTOS_VAGA: {
    id: 'FOTOS_VAGA',
    defaultMessage: 'Fotos da vaga',
  },
  VAGA_ATRATIVA: {
    id: 'VAGA_ATRATIVA',
    defaultMessage:
      'Adicione fotos para deixar sua vaga mais atrativa e mostra como foi essa ação.',
  },
  PRIMEIRAS_FOTOS: {
    id: 'PRIMEIRAS_FOTOS',
    defaultMessage: 'Adicionar primeiras fotos',
  },
})

const ProjectManagePagePhotos: React.FC<ProjectManagePagePhotosProps> = ({
  className,
  project,
}) => {
  const viewer = useSelector((state: RootState) => state.user!)
  const dispatchToReduxStore = useDispatch()
  const intl = useIntl()

  const [items, setItems] = useState<GalleryItem[]>(() => {
    const looseGallery = project.galleries.find(
      gallery => gallery.name === 'loose',
    )

    if (looseGallery) {
      return looseGallery.images.map(image => ({
        id: image.id,
        image,
      }))
    }

    return []
  })
  const [isDrafting, isUploading] = useMemo(() => {
    let drafting = false
    let uploading = false
    items.some(item => {
      if (!drafting) {
        drafting = Boolean(item.isDraft) || Boolean(item.removed)
      }
      if (!uploading) {
        uploading = Boolean(item.uploading)
      }

      return drafting && uploading
    })
    return [drafting, uploading]
  }, [items])

  const handleInputFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const { files } = event.target
      if (!files) {
        return
      }

      const promises: Array<Promise<API.ImageDict>> = []
      const newItems: GalleryItem[] = []
      Array.from(files).map(file => {
        const formData = new FormData()
        formData.append('image', file)

        const id = nanoid()
        newItems.push({
          id,
          isDraft: true,
          uploading: true,
        })

        promises.push(
          fetchAPI('/uploads/images/', {
            method: 'POST',
            body: formData,
            sessionToken: viewer.token,
          }),
        )
      })

      setItems(prevItems => [...prevItems, ...newItems])

      const payloads = await Promise.all(promises)
      const newItemsIds = newItems.map(item => item.id)

      setItems(prevItems =>
        prevItems.map(item => {
          const index = newItemsIds.indexOf(item.id)
          if (index !== -1) {
            return {
              ...item,
              uploading: false,
              image: payloads[index],
            }
          }
          return item
        }),
      )
    },
    [items],
  )

  const handleSubmitChanges = useCallback(async () => {
    if (isUploading) {
      return
    }

    const images = items
      .filter(item => item.image && !item.removed)
      .map(item => item.image!)
    let gallery =
      project.galleries &&
      project.galleries.find(galleryItem => galleryItem.name === 'loose')

    if (gallery) {
      gallery = await fetchAPI(`/gallery/${gallery.uuid}/`, {
        method: 'PATCH',
        body: {
          images,
        },
        sessionToken: viewer.token,
      })

      dispatchToReduxStore(
        updateProject({
          slug: project.slug,
          galleries: project.galleries.map(galleryItem => {
            if (galleryItem.id === gallery!.id) {
              return gallery!
            }

            return galleryItem
          }),
        }),
      )
    } else {
      gallery = await fetchAPI('/gallery/', {
        method: 'POST',
        body: {
          name: 'loose',
          description: '',
          images,
        },
        sessionToken: viewer.token,
      })

      const galleries = [...project.galleries, gallery!]

      await fetchAPI(`/projects/${project.slug}/`, {
        method: 'PATCH',
        body: {
          galleries: galleries.map(galleryItem => ({
            id: galleryItem.id,
          })),
        },
        sessionToken: viewer.token,
      })

      dispatchToReduxStore(
        updateProject({
          slug: project.slug,
          galleries,
        }),
      )
    }

    setItems(
      images.map(image => ({
        id: image.id,
        image,
      })),
    )
  }, [project, isUploading, items])

  const toggleEdtting = useCallback(() => {
    const gallery =
      project.galleries && project.galleries.find(g => g.name === 'loose')
    setItems(
      gallery ? gallery.images.map(image => ({ id: image.id, image })) : [],
    )
  }, [project, setItems])

  const toggleImageRemoved = (selectedItem: GalleryItem) => {
    setItems(
      items.map(item => {
        if (item === selectedItem) {
          return {
            ...selectedItem,
            removed: !selectedItem.removed,
          }
        }
        return item
      }),
    )
  }

  return (
    <Container
      className={`rounded-lg bg-white shadow mb-6 ${
        isDrafting ? 'active' : ''
      }${className ? ` ${className}` : ''}`}
    >
      <div className="p-4 relative">
        {isDrafting ? (
          <>
            <div className="float-right">
              <button
                type="button"
                onClick={toggleEdtting}
                className="btn btn-muted mr-2"
              >
                <Icon name="close" className="mr-2" />
                {intl.formatMessage(CANCELAR)}
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmitChanges}
                disabled={isUploading}
              >
                <Icon name="save" className="mr-2" />
                {intl.formatMessage(SALVAR)}
              </button>
            </div>
          </>
        ) : (
          items.length !== 0 && (
            <div className="btn btn-outline-primary text-primary-500 float-right inputFileWrapper">
              <input type="file" onChange={handleInputFileChange} multiple />
              <Icon name="add" className="mr-2" />
              {intl.formatMessage(ADICIONAR)}
            </div>
          )
        )}
        <h4 className="font-normal mb-0">{intl.formatMessage(FOTOS)}</h4>
      </div>
      {items.length > 0 && (
        <Photos className="px-5 pb-5">
          <div className="flex flex-wrap -mx-2">
            {items.map(item => (
              <div key={item.id} className="photo-col w-1/2 md:w-1/3 px-2">
                <Photo className="ratio">
                  <span className="ratio-fill" style={{ paddingTop: '100%' }} />
                  <Tooltip
                    value={item.removed ? 'Restaurar foto' : 'Remover foto'}
                  >
                    <ToogleRemovedButton
                      className={`btn ${
                        item.removed ? 'btn-success block' : 'btn-error'
                      }`}
                      onClick={() => toggleImageRemoved(item)}
                    >
                      <Icon name={item.removed ? 'refresh' : 'remove'} />
                    </ToogleRemovedButton>
                  </Tooltip>
                  <PhotoImage
                    className={`ratio-body ${item.removed ? 'opacity-50' : ''}`}
                    style={
                      item.image && {
                        backgroundImage: `url('${item.image.image_url}')`,
                      }
                    }
                  >
                    {item.uploading && <ActivityIndicator size={48} />}
                  </PhotoImage>
                </Photo>
              </div>
            ))}
            {isDrafting && (
              <div className="photo-col w-1/2 md:w-1/3 px-2">
                <Photo className="ratio">
                  <span className="ratio-fill" style={{ paddingTop: '100%' }} />
                  <PhotoImage className="ratio-body">
                    <PhotoImageInputWrapper className="inputFileWrapper">
                      <input
                        type="file"
                        onChange={handleInputFileChange}
                        multiple
                      />
                      <PhotoImageInputLabel>
                        <Icon name="add_circle" className="mb-2" />
                        <span className="block text-sm leading-normal">
                          {intl.formatMessage(CLIQUE)}
                          <br />
                          {intl.formatMessage(ADICIONAR_FOTOS)}
                        </span>
                      </PhotoImageInputLabel>
                    </PhotoImageInputWrapper>
                  </PhotoImage>
                </Photo>
              </div>
            )}
          </div>
        </Photos>
      )}
      {items.length === 0 && (
        <div className="pb-8 px-4 text-center">
          <PlaceholderIcon name="image" />
          <span className="h4 block font-normal mb-2">
            {intl.formatMessage(FOTOS_VAGA)}
          </span>
          <span className="text-gray-600 block mb-4">
            {intl.formatMessage(VAGA_ATRATIVA)}
          </span>

          <div className="btn btn-outline-primary inputFileWrapper">
            <input type="file" onChange={handleInputFileChange} multiple />
            <Icon name="add" /> {intl.formatMessage(PRIMEIRAS_FOTOS)}
          </div>
        </div>
      )}
    </Container>
  )
}

ProjectManagePagePhotos.displayName = 'ProjectManagePagePhotos'

export default ProjectManagePagePhotos
