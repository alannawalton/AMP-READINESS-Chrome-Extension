const builtWith = require('builtwith');

builtWith('github.com')
  .then(response => {
    console.log(response);
  })
  .catch(err => {
    console.log(err);
  });

module.exports = function (n) { return n * 111 }