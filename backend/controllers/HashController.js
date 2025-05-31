// ce fichier est pour generer des mots de passe chiffres pour les utilise pour les administrateurs
// Ce fichier génère des mots de passe hachés pour les administrateurs
const bcrypt = require('bcrypt');

  
const hachage = async (req, res)=>{
    try {
      const { password } = req.body;
      const motDePasseSecurise = await bcrypt.hash(password, 10);
      return res.status(201).json({
        succes: true,
        message: "Mot de passe haché avec succès !",
        motDePasseHache: motDePasseSecurise
      });
    } catch (error) {
      return res.status(500).json({
        succes: false,
        message: "Erreur lors du hachage du mot de passe",
        error
      });
    }
}

module.exports = { hachage };