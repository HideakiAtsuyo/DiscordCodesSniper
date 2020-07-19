@echo off
Title Discord Sniper
cls
color 0

:ask
Title Discord Sniper - Home
echo 1) Install modules
echo 2) Launch
echo 3) Exit
set /p choix=What do u want? (1/2/3):
 
if /I "%choix%"=="1" (goto :Install)
if /I "%choix%"=="2" (goto :Launch)
if /I "%choix%"=="3" (goto :End)
goto ask
 
:Install
Title Discord Sniper - Installation
cls
npm i
echo Finished!
timeout 3
goto ask
 
:Launch
Title Discord Sniper - Started
cls
node index.js
timeout 3
goto Launch

:End
exit
