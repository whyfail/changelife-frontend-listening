# ChangeLife Frontend Listening

一个面向英语初学者的前端技术新闻听力应用。项目包含 10 期 CEFR A1（小学英语水平）双人对话，每期约 2 分钟，并提供逐句同步的英汉字幕。

[在线体验](https://whyfail.github.io/changelife-frontend-listening/)

## 功能

- 10 期前端技术新闻英语听力，每期约 2 分钟
- 英文、中文及双语字幕模式
- 音频进度与字幕逐句同步
- 自动跟随当前句，支持点击句子跳转播放
- 节目搜索、播放速度、音量与前后跳转控制
- 桌面端和移动端响应式布局
- 纯 HTML、CSS 和 JavaScript，无需构建

## 本地运行

直接打开 `index.html` 即可使用。也可以通过任意静态文件服务器运行：

```bash
python3 -m http.server 8080
```

然后访问 `http://localhost:8080`。

## 内容

每个节目目录包含双人对话 MP3、英汉文本、Markdown 字幕和结构化 JSON 数据。

| # | Topic | Words | Audio | Source |
|---:|---|---:|---:|---|
| 1 | [React Foundation Launches](01-react-foundation/transcript.md) | 260 | 120.0s | [2026-02-24](https://react.dev/blog/2026/02/24/the-react-foundation) |
| 2 | [React Compiler's First Stable Release](02-react-compiler-1/transcript.md) | 246 | 120.0s | [2025-10-07](https://react.dev/blog/2025/10/07/react-compiler-1) |
| 3 | [Vite 8.0 Released](03-vite-8/transcript.md) | 259 | 120.0s | [2026-03-12](https://vite.dev/blog/announcing-vite8) |
| 4 | [Vite 8.1 Is Out!](04-vite-8-1/transcript.md) | 251 | 120.0s | [2026-06-23](https://vite.dev/blog/announcing-vite8-1) |
| 5 | [TypeScript 7 Release: Faster Compiler](05-typescript-7/transcript.md) | 247 | 120.0s | [2026-07-08](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/) |
| 6 | [New Web UI Tools at Google I/O 2026](06-new-web-ui-2026/transcript.md) | 247 | 120.0s | [2026-07-01](https://developer.chrome.com/blog/new-in-web-ui-io26) |
| 7 | [Chrome 150 DevTools Update](07-chrome-devtools-150/transcript.md) | 263 | 120.0s | [2026-06-30](https://developer.chrome.com/blog/new-in-devtools-150) |
| 8 | [New in Chrome 150](08-chrome-150/transcript.md) | 262 | 120.0s | [2026-06-30](https://developer.chrome.com/blog/new-in-chrome-150) |
| 9 | [Chrome 151 Simplifies Camera and Mic Access](09-usermedia-element/transcript.md) | 249 | 120.0s | [2026-06-29](https://developer.chrome.com/blog/usermedia-html-element) |
| 10 | [Smarter Clipboard Reading](10-selective-clipboard-read/transcript.md) | 267 | 120.0s | [2026-07-03](https://developer.chrome.com/blog/selective-format-read) |

## 项目结构

```text
.
|-- index.html          # 页面结构
|-- styles.css          # 响应式样式
|-- app.js              # 播放器与字幕交互
|-- content-data.js     # 节目元数据和逐句时间轴
|-- assets/             # 品牌图标
`-- 01-.../10-.../      # 每期音频和英汉内容
```

## 内容说明

节目主题基于表格中链接的官方技术新闻整理，英语对话和中文翻译用于语言学习。项目与 React、Vite、TypeScript、Google 或 Chrome 官方无隶属关系。

## License

[MIT](LICENSE)
