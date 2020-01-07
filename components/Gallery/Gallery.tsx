import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { ImageDict } from '~/common/channel'

const Nav = styled.nav`
  position: fixed;
  background: rgba(0, 0, 0, 0.6);
  padding: 0.75rem;
  bottom: 0;
  left: 0;
  right: 0;
  overflow-x: auto;
  white-space: nowrap;
  text-align: center;
`

const Item = styled.button`
  background-color: rgba(0, 0, 0, 0.3);
  width: 80px;
  height: 80px;
  border: 2px solid #fff;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.1);
  display: inline-block;
  margin-right: 10px;
  border-radius: 10px;
  opacity: 0.5;

  &.active {
    opacity: 1;
  }
`

const ActiveImage = styled.img`
  position: fixed;
  left: 0;
  right: 0;
  top: 50px;
  bottom: 150px;
  border-radius: 10px;
  max-height: 80vh;
  margin: auto;
`

interface GalleryProps {
  readonly className?: string
  readonly defaultImageId?: number
  readonly images: ImageDict[]
}

const Gallery: React.FC<GalleryProps> = ({
  className,
  defaultImageId,
  images,
}) => {
  const [activeImageId, setActiveImageId] = useState(defaultImageId)
  const activeImage = useMemo(
    () => images.find(image => image.id === activeImageId),
    [activeImageId],
  )
  useEffect(() => {
    const fn = ({ code }: KeyboardEvent) => {
      if (code === 'ArrowRight') {
        setActiveImageId(prevActiveImageId => {
          let activeImageIndex = -1

          images.some((image, index) => {
            if (image.id === prevActiveImageId) {
              activeImageIndex = index
            }

            return false
          })

          const nextImage =
            images[
              activeImageIndex === images.length - 1 ? 0 : activeImageIndex + 1
            ]

          return nextImage.id
        })
      } else if (code === 'ArrowLeft') {
        setActiveImageId(prevActiveImageId => {
          let activeImageIndex = -1

          images.some((image, index) => {
            if (image.id === prevActiveImageId) {
              activeImageIndex = index
            }

            return false
          })

          const prevImage =
            images[
              activeImageIndex === 0 ? images.length - 1 : activeImageIndex - 1
            ]

          return prevImage.id
        })
      }
    }

    document.addEventListener('keydown', fn)

    return () => document.removeEventListener('keydown', fn)
  }, [images, setActiveImageId])

  return (
    <div className={className}>
      {activeImage && (
        <ActiveImage src={activeImage.image_url || activeImage.image_medium} />
      )}
      <Nav>
        {images.map(image => (
          <Item
            key={image.id}
            className={`bg-cover bg-center ${
              activeImageId === image.id ? 'active' : ''
            }`}
            style={{
              backgroundImage: `url('${image.image_url ||
                image.image_medium}')`,
            }}
            onClick={() => setActiveImageId(image.id)}
          />
        ))}
      </Nav>
    </div>
  )
}

Gallery.displayName = 'Gallery'

export default Gallery
