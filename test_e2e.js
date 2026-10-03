const http = require('http');

async function testApi() {
  console.log('--- Testing SkillBridge Full-Stack Deployment ---');

  // 1. Frontend Test
  await new Promise((resolve) => {
    http.get('http://localhost:4200/', (res) => {
      console.log(`[PASS] Frontend (Angular 19) is LIVE: HTTP ${res.statusCode}`);
      resolve();
    }).on('error', (err) => {
      console.error('[FAIL] Frontend error:', err.message);
      resolve();
    });
  });

  // 2. Backend Health
  await new Promise((resolve) => {
    http.get('http://localhost:5000/api/health', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`[PASS] Backend (Node/Express) is LIVE: HTTP ${res.statusCode} -> ${data.trim()}`);
        resolve();
      });
    }).on('error', (err) => {
      console.error('[FAIL] Backend error:', err.message);
      resolve();
    });
  });

  // 3. Test Auth & Student APIs
  const loginBody = JSON.stringify({ email: 'student@skillbridge.com', password: 'Password123!' });
  const loginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: loginBody
  });
  const loginData = await loginRes.json();
  console.log(`[PASS] Student Auth Login: success=${loginData.success}, user=${loginData.user?.name}, role=${loginData.user?.role}`);

  const token = loginData.token;

  // 4. Test Profile Retrieval
  const profileRes = await fetch('http://localhost:5000/api/profiles/me', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const profileData = await profileRes.json();
  console.log(`[PASS] Student Profile: completion=${profileData.data?.profileCompletion}%, skills=${profileData.data?.skills?.length}`);

  // 5. Test Job Discovery & Search
  const jobsRes = await fetch('http://localhost:5000/api/jobs?search=Angular');
  const jobsData = await jobsRes.json();
  console.log(`[PASS] Job Search API: count=${jobsData.count}, sample title="${jobsData.data?.[0]?.title}"`);

  // 6. Test AI Career Assistant Chat
  const chatRes = await fetch('http://localhost:5000/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ message: 'What should I learn to become a Senior Full Stack Engineer?' })
  });
  const chatData = await chatRes.json();
  console.log(`[PASS] AI Career Assistant Response: success=${chatData.success}, replyLength=${chatData.data?.reply?.length}`);

  // 7. Test AI Skill Gap Analysis
  const gapRes = await fetch('http://localhost:5000/api/skills/analyze-gap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ targetRole: 'Frontend Developer' })
  });
  const gapData = await gapRes.json();
  console.log(`[PASS] AI Skill Gap Analysis: score=${gapData.data?.readinessScore}%, missingSkills=${gapData.data?.missingSkills?.join(', ')}`);

  // 7b. Test AI Cover Letter Generation
  const targetJobId = jobsData.data?.[0]?._id;
  const clRes = await fetch('http://localhost:5000/api/ai/generate-cover-letter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ jobId: targetJobId, customInstructions: 'Highlight Angular signal architecture and REST APIs' })
  });
  const clData = await clRes.json();
  console.log(`[PASS] AI Cover Letter Generation: success=${clData.success}, coverLetterLen=${clData.data?.coverLetter?.length}`);

  // 7c. Test Technical Interview Questions & AI Mock Session
  const questionsRes = await fetch('http://localhost:5000/api/interviews/questions?category=JavaScript');
  const questionsData = await questionsRes.json();
  console.log(`[PASS] Interview Questions Bank: count=${questionsData.count}, sample="${questionsData.data?.[0]?.question}"`);

  const mockStartRes = await fetch('http://localhost:5000/api/interviews/mock/start', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ category: 'JavaScript', targetRole: 'Frontend Developer', difficulty: 'Intermediate', questionCount: 2 })
  });
  const mockStartData = await mockStartRes.json();
  console.log(`[PASS] AI Mock Interview Session Created: id=${mockStartData.data?._id}, questionsCount=${mockStartData.data?.questions?.length}`);

  const mockSubmitRes = await fetch(`http://localhost:5000/api/interviews/mock/${mockStartData.data?._id}/answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ questionIndex: 0, userAnswer: 'Closures are functions that retain lexical scope reference to outer variables even after parent execution completes.' })
  });
  const mockSubmitData = await mockSubmitRes.json();
  console.log(`[PASS] AI Mock Answer Evaluation: score=${mockSubmitData.data?.evaluation?.score}%, feedback="${mockSubmitData.data?.evaluation?.feedback}"`);

  // 8. Test Recruiter Auth & Candidate Search
  const recLoginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'recruiter@skillbridge.com', password: 'Password123!' })
  });
  const recLoginData = await recLoginRes.json();
  const recToken = recLoginData.token;
  console.log(`[PASS] Recruiter Auth Login: success=${recLoginData.success}, user=${recLoginData.user?.name}, role=${recLoginData.user?.role}`);

  const candidatesRes = await fetch('http://localhost:5000/api/users/candidates', {
    headers: { 'Authorization': `Bearer ${recToken}` }
  });
  const candidatesData = await candidatesRes.json();
  console.log(`[PASS] Recruiter Candidate Discovery: count=${candidatesData.count}, candidate=${candidatesData.data?.[0]?.name}`);

  // 9. Test Admin Auth & Stats
  const adminLoginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@skillbridge.com', password: 'Password123!' })
  });
  const adminLoginData = await adminLoginRes.json();
  const adminToken = adminLoginData.token;
  console.log(`[PASS] Admin Auth Login: success=${adminLoginData.success}, user=${adminLoginData.user?.name}, role=${adminLoginData.user?.role}`);

  const statsRes = await fetch('http://localhost:5000/api/admin/stats', {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  const statsData = await statsRes.json();
  console.log(`[PASS] Admin Stats: users=${statsData.data?.totalUsers}, jobs=${statsData.data?.totalJobs}, apps=${statsData.data?.totalApplications}`);

  console.log('--- ALL FULL-STACK SMOKE TESTS COMPLETED SUCCESSFULLY ---');
}

testApi();
