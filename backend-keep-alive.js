// Backend Keep-Alive Service
// This script pings your backend every 10 minutes to keep it awake
// Run this on your local machine or deploy it separately

const BACKEND_URL = 'https://agumentik-ecommerce-test-1.onrender.com';
const PING_INTERVAL = 10 * 60 * 1000; // 10 minutes

console.log('🚀 Backend Keep-Alive Service Started');
console.log(`📍 Target: ${BACKEND_URL}`);
console.log(`⏰ Ping Interval: Every 10 minutes\n`);

let pingCount = 0;
let successCount = 0;
let failCount = 0;

async function pingBackend() {
  pingCount++;
  const timestamp = new Date().toLocaleString();
  
  try {
    console.log(`[${timestamp}] 🔄 Ping #${pingCount} - Sending request...`);
    
    const startTime = Date.now();
    const response = await fetch(`${BACKEND_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const duration = Date.now() - startTime;
    
    if (response.ok) {
      successCount++;
      const data = await response.json();
      console.log(`[${timestamp}] ✅ Ping #${pingCount} - SUCCESS (${duration}ms)`);
      console.log(`   📊 Status: ${data.status}`);
      console.log(`   📈 Success Rate: ${successCount}/${pingCount} (${((successCount/pingCount)*100).toFixed(1)}%)\n`);
    } else {
      failCount++;
      console.log(`[${timestamp}] ⚠️  Ping #${pingCount} - FAILED (Status: ${response.status})`);
      console.log(`   📉 Fail Rate: ${failCount}/${pingCount}\n`);
    }
  } catch (error) {
    failCount++;
    console.log(`[${timestamp}] ❌ Ping #${pingCount} - ERROR`);
    console.log(`   ⚠️  Error: ${error.message}`);
    console.log(`   📉 Fail Rate: ${failCount}/${pingCount}\n`);
  }
}

// Initial ping
pingBackend();

// Set up interval
setInterval(pingBackend, PING_INTERVAL);

console.log('✅ Keep-Alive service is running...');
console.log('💡 Press Ctrl+C to stop\n');

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Shutting down Keep-Alive service...');
  console.log(`📊 Final Stats:`);
  console.log(`   Total Pings: ${pingCount}`);
  console.log(`   Successful: ${successCount}`);
  console.log(`   Failed: ${failCount}`);
  console.log(`   Success Rate: ${((successCount/pingCount)*100).toFixed(1)}%`);
  console.log('\n👋 Goodbye!\n');
  process.exit(0);
});
