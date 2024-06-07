"use strict";

var express = require('express');

var axios = require('axios');

require('dotenv').config();

var app = express();
var port = 3000;
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
var apiKey = process.env.API_KEY;

function generateMathQuestion(topic, level) {
  var prompt, response;
  return regeneratorRuntime.async(function generateMathQuestion$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          prompt = "Generate a ".concat(level, " level math question about ").concat(topic, ".");
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(axios.post('https://api.openai.com/v1/completions', {
            prompt: prompt,
            max_tokens: 50,
            temperature: 0.7,
            model: 'davinci-codex' // Utiliza el modelo davinci-codex

          }, {
            headers: {
              'Authorization': "Bearer ".concat(apiKey),
              'Content-Type': 'application/json'
            }
          }));

        case 4:
          response = _context.sent;
          return _context.abrupt("return", response.data.choices[0].text.trim());

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](1);
          console.error('Error generating question:', _context.t0.response ? _context.t0.response.data : _context.t0.message);
          return _context.abrupt("return", null);

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 8]]);
}

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/api.html');
});
app.post('/generate-question', function _callee(req, res) {
  var _req$body, topic, level, question;

  return regeneratorRuntime.async(function _callee$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body = req.body, topic = _req$body.topic, level = _req$body.level;
          _context2.next = 3;
          return regeneratorRuntime.awrap(generateMathQuestion(topic, level));

        case 3:
          question = _context2.sent;
          res.send({
            question: question
          });

        case 5:
        case "end":
          return _context2.stop();
      }
    }
  });
});
app.listen(port, function () {
  console.log("Server running at http://localhost:".concat(port));
});