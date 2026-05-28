const http = require('http');

async function run() {
  try {
    const res = await fetch('http://localhost:3000/api/projects');
    const data = await res.json();
    console.log('GET returned', data.length, 'projects');
    console.log('Project Slugs:', data.map(p => p.slug));
  } catch (err) {
    console.error(err);
  }
}
run();
