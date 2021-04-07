const router = require('express').Router();
const db = require('./Database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authenticationMiddleware = require('./middleware');
const cors = require('cors');

router.get('/', async (req, res) => {
    res.status(201).send('Hello!');
});

router.get('/createtableusers', async (req, res) => {
    let sql =
        'CREATE TABLE users(id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(50), password VARCHAR(200))';
    try {
        await db.query(sql, (error, results) => {
            if (error) res.send(error.sqlMessage);
            console.log(results);
            res.send(results);
        });
    } catch (error) {
        console.log(error);
    }
});

//USER REGISTER
router.post('/register', cors(), async (req, res) => {
    // Hashing a password

    console.log(req.body);
    if ((req.body = {})) return console.log('Empty body');
    const encPass = await bcrypt.hash(req.body.password, 4);

    const newUser = {
        username: req.body.username,
        email: req.body.email,
        password: encPass,
    };

    let sql = `INSERT INTO users(username, email, password) VALUES('${newUser.username}','${newUser.email}' ,'${newUser.password}')`;
    try {
        await db.query(sql, (error, results) => {
            if (error) return res.send(error);
            console.log(results);
            res.status(201).send('Account succesfully created!');
        });
    } catch (error) {
        res.send(error);
    }
});

router.post('/login', (req, res) => {
    const user = {
        username: req.body.username,
        password: req.body.password,
    };

    let sql = `SELECT * FROM users WHERE username = '${user.username}'`;
    try {
        db.query(sql, async (error, results) => {
            if (error) return res.send(error);
            if (!results.length) return res.send('Wrong password or username!');

            userFetched = { ...results[0] };

            if (await bcrypt.compare(user.password, userFetched.password)) {
                //LOGGED IN
                // JWT

                const accessToken = jwt.sign(
                    user,
                    process.env.ACCESS_TOKEN_SECRET
                );
                sql = `UPDATE users SET authToken = '${accessToken}' WHERE username = '${user.username}'`;
                db.query(sql, (err, results) => {
                    if (err) return res.json(err);
                    console.log(results);
                    res.sendStatus(200);
                });
            } else {
                res.send('Wrong password or username!');
            }
        });
    } catch (error) {
        res.send('Wrong password or username!');
    }
});

module.exports = router;
