module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo=req.originalUrl;//store to session
        req.session.save();
        console.log(req.session);
        req.flash('error','Please sign in first!');
        return res.redirect('/login');
    }
    next();
}