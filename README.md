# Beiyoo MBTI 人格测试

贝有科技出品，面向泛娱乐人群的 MBTI 人格测试网页。

## 技术栈

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Turbopack
- Recharts（图表）
- html2canvas（分享卡片）
- Zustand（状态管理）

## 启动方式

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build

# 生产模式
npm start
```

## 项目结构

```
beiyoo-mbti/
  src/
    app/           # Next.js App Router
    components/    # React 组件
    lib/           # 工具函数
    types/         # TypeScript 类型
    data/          # 题库数据
  public/          # 静态资源
  dist/            # 构建输出（静态导出）
```

## 部署

静态导出，部署到 Vercel：

```bash
npm run build
# 将 dist/ 目录部署到 Vercel
```

## 核心功能

- 60 题 MBTI 深度测试
- 动态题目调整
- 四维度结果分析
- 图表可视化
- 趣味职业建议
- 分享卡片生成

## 注意事项

- 纯前端实现，无后端
- 匿名使用，无需登录
- 答题进度本地缓存（localStorage）
