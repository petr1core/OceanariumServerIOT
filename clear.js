const db = require('./database');
db.run('DROP TABLE IF EXISTS temperature_log;');
db.run('DROP TABLE IF EXISTS salinity_log;');
db.run('DROP TABLE IF EXISTS temperature_log;');
db.run('DROP TABLE IF EXISTS sensors;');
console.log('Sensors data was successfully cleared from database');