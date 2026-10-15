#!/usr/bin/env bash
# 城市管理志愿服务平台 - 服务器一键部署脚本
# 用法：先 pnpm build 并打包 tar -czf city-volunteer-dist.tar.gz -C dist .，
# 再将压缩包与本脚本上传到服务器同一目录，以 root 执行：
#   bash deploy-server.sh
set -euo pipefail

SITE_DIR=/var/www/city-volunteer
PKG="$(cd "$(dirname "$0")" && pwd)/city-volunteer-dist.tar.gz"

[ -f "$PKG" ] || { echo "找不到 $PKG，请把它和本脚本放在同一目录"; exit 1; }

# 1. 安装 Nginx
if ! command -v nginx >/dev/null 2>&1; then
  if command -v apt-get >/dev/null 2>&1; then
    apt-get update -y && apt-get install -y nginx
  elif command -v dnf >/dev/null 2>&1; then
    dnf install -y nginx
  elif command -v yum >/dev/null 2>&1; then
    yum install -y nginx
  else
    echo "未识别的系统，请手动安装 nginx"; exit 1
  fi
fi

# 2. 解压网站文件
mkdir -p "$SITE_DIR"
rm -rf "${SITE_DIR:?}"/*
tar -xzf "$PKG" -C "$SITE_DIR"
chmod -R a+rX "$SITE_DIR"

# 3. 写入 Nginx 站点配置（作为默认站点监听 80 端口）
cat > /etc/nginx/conf.d/city-volunteer.conf <<'NGINX'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;

    root /var/www/city-volunteer;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets/ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
}
NGINX

# 其他配置里的 default_server 会与本站冲突：
# Debian/Ubuntu 的默认站点直接移除；CentOS/EulerOS 等在 nginx.conf 里的去掉 default_server 标记（保留备份）
rm -f /etc/nginx/sites-enabled/default
if grep -q "default_server" /etc/nginx/nginx.conf 2>/dev/null; then
  cp /etc/nginx/nginx.conf "/etc/nginx/nginx.conf.bak.$(date +%s)"
  sed -i 's/[[:space:]]default_server//g' /etc/nginx/nginx.conf
fi

# 4. 检查并启动
nginx -t
systemctl enable nginx >/dev/null 2>&1 || true
systemctl restart nginx

# 5. 放行防火墙 80 端口（如有）
if command -v ufw >/dev/null 2>&1 && ufw status | grep -q active; then ufw allow 80/tcp; fi
if command -v firewall-cmd >/dev/null 2>&1 && firewall-cmd --state >/dev/null 2>&1; then
  firewall-cmd --permanent --add-service=http && firewall-cmd --reload
fi

echo
echo "部署完成：http://$(curl -s --max-time 3 ifconfig.me || hostname -I | awk '{print $1}')/"
echo "如果外网打不开，请在云服务器控制台的安全组中放行 TCP 80 端口。"
