const express = require('express');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config()
require('./auth');

const app = express();

function isLoggedIn(req, res, next) {
   req.user ? next() : res.sendStatus(401);
};

app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());


app.get('/', (req, res) => {
    const imageSignURLGoogle = 'https://developers.google.com/static/identity/gsi/web/images/standard-button-white.png';
    res.send(`<a href="/auth/google"><img src="${imageSignURLGoogle}" alt="Google Sign-In"></a>`);
});

app.get('/auth/google',
  passport.authenticate('google', { scope: [ 'email', 'profile' ] }
));

app.get( '/auth/google/callback',
  passport.authenticate( 'google', {
    successRedirect: '/protected',
    failureRedirect: '/auth/google/failure'
  })
);

app.get('/protected', isLoggedIn, (req, res) => {
  res.send(`Hello ${req.user.displayName}`);
});

app.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erro ao fazer logout');
        }
        req.session.destroy((err) => {
            res.redirect('/')
          })
    });
});

app.get('/auth/google/failure', (req, res) => {
  res.send('Failed to authenticate..');
});

app.listen(5000, () => console.log('listening on port: 5000'));