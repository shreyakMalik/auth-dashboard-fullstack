# ⚡ Quick Start Guide

Get the Task Management API up and running in under 5 minutes!

## 🎯 Prerequisites

Make sure you have these installed:
- Node.js (v16+)
- MongoDB (or MongoDB Atlas account)
- Git

## 🚀 Quick Setup

### Step 1: Clone & Install

```bash
# Clone the repository
git clone <your-repository-url>
cd backend-assignment

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2: Configure Environment

```bash
# In backend directory, update .env file
cd backend
nano .env  # or use any text editor
```

Update these values:
```env
MONGODB_URI=mongodb://localhost:27017/backend_api
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/backend_api

JWT_SECRET=your_secret_key_here_change_this
```

### Step 3: Start Services

**Terminal 1 - Start MongoDB** (if using local MongoDB):
```bash
mongod
```

**Terminal 2 - Start Backend**:
```bash
cd backend
npm start
```
Backend runs on: http://localhost:5000

**Terminal 3 - Start Frontend**:
```bash
cd frontend
npm start
```
Frontend runs on: http://localhost:3000

## 🎉 Test It Out!

### Option 1: Use the Frontend
1. Open http://localhost:3000
2. Click "Register" and create an account
3. Login with your credentials
4. Start creating tasks!

### Option 2: Test with Postman

1. **Import Collection**: Import `Backend_API.postman_collection.json`

2. **Register a User**:
   ```
   POST http://localhost:5000/api/v1/auth/register
   Body: {
     "name": "Test User",
     "email": "test@example.com",
     "password": "test123",
     "role": "user"
   }
   ```

3. **Login**:
   ```
   POST http://localhost:5000/api/v1/auth/login
   Body: {
     "email": "test@example.com",
     "password": "test123"
   }
   ```
   Copy the `token` from response.

4. **Create a Task**:
   ```
   POST http://localhost:5000/api/v1/tasks
   Headers: Authorization: Bearer YOUR_TOKEN
   Body: {
     "title": "My first task",
     "description": "Testing the API",
     "priority": "high"
   }
   ```

5. **Get All Tasks**:
   ```
   GET http://localhost:5000/api/v1/tasks
   Headers: Authorization: Bearer YOUR_TOKEN
   ```

### Option 3: Use Swagger UI

1. Open http://localhost:5000/api-docs
2. Click "Authorize" button
3. Enter: `Bearer YOUR_TOKEN`
4. Test endpoints directly!

## 🐳 Quick Start with Docker

```bash
# Start everything with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Then start the frontend separately:
```bash
cd frontend
npm start
```

## 📊 What You'll See

### Dashboard Features:
- **Statistics Cards**: Total tasks, pending, in-progress, completed
- **Task List**: All your tasks with status and priority badges
- **Filters**: Filter by status and priority
- **Create/Edit/Delete**: Full CRUD operations

### Available User Roles:
- **User**: Can manage their own tasks
- **Admin**: Can manage all users and tasks

## 🔍 API Endpoints Cheat Sheet

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/auth/register` | POST | Register new user |
| `/api/v1/auth/login` | POST | Login user |
| `/api/v1/auth/me` | GET | Get current user |
| `/api/v1/tasks` | GET | Get all tasks |
| `/api/v1/tasks` | POST | Create task |
| `/api/v1/tasks/:id` | PUT | Update task |
| `/api/v1/tasks/:id` | DELETE | Delete task |
| `/api/v1/tasks/stats` | GET | Get statistics |
| `/api/v1/users` | GET | Get all users (Admin) |

## 🔐 Test Accounts

After starting, you can create these test accounts:

**Regular User**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

**Admin User**:
```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "admin123",
  "role": "admin"
}
```

## 🛠️ Troubleshooting

### MongoDB Connection Error
```bash
# Make sure MongoDB is running
mongod

# Or check if MongoDB service is active
sudo systemctl status mongod
```

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### CORS Errors
- Make sure backend is running on port 5000
- Make sure frontend is running on port 3000
- Check `.env` CORS_ORIGIN setting

### JWT Token Issues
- Check if token is properly set in Authorization header
- Format: `Bearer YOUR_TOKEN_HERE`
- Token expires after 7 days (default)

## 📱 Mobile Testing

The frontend is responsive! Test on:
- Desktop browsers
- Mobile browsers
- Tablet browsers

## 🎯 Next Steps

1. ✅ Read the full [README.md](README.md) for detailed documentation
2. ✅ Check [SCALABILITY.md](SCALABILITY.md) for architecture details
3. ✅ Explore the Swagger docs at http://localhost:5000/api-docs
4. ✅ Try the admin features with an admin account
5. ✅ Modify and extend the API for your needs

## 💡 Quick Tips

- Use Postman Collection for faster API testing
- Check browser console for frontend errors
- Check terminal logs for backend errors
- Use MongoDB Compass to view database
- Test with both user and admin roles

## 🆘 Need Help?

- Check the [README.md](README.md) for full documentation
- Review API documentation at `/api-docs`
- Check logs in terminal
- Verify all environment variables

---

**Happy Coding! 🚀**
