import React from 'react'
import styled from 'styled-components'
import cx from 'classnames'
import { API } from '~/base/types/api'

const ImageBackground = styled.div`
  background-position: center;
  background-repeat: no-repeat;
`

interface AvatarProps {
  readonly className?: string
  readonly fallBackClassName?: string
  readonly image?: API.ImageDict
}

const Avatar: React.FC<AvatarProps> = ({
  className,
  fallBackClassName,
  image,
  children,
}) => {
  return (
    <ImageBackground
      className={cx(className, !image && fallBackClassName)}
      style={
        image
          ? {
              backgroundImage: `url('${image.image_medium_url ||
                image.image_url}')`,
              backgroundColor: '#fff',
            }
          : undefined
      }
    >
      {children}
    </ImageBackground>
  )
}

Avatar.displayName = 'Avatar'

export default Avatar
