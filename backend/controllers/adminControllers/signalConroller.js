
const signalModel = require("../../models/adminModels/siganlModel");



exports.getAllSignals = async (req, res) => {
  try {
    const signal = await signalModel.getAllSignals();

    if (skills.length === 0) {
      return res.status(200).json({
        message: "No signal found.",
        data: [],
      });
    }

    return res.status(200).json({
      message: "signals retrieved successfully.",
      data: siganl,
    });

  } catch (error) {
    console.error("Error retrieving signals:", error);
    return res.status(500).json({
      error: "Internal server error. Please try again later.",
    });
  }
};

exports.getTotalSignals = async (req, res) => {
    try {
      const total = await skillModel.total();
  
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
            data: professors,
          });
      
        } catch (error) {
          console.error("Error retrieving signal by id:", error);
          return res.status(500).json({
            message: "Internal server error. Please try again later.",
          });
        }
    };

exports.sendSolution = async ( option_solution,subject_solution, name_coach,date_start,date_done) => {
    const { id_signal } = req.params;

    try{
        const result = await signalModel.solution(id_signal, option_solution,subject_solution, name_coach,date_start,date_done);
        return res.status(200).json({message : "send notification succes"})
    }catch (error) {
        console.error("Error retrieving signal by id:", error);
        return res.status(500).json({
          message: "Internal server error. Please try again later.",
        });
      }
}


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

