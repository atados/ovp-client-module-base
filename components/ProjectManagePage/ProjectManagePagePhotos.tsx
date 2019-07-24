import nanoid from 'nanoid'
import React, { useCallback, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { channel } from '~/common/constants'
import { fetchAPI } from '~/lib/fetch/fetch.server'
import { ImageDict } from '~/redux/ducks/channel'
import { Project, updateProject } from '~/redux/ducks/project'
import { User } from '~/redux/ducks/user'
import { RootState } from '~/redux/root-reducer'
import ActivityIndicator from '../ActivityIndicator'
import Icon from '../Icon'
import Tooltip from '../Tooltip'

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

  .col-4,
  .col-sm-3,
  .col-lg-2 {
    padding: 0 5px;
  }
`

const Container = styled.div`
  transition: box-shadow 0.2s;

  &.active {
    box-shadow: 0 0 0 3px ${channel.theme.colorPrimary};
  }
`

const PhotoImageInputWrapper = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  cursor: pointer;
  border: 2px dashed ${channel.theme.colorPrimary};

  &:hover {
    background: #e0e1e2;
  }
`

const PhotoImageInputLabel = styled.div`
  height: 100px;
  line-height: 1;
  text-align: center;
  position: absolute;
  color: ${channel.theme.colorPrimary};
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
  image?: ImageDict
  removed?: boolean
}

interface ProjectManagePagePhotosReduxProps {
  user: User
}

interface ProjectManagePagePhotosProps
  extends ProjectManagePagePhotosReduxProps {
  readonly className?: string
  readonly project: Project
  readonly onUpdateProject: (
    changes: Partial<Project> & { slug: string },
  ) => any
}

const ProjectManagePagePhotos: React.FC<ProjectManagePagePhotosProps> = ({
  className,
  user,
  project,
  onUpdateProject,
}) => {
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

      const promises: Array<Promise<ImageDict>> = []
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
            sessionToken: user.token,
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
        sessionToken: user.token,
      })

      onUpdateProject({
        slug: project.slug,
        galleries: project.galleries.map(galleryItem => {
          if (galleryItem.id === gallery!.id) {
            return gallery!
          }

          return galleryItem
        }),
      })
    } else {
      gallery = await fetchAPI('/gallery/', {
        method: 'POST',
        body: {
          name: 'loose',
          description: '',
          images,
        },
        sessionToken: user.token,
      })

      const galleries = [...project.galleries, gallery!]

      await fetchAPI(`/projects/${project.slug}/`, {
        method: 'PATCH',
        body: {
          galleries: galleries.map(galleryItem => ({
            id: galleryItem.id,
          })),
        },
      })

      onUpdateProject({
        slug: project.slug,
        galleries,
      })
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
      className={`radius-10 bg-white shadow mb-4 ${isDrafting ? 'active' : ''}${
        className ? ` ${className}` : ''
      }`}
    >
      <div className="p-4 pos-relative">
        {isDrafting ? (
          <>
            <div className="float-right">
              <button
                type="button"
                onClick={toggleEdtting}
                className="btn btn-muted mr-2"
              >
                <Icon name="close" className="mr-2" />
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmitChanges}
                disabled={isUploading}
              >
                <Icon name="save" className="mr-2" />
                Salvar alterações
              </button>
            </div>
          </>
        ) : (
          items.length !== 0 && (
            <div className="btn btn-outline-primary tc-primary float-right inputFileWrapper">
              <input type="file" onChange={handleInputFileChange} multiple />
              <Icon name="add" className="mr-2" />
              Adicionar fotos
            </div>
          )
        )}
        <h4 className="tw-normal mb-0">Fotos</h4>
      </div>
      {items.length > 0 && (
        <Photos className="px-4 pb-4">
          <div className="row">
            {items.map(item => (
              <div key={item.id} className="col-4">
                <Photo className="ratio">
                  <span className="ratio-fill" style={{ paddingTop: '100%' }} />
                  <Tooltip
                    value={item.removed ? 'Restaurar foto' : 'Remover foto'}
                  >
                    <ToogleRemovedButton
                      className={`btn ${
                        item.removed ? 'btn-success d-block' : 'btn-error'
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
              <div className="col-4">
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
                        <span className="d-block ts-small tl-base">
                          Clique para
                          <br />
                          adicionar mais fotos
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
        <div className="pb-5 px-3 ta-center">
          <PlaceholderIcon name="image" />
          <span className="h4 d-block tw-normal mb-2">Fotos da vaga</span>
          <span className="tc-muted d-block mb-3">
            Adicione fotos para deixar sua vaga mais atrativa e <br /> mostra
            como foi essa ação.
          </span>
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={toggleEdtting}
          >
            <Icon name="add" /> Adicionar primeiras fotos
          </button>
        </div>
      )}
    </Container>
  )
}

ProjectManagePagePhotos.displayName = 'ProjectManagePagePhotos'

const mapStateToProps = (
  state: RootState,
): ProjectManagePagePhotosReduxProps => ({ user: state.user! })

export default React.memo(
  connect(
    mapStateToProps,
    { onUpdateProject: updateProject },
  )(ProjectManagePagePhotos),
)
