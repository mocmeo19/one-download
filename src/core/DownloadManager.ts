import Events from 'events'
import PQueue from 'p-queue'
import { DownloadEvent, DownloadManagerOptions, DownloadOptions } from './types'
import CliProgress from 'cli-progress'
import download from './Download'

export default class DownloadManager extends Events {
  queue: PQueue
  progressBar
  constructor(options?: Partial<DownloadManagerOptions>) {
    super()
    this.queue = new PQueue({
      concurrency: options?.concurrency || 1
    })
    this.progressBar = new CliProgress.MultiBar({
      hideCursor: null,
      clearOnComplete: true,
      format: '{id} [{bar}] {percentage}% | ETA: {eta}s | {value}/{total} | {name}'
    }, CliProgress.Presets.shades_grey)
    this.progressBar.on('stop', () => {
      this.emit('done')
    })
  }
  download(url: string, options?: DownloadOptions) {
    this.queue.add(() => {
      const bar = this.progressBar.create(1000, 0, { name: '##' } )
      return download(url, {
        bar,
        saveDir: options?.saveDir,
        filename: options?.filename,
        meta: options?.meta
      })
        .then(() => {
          return new Promise((resolve) => {
            setTimeout(() => {
              this.progressBar.remove(bar)
              this.emit(DownloadEvent.downloaded, url)
              resolve(true)
            }, 500)
          })
        })
    })
      .catch(e => {
        this.emit(DownloadEvent.error, e)
      })
  }
  on(event: DownloadEvent, handler: any) {
    return super.on(event, handler)
  }
}
