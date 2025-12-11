@echo off
REM Crear base de datos y usuario, importar schema, y arrancar backend
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p3114587981_$Jhan -e "CREATE DATABASE IF NOT EXISTS `viva_colombia2` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci; CREATE USER IF NOT EXISTS 'viva_user2'@'localhost' IDENTIFIED WITH mysql_native_password BY 'VivaColApp2025!'; GRANT ALL PRIVILEGES ON `viva_colombia2`.* TO 'viva_user2'@'localhost'; FLUSH PRIVILEGES;"
IF %ERRORLEVEL% NEQ 0 (
  echo Error creando base de datos o usuario
  pause
  exit /b %ERRORLEVEL%
)

"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u viva_user2 -pVivaColApp2025! viva_colombia2 < "C:\Users\57320\Downloads\Proyecto-Viva-Colombia\BACKEND\database.sql"
IF %ERRORLEVEL% NEQ 0 (
  echo Error importando database.sql
  pause
  exit /b %ERRORLEVEL%
)

cd /d "C:\Users\57320\Downloads\Proyecto-Viva-Colombia\BACKEND"
set DB_USER=viva_user2
set DB_PASSWORD=VivaColApp2025!
set DB_NAME=viva_colombia2

npm run dev
