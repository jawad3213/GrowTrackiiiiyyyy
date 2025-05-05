const dash = require("../../models/profModels/dashModel");



// Controller to get the number of distinct classes for a professor
exports.getNumberOfClasses = async (req, res) => {
    const { id_prof } = req.params;
  
    // 1. Validate path parameter
    if (!id_prof) {
      return res.status(400).json({
        error: "Professor ID is required"
      });
    }
  
    try {
      // 2. Delegate to your dashboard module
      const totalClasses = await dash.total(id_prof);
  
      // 3. Successful response
      return res.status(200).json({
        message: "Number of classes retrieved successfully",
        total: totalClasses
      });
    } catch (error) {
      // 4. Log and return a generic server error
      console.error("getNumberOfClasses error:", error);
      return res.status(500).json({
        error: "Internal server error"
      });
    }
  };

exports.getNumberOfStudents = async (req,res) => {
    const { id_prof } = req.params;
    try{
        const totalstudents = await dash.totalstudent(id_prof);
        return res.status(200).json({
            message:"Number of classes retrieved successfully",
            total: totalstudents
        })
    }catch(error){
        console.error("getNumberOfstudents error:", error)
        return res.status(500).json({
            error: "Inernal server error"
        });
    }
}

exports.getAllClasses = async (req, res) => {
    const { id_prof } = req.params;
  
    // 1. Validate path parameter
    if (!id_prof) {
      return res.status(400).json({
        error: "Professor ID is required"
      });
    }
  
    try {
      // 2. Delegate to your dashboard module
      const classes = await dash.classes(id_prof);
  
      // 3. Successful response
      return res.status(200).json({
        message: " classes retrieved successfully",
        total: classes
      });
    } catch (error) {
      // 4. Log and return a generic server error
      console.error("Classes error:", error);
      return res.status(500).json({
        error: "Internal server error"
      });
    }
  };





  exports.flaggedEvaluations = async (req, res) => {
    const classId = req.query.classId || null;

  
    try {
      // 1) Récupérer les données SQL brutes
      const rows = await dash.getGraphSignal(classId); 
      // rows = [ { month: "2024-09", total: 5 }, … ]
  
      // 2) Déterminer l'année de début de l'année scolaire
      const now = new Date();
      const currentMonth = now.getMonth() + 1; // 1–12
      // Si on est en septembre ou après, la rentrée est cette année
      // Sinon, la rentrée était l'année précédente
      const startYear = currentMonth >= 9 
        ? now.getFullYear() 
        : now.getFullYear() - 1;
  
      // 3) Générer la liste de mois de l'année scolaire
      const academicMonths = [];
      // Septembre → Décembre de startYear
      for (let m = 9; m <= 12; m++) {
        academicMonths.push(`${startYear}-${String(m).padStart(2, '0')}`);
      }
      // Janvier → Juin de l'année suivante
      for (let m = 1; m <= 6; m++) {
        academicMonths.push(`${startYear + 1}-${String(m).padStart(2, '0')}`);
      }
      // academicMonths = ["2024-09","2024-10","2024-11","2024-12","2025-01",…,"2025-06"]
  
      // 4) Fusionner avec les totaux SQL (defaults à 0)
      const data = academicMonths.map(month => {
        const rec = rows.find(r => r.month === month);
        return {
          month,
          total: rec ? rec.total : 0
        };
      });
  
      // 5) Envoyer la réponse
      return res.status(200).json({ data });
    } catch (error) {
      console.error('Erreur dans flaggedEvaluations:', error);
      return res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
  };
  
  exports.dailyEvaluation = async (req, res) => {
    const { classId, month } = req.query;

    if (!classId || !month) {
        return res.status(400).json([]); // ◀️ Retourne un tableau vide en cas d'erreur
    }

    try {
        // const classIdNum = parseInt(classId, 10);
        // const monthNum   = parseInt(month,   10);

        const data = await dash.getGraphEvaluation(classId, month);
        res.status(200).json(data); // ◀️ Envoie directement le tableau
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json([]); // ◀️ Retourne un tableau vide en cas d'erreur
    }
};
  


// genere un lien d'image 
const genarateImageUrl =(path) => {
    return path ? `http://localhost:8080/${path.replace(/\\/g, "/")}` : null;
}



// 2) Définition du controller
exports.getTopStudentsByClass = async (req, res) => {
  try {
    // Récupérer l'ID du professeur depuis les paramètres d'URL
    const teacherId = req.params.id_prof;
    

    // Appel du modèle pour récupérer les meilleurs élèves
    const topStudents = await dash.greatestAll(teacherId);

    // Si aucune classe trouvée, on renvoie 404
    // if (topStudents.length === 0) {
    //   return res.status(404).json({ message: "Aucune classe trouvée pour ce professeur." });
    // }

    const updatetopStudents = topStudents.map (student => ({
        ...student,
        profile_picture_url:genarateImageUrl(student.profile_picture),
    }))

    // Renvoi du résultat
    return res.status(200).json({
      teacherId,
      topByClass: updatetopStudents
    });
  } catch (err) {
    console.error('Erreur dans getTopStudentsByClass:', err);
    return res.status(500).json({
      message: 'Erreur serveur, impossible de récupérer les meilleurs étudiants.'
    });
  }
};
