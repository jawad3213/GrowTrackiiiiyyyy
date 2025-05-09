const signal_Model = require('../../models/profmodels/signal_classes_Model.js');

///////// 1
exports.get_sector_Controller =  async (req, res) => {
      try {
        const id = req.user.id;
        const result = await signal_Model.get_sector_Model(id);
        if(result.length>0){
          const number= result.length;
          return res.status(200).json({
            number,
            result
          });
        }else return res.status(204).json({ message: "No data" });
  
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error, Please try again later!" });
      }
};

////////// 2
exports.get_classes_Controller =  async (req, res) => {
  try {
    const id = req.user.id;
    const {id_sector}=req.params;
        const result = await signal_Model.get_classes_Model(id,id_sector);
        if(result.length>0){
          const number= result.length;
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

///////// 3
exports.get_student_Controller =  async (req, res) => {
  try {
        const id = req.user.id;
        const {id_class}=req.params;
        const result = await signal_Model.get_all_student_Model(id,id_class);
        if(result.length>0){
          const number= result.length;
          return res.status(200).json({
            number,
            result
          });
        }else return res.status(204).json({ message: "No data" });
  
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error, Please try again later!" });
      }
};

///////// 4
exports.search_cne_student_Controller =  async (req, res) => {
  try {
        const id = req.user.id;
        const {id_class,cne}=req.params;
        const result = await signal_Model.search_cne_student_Model(id,id_class,cne);
        if(result.length>0){
          const number= result.length;
          return res.status(200).json({
            number,
            result
          });
        }else return res.status(204).json({ message: "No data" });
  
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error, Please try again later!" });
      }
};

///////// 5
exports.filter_student_Controller =  async (req, res) => {
  try {
        const id = req.user.id;
        const {id_class,choice}=req.params;
        const result = await signal_Model.filter_student_Model(id,id_class,choice);
        if(result.length>0){
          const number= result.length;
          return res.status(200).json({
            number,
            result
          });
        }else return res.status(204).json({ message: "No data" });
  
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error, Please try again later!" });
      }
};

///////// 6
exports.new_signal_Controller =  async (req, res) => {
  try {
        const id = req.user.id;
        const {id_student}=req.params;
        const {Title,Description,Anonyme}=req.body;
        const result = await signal_Model.new_signal_Model(id,id_student,Title,Description,Anonyme);
        if(result.length>0){
          const number= result.length;
          return res.status(200).json({
            number,
            result
          });
        }else return res.status(204).json({ message: "No data" });
  
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error, Please try again later!" });
      }
};

//////// 7
exports.signal_history_Controller =  async (req, res) => {
  try {
        const id = req.user.id;
        const {id_student}=req.params;
        const result = await signal_Model.signal_history_Model(id,id_student);
        if(result.length>0){
          const number= result.length;
          return res.status(200).json({
            number,
            result
          });
        }else return res.status(204).json({ message: "No data" });
  
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error, Please try again later!" });
      }
};
