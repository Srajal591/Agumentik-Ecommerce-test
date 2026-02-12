# MongoDB Compass Setup Guide

## 🗄️ Setting Up Local MongoDB with Compass

### Step 1: Install MongoDB Community Server

1. **Download MongoDB:**
   - Visit: https://www.mongodb.com/try/download/community
   - Select your OS (Windows/macOS/Linux)
   - Download the installer

2. **Install MongoDB:**
   
   **Windows:**
   - Run the installer
   - Choose "Complete" installation
   - Install as a Windows Service (recommended)
   - Install MongoDB Compass (check the box)
   
   **macOS:**
   ```bash
   # Using Homebrew
   brew tap mongodb/brew
   brew install mongodb-community
   brew services start mongodb-community
   ```
   
   **Linux (Ubuntu/Debian):**
   ```bash
   # Import MongoDB public key
   wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
   
   # Create list file
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
   
   # Update and install
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   
   # Start MongoDB
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

### Step 2: Verify MongoDB is Running

**Windows:**
```powershell
# Check if MongoDB service is running
Get-Service MongoDB

# If not running, start it
net start MongoDB
```

**macOS:**
```bash
# Check status
brew services list | grep mongodb

# Start if not running
brew services start mongodb-community
```

**Linux:**
```bash
# Check status
sudo systemctl status mongod

# Start if not running
sudo systemctl start mongod
```

### Step 3: Install MongoDB Compass (GUI)

1. **Download Compass:**
   - Visit: https://www.mongodb.com/try/download/compass
   - Download for your OS
   - Install the application

2. **Open MongoDB Compass**

3. **Connect to Local MongoDB:**
   - Connection String: `mongodb://127.0.0.1:27017`
   - Or simply: `mongodb://localhost:27017`
   - Click "Connect"

### Step 4: Verify Connection

You should see:
- Connected to: `localhost:27017`
- Databases listed (admin, config, local)

## 🔧 Configure Your Application

Your `.env` file is already configured:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/fashion-ecommerce
```

This will:
- Connect to local MongoDB
- Create a database named `fashion-ecommerce`
- Store all your data locally

## 🧪 Test the Connection

1. **Navigate to backend:**
   ```bash
   cd backend
   ```

2. **Run the seed script:**
   ```bash
   npm run seed
   ```

3. **You should see:**
   ```
   ✅ MongoDB Connected: 127.0.0.1
   ✅ Admin user created successfully
   Email: admin@fashionstore.com
   Password: Admin@123
   ```

4. **Check in MongoDB Compass:**
   - Refresh the databases list
   - You should see `fashion-ecommerce` database
   - Inside, you'll see `users` collection with the admin user

## 🚀 Start the Server

```bash
npm run dev
```

You should see:
```
✅ MongoDB Connected: 127.0.0.1
🚀 Server running on port 5000
📍 Environment: development
🔗 API Base URL: http://localhost:5000/api
```

## 🔍 Troubleshooting

### Error: "connect ECONNREFUSED 127.0.0.1:27017"

**Solution:**
MongoDB is not running. Start it:

**Windows:**
```powershell
net start MongoDB
```

**macOS:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

### Error: "MongoServerError: Authentication failed"

**Solution:**
Your local MongoDB doesn't need authentication by default. Use:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/fashion-ecommerce
```

If you've enabled authentication, use:
```env
MONGODB_URI=mongodb://username:password@127.0.0.1:27017/fashion-ecommerce
```

### Error: "options useNewUrlParser, useUnifiedTopology are not supported"

**Solution:**
This is already fixed! The database connection no longer uses these deprecated options.

### MongoDB Compass Can't Connect

**Check:**
1. MongoDB service is running
2. No firewall blocking port 27017
3. Try both `localhost` and `127.0.0.1`

**Windows Firewall:**
- Allow MongoDB through Windows Firewall
- Default port: 27017

### Port 27017 Already in Use

**Find what's using the port:**

**Windows:**
```powershell
netstat -ano | findstr :27017
```

**macOS/Linux:**
```bash
lsof -i :27017
```

**Kill the process or change MongoDB port in config**

## 📊 View Your Data in Compass

Once your app is running:

1. **Open MongoDB Compass**
2. **Connect to:** `mongodb://127.0.0.1:27017`
3. **Select database:** `fashion-ecommerce`
4. **View collections:**
   - `users` - User accounts
   - `categories` - Product categories
   - `products` - Product catalog
   - `orders` - Customer orders
   - `otps` - OTP records (auto-expire)
   - `tickets` - Support tickets
   - `returns` - Return requests

## 🎯 Quick Commands

**Start MongoDB:**
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

**Stop MongoDB:**
```bash
# Windows
net stop MongoDB

# macOS
brew services stop mongodb-community

# Linux
sudo systemctl stop mongod
```

**Check MongoDB Status:**
```bash
# Windows
Get-Service MongoDB

# macOS
brew services list | grep mongodb

# Linux
sudo systemctl status mongod
```

## 🌐 Alternative: MongoDB Atlas (Cloud)

If you prefer cloud hosting:

1. **Create account:** https://www.mongodb.com/cloud/atlas
2. **Create free cluster**
3. **Get connection string:**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/fashion-ecommerce
   ```
4. **Update `.env`:**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fashion-ecommerce
   ```
5. **Whitelist your IP address** in Atlas dashboard

## ✅ Success Checklist

- [ ] MongoDB installed
- [ ] MongoDB service running
- [ ] MongoDB Compass installed
- [ ] Connected to `mongodb://127.0.0.1:27017`
- [ ] `.env` file configured
- [ ] `npm run seed` successful
- [ ] Database `fashion-ecommerce` visible in Compass
- [ ] Admin user created in `users` collection
- [ ] Backend server running without errors

## 📞 Need Help?

If you're still having issues:
1. Check MongoDB service is running
2. Try `127.0.0.1` instead of `localhost`
3. Check firewall settings
4. Verify port 27017 is not blocked
5. Check MongoDB logs for errors

---

**You're all set!** MongoDB is now connected and ready to use. 🚀
