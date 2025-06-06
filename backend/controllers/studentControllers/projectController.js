const projectModel = require('../../models/studentModels/projectModel');

exports.numberOfProdjects = async (req,res) => {
    const { id_student } = req.params;
    try  {
        const result = await projectModel.getNombreProjets(id_student);
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

exports.getAllProjects = async (req, res) => {
    const { id_student } = req.params;
    try {
        const result = await projectModel.getProjects(id_student);
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

exports.getMemberProject = async (req, res) => {
    const { id_student } = req.params;
    const{ project } = req.query;
    try {
        const result = await projectModel.getMemberProject(id_student,project);
        // if (!result || result.length === 0) {
        //     return res.status(404).json({
        //         success: false,
        //         message: "No projects found for this student"
        //     });
        // }
        res.status(200).json({
            success: true,
            message: "member of Projects retrieved successfully",
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

exports.addSignal = async (req, res) => {
    const { id_student } = req.params;
    const {  reported } = req.query;
    const {title,   description ,anony } = req.body;

    try {
        const result = await projectModel.addSignal(id_student, reported , title, description, anony);
        res.status(201).json({
            success: true,
            message: "Signal added successfully",
            data: result
        });
    } catch (error) {
        console.error("Error adding signal:", error);
        res.status(500).json({
            success: false,
            message: "Error adding signal",
            error: error.message
        });
    }
}

exports.getSkillName = async (req, res) => {

    try {
        const result = await projectModel.getSkillName();
        // if (!result || result.length === 0) {
        //     return res.status(404).json({
        //         success: false,
        //         message: "No skills found for this student"
        //     });
        // }
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

exports.setEvalation = async (req, res) => {
    const { id_student } = req.params;
    const { team,evaluated } = req.query;
    const { ratings ,message} = req.body;
    
    try {
        const result = await projectModel.setEvaluation(id_student, team, ratings,evaluated,message);
        return res.status(201).json({
            success: true,
            message: "Project evaluation added successfully",
            data: result
        });
    }catch (error) {
        console.error("Error adding project evaluation:", error);
        return res.status(500).json({
            success: false,
            message: "Error adding project evaluation",
            error: error.message
        });
    }
}