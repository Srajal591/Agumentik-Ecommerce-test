@echo off
echo ========================================
echo Fashion E-Commerce Platform Setup
echo ========================================
echo.

echo [1/3] Installing Backend Dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Backend installation failed!
    pause
    exit /b 1
)
echo Backend dependencies installed successfully!
echo.

echo [2/3] Installing Admin Frontend Dependencies...
cd ..\admin-frontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Admin frontend installation failed!
    pause
    exit /b 1
)
echo Admin frontend dependencies installed successfully!
echo.

echo [3/3] Installing User Frontend Dependencies...
cd ..\user-frontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: User frontend installation failed!
    pause
    exit /b 1
)
echo User frontend dependencies installed successfully!
echo.

cd ..
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Next Steps:
echo 1. Ensure MongoDB is running
echo 2. Configure backend/.env file
echo 3. Run: cd backend ^&^& npm run seed
echo 4. Run: cd backend ^&^& npm run dev
echo 5. Run: cd admin-frontend ^&^& npm run dev
echo 6. Run: cd user-frontend ^&^& npm start
echo.
echo See SETUP_GUIDE.md for detailed instructions
echo.
pause
