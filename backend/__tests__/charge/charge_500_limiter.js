import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 100 },   // Montée progressive
    { duration: '1m', target: 250 },   // Charge modérée
    { duration: '1m', target: 400 },   // Charge élevée
    { duration: '2m', target: 500 },   // Charge maximale maintenue
    { duration: '1m', target: 0 },     // Arrêt progressif
  ],
  thresholds: {
    http_req_duration: ['p(95)<5000'],     // Plus permissif pour 500 VU
    http_req_failed: ['rate<0.2'],         // Tolérance plus élevée (20% vs 10%)
    'http_req_duration{expected_response:true}': ['p(90)<4000'], // 90% < 4s au lieu de 2.5s
  },
};

export default function () {
  const url = 'http://localhost:3000/api/auth/login';

  const payload = JSON.stringify({
    email: 'youssef.fassi@example.com',
    password: 'PASS1234',
    RememberMe: false,
  });

  const headers = {
    'Content-Type': 'application/json',
  };

  const res = http.post(url, payload, { headers });

  // Logging simple
  if (res.status !== 200) {
    console.error(`❌ Status ${res.status}: ${res.body || 'No response body'}`);
  }

  let parsedBody;
  try {
    parsedBody = res.json();
  } catch (e) {
    const bodyPreview = res.body ? res.body.substring(0, 200) : 'No response body';
    console.error(`❌ Parse error - Status: ${res.status}, Body: ${bodyPreview}`);
    parsedBody = null;
  }

  const checks = check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 5s': (r) => r.timings.duration < 5000,      // Plus permissif
    'token exists': (r) => parsedBody && parsedBody.access_token !== undefined,
    'content-type is JSON': (r) => r.headers['Content-Type'] && r.headers['Content-Type'].includes('application/json'),
  });

  // Logging des performances
  if (res.status !== 200) {
    console.log(`❌ HTTP Error - Status: ${res.status}, Duration: ${res.timings.duration}ms`);
  } else if (res.timings.duration > 4000) {
    console.log(`⚠️ Slow request - Status: ${res.status}, Duration: ${res.timings.duration}ms`);
  }

  sleep(1);
}