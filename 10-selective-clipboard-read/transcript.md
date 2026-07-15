# Smarter Clipboard Reading

- Level: CEFR A1 / US elementary grades 3-5
- English words: 267
- Source date: 2026-07-03
- Official source: [Selective format read: Better defaults for the Async Clipboard API](https://developer.chrome.com/blog/selective-format-read)

## Bilingual Dialogue

**Mia:** Hey Ben! I just read that Chrome and Edge have a new clipboard feature starting in version 149.

**米娅：** 嘿 Ben！我刚读到 Chrome 和 Edge 在 149 版本中推出了一个新的剪贴板功能。

**Ben:** Oh, that sounds interesting! What does this new feature actually do for us?

**本：** 哦，听起来很有趣！这个新功能对我们有什么实际作用？

**Mia:** It’s part of the Async Clipboard API, which is like a smart clipboard that only grabs what your app asks for.

**米娅：** 它是 Async Clipboard API 的一部分，就像一个只会获取你所需内容的智能剪贴板。

**Ben:** So, does it still check everything on the clipboard before it knows what’s there?

**本：** 那么，它在知道剪贴板有什么之前，还会检查所有内容吗？

**Mia:** No! Now it first asks the clipboard, ‘What formats do you have?’ and gets a short list without loading all data.

**米娅：** 不！现在它先询问剪贴板‘有哪些格式？’然后得到一个简短的列表，而不用加载所有数据。

**Ben:** That sounds faster. Does that mean it only loads the part you need, like plain text or HTML?

**本：** 听起来更快了。这意味着它只加载你需要的那部分，比如纯文本或 HTML 吗？

**Mia:** Exactly! If you need plain text, the browser only grabs the text, not pictures or other stuff.

**米娅：** 没错！如果你需要纯文本，浏览器只会获取文字，不会获取图片或其他内容。

**Ben:** Great! So the paste action should feel quicker and use less memory on my computer.

**本：** 太好了！所以粘贴操作会感觉更快，而且会占用我电脑上更少的内存。

**Mia:** Yes, and the cool part is that old apps get this boost automatically without any extra code.

**米娅：** 是的，而且更棒的是，旧的应用会自动获得这种提升，不需要额外的代码。

**Ben:** So developers don’t have to change their apps to see the improvement?

**本：** 所以开发者不需要改动应用就能看到改进吗？

**Mia:** Right! The browsers already handle the smart format list, so any existing code just works better.

**米娅：** 对！浏览器已经处理了智能格式列表，所以任何现有代码都能工作得更好。

**Ben:** I’m curious how much faster it feels. Maybe I’ll copy a long article and paste it right away.

**本：** 我很好奇会快多少。也许我会复制一长篇文章，然后马上粘贴试试。

**Mia:** Give it a try! If you paste plain text, the browser will fetch only that text, saving time.

**米娅：** 试试吧！如果你粘贴纯文本，浏览器只会获取那段文字，节省时间。

**Ben:** Sounds good! I’ll also test it with HTML snippets to see the difference.

**本：** 听起来不错！我也会用 HTML 片段测试一下，看看有什么不同。

**Mia:** Let me know what you notice! It’s nice when simple changes make everyday tasks smoother.

**米娅：** 记得告诉我你的感受！当简单的改动让日常任务更顺畅时，真的很棒。

**Ben:** Will do, Mia. Thanks for sharing the news, and I’ll report back soon!

**本：** 我会的，Mia。谢谢分享这个消息，我会尽快反馈！
