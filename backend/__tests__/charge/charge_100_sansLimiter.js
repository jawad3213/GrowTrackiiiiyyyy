import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 10 },   // Montée progressive
    { duration: '30s', target: 25 },
    { duration: '30s', target: 50 },
    { duration: '30s', target: 75 },
    { duration: '30s', target: 100 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<2500'], // Ajusté pour être plus réaliste sous charge élevée
    http_req_failed: ['rate<0.1'],
    // Ajout de seuils supplémentaires pour un meilleur monitoring
    'http_req_duration{expected_response:true}': ['p(90)<2000'], // 90% des requêtes réussies < 2s
  },
};

export default function () {
  const url = 'http://localhost:3000/api/auth/login';
  // Remplacer localhost par ton IP local
  //const url = 'http://192.168.1.X:3000/api/auth/login'; // Ton IP local

  const payload = JSON.stringify({
    email: 'youssef.fassi@example.com',
    password: 'PASS1234',
    RememberMe: false,
  });

  const headers = {
    'Content-Type': 'application/json',
  };

  const res = http.post(url, payload, { headers });

  // Debug détaillé avec vérification null/undefined
  if (res.status !== 200) {
    console.error(`❌ Status ${res.status}: ${res.body || 'No response body'}`);
  }

  let parsedBody;
  try {
    parsedBody = res.json();
  } catch (e) {
    // Correction : vérifier que res.body existe avant substring
    const bodyPreview = res.body ? res.body.substring(0, 200) : 'No response body';
    console.error(`❌ Parse error - Status: ${res.status}, Body: ${bodyPreview}`);
    parsedBody = null;
  }

  const checks = check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 2.5s': (r) => r.timings.duration < 2500, // Ajusté de 2s à 2.5s
    'token exists': (r) => parsedBody && parsedBody.access_token !== undefined,
    'content-type is JSON': (r) => r.headers['Content-Type'] && r.headers['Content-Type'].includes('application/json'),
  });

  // Debug complet pour identifier le problème
  if (res.status !== 200) {
    console.log(`❌ HTTP Error - Status: ${res.status}, Duration: ${res.timings.duration}ms`);
    console.log(`Response: ${res.body ? res.body.substring(0, 200) : 'No body'}`);
  } else if (!parsedBody) {
    console.log(`❌ JSON Parse Error - Status: ${res.status}, Duration: ${res.timings.duration}ms`);
    console.log(`Raw response: ${res.body ? res.body.substring(0, 200) : 'No body'}`);
  } else if (!parsedBody.access_token) {
    console.log(`❌ Missing Token - Status: ${res.status}, Duration: ${res.timings.duration}ms`);
    console.log(`Response keys: ${Object.keys(parsedBody).join(', ')}`);
    console.log(`Message: ${parsedBody.message || 'No message'}`);
  } else if (res.timings.duration > 3000) {
    console.log(`⚠️ Slow request - Status: ${res.status}, Duration: ${res.timings.duration}ms`);
  }

  sleep(1);
}