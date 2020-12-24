# less-plugin-aliases

A less plugin work with typescript-plugin-css-modules

# Integration method

## 1. Work with webpack and [typscript-plugin-css-modules](https://github.com/mrmckeb/typescript-plugin-css-modules)

```json5
{
  "compilerOptions": {
    "plugins": [
      {
        "name": "typescript-plugin-css-modules",
        "options": {
          "classnameTransform": "camelCase",
          "customMatcher": "\\.less$",
          "customRenderer": "node_modules/less-plugin-aliases/lib/customRender.js"
        }
      }
    ],

    // @import '~antd/es/style/themes/default.less';
    // ===>
    // resovle to '/workspace/project/node_modules/antd/es/style/themes/default.less'
    "paths": {
      "antd/*": ["node_modules/antd/*"]
    }

    // ...
  }
}
```

## 2. Work alone with less

```ts
  import less from 'less'
  import LessPluginAliases from 'less-plugin-aliases'

  less.render(css, {
    ...
    plugins: [
      new LessPluginAliases({
        prefix: '~',
        aliases: {
          common: path(__dirname, 'src/common') // resovle to '/workspace/project/src/common'
        }
      })
    ]
  })
```

index.less

```less
@import '~common/variables.less';

.container {
  padding: 32px;
  font-size: @fontSize;
  background: @white;

  .header-title {
    font-size: 16px;
  }
}
```

The plugin will resolve `~common/variables.less` to `/workspace/project/src/common/variables.less`.
