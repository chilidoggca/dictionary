const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const server = http.createServer((request, response) => {
  const params = url.parse(request.url, true).query;

  require.extensions['.txt'] = function (module, filename) {
      module.exports = fs.readFileSync(filename, 'utf8');
  };
  const dictionary = require("./Oxford+English+Dictionary.txt");
  const entries = dictionary.toString().split(/\n\n(?!Usag)/g);
  const words = [];
  entries.map((x) => {
                let a=x.split('  ');
                words.push(a[0]);
                });
  const compilation = {};
  words.forEach((word, i) => compilation[word] = entries[i]);
  function generator (w='') {
    q = w.slice(0,1).toUpperCase()+w.slice(1).toLowerCase();
    if (compilation[q]) {
      console.log(compilation[q]);
      return `${compilation[q]}`;
    } else {
      return `Sorry your word was not found.`
    }
  }

  const htmlHeader = `<!DOCTYPE html>
                  <html>
                    <head>
                      <title>Oxford English Dictionary</title>
                      <meta charset="utf-8">
                      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/css/bootstrap.min.css" integrity="sha384-PsH8R72JQ3SOdhVi3uxftmaW6Vc51MKb0q5P2rRUpPvrszuE4W1povHYgTpBfshb" crossorigin="anonymous">
                    <head>
                    <body>
                      <nav class="navbar navbar-dark bg-primary bg-dark">
                        <a class="navbar-brand ml-5" href="/">My Dictionary App</a>
                        <form action="/" method="get" class="form-inline">
                          <input class="form-control" name="word" type="search" placeholder="Search">
                          <button class="btn btn-outline-warning m-2 mr-5" type="submit">Search</button>
                        </form>
                      </nav>
                      <div class="container">`;
  const htmlFooter = `    </div>
                          </body>
                        </html>`;
  const htmlContent = function() {
    if (params.word) {
      return `<h1>${params.word}</h1>
              <p>${generator(params.word)}</p>`;
    } else if (!params.word) {
      return `<h1>Read Me</h1>
              <p>This is a single-page dictionary project done strictly with node.</p>`;
    }
  }

  response.writeHead(200, { 'Content-Type': 'text/html' });

  response.write(`${htmlHeader}
                      ${htmlContent()}
                  ${htmlFooter}`);
  response.end();
});

const port = process.env.PORT || 5000;
server.listen(port);
console.log('http server running on localhost on port 5000');
