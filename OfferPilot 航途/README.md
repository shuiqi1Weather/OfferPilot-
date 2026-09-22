# OfferPilot 航途

航途小队的 AI 求职全链路桌面工作台。这个仓库仅包含宣传网站，不包含软件私有源码、简历、账号数据库或 API Key。

## 上传后，只需做两件事

1. **开启网站**：将本文件夹的内容上传到 GitHub 仓库根目录（保留 `docs` 文件夹）。在仓库的 **Settings → Pages** 中，Source 选择 **Deploy from a branch**，分支选择 **main**，目录选择 **/docs**，保存。等部署完成，这里会显示网站访问链接。
2. **上传软件**：在仓库的 **Releases → Create a new release** 中，填写标签 `v53`、标题 `OfferPilot v53 Windows 预览版`，把准备好的 **OfferPilot_v53_Windows.zip** 拖到附件区，点击 **Publish release**。不要勾选 Pre-release，不要只保存 Draft。

访问网站，下载按钮会自动找到同一仓库的 ZIP 下载包。**ZIP 不要上传到普通代码文件列表**；网站和软件下载包分开存放是正常的。仓库未发布下载包时，网页会如实显示待发布，不会假装已有下载。

## 文件是做什么的

| 文件 | 用途 |
| --- | --- |
| `docs/index.html` | 产品首页，包括介绍、真实界面、下载区和常见问题 |
| `docs/style.css` | 电脑/手机布局、颜色和动效 |
| `docs/app.js` | 菜单、界面切换、动效开关及下载包连接 |
| `docs/config.js` | 当前版本与安装包名称；默认自动识别 GitHub Pages 仓库 |
| `docs/assets/logo.png` / `favicon.ico` | 软件品牌图标和浏览器标签页图标 |
| `docs/assets/product-jobs.png` | 真实软件岗位库截图，使用隔离的示例数据 |
| `docs/assets/product-browser.png` | 真实软件 AI 浏览器截图，使用隔离的示例数据 |
| `docs/.nojekyll` | 让 GitHub 直接发布静态文件 |
| `.gitignore` | 避免把安装包、个人数据和临时文件上传到网站代码仓库 |
| `README.md` | 本说明 |
| `上传GitHub就行.txt` | 面向第一次发布的三步操作说明 |

## 本地预览与后续更新

双击 `docs/index.html` 可以先看页面；本地不会生成公开下载链接。部署到 `用户名.github.io/仓库名/` 后，会自动识别仓库。

如果以后绑定了自定义域名，在 `docs/config.js` 的 `repository` 中填入 `GitHub用户名/仓库名`。更新软件时，修改该文件中的 `assetName` 和 `version`，并在新 Release 上传同名下载包。

## 当前软件边界

- v53 面向 Windows 10 / 11 64 位，主程序运行库随包提供。完整解压后运行安装脚本，创建桌面快捷方式。
- AI 功能需要联网并设置自己的 DeepSeek API Key，服务费用以模型服务商为准。
- 完整版 Windows ZIP 内含 AI 浏览器独立 Python 环境与 Chromium，安装脚本会一起部署；无需用户另行安装组件。AI 搜索仍需联网并设置自己的 DeepSeek API Key 和有效额度。
- 网站中的岗位为示例数据，没有伪造真实招聘、用户评价或覆盖数量。它是宣传下载网站，不是网页版求职软件，不接收用户简历。
- GitHub 在部分网络环境下可能访问较慢；网站和下载都依赖访问者能够连接 GitHub。

视觉方向参考 [MotionSites 的公开产品网站案例](https://motionsites.org/zh/sites)，页面布局、代码和动效为本项目实现；未复制付费模板。商标、品牌和截图来自 OfferPilot 项目。
