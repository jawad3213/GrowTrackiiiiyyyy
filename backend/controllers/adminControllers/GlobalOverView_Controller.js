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
// in controllers/EvaluationController.js
exports.search_by_id_evaluation_Controller = async (req, res) => {
  try {
    const { id_evaluation } = req.params;
    const rows = await EvaluationModel.search_by_id_evaluation_Model(
      parseInt(id_evaluation, 10)
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No data found for this ID." });
    }

    // Since id_evaluation is unique, we expect exactly one row
    const evaluation = rows[0];

    return res.status(200).json({
      number: rows.length,
      evaluation: {
        id_evaluation:          evaluation.id_evaluation,
        evaluator_role:         evaluation.evaluator_role,
        evaluator_full_name:    evaluation.evaluator_full_name,
        evaluator_profile_picture: evaluation.evaluator_profile_picture,
        student_role:           evaluation.student_role,
        student_full_name:      evaluation.student_full_name,
        student_profile_picture: evaluation.student_profile_picture,
        date_add:               evaluation.date_add,
        type_evaluation:        evaluation.type_evaluation,
        skills:                 evaluation.skills,  // ← here’s your array of `{ skill_name, note_skill }`
      }
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server Error, Please try again later!" });
  }
};
;
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
