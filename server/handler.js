const cart = require('./cart');
const fs = require('fs');
const logger = require('./logger');

const actions = {
  add: cart.add,
  change: cart.change,
  remove: cart.remove,
};

const handler = (req, res, action, file) => {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      res.send({result: 0, text: 'Error!!'})
    } else {
      let {newCart, name} = actions[action](JSON.parse(data), req); // синтаксис деструктуризации
      fs.writeFile(file, newCart, (err) => {
        if (err) {
          res.send({result: 0, text: 'Error!!'})
        } else {
          logger(name, action);
          res.send({result: 1, text: 'Success!!'})
        }
      })
    }
  })
};

module.exports = handler;