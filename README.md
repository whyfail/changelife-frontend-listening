# ChangeLife Daily Listening

一个面向英语初学者的美式英语听力应用。项目包含 12 期 CEFR A1-A2 日常旁白和 1 期连读、弱读与缩读专项训练，并提供逐句同步的英汉字幕。

[在线体验](https://whyfail.github.io/changelife-frontend-listening/)

## 功能

- 13 期听力内容，包括日常主题旁白和连读、弱读、缩读专项训练
- 温和自然的美式女声，A1 节目约 90–93 词/分钟
- 英文、中文及双语字幕模式
- 音频进度与字幕逐句同步
- 自动跟随当前句，支持点击句子跳转播放
- 节目搜索、播放速度、音量与前后跳转控制
- 单曲循环、顺序播放和随机播放模式
- 桌面端和移动端响应式布局
- 纯 HTML、CSS 和 JavaScript，无需构建

## 本地运行

直接打开 `index.html` 即可使用。也可以通过任意静态文件服务器运行：

```bash
python3 -m http.server 8080
```

然后访问 `http://localhost:8080`。

## 内容

每个节目目录包含单人旁白 MP3、英汉文本、Markdown 字幕和带精确分段时间的 JSON 数据。

| # | Topic | Words | Audio |
|---:|---|---:|---:|
| 1 | [Small Steps Every Day](01-small-steps-every-day/transcript.md) | 228 | 120.0s |
| 2 | [A Quiet Morning](02-a-quiet-morning/transcript.md) | 236 | 120.0s |
| 3 | [The Power of Listening](03-the-power-of-listening/transcript.md) | 228 | 120.0s |
| 4 | [The Power of Kind Words](04-the-power-of-kind-words/transcript.md) | 229 | 120.0s |
| 5 | [When You Feel Nervous](05-when-you-feel-nervous/transcript.md) | 220 | 120.0s |
| 6 | [A Walk After Dinner](06-a-walk-after-dinner/transcript.md) | 244 | 120.0s |
| 7 | [A Break from Your Phone](07-a-break-from-your-phone/transcript.md) | 241 | 120.0s |
| 8 | [Making a New Friend](08-making-a-new-friend/transcript.md) | 220 | 120.0s |
| 9 | [A Peaceful Night](09-a-peaceful-night/transcript.md) | 231 | 120.0s |
| 10 | [Believe in Yourself](10-believe-in-yourself/transcript.md) | 230 | 120.0s |
| 11 | [A Cup of Water](11-a-cup-of-water/transcript.md) | 181 | 120.0s |
| 12 | [A Quiet Evening Walk](12-a-quiet-evening-walk/transcript.md) | 185 | 120.0s |
| 13 | [Connected Speech Practice](13-connected-speech-practice/transcript.md) | 40 exercises | 338.7s |

## 连读与弱读训练

第 13 期根据《英语听力中的连读、弱读与缩读》整理，覆盖 40 个高频例子，包括 `can`、`to`、`for` 等弱读，`did you`、`what are you` 等连读与同化，以及 `gonna`、`wanna`、`shoulda` 等常见口语缩读。

每个练习先以较慢语速朗读一次完整形式，再以自然美式口语朗读两遍。字幕同时标出完整形式、自然口语形式、中文意思及对应的语音现象。原始学习文档保存在 [reference.md](13-connected-speech-practice/reference.md)。

## 项目结构

```text
.
|-- index.html          # 页面结构
|-- styles.css          # 响应式样式
|-- app.js              # 播放器与字幕交互
|-- content-data.js     # 节目元数据和逐句时间轴
|-- assets/             # 品牌图标
`-- 01-.../13-.../      # 每期音频和英汉内容
```

## 内容说明

英语旁白和中文翻译为语言学习场景原创内容，语音使用 MiniMax Speech 2.8 HD 生成。连读与弱读的实际发音会随口音、语速和说话人而变化；内容经过人工校对，但不能替代专业语言课程。

## License

[MIT](LICENSE)
