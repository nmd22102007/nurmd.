const https = require('https');
https.get('https://raw.githubusercontent.com/FortAwesome/Font-Awesome/master/svgs/brands/whatsapp.svg', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(data));
});
