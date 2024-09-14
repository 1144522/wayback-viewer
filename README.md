
## 项目介绍
本项目基于Sveltekit框架，主要功能是查看互联网存档馆http://web.archive.org/web 上面的网页快照。相比原版，优势是简洁和可以自行部署，方便访问。

### Vercel部署

frok项目，直接在vercel上面部署。



### Docker部署

#### 第一步
<!-- frok项目，在项目中安装 `@sveltejs/adapter-node`，并在 `svelte.config.js` 中配置适配器：

安装适配器：

```bash
npm i -D @sveltejs/adapter-node
``` -->

frok项目,然后修改 `svelte.config.js` 文件中的适配器配置：

```javascript
// svelte.config.js
import adapter from '@sveltejs/adapter-node';
//注释原本的vercel适配器
// import adapter from '@sveltejs/adapter-vercel';


```


####  第二步 构建Docker镜像
下载项目代码到服务器，然后使用`Dockerfile`部署

```bash
docker build -t my-svelte-app .
```
####  第三步 运行Docker容器
```bash
docker run -p 3000:3000 my-svelte-app
```


### 本地运行

```bash
npm run dev
```

在 `http://localhost:3000` 上可以访问。
