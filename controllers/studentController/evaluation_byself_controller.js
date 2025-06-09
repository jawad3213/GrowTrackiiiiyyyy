const EvaluationModel = require('../../models/studentModels/evaluation_byself_model.js');


exports.new_evaluation_Controller =  async (req, res) => {
  try {
        const id = req.user.id;
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
          comment,id,id);
        if( result ){return res.status(200).json({
          skill1,note1,
          skill2,note2,
          skill3,note3,
          skill4,note4,
          skill5,note5,
          skill6,note6
        });}else res.status(400).json({ error: 'This student has already been evaluated by him self for this month.' });
          

      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error, Please try again later!" });
      }
};