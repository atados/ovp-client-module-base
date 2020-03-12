import { fetchAPI } from '../lib/fetch/fetch.client'
import { useSelector } from 'react-redux'
import { ReduxState } from '../redux/root-reducer'
import { API } from '~/types/api'

const RE_VALID_TYPE = /image\/(jpe?g|png)/gi
interface UploadImageFileOptions {
  onLoadPreview?: (src: string) => void
}

export const useImageUpload = () => {
  const viewer = useSelector((reduxState: ReduxState) => reduxState.user)

  return async (
    file: File,
    { onLoadPreview }: UploadImageFileOptions = {},
  ): Promise<API.ImageDict> => {
    if (!viewer) {
      throw new Error('Trying to use useFileUpload without viewer')
    }

    if (!file || !RE_VALID_TYPE.test(file.type)) {
      const error = new Error('Invalid image type')
      error.name = 'InvalidType'

      throw error
    }

    const fileReader = new FileReader()

    let returned: boolean = false
    if (onLoadPreview) {
      fileReader.onload = () => {
        if (returned) {
          return
        }

        onLoadPreview(String(fileReader.result))
      }
      fileReader.readAsDataURL(file)
    }

    // Create form data to send image file
    const formData = new FormData()
    formData.append('image', file)

    const imageDict = await fetchAPI<API.ImageDict>('/uploads/images/', {
      method: 'POST',
      body: formData,
      sessionToken: viewer.token,
    })

    // Indicate that the file was already uploaded to prevent the state updates with a preview
    // after updating with the uploaded image url
    returned = true

    return imageDict
  }
}
