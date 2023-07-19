FROM nginx:1.22

# 构建参数,在Jenkinsfile中构建镜像时定义
ARG PROFILE

# 将dist文件中的内容复制到 `/usr/share/nginx/html` 这个目录下面
COPY dist/  /usr/share/nginx/html/

# 用本地配置文件来替换nginx镜像里的默认配置
COPY ruoyi_nginx.conf /etc/nginx/nginx.conf

# 将 SSL 证书和密钥复制到镜像中
COPY /ssl/ruoyi-cert.pem /etc/ssl/certs/
COPY /ssl/ruoyi-key.pem /etc/ssl/private/

# 容器内部运行的端口 声明不起实际作用
EXPOSE 80

# 以前台形式持续运行
CMD ["nginx", "-g", "daemon off;"]