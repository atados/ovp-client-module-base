import { exec, ExecOptions } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'

export const REPO_DIR = path.resolve('tmp/.base')
export const execAsync = (command: string, options?: ExecOptions) =>
  new Promise((resolve, reject) => {
    exec(command, options, (error, stdout) => {
      if (error) {
        reject(error)
        return
      }

      resolve(stdout)
    })
  })

export const readFile = (filepath: string): Promise<string> =>
  new Promise((resolve, reject) => {
    fs.readFile(filepath, 'utf8', (error, body) => {
      if (error) {
        reject(error)
        return
      }

      resolve(body)
    })
  })

export const writeFile = (filepath: string, content: string): Promise<string> =>
  new Promise((resolve, reject) => {
    fs.writeFile(filepath, content, 'utf8', error => {
      if (error) {
        reject(error)
        return
      }

      resolve(filepath)
    })
  })
