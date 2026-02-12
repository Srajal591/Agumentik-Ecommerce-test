#!/bin/bash

echo "========================================"
echo "Fashion E-Commerce Platform Setup"
echo "========================================"
echo ""

echo "[1/3] Installing Backend Dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Backend installation failed!"
    exit 1
fi
echo "Backend dependencies installed successfully!"
echo ""

echo "[2/3] Installing Admin Frontend Dependencies..."
cd ../admin-frontend
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Admin frontend installation failed!"
    exit 1
fi
echo "Admin frontend dependencies installed successfully!"
echo ""

echo "[3/3] Installing User Frontend Dependencies..."
cd ../user-frontend
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: User frontend installation failed!"
    exit 1
fi
echo "User frontend dependencies installed successfully!"
echo ""

cd ..
echo "========================================"
echo "Installation Complete!"
echo "========================================"
echo ""
echo "Next Steps:"
echo "1. Ensure MongoDB is running"
echo "2. Configure backend/.env file"
echo "3. Run: cd backend && npm run seed"
echo "4. Run: cd backend && npm run dev"
echo "5. Run: cd admin-frontend && npm run dev"
echo "6. Run: cd user-frontend && npm start"
echo ""
echo "See SETUP_GUIDE.md for detailed instructions"
echo ""
