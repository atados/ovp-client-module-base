import { mergeMessages } from '../generate-intl-messages-files'

describe('Generate i18n messages', () => {
  it('should merge i18n messages correctly', () => {
    const baseMessages = {
      name: 'base name',
      description: 'base description',
      resume: 'base resume',
      slogan: 'base slogan',
    }
    const channelDefaultMessages = {
      name: 'default name',
      description: 'default description',
    }
    const channelMessages = {
      description: 'channel description',
      resume: 'channel resume',
    }

    const finalMessages = mergeMessages(
      baseMessages,
      channelDefaultMessages,
      channelMessages,
    )

    expect(finalMessages).toMatchObject({
      name: 'default name',
      description: 'channel description',
      resume: 'channel resume',
      slogan: 'base slogan',
    })
  })
})
