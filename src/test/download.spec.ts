import DownloadManager from '../core/DownloadManager'

describe('Test Download Suite', function () {
  it('should download successfully', async function () {
    const manager = new DownloadManager({
      concurrency: 1
    })

    for (let i = 0; i < 1000; i++) {
      manager.download('https://www.google.com')
    }
  })
})
