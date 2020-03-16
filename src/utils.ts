/**
 * @fileoverview the utils function for custom render
 * @author houquan | houquan@bytedance.com
 * @version 1.0.0 | 2020-03-16 | houquan      // initial version
 */

import path from 'path'
import fs from 'fs'
import less from 'less'
import findUp from 'find-up'
import JSON5 from 'json5'
import tsModule from 'typescript/lib/tsserverlibrary'

import LessPluginAliases from './index'

export interface Logger {
  log: (msg: string) => void
  error: (error: Error) => void
}

export interface InjectOptionsFromTSPlugin {
  fileName: string
  compilerOptions: tsModule.CompilerOptions
  logger: Logger
}

const checkExtList = [ ".less", ".css" ]

export function normalizePath (filename: string) {
  if (/\.(?:less|css)$/i.test(filename)) {
    return fs.existsSync(filename) ? filename : undefined
  }

  for (let i = 0, len = checkExtList.length; i < len; i ++) {
    const ext = checkExtList[i]
    if (fs.existsSync(`${filename}${ext}`)) {
      return `${filename}${ext}`
    }
  }
}

export function transformPathsToAliase ({ paths, baseUrl }: tsModule.CompilerOptions = {}): Record<string, string[]> {
  const aliase: Record<string, string[]> = {}
  if (paths && baseUrl) {
    Object.keys(paths).forEach((key) => {
      const pathList = paths[key]
      if (key.endsWith('/*')) {
        key = key.slice(0, key.length - 2)
      }
      aliase[key] = pathList.map((p) => path.resolve(baseUrl, p.endsWith('/*') ? p.slice(0, p.length - 2) : p))
    })
  }

  return aliase
}

export function readTSConf () {
  const tsconfPath = findUp.sync('tsconfig.json')

  if (!tsconfPath) {
    return {}
  }
  const tsconfigJSON = JSON5.parse(fs.readFileSync(tsconfPath).toString()) || {}
  return tsconfigJSON.compilerOptions || {}
}

export function createCustomRender (options: Less.Options & {prefix?: string}) {
  const { prefix = '~', ...lessOpts } = options
  return function (css: string, { fileName: filename, logger, compilerOptions = readTSConf() }: InjectOptionsFromTSPlugin): string {
    let transforedCSS = ''

    const aliases = transformPathsToAliase(compilerOptions)
    less.render(css, {
      syncImport: true,
      filename,
      plugins: [
        new LessPluginAliases({
          prefix,
          aliases,
          logger
        })
      ],
      ...lessOpts
    }, (error, output) => {
      if (error || output === undefined) {
        throw error
      }
      transforedCSS = output.css.toString()
    })

    return transforedCSS
  }
}
