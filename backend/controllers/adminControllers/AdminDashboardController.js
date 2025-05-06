const DashModel = require('../../models/adminModels/AdminDashboardModel');

////////////////////
exports.Total_User = [
    async (req, res) => {
      try {
        const Total_User = await DashModel.TotalUserModel();
        return res.status(200).json(Total_User);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error, Please try again later!" });
      }
    }
];
////////////////////
exports.differenceUserController = [
    async (req, res) => {
      try {
        const result = await DashModel.differenceUserModel();
        let percentage;

        if (result.previous === 0) {
            if (result.current === 0) {
                percentage = 0; 
            } else {
                percentage = 100; 
            }
        } else {
            percentage = (result.difference / result.previous) * 100;
        }
        const percentage_final=parseFloat(percentage.toFixed(2));
        return res.status(200).json({ percentage: Math.round(percentage_final) , trend: result.trend });

      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error, Please try again later!" });
      }
    }  
];
////////////////////
exports.Total_Evaluation = [
  async (req, res) => {
    try {
      const Total_Evaluation = await DashModel.TotalEvaluationModel();
      return res.status(200).json(Total_Evaluation);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server Error, Please try again later!" });
    }
  }
];
////////////////////
exports.differenceEvaluationController = [
  async (req, res) => {
    try {
      const result = await DashModel.differenceEvaluationModel();
      let percentage;

      if (result.previous === 0) {
          if (result.current === 0) {
              percentage = 0; 
          } else {
              percentage = 100; 
          }
      } else {
          percentage = (result.difference / result.previous) * 100;
      }

      const percentage_final=parseFloat(percentage.toFixed(2));

      return res.status(200).json({ percentage: Math.round(percentage_final) , trend: result.trend });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server Error, Please try again later!" });
    }
  }  
];
////////////////////
exports.InvolvementController = [
  async (req, res) => {
    try {
     const percentage = await DashModel.InvolvementModel_current();

      return res.status(200).json(percentage);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server Error, Please try again later!" });
    }
  }
];
////////////////////
exports.Involvement_target_Controller = [
  async (req, res) => {
    try {
      const percentage_previous = await DashModel.InvolvementModel_previous();
      const percentage_current = await DashModel.InvolvementModel_current();

      const trend = percentage_current.percentage > percentage_previous.percentage
        ? "increased"
        : percentage_current.percentage < percentage_previous.percentage
        ? "decreased"
        : "no change";

      const difference = Math.abs(percentage_previous.percentage - percentage_current.percentage);
      
      const percentageTest = percentage_previous.percentage === 0 ? 0 : (difference / percentage_previous.percentage) * 100;
      
      const percentage=parseFloat(percentageTest.toFixed(2));
      return res.status(200).json({
        trend,
        percentage
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server Error, Please try again later!" });
    }
  }
];
////////////////////
exports.flagged_evaluation_Controller = [
  async (req, res) => {
    try {
      const { data } = await DashModel.flagged_evaluation_Model();

      return res.status(200).json({
        data
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server Error, Please try again later!" });
    }
  }
];
////////////////////
exports.evaluation_source_overtime_Controller = [
  async (req, res) => {
    try {
      const { data } = await DashModel.evaluation_source_overtime_Model();

      return res.status(200).json({
        data
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server Error, Please try again later!" });
    }
  }
];
////////////////////
exports.user_distribution_by_role_Controller = [
  async (req, res) => {
    try {
      const { data } = await DashModel.user_distribution_by_role_Model();
 
      const percentage_student = parseFloat(((data[0] / data[3])*100).toFixed(2));
      const percentage_supervisor = parseFloat(((data[1] / data[3])*100).toFixed(2));
      const percentage_professor = parseFloat(((data[2] / data[3])*100).toFixed(2));

      return res.status(200).json({
          "student": percentage_student,
          "Supervisor": percentage_supervisor,
          "Professor": percentage_professor
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server Error, Please try again later!" });
    }
  }
];
///////////////////
exports.total_evaluation_Controller = [
  async (req, res) => {
    try {
      const { data } = await total_evaluation_Model();

      return res.status(200).json({
        data
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server Error, Please try again later!" });
    }
  }
];
///////////////////
