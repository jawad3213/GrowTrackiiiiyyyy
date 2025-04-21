const JWT = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const access_token = req.cookies.access_token || req.query.token;
    if (!access_token) {
      return res.status(401).json({ message: "NO token was found." });
    }
    JWT.verify(access_token, process.env.ACCESS_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalide token or expired." });
      }
      req.user = decoded;
      next();
    });
  };
  const authorizate = (Role =[]) => {
    return  (req,res,next) => {
      const access_token = req.cookies.access_token || req.query.token;
    if (!access_token) {
      return res.status(401).json({ message: "NO token was found." });
    }
    try{
      const decoded = JWT.verify(access_token,process.env.ACCESS_SECRET);
      req.user = decoded;

       // Si aucun rôle requis => accès libre
      if (Role.length === 0 || Role.includes(decoded.role)){
        return next();
      }else{
        return res.status(403).json({ message: "Accès interdit : rôle non autorisé." });
      }
    }catch (err) {
        return res.status(401).json({ message: "Token invalide ou expiré." });
      }
    }

  }
    
        


  module.exports = authorizate;
