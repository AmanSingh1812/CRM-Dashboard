@echo off
echo ===== Clean old dist folder =====
rmdir /s /q dist

echo ===== Build Vite React app =====
npm run build

echo ===== Deploy to Firebase Hosting =====
firebase deploy --only hosting

echo ===== Deployment Complete! =====
pause
