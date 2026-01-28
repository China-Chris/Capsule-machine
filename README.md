# 喜乐贩卖机 - 扭蛋机抽奖活动 Landing Page

一个精美的单页活动页面，展示扭蛋机抽奖活动。使用 React + Vite 构建。

## 功能特性

- 🎯 **居中主视觉** - 扭蛋机作为视觉中心
- 🎬 **交互动画** - 点击触发扭蛋机动画视频播放
- 📱 **响应式设计** - 完美适配桌面端和移动端
- ✨ **精美UI** - 现代化的设计风格
- ⚛️ **React 架构** - 组件化开发，易于维护和扩展

## 文件结构

```
Capsule-machine/
├── public/
│   └── niudanji.mp4        # 扭蛋机动画视频
├── src/
│   ├── components/         # React 组件
│   │   ├── BackgroundLayer.jsx
│   │   ├── Header.jsx
│   │   ├── MainContent.jsx
│   │   ├── LeftContent.jsx
│   │   ├── RightContent.jsx
│   │   ├── CapsuleMachine.jsx
│   │   └── Footer.jsx
│   ├── contexts/           # React Context
│   │   └── CapsuleMachineContext.jsx
│   ├── App.jsx             # 主应用组件
│   ├── main.jsx            # 入口文件
│   └── styles.css          # 样式文件
├── index.html              # HTML 模板
├── package.json            # 项目配置
├── vite.config.js          # Vite 配置
└── README.md               # 说明文档
```

## 页面布局

### 1. 背景层
- 纯白色背景

### 2. 顶部信息区
- **左上角**：活动标题「喜乐贩卖机」+ 装饰圆点
- **右上角**：活动状态「限时扭蛋」+ 日期范围

### 3. 中央主视觉区
- 视频第一帧静态显示
- 点击后播放 `niudanji.mp4` 动画视频
- 播放完成后定格在最后一帧

### 4. 两侧辅助文案
- **左侧**：纵向文案「2026 YEARS」+ 活动说明
- **右侧**：竖排大字「扭蛋机」+ 装饰花括号

### 5. 底部行动区
- CTA按钮：「参加扭蛋机抽奖活动」
- 英文辅助说明

## 使用方法

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

服务器会在 http://localhost:8000 启动

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

### 使用说明

1. 启动开发服务器后，在浏览器中访问 http://localhost:8000
2. 点击扭蛋机视频或底部按钮触发动画
3. 动画播放完成后定格在最后一帧
4. 再次点击可以重新播放动画

## 浏览器支持

- Chrome/Edge (最新版本)
- Firefox (最新版本)
- Safari (最新版本)
- 移动端浏览器

## 自定义说明

### 修改活动日期
编辑 `src/components/Header.jsx` 中的日期范围：
```jsx
<div className="date-range">12/19 – 12/25</div>
```

### 修改活动标题
编辑 `src/components/Header.jsx` 中的标题：
```jsx
<span className="title-text">喜乐贩卖机</span>
```

### 更换动画视频
替换 `public/niudanji.mp4` 文件，保持文件名不变即可。

### 修改颜色主题
编辑 `src/styles.css` 中的颜色变量：
- 主色调：`#ff6b6b`, `#ff4757`
- 背景色：`#ffffff`

## 技术栈

- ⚛️ **React 18** - UI 框架
- ⚡ **Vite** - 构建工具
- 🎨 **CSS3** - 样式（Grid, Flexbox, Animations）
- 📹 **HTML5 Video** - 视频播放

## 注意事项

- 确保 `niudanji.mp4` 文件存在且可访问
- 视频格式建议使用 MP4 (H.264 编码)
- 建议视频时长控制在 3-5 秒以内

