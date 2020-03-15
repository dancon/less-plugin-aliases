/**
 * @fileoverview
 * @author houquan | houquan@bytedance.com
 * @version 1.0.0 | 2020-03-15 | houquan      // initial version
 */

declare namespace Less {
  interface FileContent {
    filename: string
    contents: string
  }

  interface FileContentWithError {
    error: Error
    filename: string
    contents: string
  }

  interface FileManager {
    new (): FileManager
    getPath?(filename: string): string
    tryAppendLessExtension?(filename: string): string
    alwaysMakePathsAbsolute?(): boolean
    isPathAbsolute(path: string): boolean
    join?(basePath: string, laterPath: string): string
    pathDiff?(path: string, basePath: string): string
    supportsSync?(filename: string, currentDirectory: string, options: Record<string, unknown>, environment: unknown): boolean
    supports?(filename: string, currentDirectory: string, options: Record<string, unknown>, environment: unknown): boolean
    loadFile(filename: string, currentDirectory: string, options: Record<string, unknown>, environment: unknown, callback: Function): Promise<FileContent>
    loadFileSync(filename: string, currentDirectory: string, options: Record<string, unknown>, environment: unknown, callback: Function): FileContentWithError
  }

  interface PluginManager {
    addFileManager (manager: Less.FileManager): void
  }
}

interface LessStatic {
  FileManager: Less.FileManager
}
