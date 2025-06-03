const EvaluationModel = require('../../models/studentModels/signal_history_model');


//////////// 1
exports.signal_history_all_controller =  async (req, res) => {
      try {
        const id = req.user.id;
        
        const result = await EvaluationModel.all_signal_Model(id);
        if(result){
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

///////// 2
exports.signal_history_search_id_all_controller =  async (req, res) => {
      try {
        const id = req.user.id;
        const {id_signal}=req.params;
        const result = await EvaluationModel.signal_history_search_id_all_Model(id,parseInt(id_signal));
        if(result){
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

///////// 3
exports.signal_history_search_module_all_controller =  async (req, res) => {
      try {
        const id = req.user.id;
        const {module}=req.params;
        const result = await EvaluationModel.signal_history_search_module_all_Model(id,module);
        if(result){
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

//////// 4
exports.signal_history_filtre_statesignal_all_controller =  async (req, res) => {
      try {
        const id = req.user.id;
        const {state}=req.params;
        const result = await EvaluationModel.signal_history_filtre_statesignal_all_Model(id,state);
        if(result){
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

/////// 5
exports.signal_history_filtre_solutionsignal_all_controller =  async (req, res) => {
      try {
        const id = req.user.id;
        const {state}=req.params;
        const result = await EvaluationModel.signal_history_filtre_solutionsignal_all_Model(id,state);
        if(result){
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

