var koa = require('koa');
var app = koa();

app.use(function *() {
  this.body = 'Api is live';
});

app.listen(9000);
