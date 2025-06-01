const EvaluationModel = require('../../models/profmodels/evaluation_Model_classes.js');

//////////// 1

exports.get_sector_Controller =  async (req, res) => {
      try {
        const id = req.user.id;
        const result = await EvaluationModel.get_sector_Model(id);
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
        const result = await EvaluationModel.get_classes_Model(id,id_sector);
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

/////////// 3
exports.get_all_student_Controller =  async (req, res) => {
  try {
        const id = req.user.id;
        const {id_class}=req.params;
        const result = await EvaluationModel.get_all_student_Model(id,id_class);
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

////////// 4
exports.search_by_student_cne_Controller =  async (req, res) => {
  try {
        const id = req.user.id;
        const {cne,id_class} = req.params;
        const result = await EvaluationModel.search_by_student_cne_Model(id,cne,id_class);
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
exports.search_by_course_statut_Controller =  async (req, res) => {
  try {
        const id = req.user.id;
        const {statut,id_class} = req.params;
        const result = await EvaluationModel.search_by_course_statut_Model(id,statut,id_class);
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

////////// 6
exports.search_by_project_statut_Controller =  async (req, res) => {
  try {
        const id = req.user.id;
        const {statut} = req.params;
        const result = await EvaluationModel.search_by_project_statut_Model(id,statut);
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

///////// 7
exports.new_evaluation_Controller =  async (req, res) => {
  try {
        const id_prof = req.user.id;
        const {id_student} = req.params;
        const {skill1,rate1_skill1,rate2_skill1,rate3_skill1,
          skill2,rate1_skill2,rate2_skill2,rate3_skill2,
          skill3,rate1_skill3,rate2_skill3,rate3_skill3,
          skill4,rate1_skill4,rate2_skill4,rate3_skill4,
          skill5,rate1_skill5,rate2_skill5,rate3_skill5,
          skill6,rate1_skill6,rate2_skill6,rate3_skill6,
          comment
        } = req.body;
        
        const note1 = parseFloat(((rate1_skill1 + rate2_skill1 + rate3_skill1) / 3).toFixed(2));
        const note2 = parseFloat(((rate1_skill2 + rate2_skill2 + rate3_skill2) / 3).toFixed(2));
        const note3 = parseFloat(((rate1_skill3 + rate2_skill3 + rate3_skill3) / 3).toFixed(2));
        const note4 = parseFloat(((rate1_skill4 + rate2_skill4 + rate3_skill4) / 3).toFixed(2));
        const note5 = parseFloat(((rate1_skill5 + rate2_skill5 + rate3_skill5) / 3).toFixed(2));
        const note6 = parseFloat(((rate1_skill6 + rate2_skill6 + rate3_skill6) / 3).toFixed(2));

      
        const result = await EvaluationModel.new_evaluation_Model(skill1,note1,
          skill2,note2,
          skill3,note3,
          skill4,note4,
          skill5,note5,
          skill6,note6,
          comment,id_prof,id_student);
        if(result){return res.status(200).json({
          skill1,note1,
          skill2,note2,
          skill3,note3,
          skill4,note4,
          skill5,note5,
          skill6,note6
        });}else res.status(400).json({ error: 'This student has already been evaluated by this professor for this month.' });
          

      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error, Please try again later!" });
      }
};

/////// 8
exports.view_report_Controller =  async (req, res) => {
  try {
        const id_prof = req.user.id;
        const {id_student} = req.params;

        const result = await EvaluationModel.view_report_Model(id_prof,id_student);

        if(result){return res.status(200).json({
          result
        });}else res.status(400).json({ error: 'There is no data.' });

      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error, Please try again later!" });
      }
};