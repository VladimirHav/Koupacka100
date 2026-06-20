@echo off
REM Builds the web app, syncs it into the Android project, and builds a
REM debug APK. Output: android\app\build\outputs\apk\debug\app-debug.apk
cd /d "%~dp0"

REM Capacitor's Android Gradle build needs JDK 17+; the system default JDK
REM may be older, so point at the JDK 21 install used during initial setup.
set "JAVA_HOME=C:\Program Files\Android\openjdk\jdk-21.0.8"
set "PATH=%JAVA_HOME%\bin;%PATH%"

echo.
echo === [1/3] Building web app ===
call npm run build
if errorlevel 1 goto :error

echo.
echo === [2/3] Syncing Capacitor Android project ===
call npx cap sync android
if errorlevel 1 goto :error

echo.
echo === [3/3] Building Android debug APK ===
cd android
call .\gradlew.bat assembleDebug
if errorlevel 1 (
    cd ..
    goto :error
)
cd ..

echo.
echo ============================================
echo  BUILD SUCCEEDED
echo  APK: android\app\build\outputs\apk\debug\app-debug.apk
echo ============================================
goto :end

:error
echo.
echo ============================================
echo  BUILD FAILED - see output above
echo ============================================
exit /b 1

:end
pause
