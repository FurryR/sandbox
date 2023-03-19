# Sandbox

一个简单的 Worker Sandbox，沉浸式。

## 优点

- 比 Python in Gandi 强得不知道哪里去了。
- 比 A营/ClipCC的迷惑 Javascript 功能好。

## 编译

### 发布版

```bash
npm i
npm run build # 单次编译。
npm run watch (--command="编译完成执行的额外命令，可省略") # 基于监听更改的编译。
```

### 调试版

```bash
npm i
npm run debug # 单次编译。
npm run debug-watch (--command="编译完成执行的额外命令，可省略") # 基于监听更改的编译。
```

## 使用

### 自定义扩展

请参照 [我的文章](https://www.ccw.site/post/109edca6-8fd7-4e9c-8462-dcc06ec38988)。

请对 `dist/main.js` 进行这个操作，然后即可在测试插件中使用。

### CCW 官方插件

待审核。

## 版权信息

Copyright(c) FurryR & VeroFess 2023.
This program was licensed under the MIT License.

制作人员列表请参照 [CREDITS](./CREDITS.md)。
