const mongoose = require('mongoose');

// IMPORTANT: Replace with YOUR actual Atlas credentials
const MONGODB_URI = 'MONGODB_URI=mongodb+srv://coderzone1111_db_user:zFgjBFvTQbQrbSrQ@cluster0.alcs1yk.mongodb.net/shan-msala?retryWrites=true&w=majority
'

async function testConnection() {
  console.log('Testing MongoDB Atlas connection...');
  console.log('Connection string:', MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'));
  
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
    });
    
    console.log('✅ Connected to MongoDB Atlas successfully!');
    console.log('Database is ready to use');
    
    // List databases
    const admin = mongoose.connection.db.admin();
    const dbInfo = await admin.listDatabases();
    console.log('Available databases:', dbInfo.databases.map(db => db.name).join(', '));
    
    await mongoose.disconnect();
    console.log('Disconnected successfully');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('\nPossible issues:');
    console.error('1. Your IP is not whitelisted in MongoDB Atlas');
    console.error('2. Username or password is incorrect');
    console.error('3. The cluster name is wrong');
    console.error('4. Network/firewall is blocking the connection');
    console.error('\nGo to MongoDB Atlas → Network Access → Add IP Address');
  }
}

testConnection();