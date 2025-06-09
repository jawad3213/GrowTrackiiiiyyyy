const pool = require("../../config/db.js");

const DashModel = require('./AdminDashboardModel.js');

///////////////////
exports.TotalUserModel = async () => {
    const result = await pool.query(`SELECT COUNT(*) 
      FROM public.member WHERE EXTRACT(MONTH FROM date_add) = EXTRACT(MONTH FROM CURRENT_DATE)
      AND EXTRACT(YEAR FROM date_add) = EXTRACT(YEAR FROM CURRENT_DATE)`);
    return parseInt(result.rows[0].count, 10); 
};
//////////////////
exports.differenceUserModel = async () => {
    const total_current_month = await pool.query(`SELECT COUNT(*) FROM public.member WHERE 
      EXTRACT(MONTH FROM date_add) = EXTRACT(MONTH FROM CURRENT_DATE)
      AND EXTRACT(YEAR FROM date_add) = EXTRACT(YEAR FROM CURRENT_DATE)`);
    const total_previous_month = await pool.query(`SELECT COUNT(*) FROM public.member WHERE 
      EXTRACT(MONTH FROM date_add) = EXTRACT(MONTH FROM CURRENT_DATE - INTERVAL '1 month') 
      AND EXTRACT(YEAR FROM date_add) = EXTRACT(YEAR FROM CURRENT_DATE - INTERVAL '1 month')`);

    const current = parseInt(total_current_month.rows[0].count, 10);
    const previous = parseInt(total_previous_month.rows[0].count, 10);

    const difference = Math.abs(current - previous);
    const trend = current > previous ? "increased" : current < previous ? "decreased" : "no change";
    return {
        current,
        previous,
       difference,
       trend
    };

};
/////////////////
exports.TotalEvaluationModel = async () => {
    const result = await pool.query(`SELECT COUNT(*) FROM public.skill_evaluation WHERE 
      EXTRACT(MONTH FROM date_add) = EXTRACT(MONTH FROM CURRENT_DATE)
      AND EXTRACT(YEAR FROM date_add) = EXTRACT(YEAR FROM CURRENT_DATE)`);
    return parseInt(result.rows[0].count, 10); 
};
/////////////////
exports.differenceEvaluationModel = async () => {
    const total_current_month = await pool.query(`SELECT COUNT(*) FROM public.skill_evaluation WHERE 
      EXTRACT(MONTH FROM date_add) = EXTRACT(MONTH FROM CURRENT_DATE)AND 
      EXTRACT(YEAR FROM date_add) = EXTRACT(YEAR FROM CURRENT_DATE)`);
    const total_previous_month = await pool.query(`SELECT COUNT(*) FROM public.skill_evaluation WHERE 
      EXTRACT(MONTH FROM date_add) = EXTRACT(MONTH FROM CURRENT_DATE - INTERVAL '1 month') AND 
      EXTRACT(YEAR FROM date_add) = EXTRACT(YEAR FROM CURRENT_DATE - INTERVAL '1 month')`);

    const current = parseInt(total_current_month.rows[0].count, 10);
    const previous = parseInt(total_previous_month.rows[0].count, 10);

    const difference = Math.abs(current - previous);
    const trend = current > previous ? "increased" : current < previous ? "decreased" : "no change";

    return {
        current,
        previous,
       difference,
       trend
    };

};
////////////////
exports.InvolvementModel_current = async () => {
    const total = await pool.query(
        "SELECT COUNT(*) FROM public.member WHERE role NOT IN ($1, $2)",
        ['coach', 'admin']
      );      

    const total_current_month = await pool.query(`
        SELECT COUNT(DISTINCT id_evaluator) AS count
        FROM public.skill_evaluation
        WHERE EXTRACT(MONTH FROM date_add) = EXTRACT(MONTH FROM CURRENT_DATE)
          AND EXTRACT(YEAR FROM date_add) = EXTRACT(YEAR FROM CURRENT_DATE)
    `);

    const total_users = parseInt(total.rows[0].count, 10);
    const evaluators_this_month = parseInt(total_current_month.rows[0].count, 10);

    const percentage = total_users === 0 ? 0 : (evaluators_this_month / total_users) * 100;
    const float_percentage = parseFloat(percentage.toFixed(2));

    return {
        percentage: float_percentage
    };
};
////////////////
exports.InvolvementModel_previous = async () => {
  const total = await pool.query(
    "SELECT COUNT(*) FROM public.member WHERE role NOT IN ($1, $2)",
    ['coach', 'admin']
  );  

    const total_previous_month = await pool.query(`
        SELECT COUNT(DISTINCT id_evaluator) AS count
        FROM public.skill_evaluation
        WHERE EXTRACT(MONTH FROM date_add) = EXTRACT(MONTH FROM CURRENT_DATE - INTERVAL '1 month')
          AND EXTRACT(YEAR FROM date_add) = EXTRACT(YEAR FROM CURRENT_DATE - INTERVAL '1 month')
    `);

    const total_users = parseInt(total.rows[0].count, 10);
    const evaluators_previous_month = parseInt(total_previous_month.rows[0].count, 10);
    const percentage = total_users === 0 ? 0 : (evaluators_previous_month / total_users) * 100;
    const float_percentage = parseFloat(percentage.toFixed(2));

    return {
        percentage: float_percentage
    };
};

////////////////
//9 10 ... 6
exports.flagged_evaluation_Model = async () => {
    const currentMonth = new Date().getMonth() + 1; 
    const currentYear = new Date().getFullYear();
  
    let months = [];
    let years = [];
  
    if (currentMonth <= 6) {

      for (let m = 9; m <= 12; m++) {
        months.push(m);
        years.push(currentYear - 1);
      }
      
      for (let m = 1; m <= 6; m++) {
        months.push(m);
        years.push(currentYear);
      }
    } else {
      
      for (let m = 9; m <= 12; m++) {
        months.push(m);
        years.push(currentYear);
      }
      
      for (let m = 1; m <= 6; m++) {
        months.push(m);
        years.push(currentYear + 1);
      }
    }
  
    const data = [];
    for (let i = 0; i < months.length; i++) {
      const res = await pool.query(
        `SELECT COUNT(*) FROM public.signal WHERE EXTRACT(MONTH FROM date_add) = $1 AND EXTRACT(YEAR FROM date_add) = $2`,
        [months[i], years[i]]
      );
      data.push(parseInt(res.rows[0].count, 10));
    }
  
    return {
      data
    };
};
////////////////
exports.evaluation_type_in_month = async (mois,annee) => {
    const Pair = await pool.query(
        "SELECT COUNT(*) FROM public.skill_evaluation WHERE  EXTRACT(MONTH FROM date_add)=$1 and EXTRACT(YEAR FROM date_add)=$2 and type_evaluation='Pair'",
        [mois,annee]
    );
    const Self = await pool.query(
        "SELECT COUNT(*) FROM public.skill_evaluation WHERE  EXTRACT(MONTH FROM date_add)=$1 and EXTRACT(YEAR FROM date_add)=$2 and type_evaluation='Self'",
        [mois,annee]
    );
    const Supervisor = await pool.query(
        "SELECT COUNT(*) FROM public.skill_evaluation WHERE  EXTRACT(MONTH FROM date_add)=$1 and EXTRACT(YEAR FROM date_add)=$2 and type_evaluation='Supervisor'",
        [mois,annee]
    );
    const Professor = await pool.query(
        "SELECT COUNT(*) FROM public.skill_evaluation WHERE  EXTRACT(MONTH FROM date_add)=$1 and EXTRACT(YEAR FROM date_add)=$2 and type_evaluation='Professor'",
        [mois,annee]
    );
    
    result = [parseInt(Pair.rows[0].count),parseInt(Self.rows[0].count),parseInt(Supervisor.rows[0].count),parseInt(Professor.rows[0].count)];
    return {
        result
    };
};
////////////////
exports.evaluation_source_overtime_Model = async () => {
  const currentMonth = new Date().getMonth() + 1; 
  const currentYear = new Date().getFullYear();

  let months = [];
  let years = [];

  if (currentMonth <= 6) {

    for (let m = 9; m <= 12; m++) {
      months.push(m);
      years.push(currentYear - 1);
    }
    
    for (let m = 1; m <= 6; m++) {
      months.push(m);
      years.push(currentYear);
    }
  } else {
    
    for (let m = 9; m <= 12; m++) {
      months.push(m);
      years.push(currentYear);
    }
    
    for (let m = 1; m <= 6; m++) {
      months.push(m);
      years.push(currentYear + 1);
    }
  }

  const data = [];
  for (let i = 0; i < months.length; i++) {
    const res = await DashModel.evaluation_type_in_month(months[i], years[i]);
    data.push(res.result);
  }

  return {
    data
  };
};
///////////////////
exports.user_distribution_by_role_Model = async () => {
  const student = await pool.query(
    "SELECT COUNT(*) FROM public.member WHERE role='student'"
  );
  const Supervisor = await pool.query(
    "SELECT COUNT(*) FROM public.member WHERE role='Supervisor'"
  );
  const Professor = await pool.query(
    "SELECT COUNT(*) FROM public.member WHERE role='Professor'"
  );

  const total = await pool.query(
    "SELECT COUNT(*) FROM public.member WHERE role NOT IN ($1, $2)",
    ['coach', 'admin']
  );  


  data = [student.rows[0].count,Supervisor.rows[0].count,Professor.rows[0].count,total.rows[0].count];
    return {
        data
    };
};
///////////////////
exports.news_admin_Model = async () => {
  const news = await pool.query(
    "SELECT * FROM public.news WHERE type='admin' ORDER BY date DESC"
  );   
  return news.rows
};
//////////////
exports.news_professor_Model = async () => {
  const news = await pool.query(
    "SELECT * FROM public.news WHERE type='Professor' ORDER BY date DESC"
  );   
  return news.rows
};