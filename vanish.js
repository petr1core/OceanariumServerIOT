const db = require('./database');
db.run('DROP TABLE IF EXISTS temperature_log;');
db.run('DROP TABLE IF EXISTS salinity_log;');
db.run('DROP TABLE IF EXISTS luminance_log;');
db.run('DROP TABLE IF EXISTS sensors;');
db.run('DROP TABLE IF EXISTS users;');
console.log('All database was vanished');