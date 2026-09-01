# Backie

[English](README.md)

Backie 是一个轻量的浏览器工具，用来制作带动画的柔和渐变背景。

**[立即打开 Backie](https://backie.acroonic.com/)**

![Backie 预设浏览器](assets/backie-preview.jpg)

## 使用方法

1. 打开 **Explore Presets（浏览预设）**，选择一个喜欢的起点。
2. 打开 **Customise（自定义）**，调整构图、运动方式、模糊、泛光、不透明度和混合模式。
3. 使用底部的颜色控件编辑画布和光晕颜色。锁定颜色后，随机生成时该颜色会保持不变。
4. 打开 **Export（导出）**，复制可直接使用的 CSS 或 React 代码。

当前设置会保存在 URL 中，因此可以收藏或分享一个设计链接。Backie 完全在浏览器中运行，不需要账号或 API 密钥。

## 功能

- 带动画的柔和渐变画布，支持静止、平缓、流动和混沌四种运动方式
- 预设包含极光、珍珠、海洋、天鹅绒、玻璃、抹茶、日落和薰衣草等风格
- 精细调整颜色、模糊、泛光、不透明度、混合模式和构图
- 支持锁定颜色、随机生成调色板、撤销历史记录、全屏和暂停
- 一键复制 CSS 和 React 代码，用于其他项目

快捷键：`Space` 暂停或继续动画，`R` 生成新的调色板，`Esc` 关闭当前面板。

## 开发

要求：Node.js 20.19 或更高版本。

```sh
npm install
npm run dev
```

开发服务器默认运行在 `http://localhost:3000`。

## 常用命令

- `npm run dev` 启动 Vite 开发服务器
- `npm run lint` 运行 TypeScript 类型检查
- `npm run build` 将生产版本构建到 `dist/`
- `npm run preview` 在本地预览生产版本

Backie 是纯前端应用，不需要 API 密钥、数据库或服务端运行环境。

## 许可证

MIT，详见 [LICENSE](LICENSE)。
