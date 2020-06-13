@echo off
Title Nitro Auto Claimer
cls
color 0

:ask
Title Nitro Auto Claimer - Home
echo 1) Install modules
echo 2) Launch
echo 3) Exit
set /p choix=What do u want? (1/2/3):
 
if /I "%choix%"=="1" (goto :Install)
if /I "%choix%"=="2" (goto :Launch)
if /I "%choix%"=="3" (goto :End)
goto ask
 
:Install
Title Nitro Auto Claimer - Installation
cls
npm i
echo Finished!
timeout 3
goto ask
 
:Launch
Title Nitro Auto Claimer - Started
cls
node index.js
timeout 3
goto Launch

:End
exit
