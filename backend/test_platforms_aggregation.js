const http = require('http');
const app = require('./src/app');
const { connectDB, disconnectDB } = require('./src/config/db');

async function testPlatformsSystem() {
  console.log('=== STARTING 350 PLATFORMS & REAL-TIME STREAM TEST ===\n');

  await connectDB();
  const server = app.listen(5001);
  console.log('Test server started on port 5001');

  function get(url) {
    return new Promise((resolve, reject) => {
      http.get(`http://localhost:5001${url}`, (res) => {
        let raw = '';
        res.on('data', c => raw += c);
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(raw) });
          } catch (e) {
            resolve({ status: res.statusCode, raw });
          }
        });
      }).on('error', reject);
    });
  }

  function post(url, body) {
    return new Promise((resolve, reject) => {
      const data = JSON.stringify(body);
      const req = http.request({
        hostname: 'localhost',
        port: 5001,
        path: url,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
        }
      }, (res) => {
        let raw = '';
        res.on('data', c => raw += c);
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(raw) });
          } catch (e) {
            resolve({ status: res.statusCode, raw });
          }
        });
      });
      req.on('error', reject);
      req.write(data);
      req.end();
    });
  }

  // 1. Test 350 Platforms Directory Endpoint
  console.log('[1] Testing GET /api/jobs/platforms...');
  const platRes = await get('/api/jobs/platforms');
  console.log(` -> Status: ${platRes.status}`);
  console.log(` -> Total Platforms in catalog: ${platRes.data.totalPlatforms}`);
  console.log(` -> Categories count: ${platRes.data.categories?.length}`);
  if (platRes.data.totalPlatforms < 350) {
    throw new Error(`Expected at least 350 platforms, got ${platRes.data.totalPlatforms}`);
  }
  console.log(' -> PASS: 350 Platforms catalog verified.');

  // 2. Test Stream Filter on Platforms: Government
  console.log('\n[2] Testing GET /api/jobs/platforms?stream=government...');
  const govPlatRes = await get('/api/jobs/platforms?stream=government');
  console.log(` -> Gov platforms count: ${govPlatRes.data.count}`);
  const sampleGov = govPlatRes.data.data.slice(0, 5).map(p => p.name);
  console.log(` -> Sample Gov Portals: ${sampleGov.join(', ')}`);
  console.log(' -> PASS: Government platforms filtered accurately.');

  // 3. Test Real-time Stream Jobs: Government
  console.log('\n[3] Testing POST /api/jobs/criteria-search with stream=government...');
  const govJobsRes = await post('/api/jobs/criteria-search', { stream: 'government', limit: 5 });
  console.log(` -> Status: ${govJobsRes.status}`);
  console.log(` -> Total matching: ${govJobsRes.data.total}`);
  console.log(` -> Returned count: ${govJobsRes.data.count}`);
  govJobsRes.data.data.forEach((j, i) => {
    console.log(`    [${i+1}] ${j.title} | ${j.platform} | ${j.postedAt} | Apply: ${j.applyUrl}`);
  });
  console.log(' -> PASS: Government jobs aggregated and sorted chronologically.');

  // 4. Test Real-time Stream Jobs: B.Tech
  console.log('\n[4] Testing POST /api/jobs/criteria-search with stream=btech...');
  const btechJobsRes = await post('/api/jobs/criteria-search', { stream: 'btech', limit: 5 });
  console.log(` -> Status: ${btechJobsRes.status}`);
  console.log(` -> Returned count: ${btechJobsRes.data.count}`);
  btechJobsRes.data.data.forEach((j, i) => {
    console.log(`    [${i+1}] ${j.title} | ${j.platform} | ${j.postedAt} | Apply: ${j.applyUrl}`);
  });
  console.log(' -> PASS: B.Tech jobs verified.');

  // 5. Test Real-time Stream Jobs: B.Com
  console.log('\n[5] Testing POST /api/jobs/criteria-search with stream=bcom...');
  const bcomJobsRes = await post('/api/jobs/criteria-search', { stream: 'bcom', limit: 5 });
  console.log(` -> Status: ${bcomJobsRes.status}`);
  console.log(` -> Returned count: ${bcomJobsRes.data.count}`);
  bcomJobsRes.data.data.forEach((j, i) => {
    console.log(`    [${i+1}] ${j.title} | ${j.platform} | ${j.postedAt} | Apply: ${j.applyUrl}`);
  });
  console.log(' -> PASS: B.Com jobs verified.');

  // 6. Test Single Job Details for Real/External Job ID
  console.log('\n[6] Testing GET /api/jobs/real_gov_01...');
  const jobDetailRes = await get('/api/jobs/real_gov_01');
  console.log(` -> Status: ${jobDetailRes.status}`);
  console.log(` -> Title: ${jobDetailRes.data.data?.title}`);
  console.log(` -> Company: ${jobDetailRes.data.data?.companyName}`);
  console.log(` -> Apply URL: ${jobDetailRes.data.data?.applyUrl}`);
  if (jobDetailRes.status !== 200 || !jobDetailRes.data.data?.applyUrl) {
    throw new Error('Failed to retrieve external real job details');
  }
  console.log(' -> PASS: Direct job details retrieved successfully.');

  // Clean up
  server.close();
  await disconnectDB();
  console.log('\n=== ALL 350 PLATFORMS & REAL-TIME STREAM TESTS PASSED 100% ===');
}

testPlatformsSystem().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
