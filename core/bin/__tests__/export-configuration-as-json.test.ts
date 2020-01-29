import { main as exportConfigurationAsJson } from '../export-configuration-as-json'
import path from 'path'
import legacyFs from 'fs'
import legacyMkdirp from 'mkdirp'

jest.mock('mkdirp', () =>
  jest.fn().mockImplementation((_, callback) => callback(null)),
)
jest.mock('fs', () => ({
  writeFile: jest
    .fn()
    .mockImplementation((_, __, ___, callback) => callback(null)),
}))

const { writeFile } = (legacyFs as any) as {
  writeFile: jest.Mock<typeof legacyFs>
}
const mkdirp: jest.Mock<typeof legacyMkdirp> = legacyMkdirp as any

describe('Export configuration as json', () => {
  it('should load base configuration and write channel/generated/app.json', async () => {
    await exportConfigurationAsJson()
    expect(mkdirp).toBeCalledTimes(1)
    expect(writeFile).toBeCalledTimes(1)
    const [outputPath, outputJson] = writeFile.mock.calls[0]
    const exportedConfig = JSON.parse(outputJson)
    expect(exportedConfig).toMatchObject({
      id: 'default',
    })
    expect(outputPath).toBe(path.resolve('channel', 'generated', 'app.json'))
  })
})
