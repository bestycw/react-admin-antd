#!/bin/bash

# 清理旧的构建文件
rm -rf dist

# 根据环境参数选择构建命令
case "$1" in
  "dev")
    echo "Building for development..."
    npm run build:dev
    ;;
  "test")
    echo "Building for test..."
    npm run build:test
    ;;
  "prod")
    echo "Building for production..."
    npm run build:prod
    ;;
  *)
    echo "Please specify environment: dev, test, or prod"
    exit 1
    ;;
esac

# 如果构建成功，压缩dist目录
if [ $? -eq 0 ]; then
  echo "Build successful, creating archive..."
  tar -czf dist.tar.gz dist/
  echo "Archive created: dist.tar.gz"
else
  echo "Build failed!"
  exit 1
fi 