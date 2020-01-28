import { mergeMessages } from '../generate-intl-messages-files'

describe('Generate i18n messages', () => {
  it('should merge i18n messages correctly', () => {
    const defaultMessages = {
      name: 'default name',
      description: 'default description',
      resume: 'default resume',
      slogan: 'default slogan',
    }
    const baseMessages = { name: 'base name', description: 'base description' }
    const channelMessages = {
      description: 'channel description',
      resume: 'channel resume',
    }

    const finalMessages = mergeMessages(
      defaultMessages,
      baseMessages,
      channelMessages,
    )

    expect(finalMessages).toMatchObject({
      name: 'base name',
      description: 'channel description',
      resume: 'channel resume',
      slogan: 'default slogan',
    })
  })
})
