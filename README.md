## 开发

```bash
# 克隆项目
git clone https://gitee.com/y_project/RuoYi-Vue

# 进入项目目录
node 16.18.1
cd ruoyi-ui

# 安装依赖
pnpm install

# 建议不要直接使用 cnpm 安装依赖，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
pnpm install --registry=https://registry.npmmirror.com

# 启动服务
pnpm run dev
```

浏览器访问 http://localhost:80

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```

## 部署流程

```
    准备材料: 腾讯SSL证书 https://console.cloud.tencent.com/ssl


```
