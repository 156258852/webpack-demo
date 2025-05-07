module.exports = {
  settings: {
    react: {
      version: "999.999.999",
    },
  },
  extends: [
    "eslint:recommended", // 使用 eslint 推荐规则
    "plugin:react/recommended", // 添加 react 插件
  ],
  parser: "@babel/eslint-parser",
  parserOptions: {
    requireConfigFile: false, // 禁用配置文件
    babelOptions: {
      presets: [
        "@babel/preset-react", // 添加 react preset
        "@babel/preset-typescript",
        "@babel/preset-env", //  添加 env preset，
      ],
    },
  },
  env: {
    jest: true,
    browser: true, // 是否支持浏览器环境
    commonjs: true, // 是否支持 commonjs
    es6: true, // 是否支持 es6
  },
  globals: {
    // 全局变量,使用不会报错
    ReactDOM: true,
    React: true,
    process: true,
    module: true,
    __dirname: true,
    __filename: true,
  },
  plugins: ["react", "react-hooks", "import"],
  rules: {
    // import
    "import/prefer-default-export": 0, // 不要偏好默认导出
    "import/no-unresolved": 0, // 忽略未解析的导入
    "import/order": [
      "error",
      {
        //  导入顺序
        groups: [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index",
        ], // nodejs模块、node_modules、src路径、父级、同级、index
      },
    ],

    // react
    "react/jsx-key": 1, // 循环中需要有key
    "react/jsx-indent": [1, 2], // jsx缩进
    "react/jsx-indent-props": 2, // jsx属性缩进
    "react/jsx-no-target-blank": 0, // 忽略 target 使用的警告
    "react/jsx-closing-tag-location": 0, // 不要想着标签严格缩进匹配
    "react/jsx-filename-extension": [
      1,
      { extensions: [".js", ".jsx", ".ts", ".tsx"] },
    ], // 只允许在JS/JSX出现JSX
    "react/no-unused-state": 2, // 不要出现没有使用的 state
    "react/prop-types": 0, // 关闭 prop-types
    "react/no-array-index-key": 0, // 允许使用数组索引
    "react/jsx-no-undef": [2, { allowGlobals: true }],
    "react/no-danger": 2,
    "react/display-name": 0,
    "react/no-access-state-in-setstate": 1,
    "react/no-deprecated": 0,

    // react hooks
    "react-hooks/rules-of-hooks": 2, // 检查 Hook 的规则
    "react-hooks/exhaustive-deps": 0, // 检查 effect 的依赖

    // Custom
    eqeqeq: 2, // 禁止使用 ==
    "no-script-url": 2, // 不允许 javascript:void(0) 的写法
    "no-unused-expressions": 0,
    "dot-notation": 0, // 获取对象属性不是必须用点
    "no-param-reassign": 0, // 允许复写参数
    "no-console": 1, // 警告 console.log 使用
    "no-plusplus": 0, // 允许自增操作
    "prefer-destructuring": 0, // 不要老想着解构
    semi: [1, "always"], // 双引号
    "one-var": 0, // 不管你变量声明的方式了
    "arrow-parens": [0, "always"], // 箭头函数参数应该始终包含括号
    indent: [1, 2, { SwitchCase: 1 }], // 2空格缩进，否则警告
    "no-unused-vars": 1, // 未使用的变量进行警告
    "arrow-body-style": [1, "as-needed"], // 箭头函数可以去掉括号就去掉括号
    "max-len": 0, // 不限制单行长度
    "no-bitwise": 0, // 允许位运算
    radix: 0, // parseInt 不强制要求第二个参数
    "array-callback-return": 1, // 应该return的没有return的进行警告
    "no-restricted-globals": 2, // 不要直接使用 global 的东西
    "require-atomic-updates": 0, // 不允许异步更新
    "no-nested-ternary": 0, // 不允许嵌套三元运算
    "no-multi-spaces": 2, // 不允许多个空格
    "object-curly-spacing": ["error", "always"], // 对象大括号前后要有空格
    "comma-spacing": ["error", { before: false, after: true }],
    "key-spacing": ["error", { afterColon: true }], // 对象key后面要有空格
    "space-in-parens": ["error", "never"], // 括号内不允许有空格
  },
  // ignorePatterns: ['config/**/*.js']
};
