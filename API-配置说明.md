# Footprints 前后端连接配置说明

## 配置概述

已经完成了前端环境的配置，使前端能够正确请求后端API。

## 配置内容

### 1. Vite 代理配置

在 `vite.config.ts` 中添加了API代理配置：

```typescript
server: {
  host: true,
  proxy: {
    // 代理后端API请求
    '/api': {
      target: 'http://localhost:9000',
      changeOrigin: true,
      rewrite: path => path.replace(/^\/api/, ''),
    },
  },
}
```

### 2. Axios 基础配置

在 `src/utils/axios/index.ts` 中设置了 baseURL：

```typescript
const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
})
```

### 3. 后端服务配置

后端Spring Boot应用运行在端口 9000，已经配置了CORS支持。

## 使用步骤

### 1. 启动后端服务

```bash
cd footprints
mvn spring-boot:run
```

后端服务将在 http://localhost:9000 启动

### 2. 启动前端开发服务器

```bash
cd footprints-vue
pnpm install  # 如果是第一次运行
pnpm dev
```

前端开发服务器将在 http://localhost:3000 启动（或其他可用端口）

### 3. 测试API连接

访问 http://localhost:3000/test-api.html 来测试API连接是否正常。

## API 路径映射

| 前端请求路径            | 实际后端路径                             | 说明         |
| ----------------------- | ---------------------------------------- | ------------ |
| `/api/system/user/page` | `http://localhost:9000/system/user/page` | 用户分页查询 |
| `/api/system/user/{id}` | `http://localhost:9000/system/user/{id}` | 获取用户详情 |
| `/api/system/role/list` | `http://localhost:9000/system/role/list` | 角色列表     |

## 工作原理

1. **开发环境**: 前端通过Vite代理将 `/api/*` 请求转发到 `http://localhost:9000`
2. **请求流程**:
   - 前端发起请求到 `/api/system/user/page`
   - Vite代理拦截请求，移除 `/api` 前缀
   - 转发到 `http://localhost:9000/system/user/page`
   - 后端处理请求并返回响应
   - 前端接收响应数据

## 故障排除

### 如果遇到CORS错误

后端控制器已经添加了 `@CrossOrigin` 注解，如果仍有问题，可以检查：

1. 后端服务是否正常运行
2. 端口是否正确（默认9000）
3. 防火墙是否阻止了连接

### 如果API请求失败

1. 检查后端服务状态
2. 查看浏览器开发者工具的网络标签
3. 确认请求路径是否正确
4. 使用测试页面验证连接

## 生产环境配置

生产环境需要：

1. 修改 `.env.production` 中的 `VITE_API_URL` 为实际的后端服务地址
2. 确保后端服务的CORS配置允许生产环境的前端域名
3. 配置反向代理（如Nginx）来处理前端静态文件和API请求

## 注意事项

- 开发时确保后端服务先启动，再启动前端服务
- 如果更改了后端端口，需要同步更新 `vite.config.ts` 中的代理配置
- 生产环境部署时需要单独配置API路径
