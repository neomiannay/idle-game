import path from 'path'

import { globSync } from 'glob'
import { SassPreprocessorOptions } from 'vite'

const sassOptions: SassPreprocessorOptions = {
  api: 'modern-compiler',
  silenceDeprecations: ['legacy-js-api', 'import'],
  additionalData (source, filename) {
    const relativePath = path.relative(path.resolve(), filename)
    let prepend = ''
    if (~relativePath.indexOf('/libs/')) return prepend + source

    const cores = globSync(path.resolve(path.resolve(), './src/styles/core/**/*.scss'))
    const libs = globSync(path.resolve(path.resolve(), './src/styles/libs/**/*.scss'))
    const layout = globSync(path.resolve(path.resolve(), './src/styles/layout/styling.module.scss'))

    const files = [...cores, ...libs, ...layout]
    files.forEach((file) => (prepend += '@import "' + file + '"; \n'))

    const split = source.split(/(@use.*;)/g)
    split.splice(split.length - 1, 0, prepend)
    return split.join('\n')
  }
}

export default sassOptions
