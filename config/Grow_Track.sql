
--PARTIE INTIALE : LES MEMBRES

--DONEE--
CREATE TABLE member ( 
   id_member VARCHAR(100) PRIMARY KEY,
   cin VARCHAR(50) UNIQUE,
   phone VARCHAR(50),
   password VARCHAR(255) NOT NULL,
   role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'student', 'Supervisor', 'Professor', 'coach')),
   full_name VARCHAR(50),
   email VARCHAR(50) NOT NULL UNIQUE,
   profile_picture VARCHAR(50), 
   description VARCHAR(1000), 
   date_add TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

--creation des fillieres par les admins
--DONEE--
CREATE TABLE sector (
   id_sector VARCHAR(100),
   description VARCHAR(2000), 
   id_admin VARCHAR(100),
   PRIMARY KEY(id_sector),
   FOREIGN KEY(id_admin) REFERENCES admin(id_member)
);


--DONEE--
CREATE TABLE class (
  id_class VARCHAR(100),
  start_date DATE DEFAULT CURRENT_DATE,
  sector_id VARCHAR(100) NOT NULL,
  PRIMARY KEY(id_class),
  FOREIGN KEY(sector_id) REFERENCES sector(id_sector)
);

--DONEE--
CREATE TABLE student ( 
   id_member VARCHAR(100) PRIMARY KEY,
   cne VARCHAR(50) UNIQUE,
   id_class VARCHAR(100),
   FOREIGN KEY (id_member) REFERENCES member(id_member),
   FOREIGN KEY (id_class) REFERENCES class(id_class)
);

--DONEE--
CREATE TABLE professor (
   id_member VARCHAR(100) PRIMARY KEY,
   department VARCHAR(50),
   code VARCHAR(50) UNIQUE,
   FOREIGN KEY (id_member) REFERENCES member(id_member)
);

--DONEE--
CREATE TABLE supervisor (
   id_member VARCHAR(100) PRIMARY KEY,
   registration_number VARCHAR(50) UNIQUE,
   company VARCHAR(50),
   position VARCHAR(50),
   FOREIGN KEY (id_member) REFERENCES member(id_member)
);

--DONEE--
CREATE TABLE coach (
   id_member VARCHAR(100) PRIMARY KEY,
   field VARCHAR(50),
   FOREIGN KEY (id_member) REFERENCES member(id_member)
);

--DONEE--
CREATE TABLE admin (
   id_member VARCHAR(100) PRIMARY KEY,
   assigned_zone VARCHAR(50),
   FOREIGN KEY (id_member) REFERENCES member(id_member)
);


-- TRAITEMENT SIGNIAL - SOLUTION - SUIVI
--DONEE--
CREATE TABLE solution (
   id_solution SERIAL,
   option_solution VARCHAR(100),
   subject_solution VARCHAR(100),
   periode VARCHAR(100),
   state VARCHAR(100) DEFAULT 'New' CHECK (state IN ('New', 'Approved', 'Rejected')),
   PRIMARY KEY(id_solution)
);

--DONEE--
CREATE TABLE report (
  id_reporter VARCHAR(100),   
  id_reported VARCHAR(100),
  id_signal INT,

  PRIMARY KEY (id_reporter, id_reported, id_signal),

  FOREIGN KEY (id_reporter) REFERENCES member(id_member),
  FOREIGN KEY (id_reported) REFERENCES student(id_member),
  FOREIGN KEY (id_signal) REFERENCES signal(id_signal)
);


--DONEE--
CREATE TABLE signal (
   id_signal SERIAL PRIMARY KEY,
   approved BOOLEAN,
   message VARCHAR(1000),
   anony BOOLEAN,
   option_signal VARCHAR(100),
   prove BYTEA,
   id_solution INT ,
   id_member VARCHAR(100) ,
   date_add DATE DEFAULT CURRENT_DATE,
   solution_state VARCHAR(100),
   FOREIGN KEY(id_solution) REFERENCES solution(id_solution),
   FOREIGN KEY(id_member) REFERENCES member(id_member)
);

--DONEE--
CREATE TABLE follow_up (
   id_coach VARCHAR(100),
   id_student VARCHAR(100),
   id_solution INT,
   message VARCHAR(1000),
   start_date DATE DEFAULT CURRENT_DATE,
   date_done DATE,
   PRIMARY KEY(id_coach, id_student, id_solution),
   FOREIGN KEY(id_coach) REFERENCES coach(id_member),
   FOREIGN KEY(id_student) REFERENCES student(id_member),
   FOREIGN KEY(id_solution) REFERENCES solution(id_solution)
);


--l'ensemble de regroupement des etudiants : stage - groupe/projet - classe
--DONEE--
CREATE TABLE project (
   id_project SERIAL PRIMARY KEY,
   description_project VARCHAR(1000),
   date_project DATE,
   subject_project VARCHAR(1000),
   id_prof VARCHAR(100) NOT NULL,
   FOREIGN KEY(id_prof) REFERENCES professor(id_member)
);

--DONEE--
CREATE TABLE internship (
   id_internship SERIAL PRIMARY KEY,
   date_start DATE,
   date_done DATE,
   subject_internship VARCHAR(100)
);

--DONEE--
CREATE TABLE team (
   id_team SERIAL PRIMARY KEY,
   note DOUBLE PRECISION,
   id_prof VARCHAR(100) NOT NULL,
   id_project INT,
   FOREIGN KEY(id_prof) REFERENCES professor(id_member),
   FOREIGN KEY(id_project) REFERENCES project(id_project)
);

--DONEE--
CREATE TABLE team_student (
   id_team INT,
   student_id VARCHAR(100),
   PRIMARY KEY(id_team, student_id),
   FOREIGN KEY(id_team) REFERENCES team(id_team),
   FOREIGN KEY(student_id) REFERENCES student(id_member)
);


--prof donne des formations dans quel class ?
--DONEE--
CREATE TABLE teach (
   id_member VARCHAR(100),
   id_class VARCHAR(100),
   course VARCHAR(50),
   PRIMARY KEY(id_member, id_class),
   FOREIGN KEY(id_member) REFERENCES professor(id_member),
   FOREIGN KEY(id_class) REFERENCES class(id_class)
);


-- superviseur avec quel etudiant (un seul)?
--DONEE--
CREATE TABLE supervise (
   id_supervisor VARCHAR(100), 
   id_student VARCHAR(100), 
   id_internship INT,
   PRIMARY KEY(id_supervisor, id_student, id_internship),
   FOREIGN KEY(id_supervisor) REFERENCES supervisor(id_member), 
   FOREIGN KEY(id_student) REFERENCES student(id_member), 
   FOREIGN KEY(id_internship) REFERENCES internship(id_internship)
);

--traitement des skill prenant en compte evalusation est une evaluation d'une skill dans un concept
--DONEE--
CREATE TABLE skill (
   skill_name VARCHAR(100),
   description_skill VARCHAR(1000),
   question1 VARCHAR(100),
   question2 VARCHAR(100),
   question3 VARCHAR(100),
   id_admin VARCHAR(100) NOT NULL, 
   PRIMARY KEY(skill_name),
   FOREIGN KEY(id_admin) REFERENCES admin(id_member) 
);

--DONEE--
CREATE TABLE skill_evaluation (
   id_evaluation SERIAL PRIMARY KEY,
   note_evaluation DOUBLE PRECISION,
   type_evaluation VARCHAR(100) CHECK (type_evaluation IN ('Pair', 'Self', 'Supervisor', 'Professor')),
   comment_evaluation VARCHAR(1000),
   id_internship INT,
   id_class VARCHAR(100),
   id_team INT,
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
--DONEE--
CREATE TABLE notifications (
   id_notification SERIAL PRIMARY KEY,
   content_notification VARCHAR(100),
   date_notification TIMESTAMP,
   id_member VARCHAR(100),
   FOREIGN KEY(id_member) REFERENCES member(id_member)
);


--rate
--DONEE--
CREATE TABLE rate (
   id_rate SERIAL,
   id_member VARCHAR(100),
   PRIMARY KEY(id_rate),
   FOREIGN KEY(id_member) REFERENCES member(id_member)
);

