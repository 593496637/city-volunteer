#!/usr/bin/env bash
# 城市管理志愿服务平台 - 服务器一键部署脚本
# 用法：先 pnpm build 并打包 tar -czf city-volunteer-dist.tar.gz -C dist .，
# 再将压缩包与本脚本上传到服务器同一目录，以 root 执行：
#   bash deploy-server.sh
#
# 本站使用独立端口（默认 8080，可用环境变量 SITE_PORT 指定），
# 只写入自己的 /etc/nginx/conf.d/city-volunteer.conf，不修改服务器上的其他站点。
set -euo pipefail

SITE_DIR=/var/www/city-volunteer
CONF=/etc/nginx/conf.d/city-volunteer.conf
PKG="$(cd "$(dirname "$0")" && pwd)/city-volunteer-dist.tar.gz"

[ -f "$PKG" ] || { echo "找不到 $PKG，请把它和本脚本放在同一目录"; exit 1; }

# 1. 安装 Nginx（已安装则跳过）
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

# 2. 选择端口：显式指定 > 上次部署使用的端口 > 8080 起第一个空闲端口
port_in_use() { ss -ltnH "( sport = :$1 )" 2>/dev/null | grep -q .; }
PORT="${SITE_PORT:-}"
if [ -z "$PORT" ] && [ -f "$CONF" ]; then
  PORT="$(grep -oE 'listen[[:space:]]+[0-9]+' "$CONF" | head -1 | grep -oE '[0-9]+' || true)"
  # 旧版本脚本曾使用 80 端口，与已有站点冲突，不再沿用
  [ "$PORT" = "80" ] && PORT=""
fi
if [ -z "$PORT" ]; then
  for p in 8080 8081 8088 8090 9090; do
    if ! port_in_use "$p"; then PORT="$p"; break; fi
  done
fi
[ -n "$PORT" ] || { echo "8080/8081/8088/8090/9090 均被占用，请用 SITE_PORT 指定端口"; exit 1; }

# 3. 解压网站文件
mkdir -p "$SITE_DIR"
rm -rf "${SITE_DIR:?}"/*
tar -xzf "$PKG" -C "$SITE_DIR"
chmod -R a+rX "$SITE_DIR"

# 4. 写入本站 Nginx 配置
cat > "$CONF" <<NGINX
server {
    listen $PORT;
    listen [::]:$PORT;
    server_name _;

    root $SITE_DIR;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location /assets/ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
}
NGINX

# 5. 校验配置；失败则移除本站配置，保证服务器上其他站点不受影响
if ! nginx -t; then
  rm -f "$CONF"
  echo "Nginx 配置校验失败，已移除 $CONF，其他站点未受影响"
  exit 1
fi

# 平滑重载（不中断已有站点）；未运行则启动
systemctl enable nginx >/dev/null 2>&1 || true
if systemctl is-active --quiet nginx; then
  systemctl reload nginx
else
  systemctl start nginx
fi

# 6. 放行本机防火墙端口（如启用）
if command -v ufw >/dev/null 2>&1 && ufw status | grep -q active; then ufw allow "$PORT/tcp"; fi
if command -v firewall-cmd >/dev/null 2>&1 && firewall-cmd --state >/dev/null 2>&1; then
  firewall-cmd --permanent --add-port="$PORT/tcp" && firewall-cmd --reload
fi

IP="$(curl -s --max-time 3 ifconfig.me || hostname -I | awk '{print $1}')"
echo
echo "部署完成：http://$IP:$PORT/"
echo "如果外网打不开，请在云服务器控制台的安全组中放行入方向 TCP $PORT 端口。"
echo "CITY_VOLUNTEER_PORT=$PORT"
