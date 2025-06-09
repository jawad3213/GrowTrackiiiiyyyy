const EvaluationModel = require('../../models/studentModels/evaluation_history_model');


//////////// 1
exports.evaluation_history_all_controller =  async (req, res) => {
      try {
        const id = req.user.id;
        const result = await EvaluationModel.all_evaluation_Model(id);
        if(result.length>0){
          const number = result.length;
          return res.status(200).json({
            number,
            result
          });
        }else return res.status(204).json({ message: "no data" });
  
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error, Please try again later!" });
      }
};

/////////// 2
exports.evaluation_history_search_controller =  async (req, res) => {
      try {
        const id = req.user.id;
        const {name}=req.params;
        const result = await EvaluationModel.all_evaluation_search_Model(id,name);
        if(result.length>0){
          const number = result.length;
          return res.status(200).json({
            number,
            result
          });
        }else return res.status(204).json({ message: "no data" });
  
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error, Please try again later!" });
      }
};

////////// 3
exports.evaluation_history_search_module_controller =  async (req, res) => {
      try {
        const id = req.user.id;
        const {module_name}=req.params;
        const result = await EvaluationModel.all_evaluation_search_module_Model(id,module_name);
        if(result.length>0){
          const number = result.length;
          return res.status(200).json({
            number,
            result
          });
        }else return res.status(204).json({ message: "no data" });
  
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error, Please try again later!" });
      }
};

///////// 4
exports.evaluation_history_search_project_controller =  async (req, res) => {
      try {
        const id = req.user.id;
        const {project_name}=req.params;
        const result = await EvaluationModel.all_evaluation_search_project_Model(id,project_name);
        if(result.length>0){
          const number = result.length;
          return res.status(200).json({
            number,
            result
          });
        }else return res.status(204).json({ message: "no data" });
  
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error, Please try again later!" });
      }
};