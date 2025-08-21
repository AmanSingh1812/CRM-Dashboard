@echo off
echo ===== Clean old build =====
rmdir /s /q build

echo ===== Install dependencies =====
npm install

echo ===== Build React app =====
npm run build

echo ===== Deploy to Firebase Hosting =====
firebase deploy --only hosting

echo ===== Deployment Complete! =====
pause
