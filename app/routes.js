var ObjectId = require('mongodb').ObjectID;
module.exports = function(app, passport, db) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        db.collection('cards').find({"user": req.session.passport.user}, (err, cards) => {
          if (err) return console.log(err)
          res.render('profile.ejs', {
            user : req.user,
            cards: cards
          })
        })
    });

    app.get('/owned', isLoggedIn, function(req, res) {
      const colorId = req.query.color;
      const userObject = {
        "user": req.session.passport.user
      }
      const userWithColor = {
        "user": req.session.passport.user,
        "colors": colorId
      }
      function test(){
        if(colorId){
          return userWithColor
        }else{
          return userObject
        }
      }
      db.collection('cards').find(test()).toArray((err, results) =>{
        console.log(results);
        if(err) return console.log(err)
        res.render('owned.ejs',{
          user: req.user,
          cards: results
        })
      })
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// message board routes ===============================================================
  //restart the server each time I make a update
    app.post('/magic', (req, res) => {
      db.collection('cards').save({user: req.session.passport.user, url: req.body.url, colors: req.body.colors}, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/profile')
      })
    })


    app.delete('/magic', (req, res) => {
      var uId = ObjectId(req.body.allan);
      db.collection('cards').findOneAndDelete({"_id": uId}, (err, result) => {
        console.log(uId);
        console.log("This is result:" + result);
        if (err) return res.send(500, err)
        res.send('Message deleted!')
      })
    })

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/index');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
