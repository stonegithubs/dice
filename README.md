# Dice HTML 源代码

### 依赖安装
```
npm install
```

### 本地开发环境运行（支持热加载）
```
npm run serve
```

### 压缩编译生成上线源码
```
npm run build
```

### 前端核心源码

这里只是前端源码，不包含 server 及合约代码

#### 位置

前端核心源码位置在 src 目录下，遵循 vue-cli init 初始化的 vue 项目目录结构，其中：

- components，存放页面中相应的组件
- locale，存放 i18n 的多国界面语言包

#### 相关组件

- Header.vue 页面头部区域
- Footer.vue 页面底部区域
- Stage.vue 下注主舞台区域
- Coin.vue 猜硬币的投注区，用户可以点击选择相应的硬币（正面/反面）
- Dice.vue 摇骰子的投注区，用户可以点击选择相应的骰子数（1-6）
- Dice2.vue 两个骰子的投注区，用户可以点击选择相应的筛子之和（2-12）
- Roll.vue 过山车的投注区域，用户可以拖动选择下注的区间（1-97）
- Chance.vue 界面中中间一栏，根据用户投注金额等实时呈现用户中奖机会等数据
- History.vue 历史记录区域
- DataStat.vue 汇总游戏统计数据
- LocaleSelector.vue 语言选择区域
- Logo.vue Logo 区域
- Social.vue 页面社区分享区域

#### 语言包

- zh-CN.js 简体中文
- en.js 英文
- jp.js 日文
- kr.js 韩语
- ru.js 俄语

#### 首次运行

通过 npm run serve 方式本地运行时，可能需要在 url 地址后面手动输入相应游戏的名字hash(coin/dice/dice2/roll)，比如：

    http://localhost:8080/#coin

首次运行可能会出错，有几个地方需要做修改，统计可能不全，也未经本地测试，如果运行出错，大部分错误都能通过 Vue 的 chrome 插件快速定位修改

- 调整编译目标保存目录（vue.config.js）
    - 其中 outputDir 一项需要修改，调整为编译后文件存放位置，可以删除这行配置，默认编译后文件存在 dist 目录下
- 修改 web3 的普通浏览器环境 provider（main.js）
    - 开发时的私链（http://192.168.1.3:9656），你们可能需要自己配置
    - 线上环境（https://mainnet.infura.io/v3/xxxxxx），你们需要使用自己申请的key
- 搜索所有文件中的 fck.com 字样
    - 浏览代码上下文能判断当前字样的作用，进行相应的修改替换
- 服务端接口
    - 服务端接口是当前域下的 /api/xxxxxx 路径进行请求的

#### 发布上线

发布上线运行 npm run build 后会生成可供上线的编译后的前端源代码，自动存放在经过上面修改后的目录下
