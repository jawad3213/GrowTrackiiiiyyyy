const dashModel = require("../../models/studentModels/dashModel");


exports.numberOfProdjects = async (req,res) => {
    const { id_student } = req.params;
    try  {
        const result = await dashModel.getNombreProjets(id_student);
        res.status(200).json({
            success: true,
            message: "Number of projects retrieved successfully",
            data: result
        })
    }catch(error) {
        console.error("Error retrieving number of projects:", error);
        res.status(500).json({
            success: false,
            message: "Error retrieving number of projects",
            error: error.message
        });
    }
}

exports.signalReceived = async (req,res) => {
    const { id_student } = req.params;
    try {
        const result = await dashModel.getNumberOfSignal(id_student);
        res.status(200).json({
            success: true,
            message: "Number of signals retrieved successfully",
            data: result
        })

    }catch(error) {
        console.error("Error retrieving number of signals:", error);
        res.status(500).json({
            success: false,
            message: "Error retrieving number of signals",
            error: error.message
        });
    }

}

exports.moyenneDansLaClasse = async (req,res) => {
    const { id_student } = req.params;
    try {
        const result = await dashModel.getMoyenneDansLaClasse(id_student);
        res.status(200).json({
            success: true,
            message: "Average in the class retrieved successfully",
            data: result
        })
    }catch(error){
        console.erroe("Error retrieving average in the class:", error);
        res.status(500).json({
            success: false,
            message: "Error retrieving average in the class",
            error: error.message
        })
    }
}