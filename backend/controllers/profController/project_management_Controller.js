const project_Model = require('../../models/profmodels/project_management_Model.js');


//////////// 1
exports.all_project_Controller =  async (req, res) => {
      try {
        const id = req.user.id;
        const result = await project_Model.all_project_Model(id);
        if(result.length>0){
          const number = result.length;
          return res.status(200).json({
            number,
            result
          });
        }else return res.status(404).json({message: "something went wrong"});
  
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error, Please try again later!" });
      }
};

/////////// 2
exports.delete_project_Controller =  async (req, res) => {
  try {
    const {id_project} = req.params;
    const result = await project_Model.delete_project_Model(parseInt(id_project));
    if (result) {
      return res.status(200).json({
        message: "deleted successfully!",
        deleted: result, 
      });
    } else {
      return res.status(404).json({ message: "No content to delete." });
    }    

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error, Please try again later!" });
  }
};

/////////// 3
// Fixed version of add_project_Controller
exports.add_project_Controller = async (req, res) => {
  try {
    const id = req.user.id;
    const {name, month_start, month_number, description, level, field} = req.body;
    const [month, year] = month_start.split('/');
    const start_date = new Date(`${year}-${month}-01`);
    const end_date = new Date(start_date);
    
    // Add the months, then move to next month and set to day 0 (last day of target month)
    end_date.setMonth(end_date.getMonth() + parseInt(month_number) + 1, 0);

    const result = await project_Model.add_project_Model(id, name, start_date, end_date, description, level, field);
    
    if (result) {
      return res.status(200).json({
        result
      });
    } else {
      return res.status(404).json({ message: " something went wrong " });
    }    

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error, Please try again later!" });
  }
};

////////// 4
exports.add_group_Controller =  async (req, res) => {
  try {
    const id = req.user.id;
    const {name}=req.body;
    const {project_id}=req.params;

    const result = await project_Model.add_group_Model(id,name,parseInt(project_id));

    if (result) {
      return res.status(200).json({
        result
      }); 
    } else {
      return res.status(404).json({ message: "Something went wrong." });
    }    

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error, Please try again later!" });
  }
};

////////// 5
exports.delete_group_Controller =  async (req, res) => {
  try {
    const {id_group}=req.params;

    const result = await project_Model.delete_group_Model(parseInt(id_group));

    if (result) {
      return res.status(200).json({
        result
      }); 
    } else {
      return res.status(404).json({ message: "Something went wrong." });
    }    

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error, Please try again later!" });
  }
};

////////// 6
exports.add_member_Controller =  async (req, res) => {
  try {
    const {cne}=req.body;
    const {id_group}=req.params;

    const result = await project_Model.add_member_Model(cne,parseInt(id_group));

    if (result) {
      return res.status(200).json({
        result
      }); 
    } else {
      return res.status(404).json({ message: "Something went wrong." });
    }    

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error, Please try again later!" });
  }
};

//////////
exports.update_project_Controller = async (req, res) => {
  try {
    const id_project = req.params.id;
    const { start_date, month_number } = req.body;

    if (!start_date && !month_number) {
      return res.status(400).json({ message: "Provide at least one field to update." });
    }

    const result = await project_Model.update_project_Model(id_project, start_date, month_number);
    return res.status(200).json({ message: "Project updated successfully", result });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error, Please try again later!" });
  }
};

/////////
exports.all_group_Controller =  async (req, res) => {
      try {
        const {id_project} = req.params;
        const result = await project_Model.all_group_Model(id_project);
        if(result.length>0){
          const number = result.length;
          return res.status(200).json({
            number,
            result
          });
        }else return res.status(404).json({message: "something went wrong"});
  
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error, Please try again later!" });
      }
};

/////////
exports.delete_team_Controller = async (req, res) => {
  try {
    const id_team = req.params.id;

    const deleted = await project_Model.delete_team_Model(id_team);

    if (deleted === 0) {
      return res.status(404).json({ message: "Team not found." });
    }

    return res.status(200).json({ message: "Team deleted successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error. Please try again later." });
  }
};

/////////
exports.all_member_Controller = async (req, res) => {
  try {
        const id_team = req.params.id_group;
        const result = await project_Model.all_member_Model(id_team);
        if(result.length>0){
          const number = result.length;
          return res.status(200).json({
            number,
            result
          });
        }else return res.status(404).json({message: "something went wrong"});
  
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error, Please try again later!" });
      }
};