const jwt=require('jsonwebtoken');
const secret=process.env.JWT_SECRET
function checkforAuthentication(req,res,next){
    const tokenCookie=req.cookies.token;
    const authHeader = req.headers['authorization'];
    let token = null;
    if (tokenCookie) {
        token = tokenCookie;
    } else if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split("Bearer ")[1];
    }
    if (token) {
        const admin = getUser(token);
        if(!admin) return res.status(401).json({error: "Unauthorized"});
        req.admin = admin;
        next();
    } else {
        return res.status(401).json({error: "Unauthorized"});
    }
}
function getUser(token){
    if(!token) return null;
    try{
        return jwt.verify(token,secret);
    }
    catch(error){
        return null;
    }
}
module.exports=checkforAuthentication