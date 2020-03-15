/**
 * @fileoverview the utils function for custom render
 * @author houquan | houquan@bytedance.com
 * @version 1.0.0 | 2020-03-16 | houquan      // initial version
 */

import path from 'path'
import less from 'less'
import tsModule from 'typescript/lib/tsserverlibrary'

import LessPluginAliases from './index'

export interface Logger {
  log: (msg: string) => void
  error: (error: Error) => void
}

export interface InjectOptionsFromTSPlugin {
  filename: string
  compilerOptions: tsModule.CompilerOptions
  logger: Logger
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

export function createCustomRender (options: Less.Options & {prefix?: string}) {
  const { prefix = '~', ...lessOpts } = options
  return function (css: string, { filename, compilerOptions }: InjectOptionsFromTSPlugin): string {
    let transforedCSS = ''

    const aliases = transformPathsToAliase(compilerOptions)
    less.render(css, {
      syncImport: true,
      filename,
      plugins: [
        new LessPluginAliases({
          prefix,
          aliases
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
