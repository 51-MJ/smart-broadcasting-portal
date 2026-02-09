@echo off
REM 设置 Node.js 路径
set PATH=D:\develop\Node;%PATH%

REM 进入项目目录
cd /d "d:\develop\智慧广电\vue\smart-portal-admin"

REM 显示 node 和 npm 版本
echo 检查 Node.js...
node --version
npm --version

REM 安装依赖
echo.
echo 正在安装依赖...
call npm install

REM 启动开发服务器
echo.
echo 启动开发服务器...
call npm run dev

pause
