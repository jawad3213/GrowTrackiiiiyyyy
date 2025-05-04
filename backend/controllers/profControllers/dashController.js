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
        const totalstudents = dash.totalstudent(id_prof);
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
  