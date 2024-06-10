
const db = require('../database');
login = 'admin'
//const { login, password } = req.body;
    db.get('SELECT * FROM users WHERE login = ?', login, (err, user) => {
        if (err) {
            console.log('res.status(500).send(Internal Server Error);'); 
        }
        if (!user) {
            console.log(user, 'sd 401 notuser Invalid login credentials');
        }
        console.log("POBEDA")

        // bcrypt.compare(password, user.password, (err, result) => {
        //     if (result) {
        //         console.log("POBEDA")

        //     } else {
        //         console.log("res.status(401).send('Invalid login credentials');")
        //     }
        // });
    });