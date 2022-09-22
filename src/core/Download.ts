import got from 'got'
import { DownloadOptions } from './types'
import path from 'path'
import { createWriteStream } from 'fs'
import { pipeline } from 'stream/promises'

export default function download(url: string, options?: DownloadOptions) {
  return new Promise<void>((resolve, reject) => {
    const parsedUrl = new URL(url)
    const fileName = path.basename(parsedUrl.pathname)
    const readStream = got.stream(url, { throwHttpErrors: false })

    const onError = (e: any) => {
      reject(e)
    }

    readStream.on('downloadProgress', progress => {
      options?.bar?.setTotal(progress.total)
      options?.bar?.update(progress.transferred, { name: fileName })
    })
    readStream.resume()
    readStream.once('end', resolve)
    readStream.once('error', onError)
    readStream.on('close', () => console.log('close'))
    readStream.on('response', async (response) => {
      readStream.off('error', onError)
      try {
        const savePath = path.join(options?.saveDir || __dirname, options?.filename || fileName)
        await pipeline(readStream, createWriteStream(savePath))
      } catch (error) {
        onError(error)
      }
    })
  })

}
