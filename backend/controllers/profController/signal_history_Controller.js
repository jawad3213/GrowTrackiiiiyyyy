const project_Model = require('../../models/profmodels/signal_history_Model.js');


//////////// 1
exports.all_signal_Controller =  async (req, res) => {
      try {
        const id = req.user.id;
        const result = await project_Model.all_signal_Model(id);
        if(result.length>0){
          const number = result.length;
          return res.status(200).json({
            number,
            result
          });
        }else return res.status(204).json({message: "no data to sent"});
  
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error, Please try again later!" });
      }
};

/////////// 2
exports.search_signal_id_Controller =  async (req, res) => {
    try {
      const id = req.user.id;
      const {id_signal} = req.params;

      const result = await project_Model.search_signal_id_Model(id,parseInt(id_signal));
      if(result){
        const number = result.length;
        return res.status(200).json({
          number,
          result
        });
      }else return res.status(404).json({message: "there is no signal with this id for this professor!"});

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server Error, Please try again later!" });
    }
};

/////////// 3
exports.filtre_signal_state_Controller =  async (req, res) => {
  try {
    const id = req.user.id;
    const {statut} = req.params;

    const result = await project_Model.filtre_signal_state_Model(id,statut);
    if(result){
      const number = result.length;
      return res.status(200).json({
        number,
        result
      });
    }else return res.status(404).json({message: "there is no signal with this id for this professor!"});

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error, Please try again later!" });
  }
};

/////////// 4
exports.filtre_solution_state_Controller =  async (req, res) => {
  try {
    const id = req.user.id;
    const {statut} = req.params;

    const result = await project_Model.filtre_solution_state_Model(id,statut);
    if(result){
      const number = result.length;
      return res.status(200).json({
        number,
        result
      });
    }else return res.status(404).json({message: "there is no signal with this id for this professor!"});

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error, Please try again later!"});
  }
};

/////////// 5
exports.view_solution_Controller =  async (req, res) => {
  try {
    const {id_signal} = req.params;

    const result = await project_Model.view_solution_Model(parseInt(id_signal));
    if(result){
      const number = result.length;
      return res.status(200).json({
        number,
        result
      });
    }else return res.status(404).json({message: "there is no signal with this id for this professor!"});

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error, Please try again later!"});
  }
};