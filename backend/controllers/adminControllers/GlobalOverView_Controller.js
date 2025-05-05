const EvaluationModel = require('../../models/adminModels/GlobalOverView_Model.js');
const { body, validationResult } = require('express-validator');

exports.number_of_evaluation_submitted_Controller = [
    async (req, res) => {
      try {
        const { data } = await EvaluationModel.number_of_evaluation_submitted_Model();
  
        return res.status(200).json({
          data
        });
  
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error, Please try again later!" });
      }
    }
];
////////////////
exports.search_by_id_evaluation_Controller = [
  async (req, res) => {
    try {
      const { id_evaluation } = req.params;
      
      const result = await EvaluationModel.search_by_id_evaluation_Model(parseInt(id_evaluation));
      if(result.length>0){
        const number = result.length;
        return res.status(200).json({
          number,
          result
        });
      }else return res.status(404).json({ message: "No data found for this ID." })
      

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server Error, Please try again later!" });
    }
  }
];
////////////////
exports.filter_by_type_Controller = [
  async (req, res) => {
    try {
      const { type } = req.params;
      
      const result = await EvaluationModel.filter_by_type_Model(type);
      if(result.length>0){
        const number = result.length;
        return res.status(200).json({
          number,
          result
        });
      }else return res.status(404).json({ message: "No data found for this type." })

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server Error, Please try again later!" });
    }
  }
];
/////////////////
exports.all_evaluation_Controller = [
  async (req, res) => {
    try {
      
      const result = await EvaluationModel.all_evaluation_Model();
      if(result.length>0){
        const number = result.length;
        return res.status(200).json({
          number,
          result
        });
      }else return res.status(204)

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server Error, Please try again later!" });
    }
  }
];
///////////////
