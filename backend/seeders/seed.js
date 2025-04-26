require('dotenv').config(); // Charge les variables du fichier .env pou acceder au donnee de la base de donneed
const { Client } = require('pg'); // PostgreSQL client pour se connecter à la base de données
const bcrypt = require('bcrypt'); // Pour hasher les mots de passe 

// Crée une instance de client PostgreSQL avec les paramatres de connexion
const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

async function seedDatabase() { // cest la fonction qui va se charger de remplir la base de donnee
  try {
    // Connexion à la base de données
    await client.connect();
    console.log('Connected to database');

    // ====== MEMBERS ======
    const members = [  // definition de donnees
      // Admins
      {
        id_member: 'admin_01',
        cin: 'A111111',
        phone: '+212600000001',
        password: await bcrypt.hash('password123', 10),
        role: 'admin',
        full_name: 'Admin One',
        email: 'admin1@edu.ma',
        profile_picture: 'admin1.jpg',
        description: 'System administrator responsible for user management',
      },
      {
        id_member: 'admin_02',
        cin: 'A222222',
        phone: '+212600000002',
        password: await bcrypt.hash('password123', 10),
        role: 'admin',
        full_name: 'Admin Two',
        email: 'admin2@edu.ma',
        profile_picture: 'admin2.jpg',
        description: 'System administrator responsible for curriculum management',
      },
      
      // Professors
      {
        id_member: 'prof_01',
        cin: 'P111111',
        phone: '+212600000101',
        password: await bcrypt.hash('password123', 10),
        role: 'Professor',
        full_name: 'Professor Ahmed',
        email: 'ahmed@edu.ma',
        profile_picture: 'ahmed.jpg',
        description: 'Computer Science Professor with 10 years of experience',
      },
      {
        id_member: 'prof_02',
        cin: 'P222222',
        phone: '+212600000102',
        password: await bcrypt.hash('password123', 10),
        role: 'Professor',
        full_name: 'Professor Fatima',
        email: 'fatima@edu.ma',
        profile_picture: 'fatima.jpg',
        description: 'Mathematics Professor specializing in data analysis',
      },
      {
        id_member: 'prof_03',
        cin: 'P333333',
        phone: '+212600000103',
        password: await bcrypt.hash('password123', 10),
        role: 'Professor',
        full_name: 'Professor Karim',
        email: 'karim@edu.ma',
        profile_picture: 'karim.jpg',
        description: 'Networks and Security Professor',
      },
      
      // Students
      {
        id_member: 'student_01',
        cin: 'S111111',
        phone: '+212600001001',
        password: await bcrypt.hash('password123', 10),
        role: 'student',
        full_name: 'Student Yasmine',
        email: 'yasmine@student.edu.ma',
        profile_picture: 'yasmine.jpg',
        description: 'Computer Engineering student with interest in AI',
      },
      {
        id_member: 'student_02',
        cin: 'S222222',
        phone: '+212600001002',
        password: await bcrypt.hash('password123', 10),
        role: 'student',
        full_name: 'Student Omar',
        email: 'omar@student.edu.ma',
        profile_picture: 'omar.jpg',
        description: 'Data Science student',
      },
      {
        id_member: 'student_03',
        cin: 'S333333',
        phone: '+212600001003',
        password: await bcrypt.hash('password123', 10),
        role: 'student',
        full_name: 'Student Leila',
        email: 'leila@student.edu.ma',
        profile_picture: 'leila.jpg',
        description: 'Software Engineering student',
      },
      {
        id_member: 'student_04',
        cin: 'S444444',
        phone: '+212600001004',
        password: await bcrypt.hash('password123', 10),
        role: 'student',
        full_name: 'Student Amine',
        email: 'amine@student.edu.ma',
        profile_picture: 'amine.jpg',
        description: 'Networks student',
      },
      {
        id_member: 'student_05',
        cin: 'S555555',
        phone: '+212600001005',
        password: await bcrypt.hash('password123', 10),
        role: 'student',
        full_name: 'Student Sara',
        email: 'sara@student.edu.ma',
        profile_picture: 'sara.jpg',
        description: 'Cybersecurity student',
      },
      {
        id_member: 'student_06',
        cin: 'S666666',
        phone: '+212600001006',
        password: await bcrypt.hash('password123', 10),
        role: 'student',
        full_name: 'Student Youssef',
        email: 'youssef@student.edu.ma',
        profile_picture: 'youssef.jpg',
        description: 'Web Development student',
      },
      
      // Supervisors
      {
        id_member: 'super_01',
        cin: 'SU111111',
        phone: '+212600010001',
        password: await bcrypt.hash('password123', 10),
        role: 'Supervisor',
        full_name: 'Supervisor Mehdi',
        email: 'mehdi@company.ma',
        profile_picture: 'mehdi.jpg',
        description: 'Senior Software Engineer at TechCorp',
      },
      {
        id_member: 'super_02',
        cin: 'SU222222',
        phone: '+212600010002',
        password: await bcrypt.hash('password123', 10),
        role: 'Supervisor',
        full_name: 'Supervisor Amal',
        email: 'amal@company.ma',
        profile_picture: 'amal.jpg',
        description: 'Project Manager at DataTech',
      },
      {
        id_member: 'super_03',
        cin: 'SU333333',
        phone: '+212600010003',
        password: await bcrypt.hash('password123', 10),
        role: 'Supervisor',
        full_name: 'Supervisor Hassan',
        email: 'hassan@company.ma',
        profile_picture: 'hassan.jpg',
        description: 'Network Administrator at SecureNet',
      },
      
      // Coaches
      {
        id_member: 'coach_01',
        cin: 'C111111',
        phone: '+212600100001',
        password: await bcrypt.hash('password123', 10),
        role: 'coach',
        full_name: 'Coach Nadia',
        email: 'nadia@edu.ma',
        profile_picture: 'nadia.jpg',
        description: 'Career coach specializing in tech industry',
      },
      {
        id_member: 'coach_02',
        cin: 'C222222',
        phone: '+212600100002',
        password: await bcrypt.hash('password123', 10),
        role: 'coach',
        full_name: 'Coach Hamid',
        email: 'hamid@edu.ma',
        profile_picture: 'hamid.jpg',
        description: 'Academic coach for programming skills',
      }
    ];

    // Insérer les membres dans la table `member`
    for (const member of members) {
      await client.query(
        'INSERT INTO member (id_member, cin, phone, password, role, full_name, email, profile_picture, description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
        [
          member.id_member,
          member.cin,
          member.phone,
          member.password,
          member.role,
          member.full_name,
          member.email,
          member.profile_picture,
          member.description,
        ]
      );
    }
    console.log('✅ Members seeded successfully!');

    // ====== ADMIN ======
    const admins = [
      { id_member: 'admin_01', assigned_zone: 'User Management' },
      { id_member: 'admin_02', assigned_zone: 'Curriculum' }
    ];
    
    for (const admin of admins) {
      await client.query(
        'INSERT INTO admin (id_member, assigned_zone) VALUES ($1, $2)',
        [admin.id_member, admin.assigned_zone]
      );
    }
    console.log('✅ Admins seeded successfully!');

    // ====== SECTORS ======
    const sectors = [
      { id_sector: 'sector_01', sector_name: 'Computer Science', id_admin: 'admin_01' },
      { id_sector: 'sector_02', sector_name: 'Data Science', id_admin: 'admin_02' },
      { id_sector: 'sector_03', sector_name: 'Networks & Security', id_admin: 'admin_01' }
    ];
    
    for (const sector of sectors) {
      await client.query(
        'INSERT INTO sector (id_sector, sector_name, id_admin) VALUES ($1, $2, $3)',
        [sector.id_sector, sector.sector_name, sector.id_admin]
      );
    }
    console.log('✅ Sectors seeded successfully!');

    // ====== CLASSES ======
    const classes = [
      { id_class: 'class_cs_2024', start_date: '2024-09-01', sector_id: 'sector_01' },
      { id_class: 'class_ds_2024', start_date: '2024-09-01', sector_id: 'sector_02' },
      { id_class: 'class_ns_2024', start_date: '2024-09-01', sector_id: 'sector_03' }
    ];
    
    for (const cls of classes) {
      await client.query(
        'INSERT INTO class (id_class, start_date, sector_id) VALUES ($1, $2, $3)',
        [cls.id_class, cls.start_date, cls.sector_id]
      );
    }
    console.log('✅ Classes seeded successfully!');

    // ====== STUDENTS ======
    const students = [
      { id_member: 'student_01', cne: 'CNE111111', id_class: 'class_cs_2024' },
      { id_member: 'student_02', cne: 'CNE222222', id_class: 'class_ds_2024' },
      { id_member: 'student_03', cne: 'CNE333333', id_class: 'class_cs_2024' },
      { id_member: 'student_04', cne: 'CNE444444', id_class: 'class_ns_2024' },
      { id_member: 'student_05', cne: 'CNE555555', id_class: 'class_ns_2024' },
      { id_member: 'student_06', cne: 'CNE666666', id_class: 'class_ds_2024' }
    ];
    
    for (const student of students) {
      await client.query(
        'INSERT INTO student (id_member, cne, id_class) VALUES ($1, $2, $3)',
        [student.id_member, student.cne, student.id_class]
      );
    }
    console.log('✅ Students seeded successfully!');

    // ====== PROFESSORS ======
    const professors = [
      { id_member: 'prof_01', department: 'Computer Science', code: 'PROF-CS-01' },
      { id_member: 'prof_02', department: 'Mathematics', code: 'PROF-MATH-01' },
      { id_member: 'prof_03', department: 'Networks', code: 'PROF-NET-01' }
    ];
    
    for (const professor of professors) {
      await client.query(
        'INSERT INTO professor (id_member, department, code) VALUES ($1, $2, $3)',
        [professor.id_member, professor.department, professor.code]
      );
    }
    console.log('✅ Professors seeded successfully!');

    // ====== SUPERVISORS ======
    const supervisors = [
      { id_member: 'super_01', registration_number: 'SUP-001', company: 'TechCorp', position: 'Senior Software Engineer' },
      { id_member: 'super_02', registration_number: 'SUP-002', company: 'DataTech', position: 'Project Manager' },
      { id_member: 'super_03', registration_number: 'SUP-003', company: 'SecureNet', position: 'Network Administrator' }
    ];
    
    for (const supervisor of supervisors) {
      await client.query(
        'INSERT INTO supervisor (id_member, registration_number, company, position) VALUES ($1, $2, $3, $4)',
        [supervisor.id_member, supervisor.registration_number, supervisor.company, supervisor.position]
      );
    }
    console.log('✅ Supervisors seeded successfully!');

    // ====== COACHES ======
    const coaches = [
      { id_member: 'coach_01', field: 'Career Development' },
      { id_member: 'coach_02', field: 'Academic Support' }
    ];
    
    for (const coach of coaches) {
      await client.query(
        'INSERT INTO coach (id_member, field) VALUES ($1, $2)',
        [coach.id_member, coach.field]
      );
    }
    console.log('✅ Coaches seeded successfully!');

    // ====== TEACH ======
    const teachings = [
      { id_member: 'prof_01', id_class: 'class_cs_2024', course: 'Programming Paradigms' },
      { id_member: 'prof_01', id_class: 'class_ds_2024', course: 'Algorithms' },
      { id_member: 'prof_02', id_class: 'class_ds_2024', course: 'Statistics' },
      { id_member: 'prof_02', id_class: 'class_cs_2024', course: 'Data Structures' },
      { id_member: 'prof_03', id_class: 'class_ns_2024', course: 'Network Security' }
    ];
    
    for (const teaching of teachings) {
      await client.query(
        'INSERT INTO teach (id_member, id_class, course) VALUES ($1, $2, $3)',
        [teaching.id_member, teaching.id_class, teaching.course]
      );
    }
    console.log('✅ Teaching assignments seeded successfully!');

    // ====== PROJECTS ======
    const projects = [
      { id_project: 'project_01', description_project: 'Develop a web application with modern technologies', date_project: '2024-10-15', subject_project: 'E-Learning Platform', id_prof: 'prof_01' },
      { id_project: 'project_02', description_project: 'Data analysis project using machine learning', date_project: '2024-11-01', subject_project: 'Predictive Analysis System', id_prof: 'prof_02' },
      { id_project: 'project_03', description_project: 'Network security implementation project', date_project: '2024-10-20', subject_project: 'Secure Network Architecture', id_prof: 'prof_03' }
    ];
    
    for (const project of projects) {
      await client.query(
        'INSERT INTO project (id_project, description_project, date_project, subject_project, id_prof) VALUES ($1, $2, $3, $4, $5)',
        [project.id_project, project.description_project, project.date_project, project.subject_project, project.id_prof]
      );
    }
    console.log('✅ Projects seeded successfully!');

    // ====== TEAMS ======
    const teams = [
      { id_team: 'team_01', note: 17.5, id_prof: 'prof_01', id_project: 'project_01' },
      { id_team: 'team_02', note: 16.0, id_prof: 'prof_02', id_project: 'project_02' },
      { id_team: 'team_03', note: 18.0, id_prof: 'prof_03', id_project: 'project_03' }
    ];
    
    for (const team of teams) {
      await client.query(
        'INSERT INTO team (id_team, note, id_prof, id_project) VALUES ($1, $2, $3, $4)',
        [team.id_team, team.note, team.id_prof, team.id_project]
      );
    }
    console.log('✅ Teams seeded successfully!');

    // ====== TEAM STUDENTS ======
    const teamStudents = [
      { id_team: 'team_01', student_id: 'student_01' },
      { id_team: 'team_01', student_id: 'student_03' },
      { id_team: 'team_02', student_id: 'student_02' },
      { id_team: 'team_02', student_id: 'student_06' },
      { id_team: 'team_03', student_id: 'student_04' },
      { id_team: 'team_03', student_id: 'student_05' }
    ];
    
    for (const teamStudent of teamStudents) {
      await client.query(
        'INSERT INTO team_student (id_team, student_id) VALUES ($1, $2)',
        [teamStudent.id_team, teamStudent.student_id]
      );
    }
    console.log('✅ Team students seeded successfully!');

    // ====== INTERNSHIPS ======
    const internships = [
      { id_internship: 'internship_01', date_start: '2024-07-01', date_done: '2024-08-31', subject_internship: 'Web Development Internship' },
      { id_internship: 'internship_02', date_start: '2024-07-01', date_done: '2024-08-31', subject_internship: 'Data Analysis Internship' },
      { id_internship: 'internship_03', date_start: '2024-07-01', date_done: '2024-08-31', subject_internship: 'Network Security Internship' }
    ];
    
    for (const internship of internships) {
      await client.query(
        'INSERT INTO internship (id_internship, date_start, date_done, subject_internship) VALUES ($1, $2, $3, $4)',
        [internship.id_internship, internship.date_start, internship.date_done, internship.subject_internship]
      );
    }
    console.log('✅ Internships seeded successfully!');

    // ====== SUPERVISE ======
    const supervisions = [
      { id_supervisor: 'super_01', id_student: 'student_01', id_internship: 'internship_01' },
      { id_supervisor: 'super_01', id_student: 'student_03', id_internship: 'internship_01' },
      { id_supervisor: 'super_02', id_student: 'student_02', id_internship: 'internship_02' },
      { id_supervisor: 'super_02', id_student: 'student_06', id_internship: 'internship_02' },
      { id_supervisor: 'super_03', id_student: 'student_04', id_internship: 'internship_03' },
      { id_supervisor: 'super_03', id_student: 'student_05', id_internship: 'internship_03' }
    ];
    
    for (const supervision of supervisions) {
      await client.query(
        'INSERT INTO supervise (id_supervisor, id_student, id_internship) VALUES ($1, $2, $3)',
        [supervision.id_supervisor, supervision.id_student, supervision.id_internship]
      );
    }
    console.log('✅ Supervisions seeded successfully!');

    // ====== SOLUTIONS ======
    const solutions = [
      { id_solution: 'solution_01', option_solution: 'Academic Support', subject_solution: 'Attendance Issues', periode: '2024-Q3', state: 'Approved' },
      { id_solution: 'solution_02', option_solution: 'Behavior Correction', subject_solution: 'Classroom Disruption', periode: '2024-Q3', state: 'New' },
      { id_solution: 'solution_03', option_solution: 'Additional Tutoring', subject_solution: 'Performance Issues', periode: '2024-Q3', state: 'Approved' },
      { id_solution: 'solution_04', option_solution: 'Counseling', subject_solution: 'Personal Issues', periode: '2024-Q3', state: 'Rejected' }
    ];
    
    for (const solution of solutions) {
      await client.query(
        'INSERT INTO solution (id_solution, option_solution, subject_solution, periode, state) VALUES ($1, $2, $3, $4, $5)',
        [solution.id_solution, solution.option_solution, solution.subject_solution, solution.periode, solution.state]
      );
    }
    console.log('✅ Solutions seeded successfully!');

    // ====== SIGNALS ======
    const signals = [
      { id_signal: 'signal_01', approved: true, message: 'Student has missed multiple classes', anony: false, option_signal: 'Attendance', id_solution: 'solution_01', id_member: 'prof_01' },
      { id_signal: 'signal_02', approved: true, message: 'Disruptive behavior during lectures', anony: true, option_signal: 'Behavior', id_solution: 'solution_02', id_member: 'prof_02' },
      { id_signal: 'signal_03', approved: false, message: 'Poor performance in assignments', anony: false, option_signal: 'Performance', id_solution: 'solution_03', id_member: 'prof_01' },
      { id_signal: 'signal_04', approved: true, message: 'Student seems to be dealing with personal issues', anony: true, option_signal: 'Personal', id_solution: 'solution_04', id_member: 'prof_03' }
    ];
    
    for (const signal of signals) {
      await client.query(
        'INSERT INTO signal (id_signal, approved, message, anony, option_signal, id_solution, id_member) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [signal.id_signal, signal.approved, signal.message, signal.anony, signal.option_signal, signal.id_solution, signal.id_member]
      );
    }
    console.log('✅ Signals seeded successfully!');

    // ====== REPORTS ======
    const reports = [
      { id_reporter: 'prof_01', id_reported: 'student_01', id_signal: 'signal_01' },
      { id_reporter: 'prof_02', id_reported: 'student_02', id_signal: 'signal_02' },
      { id_reporter: 'prof_01', id_reported: 'student_03', id_signal: 'signal_03' },
      { id_reporter: 'prof_03', id_reported: 'student_04', id_signal: 'signal_04' }
    ];
    
    for (const report of reports) {
      await client.query(
        'INSERT INTO report (id_reporter, id_reported, id_signal) VALUES ($1, $2, $3)',
        [report.id_reporter, report.id_reported, report.id_signal]
      );
    }
    console.log('✅ Reports seeded successfully!');

    // ====== FOLLOW-UPS ======
    const followUps = [
      { id_coach: 'coach_02', id_student: 'student_01', id_solution: 'solution_01', message: 'Weekly check-ins scheduled to monitor attendance' },
      { id_coach: 'coach_01', id_student: 'student_02', id_solution: 'solution_02', message: 'Behavior improvement plan implemented' },
      { id_coach: 'coach_02', id_student: 'student_03', id_solution: 'solution_03', message: 'Additional tutoring sessions arranged' }
    ];
    
    for (const followUp of followUps) {
      await client.query(
        'INSERT INTO follow_up (id_coach, id_student, id_solution, message) VALUES ($1, $2, $3, $4)',
        [followUp.id_coach, followUp.id_student, followUp.id_solution, followUp.message]
      );
    }
    console.log('✅ Follow-ups seeded successfully!');

    // ====== SKILLS ======
    const skills = [
      { skill_name: 'Problem Solving', desciption_skill: 'Ability to identify problems and develop solutions', question1: 'Can identify core issues?', question2: 'Develops innovative solutions?', question3: 'Evaluates effectiveness of solutions?', id_admin: 'admin_01' },
      { skill_name: 'Communication', desciption_skill: 'Ability to effectively communicate ideas', question1: 'Articulates ideas clearly?', question2: 'Listens effectively?', question3: 'Adapts communication style as needed?', id_admin: 'admin_01' },
      { skill_name: 'Technical Proficiency', desciption_skill: 'Mastery of technical concepts and tools', question1: 'Understands technical concepts?', question2: 'Applies tools appropriately?', question3: 'Keeps up with technological changes?', id_admin: 'admin_02' },
      { skill_name: 'Teamwork', desciption_skill: 'Ability to work collaboratively in a team', question1: 'Contributes meaningfully to team?', question2: 'Respects others viewpoints?', question3: 'Helps resolve team conflicts?', id_admin: 'admin_02' },
      { skill_name: 'Time Management', desciption_skill: 'Ability to manage time and meet deadlines', question1: 'Prioritizes tasks effectively?', question2: 'Meets deadlines consistently?', question3: 'Handles multiple tasks efficiently?', id_admin: 'admin_01' }
    ];
    
    for (const skill of skills) {
      await client.query(
        'INSERT INTO skill (skill_name, desciption_skill, question1, question2, question3, id_admin) VALUES ($1, $2, $3, $4, $5, $6)',
        [skill.skill_name, skill.desciption_skill, skill.question1, skill.question2, skill.question3, skill.id_admin]
      );
    }
    console.log('✅ Skills seeded successfully!');

    // ====== SKILL EVALUATIONS ======
    
const skillEvaluations = [
  // Professor evaluations
  { id_evaluation: 'eval_01', note_evaluation: 16.5, type_evaluation: 'Professor', comment_evaluation: 'Shows strong problem-solving abilities', id_internship: null, id_class: 'class_cs_2024', id_team: null, id_student: 'student_01', id_evaluator: 'prof_01', skill_name: 'Problem Solving' },
  { id_evaluation: 'eval_02', note_evaluation: 15.0, type_evaluation: 'Professor', comment_evaluation: 'Good communication skills but can improve', id_internship: null, id_class: 'class_cs_2024', id_team: null, id_student: 'student_01', id_evaluator: 'prof_01', skill_name: 'Communication' },
  { id_evaluation: 'eval_03', note_evaluation: 17.0, type_evaluation: 'Professor', comment_evaluation: 'Advanced technical skills', id_internship: null, id_class: 'class_cs_2024', id_team: null, id_student: 'student_03', id_evaluator: 'prof_01', skill_name: 'Technical Proficiency' },
  
  // Supervisor evaluations
  { id_evaluation: 'eval_04', note_evaluation: 18.0, type_evaluation: 'Supervisor', comment_evaluation: 'Excellent problem-solving in real-world scenarios', id_internship: 'internship_01', id_class: null, id_team: null, id_student: 'student_01', id_evaluator: 'super_01', skill_name: 'Problem Solving' },
  { id_evaluation: 'eval_05', note_evaluation: 16.5, type_evaluation: 'Supervisor', comment_evaluation: 'Good team player', id_internship: 'internship_02', id_class: null, id_team: null, id_student: 'student_02', id_evaluator: 'super_02', skill_name: 'Teamwork' },
  { id_evaluation: 'eval_06', note_evaluation: 17.5, type_evaluation: 'Supervisor', comment_evaluation: 'Very organized and meets all deadlines', id_internship: 'internship_03', id_class: null, id_team: null, id_student: 'student_04', id_evaluator: 'super_03', skill_name: 'Time Management' },
  
  // Self evaluations
  { id_evaluation: 'eval_07', note_evaluation: 15.0, type_evaluation: 'Self', comment_evaluation: 'I need to improve my time management', id_internship: null, id_class: null, id_team: 'team_01', id_student: 'student_01', id_evaluator: 'student_01', skill_name: 'Time Management' },
  { id_evaluation: 'eval_08', note_evaluation: 16.0, type_evaluation: 'Self', comment_evaluation: 'I believe my technical skills are strong', id_internship: null, id_class: null, id_team: 'team_02', id_student: 'student_02', id_evaluator: 'student_02', skill_name: 'Technical Proficiency' },
  
  // Pair evaluations
  { id_evaluation: 'eval_09', note_evaluation: 17.0, type_evaluation: 'Pair', comment_evaluation: 'Great teammate who communicates well', id_internship: null, id_class: null, id_team: 'team_01', id_student: 'student_03', id_evaluator: 'student_01', skill_name: 'Communication' },
  { id_evaluation: 'eval_10', note_evaluation: 16.0, type_evaluation: 'Pair', comment_evaluation: 'Works well in team settings', id_internship: null, id_class: null, id_team: 'team_02', id_student: 'student_06', id_evaluator: 'student_02', skill_name: 'Teamwork' },
  { id_evaluation: 'eval_11', note_evaluation: 18.0, type_evaluation: 'Pair', comment_evaluation: 'Excellent technical skills', id_internship: null, id_class: null, id_team: 'team_03', id_student: 'student_05', id_evaluator: 'student_04', skill_name: 'Technical Proficiency' }
];

for (const evaluation of skillEvaluations) {
  await client.query(
    'INSERT INTO skill_evaluation (id_evaluation, note_evaluation, type_evaluation, comment_evaluation, id_internship, id_class, id_team, id_student, id_evaluator, skill_name) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
    [
      evaluation.id_evaluation,
      evaluation.note_evaluation,
      evaluation.type_evaluation,
      evaluation.comment_evaluation,
      evaluation.id_internship,
      evaluation.id_class,
      evaluation.id_team,
      evaluation.id_student,
      evaluation.id_evaluator,
      evaluation.skill_name
    ]
  );
}
console.log('✅ Skill evaluations seeded successfully!');

// ====== NOTIFICATIONS ======
const notifications = [
  { id_notification: 'notif_01', content_notification: 'New project assigned: E-Learning Platform', date_notification: '2024-10-10 09:30:00', id_member: 'student_01' },
  { id_notification: 'notif_02', content_notification: 'New project assigned: E-Learning Platform', date_notification: '2024-10-10 09:30:00', id_member: 'student_03' },
  { id_notification: 'notif_03', content_notification: 'New skill evaluation received', date_notification: '2024-10-12 14:15:00', id_member: 'student_01' },
  { id_notification: 'notif_04', content_notification: 'Internship starts on July 1st', date_notification: '2024-06-15 10:00:00', id_member: 'student_02' },
  { id_notification: 'notif_05', content_notification: 'New team member added', date_notification: '2024-10-11 11:45:00', id_member: 'student_03' },
  { id_notification: 'notif_06', content_notification: 'Academic support solution approved', date_notification: '2024-10-13 16:20:00', id_member: 'student_01' },
  { id_notification: 'notif_07', content_notification: 'New evaluation to complete', date_notification: '2024-10-14 08:30:00', id_member: 'prof_01' },
  { id_notification: 'notif_08', content_notification: 'Team meeting scheduled for tomorrow', date_notification: '2024-10-16 09:00:00', id_member: 'student_04' },
  { id_notification: 'notif_09', content_notification: 'New follow-up session scheduled', date_notification: '2024-10-17 13:00:00', id_member: 'coach_01' },
  { id_notification: 'notif_10', content_notification: 'Internship evaluation due next week', date_notification: '2024-08-20 15:30:00', id_member: 'super_01' }
];

for (const notification of notifications) {
  await client.query(
    'INSERT INTO notifications (id_notification, content_notification, date_notification, id_member) VALUES ($1, $2, $3, $4)',
    [notification.id_notification, notification.content_notification, notification.date_notification, notification.id_member]
  );
}
console.log('✅ Notifications seeded successfully!');

// ====== RATES ======
const rates = [
  { id_rate: 'rate_01', id_member: 'student_01' },
  { id_rate: 'rate_02', id_member: 'student_02' },
  { id_rate: 'rate_03', id_member: 'student_03' },
  { id_rate: 'rate_04', id_member: 'student_04' },
  { id_rate: 'rate_05', id_member: 'prof_01' },
  { id_rate: 'rate_06', id_member: 'prof_02' },
  { id_rate: 'rate_07', id_member: 'coach_01' },
  { id_rate: 'rate_08', id_member: 'super_01' }
];

for (const rate of rates) {
  await client.query(
    'INSERT INTO rate (id_rate, id_member) VALUES ($1, $2)',
    [rate.id_rate, rate.id_member]
  );
}
console.log('✅ Rates seeded successfully!');

console.log('🚀 Database seeding completed successfully!');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.end();
    console.log('Database connection closed');
  }
}

// Run the seeding function
seedDatabase();