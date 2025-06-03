
const signalModel = require("../../models/adminModels/signalModel");

// Fonction pour générer l'URL complète de l'image
const generateImageUrl = (path) => {
  if (!path) return null; // Si l'utilisateur n'a pas d'image
  return `http://localhost:3000/uploads/${path}`; // Chemin de ton serveur + dossier d'upload
};

exports.getAllSignals = async (req, res) => {
  try {
    const result = await signalModel.getAllSignals(); // Appel du modèle
    const signals = result.rows; // Récupérer les lignes

    if (signals.length === 0) {
      return res.status(200).json({
        message: "No signals found.",
        data: [],
      });
    }

    const updatedSignals = signals.map(signal => ({
      ...signal,
      reporder_profile_picture_url: generateImageUrl(signal.reporder_picture), // utilise le bon champ
      reported_profile_picture_url: generateImageUrl(signal.reported_picture), // utilise le bon champ
    }));
    

    return res.status(200).json({
      message: "Signals retrieved successfully.",
      data: updatedSignals,
    });

  } catch (error) {
    console.error("Error retrieving signals:", error);
    return res.status(500).json({
      message: "An error occurred while retrieving signals.",
    });
  }
};


exports.getTotalSignals = async (req, res) => {
    try {
      const total = await signalModel.total();
  
      return res.status(200).json({
        message: "Total number of signals retrieved successfully.",
        data: total,
      });
  
    } catch (error) {
      console.error("Error retrieving total number of signals:", error);
      return res.status(500).json({
        message: "Internal server error. Please try again later.",
      });
    }
  };

  
  exports.getSignalById = async (req, res) => {
      const { id_signal } = req.params;
    
      try {
        const result = await signalModel.getSignalById(id_signal);
    
        return res.status(200).json({
            message: "signals retrieved successfully by id.",
            data: result,
          });
      
        } catch (error) {
          console.error("Error retrieving signal by id:", error);
          return res.status(500).json({
            message: "Internal server error. Please try again later.",
          });
        }
    };

exports.sendSolution = async (req,res ) => {
    const {option_solution ,details, name_coach,start_date,date_done} =  req.body;
    const { id_signal } = req.params;

    try{
        const result = await signalModel.solution( id_signal,option_solution,details, name_coach,start_date,date_done);
        return res.status(200).json({message : "send notification succes"})
    }catch (error) {
        console.error("Error retrieving signal by id:", error);
        return res.status(500).json({
          message: "Internal server error. Please try again later.",
        });
      }
}

exports.sendAlert = async (req, res) => {
  const { details } = req.body;
  const { id_signal } = req.params;

  try {
    const result = await signalModel.sendAlert(id_signal, details);
    
    return res.status(200).json({
      message: "Notification envoyée avec succès.",
      data: result
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi de la notification :", error);
    return res.status(500).json({
      message: "Erreur serveur interne. Veuillez réessayer plus tard."
    });
  }
};



exports.deleteSignal = async (req, res) => {
  const { id_signal } = req.params;

  try {
    const result = await signalModel.deleteSignal(id_signal);

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "signal not found.",
      });
    }

    return res.status(200).json({
      message: "signal deleted successfully.",
    });

  } catch (error) {
    console.error("Error deleting signal:", error);
    return res.status(500).json({
      message: "Internal server error. Please try again later.",
    });
  }
};

