import { SingleBar } from 'cli-progress'

export interface DownloadManagerOptions {
  concurrency: number
}

export interface DownloadOptions {
  bar?: SingleBar
  filename?: string
  saveDir?: string
  meta?: Record<string, any>
}

export enum DownloadEvent {
  downloaded = 'downloaded',
  error = 'error',
  done = 'done'
}
