const moment = require('moment');
const fs = require('fs');

const logger = (name, action) => {
  fs.readFile('server/db/stats.json', 'utf8', (err, data) => {
    if(err){
      console.log('Error!');
    } else {
      const stat = JSON.parse(data);
      stat.push({
        time: moment().format('MMMM Do YYYY, h:mm:ss a'),
        action: action,
        prod_name: name,
      });
      fs.writeFile('server/db/stats.json', JSON.stringify(stat, null, 4), (err)=>{
        if(err){
          console.log('Error!!')
        }
      })
    }
  })
};

module.exports = logger;