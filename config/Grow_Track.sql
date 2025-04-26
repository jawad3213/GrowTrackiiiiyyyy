
--PARTIE INTIALE : LES MEMBRES

--DONE--
CREATE TABLE member ( 
   id_member VARCHAR(100) PRIMARY KEY,
   cin VARCHAR(50) UNIQUE,
   phone VARCHAR(50),
   password VARCHAR(255) NOT NULL,
   role VARCHAR(50) NOT NULL CHECK (type_evaluation IN ('admin', 'student', 'Supervisor', 'Professor', 'coach')),
   full_name VARCHAR(50),
   email VARCHAR(50) NOT NULL UNIQUE,
   profile_picture VARCHAR(50), 
   description VARCHAR(1000), 
   date_add TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

--DONE--
CREATE TABLE student ( 
   id_member VARCHAR(100) PRIMARY KEY,
   cne VARCHAR(50) UNIQUE,
   id_class VARCHAR(100),
   FOREIGN KEY (id_member) REFERENCES member(id_member),
   FOREIGN KEY (id_class) REFERENCES class(id_class)
);

--DONE--
CREATE TABLE professor (
   id_member VARCHAR(100) PRIMARY KEY,
   department VARCHAR(50),
   code VARCHAR(50) UNIQUE,
   FOREIGN KEY (id_member) REFERENCES member(id_member)
);

--DONE--
CREATE TABLE supervisor (
   id_member VARCHAR(100) PRIMARY KEY,
   registration_number VARCHAR(50) UNIQUE,
   company VARCHAR(50),
   position VARCHAR(50),
   FOREIGN KEY (id_member) REFERENCES member(id_member)
);

--DONE--
CREATE TABLE coach (
   id_member VARCHAR(100) PRIMARY KEY,
   field VARCHAR(50),
   FOREIGN KEY (id_member) REFERENCES member(id_member)
);

--DONE--
CREATE TABLE admin (
   id_member VARCHAR(100) PRIMARY KEY,
   assigned_zone VARCHAR(50),
   FOREIGN KEY (id_member) REFERENCES member(id_member)
);

--creation des fillieres par les admins
--DONE--
CREATE TABLE sector (
   id_sector VARCHAR(100),
   sector_name VARCHAR(100), --?? deja doit etre id
   id_admin VARCHAR(100),
   PRIMARY KEY(id_sector),
   FOREIGN KEY(id_admin) REFERENCES admin(id_member)
);


-- TRAITEMENT SIGNIAL - SOLUTION - SUIVI
--DONE--
CREATE TABLE solution (
   id_solution VARCHAR(100),
   option_solution VARCHAR(100),
   subject_solution VARCHAR(100),
   periode VARCHAR(100),
   state VARCHAR(100) DEFAULT 'New' CHECK (state IN ('New', 'Approved', 'Rejected')),
   PRIMARY KEY(id_solution)
);

--DONE--
CREATE TABLE report (
  id_reporter VARCHAR(100),   
  id_reported VARCHAR(100),  
  id_signal   VARCHAR(100)

  PRIMARY KEY (id_reporter, id_reported, id_signal),

  FOREIGN KEY (id_reporter) REFERENCES member(id_member),
  FOREIGN KEY (id_reported) REFERENCES student(id_member),
  FOREIGN KEY (id_signal) REFERENCES signal(id_signal)
);


--DONE--
CREATE TABLE signal (
   id_signal VARCHAR(100),
   approved BOOLEAN,
   message VARCHAR(1000),
   anony BOOLEAN,
   option_signal VARCHAR(100),
   prove BYTEA,
   id_solution VARCHAR(100) ,
   id_member VARCHAR(100) ,
   date_add DATE DEFAULT CURRENT_DATE,
   PRIMARY KEY(id_signal),
   FOREIGN KEY(id_solution) REFERENCES solution(id_solution),
   FOREIGN KEY(id_member) REFERENCES member(id_member)
);

--DONE--
CREATE TABLE follow_up (
   id_coach VARCHAR(100),
   id_student VARCHAR(100),
   id_solution VARCHAR(100),
   message VARCHAR(1000),
   PRIMARY KEY(id_coach, id_student, id_solution),
   FOREIGN KEY(id_coach) REFERENCES coach(id_member),
   FOREIGN KEY(id_student) REFERENCES student(id_member),
   FOREIGN KEY(id_solution) REFERENCES solution(id_solution)
);


--l'ensemble de regroupement des etudiants : stage - groupe/projet - classe
--DONE--
CREATE TABLE project (
   id_project VARCHAR(100),
   description_project VARCHAR(1000),
   date_project DATE,
   subject_project VARCHAR(1000),
   id_prof VARCHAR(100) NOT NULL,
   PRIMARY KEY(id_project),
   FOREIGN KEY(id_prof) REFERENCES professor(id_member)
);

--DONE--
CREATE TABLE internship (
   id_internship VARCHAR(100),
   date_start DATE,
   date_done DATE,
   subject_internship VARCHAR(100),
   PRIMARY KEY(id_internship)
);

--DONE--
CREATE TABLE team (
   id_team VARCHAR(100),
   note DOUBLE PRECISION,
   id_prof VARCHAR(100) NOT NULL,
   id_project VARCHAR(100) NOT NULL,
   PRIMARY KEY(id_team),
   FOREIGN KEY(id_prof) REFERENCES professor(id_member),
   FOREIGN KEY(id_project) REFERENCES project(id_project)
);

--DONE--
CREATE TABLE team_student (
   id_team VARCHAR(100),
   student_id VARCHAR(100),
   PRIMARY KEY(id_team, student_id),
   FOREIGN KEY(id_team) REFERENCES team(id_team),
   FOREIGN KEY(student_id) REFERENCES student(id_member)
);

--DONE--
CREATE TABLE class (
  id_class VARCHAR(100),
  start_date DATE DEFAULT CURRENT_DATE,
  sector_id VARCHAR(100) NOT NULL,
  PRIMARY KEY(id_class),
  FOREIGN KEY(sector_id) REFERENCES sector(id_sector)
);


--prof donne des formations dans quel class ?
--DONE--
CREATE TABLE teach (
   id_member VARCHAR(100),
   id_class VARCHAR(100),
   course VARCHAR(50),
   PRIMARY KEY(id_member, id_class),
   FOREIGN KEY(id_member) REFERENCES professor(id_member),
   FOREIGN KEY(id_class) REFERENCES class(id_class)
);


-- superviseur avec quel etudiant (un seul)?
--DONE--
CREATE TABLE supervise (
   id_supervisor VARCHAR(100), 
   id_student VARCHAR(100), 
   id_internship VARCHAR(100),
   PRIMARY KEY(id_supervisor, id_student, id_internship),
   FOREIGN KEY(id_supervisor) REFERENCES supervisor(id_member), 
   FOREIGN KEY(id_student) REFERENCES student(id_member), 
   FOREIGN KEY(id_internship) REFERENCES internship(id_internship)
);

--traitement des skill prenant en compte evalusation est une evaluation d'une skill dans un concept
--DONE--
CREATE TABLE skill (
   skill_name VARCHAR(100),
   desciption_skill VARCHAR(1000),
   question1 VARCHAR(100),
   question2 VARCHAR(100),
   question3 VARCHAR(100),
   id_admin VARCHAR(100) NOT NULL, 
   PRIMARY KEY(skill_name),
   FOREIGN KEY(id_admin) REFERENCES admin(id_member) 
);

--DONE--
CREATE TABLE skill_evaluation (
   id_evaluation SERIAL PRIMARY KEY,
   note_evaluation DOUBLE PRECISION,
   type_evaluation VARCHAR(100) CHECK (type_evaluation IN ('Pair', 'Self', 'Supervisor', 'Professor')),
   comment_evaluation VARCHAR(1000),
   id_internship VARCHAR(100),
   id_class VARCHAR(100),
   id_team VARCHAR(100),
   id_student VARCHAR(100),
   id_evaluator VARCHAR(100),
   skill_name VARCHAR(100),
   date_add DATE DEFAULT CURRENT_DATE,
   FOREIGN KEY(id_internship) REFERENCES internship(id_internship),
   FOREIGN KEY(id_class) REFERENCES class(id_class),
   FOREIGN KEY(id_team) REFERENCES team(id_team),
   FOREIGN KEY(id_student) REFERENCES student(id_member),
   FOREIGN KEY(id_evaluator) REFERENCES member(id_member),
   FOREIGN KEY(skill_name) REFERENCES skill(skill_name)
);


-- Notifications
--DONE--
CREATE TABLE notifications (
   id_notification VARCHAR(100),
   content_notification VARCHAR(100),
   date_notification TIMESTAMP,
   id_member VARCHAR(100),
   PRIMARY KEY(id_notification),
   FOREIGN KEY(id_member) REFERENCES member(id_member)
);


--rate
--DONE--
CREATE TABLE rate (
   id_rate VARCHAR(100),
   id_member VARCHAR(100),
   PRIMARY KEY(id_rate),
   FOREIGN KEY(id_member) REFERENCES member(id_member)
);

