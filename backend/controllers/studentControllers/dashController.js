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

exports.evaluationSubmitted = async (req,res) => {
    const { id_student } = req.params;
    try {
        const result = await dashModel.getEvaluationSubmitted(id_student);
        res.status(200).json({
            success: true,
            message: "Number of evaluations submitted retrieved successfully",
            data: result
        })
    }catch(error) {
        console.error("Error retrieving number of evaluations submitted:", error);
        res.status(500).json({
            success: false,
            message: "Error retrieving number of evaluations submitted",
            error: error.message
        });
    }
}
exports.evaluationAssigned = async (req,res) => {
    const { id_student } =req.params;
    try{
        const result =await dashModel.getEvaluationAssigned(id_student);
        res.status(200).json({
            success: true,
            message: "Number of evaluations assigned in this Month retrieved successfully",
            data: result
        })
    }catch(error){
        console.error("Error retrieving number of evaluations assigned:", error);
        res.status(500).json({
            success: false,
            message: "Error retrieving number of evaluations assigned",
            error: error.message
        });
    }
}
exports.getRadarByClass = async (req, res) => {
    const { id_student } = req.params;
    try{
        const result = await dashModel.getRadarByClass(id_student);
        if (!result) {
            return res.status(404).json({
                success: false,
                message: "No statistics found for this class"
            });
        }
        res.status(200).json({
            success: true,
            message: "Statistics by class retrieved successfully",
            data: result
        });
    }catch(error) {
        console.error("Error retrieving statistics by class:", error);
        res.status(500).json({
            success: false,
            message: "Error retrieving statistics by class",
            error: error.message
        });
    }
}

exports.getProjects = async (req, res) => {
    const { id_student } = req.params;
    try {
        const result = await dashModel.getProjects(id_student);
        // if (!result || result.length === 0) {
        //     return res.status(404).json({
        //         success: false,
        //         message: "No projects found for this student"
        //     });
        // }
        res.status(200).json({
            success: true,
            message: "Projects retrieved successfully",
            data: result
        });
    } catch (error) {
        console.error("Error retrieving projects:", error);
        res.status(500).json({
            success: false,
            message: "Error retrieving projects",
            error: error.message
        });
    }
}

exports.getRadarByProject = async (req, res) => {
    const { project } = req.query;
    const { id_student } = req.params;
    try{
        const result = await dashModel.getRadarByProject(id_student,project);
        if (!result) {
            return res.status(404).json({
                success: false,
                message: "No statistics found for this class"
            });
        }
        res.status(200).json({
            success: true,
            message: "Statistics by project retrieved successfully",
            data: result
        });
    }catch(error) {
        console.error("Error retrieving statistics by project:", error);
        res.status(500).json({
            success: false,
            message: "Error retrieving statistics by project",
            error: error.message
        });
    }
}

exports.getEvaluationCountByRoleAndMonth = async (req, res) => {
    const { id_student } = req.params;
    try {
        const result = await dashModel.getEvaluationCountByRoleAndMonth(id_student);
        res.status(200).json({
            success: true,
            message: "Evaluation count by role and month retrieved successfully",
            data: result
        });
    } catch (error) {
        console.error("Error retrieving evaluation count by role and month:", error);
        res.status(500).json({
            success: false,
            message: "Error retrieving evaluation count by role and month",
            error: error.message
        });
    }
};

/////////
exports.getSkills = async (req, res) => {
    
    try {
        const result = await dashModel.getSkills();
        if (!result || result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No skills found for this student"
            });
        }
        res.status(200).json({
            success: true,
            message: "Skills retrieved successfully",
            data: result
        });
    } catch (error) {
        console.error("Error retrieving skills:", error);
        res.status(500).json({
            success: false,
            message: "Error retrieving skills",
            error: error.message
        });
    }
}

exports.getSkillRatingByMonth = async (req, res) => {
    const { id_student } = req.params;
    const { skill } = req.query; // exemple: ?skill=Skill1
    try {
        const result = await dashModel.getSkillRatingByMonth(id_student, skill);
        res.status(200).json({
            success: true,
            message: "Skill rating by month retrieved successfully",
            data: result
        });
    } catch (error) {
        console.error("Error retrieving skill rating by month:", error);
        res.status(500).json({
            success: false,
            message: "Error retrieving skill rating by month",
            error: error.message
        });
    }
};