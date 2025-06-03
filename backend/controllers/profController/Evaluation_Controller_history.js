const EvaluationModel = require('../../models/profmodels/evaluation_Model_history.js');


//////////// 1
exports.all_evaluation_Controller =  async (req, res) => {
      try {
        const id = req.user.id;
        const result = await EvaluationModel.all_evaluation_Model(id);
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
};
//////////// 2
exports.search_by_id_evaluation_Controller = async (req, res) => {
    try {
      const { id_evaluation } = req.params;
      const id = req.user.id;
      const result = await EvaluationModel.search_by_id_evaluation_Model(parseInt(id_evaluation),id);
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
};
//////////// 3
exports.filter_by_level_Controller= async (req, res) => {
    try {
      const { level } = req.params;
      const id = req.user.id;
      const result = await EvaluationModel.filter_by_level_Model(level,id);
      if(result.length>0){
        const number = result.length;
        return res.status(200).json({
          number,
          result
        });
      }else return res.status(404).json({ message: "No data found for this level." })

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server Error, Please try again later!" });
    }
};
////////// 4
exports.filter_by_class_Controller= async (req, res) => {
  try {
    const { classe } = req.params;
    const id = req.user.id;
    const result = await EvaluationModel.filter_by_class_Model(classe,id);
    if(result.length>0){
      const number = result.length;
      return res.status(200).json({
        number,
        result
      });
    }else return res.status(404).json({ message: "No data found for this class." })

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error, Please try again later!" });
  }
};
////////// 5
exports.filter_by_type_Controller= async (req, res) => {
  try {
    const { type } = req.params;
    const id = req.user.id;
    const result = await EvaluationModel.filter_by_type_Model(type,id);
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
};
///////// 6
exports.view_evaluation_Controller= async (req, res) => {
  try {
    const { id_evaluation } = req.params;
    const {comment,result} = await EvaluationModel.view_evaluation_Model(id_evaluation);
    if(result){
      return res.status(200).json({
        comment,
        result
      });
    }else return res.status(404).json({ message: "No data found for this id." })

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error, Please try again later!" });
  }
};