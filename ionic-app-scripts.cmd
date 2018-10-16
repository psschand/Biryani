@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\node_modules\@ionic\app-scripts\bin\ionic-app-scripts.js" %*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node  "%~dp0\node_modules\@ionic\app-scripts\bin\ionic-app-scripts.js" %*
)