const User = require('../models/user');
module.exports.renderRegister = (req,res)=>{
    res.render('users/register');
}

module.exports.userRegister = async(req,res)=>{
    try{
        const {username,email,password} = req.body;
        const user = new User({email,username});
        const registeredUser = await User.register(user,password);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            else{
                req.flash('success','Registered successfully! Welcome to Camp, '+username+'!');
                res.redirect('/campgrounds');
            }
        })

    }
    catch(e){
        req.flash('error',e.message);
        res.redirect('/register');
    }
}
module.exports.renderLogin = (req,res)=>{
    res.render('users/login');
}
module.exports.userLogin = (req,res)=>{
    req.flash('success','Welcome back, '+req.body.username+'!');
    // console.log(req.session);
    const redirectUrl = req.session.returnTo || '/campgrounds';
    
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}
module.exports.userLogout = (req,res)=>{
    req.logout(function(err){
        if(err){
            return next(err);
        }
        else{
        req.flash('success',"Logged out successfully!");
        res.redirect('/campgrounds');
        }
    });
    
}