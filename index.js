require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: false })); 

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


let urlDatabase = [];
let counter = 1;


app.post('/api/shorturl', (req, res) => {
  const url = req.body.url; 
  
 
  if (!url || !url.startsWith('http://') && !url.startsWith('https://')) {
    return res.json({ error: 'invalid url' });
  }
  
  //! Check if it already exists
  const existUrl = urlDatabase.find(item => item.original_url === url);
  if (existUrl) {
    return res.json(existUrl);
  }
  
  //! Create new URL
  const newUrl = {
    original_url: url,
    short_url: counter
  };
  
  urlDatabase.push(newUrl);
  counter++;
  
  res.json(newUrl);
});


app.get('/api/shorturl/:short_url', (req, res) => {
  const shortId = parseInt(req.params.short_url);
  
  const found = urlDatabase.find(item => item.short_url === shortId);
  if (!found) {
    return res.json({ error: 'No short URL found for the given input' });
  }
  
  res.redirect(found.original_url);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});