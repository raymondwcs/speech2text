const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const app = express();
const fetch = require('node-fetch');
const APIKEY = '';

/*
curl -X POST -u "apikey:{apikey}" \
--header "Content-Type: audio/flac" \
--data-binary @{path_to_file}audio-file.flac \
"{url}/v1/recognize"
*/

/* curl -u "apikey:{apikey}" */
/* Expects the following in the POST/GET header */
/* 'Authorization' : 'Basic <base64 encoded apikey:{apikey} */
var base64encodedData = Buffer.from(`apikey:${APIKEY}`).toString('base64');

var options = {
    host: 'gateway-tok.watsonplatform.net',
    port: 80,
    path: 'speech-to-text/api/v1/recognize',
    method: 'POST',
    headers: {
    	'Content-Type': 'audio/flac', 
	'Authorization': `Basic ${base64encodedData}`
    },
    json: true 
};

app.set('view engine', 'ejs');

// middlewares
app.use(fileUpload());
app.use(bodyParser.json());

app.get('/',function(req,res) {
  res.render('form',{});
})

app.post('/upload', function(req, res) {
  if (!req.files) {
      res.status(500).end('No files were uploaded.');
  }

  options['body'] = req.files.audio_file.data;

  speech2Text().then(data => {
	res.json(data);
  })
})

async function speech2Text() {
   const res = await fetch(`https://${options.host}/${options.path}`,options);
   const data = await res.json();
   
   return(data);
}

app.listen(process.env.PORT || 8099, function() {
    console.log('Server running...');
});
