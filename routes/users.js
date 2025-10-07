const express=require('express');
const async=require('../utils/catchAsync')
const router=express();
const { storeReturnTo } = require('../middleware');

const User=require('../models/user');
const passport = require('passport');

router.get('/register',(req,res)=>{
    res.render('users/register')
})

router.post('/register',async(async(req,res,next)=>{
    try{
        const{username,email,password}=req.body;
    const user=await User({username,email});
    const registeruser=await User.register(user,password);
    req.login(registeruser,err=>{
        if (err) return next(err)
            console.log(registeruser);
    req.flash('success','Welcome!');
    res.redirect('/campgrounds')
    })
    }
    catch(e){
        req.flash('error',e.message);
        res.redirect('register');
    }
}));

 router.get('/login',(req,res)=>{
    res.render('users/login');
 })



router.post('/login',
    storeReturnTo,
    passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}),
    (req, res) => {
        req.flash('success', 'Welcome back!');
        const redirectUrl = res.locals.returnTo || '/campgrounds'; 
        res.redirect(redirectUrl);
    });


router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
});


module.exports = router;

