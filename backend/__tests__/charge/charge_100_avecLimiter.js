import http from 'k6/http';
import { check, sleep } from 'k6';

// ==========================================
// TEST COMPARATIF: AVEC RATE LIMITER ACTIVÉ
// ==========================================
// Même profil de charge que votre test sans limiter
// pour comparaison directe des performances

export const options = {
  stages: [
    { duration: '30s', target: 10 },   // Identique à votre test
    { duration: '30s', target: 25 },
    { duration: '30s', target: 50 },
    { duration: '30s', target: 75 },
    { duration: '30s', target: 100 },  // Même pic à 100 VU
  ],
  thresholds: {
    // Seuils adaptés pour comparaison avec rate limiter
    http_req_duration: ['p(95)<3000'], // Vs 2500ms sans limiter
    http_req_failed: ['rate<0.5'],     // Vs 0.1 sans limiter (429 attendus)
    'http_req_duration{expected_response:true}': ['p(90)<2500'], // Vs 2000ms
    
    // Nouveaux seuils spécifiques au rate limiting
    'http_req_duration{status:200}': ['p(95)<2500'], // Performance des requêtes réussies
    'http_req_duration{status:429}': ['p(95)<500'],  // Les 429 doivent être ultra-rapides
    'http_reqs{status:200}': ['count>50'],           // Au moins 50 requêtes réussies
  },
};

// Variables pour comparaison détaillée
let totalRequests = 0;
let successRequests = 0;
let rateLimitedRequests = 0;
let otherErrors = 0;
let totalResponseTime = 0;
let successResponseTime = 0;

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
  
  totalRequests++;
  totalResponseTime += res.timings.duration;

  let parsedBody;
  try {
    parsedBody = res.json();
  } catch (e) {
    const bodyPreview = res.body ? res.body.substring(0, 200) : 'No response body';
    console.error(`❌ Parse error - Status: ${res.status}, Body: ${bodyPreview}`);
    parsedBody = null;
  }

  const checks = check(res, {
    // Checks identiques à votre test original pour comparaison
    'status is 200': (r) => r.status === 200,
    'response time < 2.5s': (r) => r.timings.duration < 2500,
    'token exists': (r) => parsedBody && parsedBody.access_token !== undefined,
    'content-type is JSON': (r) => r.headers['Content-Type'] && r.headers['Content-Type'].includes('application/json'),
    
    // Checks supplémentaires pour le rate limiting
    'rate_limiter_working': (r) => r.status === 200 || r.status === 429,
    'fast_rate_limit_response': (r) => r.status !== 429 || r.timings.duration < 1000,
  });

  // Comptage détaillé pour statistiques
  if (res.status === 200 && parsedBody && parsedBody.access_token) {
    successRequests++;
    successResponseTime += res.timings.duration;
  } else if (res.status === 429) {
    rateLimitedRequests++;
  } else {
    otherErrors++;
  }

  // Logging comparatif (même format que votre test original)
  if (res.status === 429) {
    console.log(`🚫 RATE LIMITED - VU: ${__VU}, Iter: ${__ITER}, Duration: ${res.timings.duration}ms`);
    if (parsedBody && parsedBody.message) {
      console.log(`   Rate limit message: ${parsedBody.message}`);
    }
  } else if (res.status !== 200) {
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

  // Stats en temps réel pour comparaison
  if (totalRequests % 100 === 0) {
    const successRate = (successRequests / totalRequests * 100).toFixed(1);
    const rateLimitRate = (rateLimitedRequests / totalRequests * 100).toFixed(1);
    const avgResponseTime = (totalResponseTime / totalRequests).toFixed(0);
    const avgSuccessTime = successRequests > 0 ? (successResponseTime / successRequests).toFixed(0) : 0;
    
    console.log(`\n📊 COMPARAISON EN COURS - Requêtes: ${totalRequests}`);
    console.log(`   ✅ Succès: ${successRate}% (avg: ${avgSuccessTime}ms)`);
    console.log(`   🚫 Rate Limited: ${rateLimitRate}%`);
    console.log(`   ⏱️  Temps moyen global: ${avgResponseTime}ms`);
  }

  sleep(1); // Même délai que votre test original
}

export function teardown() {
  const successRate = (successRequests / totalRequests * 100).toFixed(1);
  const rateLimitRate = (rateLimitedRequests / totalRequests * 100).toFixed(1);
  const errorRate = (otherErrors / totalRequests * 100).toFixed(1);
  const avgResponseTime = (totalResponseTime / totalRequests).toFixed(0);
  const avgSuccessTime = successRequests > 0 ? (successResponseTime / successRequests).toFixed(0) : 'N/A';

  console.log('\n' + '='.repeat(60));
  console.log('📈 RÉSULTATS COMPARATIFS - AVEC RATE LIMITER');
  console.log('='.repeat(60));
  console.log(`📊 Total requêtes envoyées: ${totalRequests}`);
  console.log(`✅ Requêtes réussies: ${successRequests} (${successRate}%)`);
  console.log(`🚫 Rate limitées (429): ${rateLimitedRequests} (${rateLimitRate}%)`);
  console.log(`❌ Autres erreurs: ${otherErrors} (${errorRate}%)`);
  
  console.log('\n⏱️  TEMPS DE RÉPONSE:');
  console.log(`   Global moyen: ${avgResponseTime}ms`);
  console.log(`   Succès moyen: ${avgSuccessTime}ms`);
  
  console.log('\n📋 COMPARAISON ATTENDUE AVEC VOTRE TEST SANS LIMITER:');
  console.log(`   Sans limiter: ~95%+ de succès, ~800-1200ms moyen`);
  console.log(`   Avec limiter: ${successRate}% de succès, ${avgResponseTime}ms moyen`);
  
  console.log('\n🎯 ANALYSE:');
  if (rateLimitedRequests > 0) {
    console.log(`   ✅ Rate limiter fonctionne (${rateLimitedRequests} requêtes bloquées)`);
  }
  if (parseInt(successRate) < 50) {
    console.log(`   ⚠️  Impact significatif: ${100 - parseFloat(successRate)}% de requêtes bloquées`);
  }
  if (parseInt(avgResponseTime) > 1500) {
    console.log(`   ⚠️  Dégradation des performances due au rate limiting`);
  } else {
    console.log(`   ✅ Performances des requêtes réussies maintenues`);
  }
  
  console.log('\n💡 Pour comparaison complète, lancez le même test avec limiter désactivé');
  console.log('='.repeat(60));
}