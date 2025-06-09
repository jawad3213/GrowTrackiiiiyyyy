const report_Model = require('../../models/profmodels/student_report_Model.js');

//////// 1
exports.Profile_Section_Controller =  async (req, res) => {
      try {
        const id = req.params.id;
        const result = await report_Model.Profile_Section_Model(id);
        if(result){
          return res.status(200).json({
            result
          });
        }else return res.status(404).json({message: "something went wrong"});vd
  
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error, Please try again later!" });
      }
};



//////// 2
exports.Evaluatuion_Section_Controller =  async (req, res) => {
      try {
        const id = req.params.id;
        const result = await report_Model.Evaluation_Section_Model(id);
        if(result){
          return res.status(200).json({
            result
          });
        }else return res.status(404).json({message: "something went wrong"});
  
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error, Please try again later!" });
      }
};

/////// 3
exports.Signal_History_Controller =  async (req, res) => {
      try {
        const id = req.params.id;
        const result = await report_Model.Signal_History_Model(id);
        if(result){
          return res.status(200).json({
            result
          });
        }else return res.status(404).json({message: "something went wrong"});

      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error, Please try again later!" });
      }
};

//////// 4
exports.Comment_Section_Controller =  async (req, res) => {
      try {
        const id = req.params.id;
        const result = await report_Model.Comment_Section_Model(id);
        if(result){
          return res.status(200).json({
            result
          });
        }else return res.status(404).json({message: "something went wrong"});

      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error, Please try again later!" });
      }
};