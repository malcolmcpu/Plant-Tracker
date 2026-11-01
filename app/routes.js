//SETTING UP ACCESS TO THE 'PLANTS' COLLECTION WITHIN OUR DATABASE
const Plants = require('./models/plants');

module.exports = function (app, passport, db, ObjectId) {
  // normal routes ===============================================================

  // SERVING UP THE LANDING PAGE
  app.get('/', function (req, res) {
    res.render('index.ejs');
  });

  //SERVING UP THE ADD PLANT PAGE
  app.get('/plants/new', isLoggedIn, function (req, res) {
    res.render('addPlant.ejs');
  });

  // PROFILE SECTION =========================
  app.get('/profile', isLoggedIn, function (req, res) {
    // db.collection('plants')
    //   .find()
    //   .toArray((err, result) => {
    //     if (err) return console.log(err);
    //     res.render('profile.ejs', {
    //       user: req.user,
    //       //what's held in the 'messages' key, has to be referred to in profile.ejs
    //       messages: result,
    //     });
    //   });
    //RETRIEVING OUR LIST OF PLANTS ASSOCIATED WITH OUR USER
    Plants.find({ userId: req.user._id }, (err, plants) => {
      if (err) {
        return console.log(err);
      }
      res.render('profile.ejs', { user: req.user, plants });
    });
  });

  //CREATING A NEW PLANT DATABASE RECORD
  app.post('/plants', isLoggedIn, async (req, res) => {
    try {
      await Plants.create({
        userId: req.user._id,
        name: req.body.name,
        light: req.body.light,
      });
      console.log('New plant added to the database!');
      res.redirect('/profile');
    } catch (err) {
      console.error(err);
      res.redirect('/profile');
    }
  });

  // DELETING A PLANT RECORD
  app.delete('/delete/:id', async (req, res) => {
    try {
      const deleteThisPlant = await Plants.findByIdAndDelete(req.params.id);
      if (!deleteThisPlant) {
        return res.status(404).json({ message: 'Plant not found' });
      }
      res.json({ message: 'Plant deleted' });
      // res.redirect('/profile'); was NOT necessary
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // LOGOUT ==============================
  app.get('/logout', (req, res) => {
    req.logout(() => {
      console.log('User has logged out!');
    });
    res.redirect('/');
  });

  // // Previous message board routes ===============================================================

  // app.post('/messages', (req, res) => {
  //   db.collection('messages').save(
  //     { name: req.body.name, msg: req.body.msg, thumbUp: 0, thumbDown: 0 },
  //     (err, result) => {
  //       if (err) return console.log(err);
  //       console.log('saved to database');
  //       res.redirect('/profile');
  //     },
  //   );
  // });

  // app.put('/likeMsg', (req, res) => {
  //   db.collection('messages').findOneAndUpdate(
  //     {
  //       // name: req.body.name, msg: req.body.msg
  //       _id: new ObjectId(req.body.id),
  //     },
  //     {
  //       $inc: {
  //         thumbUp: 1,
  //       },
  //     },
  //     {
  //       sort: { _id: -1 },
  //       upsert: true,
  //     },
  //     (err, result) => {
  //       if (err) return res.send(err);
  //       res.send(result);
  //     },
  //   );
  // });

  // app.put('/dislikeMsg', (req, res) => {
  //   db.collection('messages').findOneAndUpdate(
  //     {
  //       // name: req.body.name, msg: req.body.msg
  //       _id: new ObjectId(req.body.id),
  //     },
  //     {
  //       $inc: {
  //         thumbUp: -1,
  //       },
  //     },
  //     {
  //       sort: { _id: -1 },
  //       upsert: true,
  //     },
  //     (err, result) => {
  //       if (err) return res.send(err);
  //       res.send(result);
  //     },
  //   );
  // });

  // app.delete('/deleteMsg', (req, res) => {
  //   db.collection('messages').findOneAndDelete(
  //     {
  //       // name: req.body.name,
  //       // msg: req.body.msg,
  //       _id: new ObjectId(req.body.id),
  //     },
  //     (err, result) => {
  //       if (err) return res.send(500, err);
  //       res.send('Message deleted!');
  //     },
  //   );
  // });

  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // SERVING UP THE LOGIN PAGE
  app.get('/login', function (req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  // WE'RE USING APP.POST FOR AUTHENTICATION ON LOGIN, BECAUSE APP.GET IS ALREADY BEING USED TO SIMPLY SERVE UP LOGIN PAGE; AND B/C WE ARE USING A FORM THE .POST METHOD IS THE DEFAULT METHOD WHEN USING A FORM

  // process the login form
  app.post(
    '/login',
    passport.authenticate('local-login', {
      successRedirect: '/profile', // redirect to the secure profile section
      failureRedirect: '/login', // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    }),
  );

  // SIGNUP =================================
  // SERVING UP THE PROFILE SIGN UP PAGE
  app.get('/signup', function (req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  // process the signup form
  app.post(
    '/signup',
    passport.authenticate('local-signup', {
      successRedirect: '/profile', // redirect to the secure profile section
      failureRedirect: '/signup', // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    }),
  );

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get('/unlink/local', isLoggedIn, function (req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function (err) {
      res.redirect('/profile');
    });
  });
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();

  res.redirect('/');
}
