/**
 * @fileoverview the custom render for typescript-plugin-css-modules
 * @author houquan | 870301137@qq.com
 * @version 1.0.0 | 2020-03-15 | houquan      // initial version
 */

import { createCustomRender } from './utils'

/**
 * less options
 *
 * @see http://lesscss.org/usage/#less-options
 */
export = createCustomRender({ prefix: '~', javascriptEnabled: true })
