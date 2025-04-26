--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admin; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admin (
    id_member character varying(100) NOT NULL,
    assigned_zone character varying(50)
);


--
-- Name: class; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.class (
    id_class character varying(100) NOT NULL,
    sector_id character varying(100) NOT NULL,
    start_date date DEFAULT CURRENT_DATE
);


--
-- Name: coach; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.coach (
    id_member character varying(100) NOT NULL,
    field character varying(50)
);


--
-- Name: follow_up; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.follow_up (
    id_coach character varying(100) NOT NULL,
    id_student character varying(100) NOT NULL,
    id_solution character varying(100) NOT NULL,
    message character varying(1000)
);


--
-- Name: internship; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.internship (
    id_internship character varying(100) NOT NULL,
    date_start date,
    date_done date,
    subject_internship character varying(100)
);


--
-- Name: member; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.member (
    id_member character varying(100) NOT NULL,
    cin character varying(50) NOT NULL,
    phone character varying(100),
    password character varying(255) NOT NULL,
    full_name character varying(50),
    email character varying(50) NOT NULL,
    profile_picture character varying(200),
    description character varying(1000),
    date_add timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    role character varying(50) NOT NULL,
    CONSTRAINT member_role_check CHECK (((role)::text = ANY ((ARRAY['admin'::character varying, 'student'::character varying, 'Supervisor'::character varying, 'Professor'::character varying, 'coach'::character varying])::text[])))
);


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notifications (
    id_notification character varying(100) NOT NULL,
    content_notification character varying(100),
    date_notification timestamp without time zone,
    id_member character varying(100)
);


--
-- Name: professor; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.professor (
    id_member character varying(100) NOT NULL,
    department character varying(50),
    code character varying(50)
);


--
-- Name: project; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.project (
    id_project character varying(100) NOT NULL,
    description_project character varying(1000),
    date_project date,
    subject_project character varying(1000),
    id_prof character varying(100) NOT NULL
);


--
-- Name: rate; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rate (
    id_rate character varying(100) NOT NULL,
    id_member character varying(100)
);


--
-- Name: report; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.report (
    id_reporter character varying(100) NOT NULL,
    id_reported character varying(100) NOT NULL,
    id_signal character varying(100) NOT NULL
);


--
-- Name: sector; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sector (
    id_sector character varying(100) NOT NULL,
    sector_name character varying(100),
    id_admin character varying(100)
);


--
-- Name: signal; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.signal (
    id_signal character varying(100) NOT NULL,
    approved boolean,
    message character varying(1000),
    anony boolean,
    option_signal character varying(100),
    prove bytea,
    id_solution character varying(100),
    id_member character varying(100),
    date_add date DEFAULT CURRENT_DATE
);


--
-- Name: skill; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.skill (
    skill_name character varying(100) NOT NULL,
    desciption_skill character varying(1000),
    question1 character varying(100),
    question2 character varying(100),
    question3 character varying(100),
    id_admin character varying(100) NOT NULL
);


--
-- Name: skill_evaluation; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.skill_evaluation (
    id_evaluation integer NOT NULL,
    note_evaluation double precision,
    type_evaluation character varying(100),
    comment_evaluation character varying(1000),
    id_internship character varying(100),
    id_class character varying(100),
    id_team character varying(100),
    id_student character varying(100),
    id_evaluator character varying(100),
    skill_name character varying(100),
    date_add date DEFAULT CURRENT_DATE,
    CONSTRAINT skill_evaluation_type_evaluation_check CHECK (((type_evaluation)::text = ANY ((ARRAY['Pair'::character varying, 'Self'::character varying, 'Supervisor'::character varying, 'Professor'::character varying])::text[])))
);


--
-- Name: skill_evaluation_id_evaluation_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.skill_evaluation_id_evaluation_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: skill_evaluation_id_evaluation_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.skill_evaluation_id_evaluation_seq OWNED BY public.skill_evaluation.id_evaluation;


--
-- Name: solution; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.solution (
    id_solution character varying(100) NOT NULL,
    option_solution character varying(100),
    subject_solution character varying(100),
    periode character varying(100),
    state character varying(100) DEFAULT 'New'::character varying,
    CONSTRAINT chk_state_values CHECK (((state)::text = ANY ((ARRAY['New'::character varying, 'Approved'::character varying, 'Rejected'::character varying])::text[])))
);


--
-- Name: student; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student (
    id_member character varying(100) NOT NULL,
    cne character varying(50),
    id_class character varying(100)
);


--
-- Name: supervise; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.supervise (
    id_supervisor character varying(100) NOT NULL,
    id_student character varying(100) NOT NULL,
    id_internship character varying(100) NOT NULL
);


--
-- Name: supervisor; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.supervisor (
    id_member character varying(100) NOT NULL,
    registration_number character varying(50),
    company character varying(50),
    "position" character varying(50)
);


--
-- Name: teach; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.teach (
    id_member character varying(100) NOT NULL,
    id_class character varying(100) NOT NULL,
    course character varying(50)
);


--
-- Name: team; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.team (
    id_team character varying(100) NOT NULL,
    note double precision,
    id_prof character varying(100) NOT NULL,
    id_project character varying(100) NOT NULL
);


--
-- Name: team_student; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.team_student (
    id_team character varying(100) NOT NULL,
    student_id character varying(100) NOT NULL
);


--
-- Name: skill_evaluation id_evaluation; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.skill_evaluation ALTER COLUMN id_evaluation SET DEFAULT nextval('public.skill_evaluation_id_evaluation_seq'::regclass);


--
-- Data for Name: admin; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.admin (id_member, assigned_zone) FROM stdin;
\.


--
-- Data for Name: class; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.class (id_class, sector_id, start_date) FROM stdin;
GINF1	CI1	2025-04-26
\.


--
-- Data for Name: coach; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.coach (id_member, field) FROM stdin;
\.


--
-- Data for Name: follow_up; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.follow_up (id_coach, id_student, id_solution, message) FROM stdin;
\.


--
-- Data for Name: internship; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.internship (id_internship, date_start, date_done, subject_internship) FROM stdin;
INT001	\N	\N	\N
Développement Web	2025-05-01	2025-08-01	Création d'une application de gestion
\.


--
-- Data for Name: member; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.member (id_member, cin, phone, password, full_name, email, profile_picture, description, date_add, role) FROM stdin;
M001	CIN001	0612345678	hashedpass1	Nada Admin	admin1@example.com	admin.png	Admin system manager	2025-04-23 20:11:38.736008	admin
M002	CIN002	0623456789	$2b$10$XCZ3EcjDWRh5Ej59TVsqn.iwrrhKcHVED2QC5gY5msC823xA4REaG	Omar Étudiant	eloukili.nada@etu.uae.ac.ma	student.png	1ère année ingénierie	2025-04-23 20:11:38.736008	student
M003	CIN003	0634567890	hashedpass3	Sara Superviseure	supervisor1@example.com	supervisor.png	Supervise les projets de fin des	2025-04-23 20:11:38.736008	Supervisor
M004	CIN004	0645678901	hashedpass4	Youssef Prof	prof1@example.com	prof.png	Professeur de base de données	2025-04-23 20:11:38.736008	Professor
M005	CIN005	0656789012	hashedpass5	Amal Coach	coach1@example.com	coach.png	Coach en soft skills	2025-04-23 20:11:38.736008	coach
F001	CIN00133	0612345678	hashed_pwd1	Dr. Amine Rahmouni	amine.rahmouni@univ.ma	amine.png	Professeur en informatique.	2025-04-23 21:25:48.884503	Professor
F002	CIN0023	0612345679	hashed_pwd2	Dr. Salma Idrissi	salma.idrissi@univ.ma	salma.png	Spécialiste en intelligence artificielle.	2025-04-23 21:25:48.884503	Professor
F003	CIN0033	0612345680	hashed_pwd3	Dr. Youssef Bakkali	youssef.bakkali@univ.ma	youssef.png	Enseignant chercheur en cybersécurité.	2025-04-23 21:25:48.884503	Professor
F004	CIN0043	0612345681	hashed_pwd4	Dr. Zineb El Alaoui	zineb.alaoui@univ.ma	zineb.png	Experte en systèmes distribués.	2025-04-23 21:25:48.884503	Professor
F005	CIN0053	0612345682	hashed_pwd5	Dr. Mehdi Mansouri	mehdi.mansouri@univ.ma	mehdi.png	Professeur en génie logiciel.	2025-04-23 21:25:48.884503	Professor
F006	CIN006	0612345683	hashed_pwd6	Aya El Khattabi	aya.khattabi@student.ma	aya.png	Étudiante en 2e année ingénierie informatique.	2025-04-23 21:26:21.8554	student
F007	CIN007	0612345684	hashed_pwd7	Mohamed Benali	mohamed.benali@student.ma	mohamed.png	Passionné par le développement web.	2025-04-23 21:26:21.8554	student
F008	CIN008	0612345685	hashed_pwd8	Sara Laaroussi	sara.laaroussi@student.ma	sara.png	Étudiante active au club robotique.	2025-04-23 21:26:21.8554	student
F009	CIN009	0612345686	hashed_pwd9	Yassine Ait Taleb	yassine.aittaleb@student.ma	yassine.png	Étudiant intéressé par l’IA et les données.	2025-04-23 21:26:21.8554	student
F010	CIN010	0612345687	hashed_pwd10	Fatima Zahra Idrissi	fatima.idrissi@student.ma	fatima.png	Étudiante motivée en cybersécurité.	2025-04-23 21:26:21.8554	student
54c5b83f-2a94-44a6-8001-af0a4cbeb645	CIN653232	\N	$2b$10$YCwD45yF0mw3CEmpqWWjeeMw.aRF4navXEx22sntGLkISq7bEVUui	hamza	hamza@gamil.com	uploads\\1745630775446-Screenshot 2025-01-21 150850.png	nouveau etudiant	2025-04-26 01:31:22.866761	student
21e2dc75-98b3-4f95-8a17-073b96634a86	lb28634	\N	$2b$10$yvQgOMjMuNlg4yZ506MJfeD6vwfMrQ81FkJmAaLvDX9qTNAj/hwyS	mohamed	dhjd@gmail.com	uploads\\1745634382322-Capture d’écran 2024-12-12 155640.png	nouveau	2025-04-26 02:31:30.437286	Professor
3f89087a-0f35-43a9-bca3-d441df394223	AB123456	\N	$2b$10$litQYGB9mWF8lvfmbaaUqerkaO1z5HvoSFdM8yxyX4zi19wCwo3PS	Ali Ben Salah	ali.salah@example.com	uploads\\1745636364638-Screenshot 2025-01-21 205954.png	Projet très important pour le département IT.	2025-04-26 03:04:33.449826	Supervisor
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.notifications (id_notification, content_notification, date_notification, id_member) FROM stdin;
\.


--
-- Data for Name: professor; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.professor (id_member, department, code) FROM stdin;
F001	Informatique	CODE001
F002	Intelligence Artificielle	CODE002
F003	Cybersécurité	CODE003
21e2dc75-98b3-4f95-8a17-073b96634a86	\N	8725
\.


--
-- Data for Name: project; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.project (id_project, description_project, date_project, subject_project, id_prof) FROM stdin;
\.


--
-- Data for Name: rate; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.rate (id_rate, id_member) FROM stdin;
\.


--
-- Data for Name: report; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.report (id_reporter, id_reported, id_signal) FROM stdin;
\.


--
-- Data for Name: sector; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sector (id_sector, sector_name, id_admin) FROM stdin;
CI1	\N	\N
\.


--
-- Data for Name: signal; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.signal (id_signal, approved, message, anony, option_signal, prove, id_solution, id_member, date_add) FROM stdin;
SIG001	\N	\N	\N	\N	\N	\N	\N	2025-01-05
SIG002	\N	\N	\N	\N	\N	\N	\N	2025-01-12
SIG003	\N	\N	\N	\N	\N	\N	\N	2025-01-18
SIG004	\N	\N	\N	\N	\N	\N	\N	2025-01-23
SIG005	\N	\N	\N	\N	\N	\N	\N	2025-01-29
SIG006	\N	\N	\N	\N	\N	\N	\N	2025-02-03
SIG007	\N	\N	\N	\N	\N	\N	\N	2025-02-10
SIG008	\N	\N	\N	\N	\N	\N	\N	2025-02-14
SIG009	\N	\N	\N	\N	\N	\N	\N	2025-02-20
SIG010	\N	\N	\N	\N	\N	\N	\N	2025-02-25
SIG011	\N	\N	\N	\N	\N	\N	\N	2025-03-02
SIG012	\N	\N	\N	\N	\N	\N	\N	2025-03-08
SIG013	\N	\N	\N	\N	\N	\N	\N	2025-03-15
SIG014	\N	\N	\N	\N	\N	\N	\N	2025-03-22
SIG015	\N	\N	\N	\N	\N	\N	\N	2025-03-30
SIG016	\N	\N	\N	\N	\N	\N	\N	2025-04-01
SIG017	\N	\N	\N	\N	\N	\N	\N	2025-04-06
SIG018	\N	\N	\N	\N	\N	\N	\N	2025-04-12
SIG019	\N	\N	\N	\N	\N	\N	\N	2025-04-18
SIG020	\N	\N	\N	\N	\N	\N	\N	2025-04-24
\.


--
-- Data for Name: skill; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.skill (skill_name, desciption_skill, question1, question2, question3, id_admin) FROM stdin;
\.


--
-- Data for Name: skill_evaluation; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.skill_evaluation (id_evaluation, note_evaluation, type_evaluation, comment_evaluation, id_internship, id_class, id_team, id_student, id_evaluator, skill_name, date_add) FROM stdin;
9	\N	Self	\N	\N	\N	\N	F010	F010	\N	2025-04-24
10	\N	Professor	\N	\N	\N	\N	F010	F003	\N	2025-04-24
11	13	Pair	Participation correcte aux travaux de groupe	\N	\N	\N	\N	\N	\N	2024-03-05
12	15.5	Professor	Bonne compréhension du sujet	\N	\N	\N	\N	\N	\N	2024-03-12
13	17	Supervisor	Respect des délais et bonne communication	\N	\N	\N	\N	\N	\N	2024-03-20
14	11.5	Self	Des efforts restent à faire	\N	\N	\N	\N	\N	\N	2024-03-27
15	\N	\N	\N	\N	\N	\N	\N	F001	\N	2025-03-24
16	\N	\N	\N	\N	\N	\N	\N	F002	\N	2025-03-24
17	\N	\N	\N	\N	\N	\N	\N	F003	\N	2025-03-24
18	\N	\N	\N	\N	\N	\N	\N	F004	\N	2025-03-24
19	\N	Self	\N	\N	\N	\N	\N	\N	\N	2024-04-01
20	\N	Self	\N	\N	\N	\N	\N	\N	\N	2024-04-05
21	\N	Self	\N	\N	\N	\N	\N	\N	\N	2024-04-10
22	\N	Self	\N	\N	\N	\N	\N	\N	\N	2024-04-15
23	\N	Self	\N	\N	\N	\N	\N	\N	\N	2000-01-01
29	14.5	Self	Très bonne auto-évaluation.	\N	\N	\N	F010	F010	\N	2025-04-26
30	16	Self	Bonne compréhension des concepts.	\N	\N	\N	F010	F010	\N	2025-04-26
31	15	Self	Travail d'équipe efficace.	\N	\N	\N	F010	F010	\N	2025-04-26
32	13.5	Self	Peut améliorer la présentation.	\N	\N	\N	F010	F010	\N	2025-04-26
33	17	Self	Excellente implication dans le projet.	\N	\N	\N	F010	F010	\N	2025-04-26
\.


--
-- Data for Name: solution; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.solution (id_solution, option_solution, subject_solution, periode, state) FROM stdin;
\.


--
-- Data for Name: student; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.student (id_member, cne, id_class) FROM stdin;
F010	CNE123456	\N
54c5b83f-2a94-44a6-8001-af0a4cbeb645	p137638	GINF1
\.


--
-- Data for Name: supervise; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.supervise (id_supervisor, id_student, id_internship) FROM stdin;
3f89087a-0f35-43a9-bca3-d441df394223	54c5b83f-2a94-44a6-8001-af0a4cbeb645	Développement Web
\.


--
-- Data for Name: supervisor; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.supervisor (id_member, registration_number, company, "position") FROM stdin;
3f89087a-0f35-43a9-bca3-d441df394223	0600123456	Tech Solutions	Senior Engineer
\.


--
-- Data for Name: teach; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.teach (id_member, id_class, course) FROM stdin;
21e2dc75-98b3-4f95-8a17-073b96634a86	GINF1	linux
\.


--
-- Data for Name: team; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.team (id_team, note, id_prof, id_project) FROM stdin;
\.


--
-- Data for Name: team_student; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.team_student (id_team, student_id) FROM stdin;
\.


--
-- Name: skill_evaluation_id_evaluation_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.skill_evaluation_id_evaluation_seq', 33, true);


--
-- Name: admin admin_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_pkey PRIMARY KEY (id_member);


--
-- Name: class class_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.class
    ADD CONSTRAINT class_pkey PRIMARY KEY (id_class);


--
-- Name: coach coach_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coach
    ADD CONSTRAINT coach_pkey PRIMARY KEY (id_member);


--
-- Name: follow_up follow_up_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.follow_up
    ADD CONSTRAINT follow_up_pkey PRIMARY KEY (id_coach, id_student, id_solution);


--
-- Name: internship internship_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.internship
    ADD CONSTRAINT internship_pkey PRIMARY KEY (id_internship);


--
-- Name: member member_cin_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.member
    ADD CONSTRAINT member_cin_key UNIQUE (cin);


--
-- Name: member member_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.member
    ADD CONSTRAINT member_email_key UNIQUE (email);


--
-- Name: member member_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.member
    ADD CONSTRAINT member_pkey PRIMARY KEY (id_member);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id_notification);


--
-- Name: professor professor_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.professor
    ADD CONSTRAINT professor_code_key UNIQUE (code);


--
-- Name: professor professor_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.professor
    ADD CONSTRAINT professor_pkey PRIMARY KEY (id_member);


--
-- Name: project project_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project
    ADD CONSTRAINT project_pkey PRIMARY KEY (id_project);


--
-- Name: rate rate_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rate
    ADD CONSTRAINT rate_pkey PRIMARY KEY (id_rate);


--
-- Name: report report_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.report
    ADD CONSTRAINT report_pkey PRIMARY KEY (id_reporter, id_reported, id_signal);


--
-- Name: sector sector_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sector
    ADD CONSTRAINT sector_pkey PRIMARY KEY (id_sector);


--
-- Name: signal signal_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.signal
    ADD CONSTRAINT signal_pkey PRIMARY KEY (id_signal);


--
-- Name: skill_evaluation skill_evaluation_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.skill_evaluation
    ADD CONSTRAINT skill_evaluation_pkey PRIMARY KEY (id_evaluation);


--
-- Name: skill skill_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.skill
    ADD CONSTRAINT skill_pkey PRIMARY KEY (skill_name);


--
-- Name: solution solution_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solution
    ADD CONSTRAINT solution_pkey PRIMARY KEY (id_solution);


--
-- Name: student student_cne_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_cne_key UNIQUE (cne);


--
-- Name: student student_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_pkey PRIMARY KEY (id_member);


--
-- Name: supervise supervise_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.supervise
    ADD CONSTRAINT supervise_pkey PRIMARY KEY (id_supervisor, id_student, id_internship);


--
-- Name: supervisor supervisor_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.supervisor
    ADD CONSTRAINT supervisor_pkey PRIMARY KEY (id_member);


--
-- Name: supervisor supervisor_registration_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.supervisor
    ADD CONSTRAINT supervisor_registration_number_key UNIQUE (registration_number);


--
-- Name: teach teach_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teach
    ADD CONSTRAINT teach_pkey PRIMARY KEY (id_member, id_class);


--
-- Name: team team_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.team
    ADD CONSTRAINT team_pkey PRIMARY KEY (id_team);


--
-- Name: team_student team_student_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.team_student
    ADD CONSTRAINT team_student_pkey PRIMARY KEY (id_team, student_id);


--
-- Name: admin admin_id_member_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_id_member_fkey FOREIGN KEY (id_member) REFERENCES public.member(id_member);


--
-- Name: class class_sector_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.class
    ADD CONSTRAINT class_sector_id_fkey FOREIGN KEY (sector_id) REFERENCES public.sector(id_sector);


--
-- Name: coach coach_id_member_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coach
    ADD CONSTRAINT coach_id_member_fkey FOREIGN KEY (id_member) REFERENCES public.member(id_member);


--
-- Name: follow_up follow_up_id_coach_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.follow_up
    ADD CONSTRAINT follow_up_id_coach_fkey FOREIGN KEY (id_coach) REFERENCES public.coach(id_member);


--
-- Name: follow_up follow_up_id_solution_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.follow_up
    ADD CONSTRAINT follow_up_id_solution_fkey FOREIGN KEY (id_solution) REFERENCES public.solution(id_solution);


--
-- Name: follow_up follow_up_id_student_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.follow_up
    ADD CONSTRAINT follow_up_id_student_fkey FOREIGN KEY (id_student) REFERENCES public.student(id_member);


--
-- Name: notifications notifications_id_member_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_id_member_fkey FOREIGN KEY (id_member) REFERENCES public.member(id_member);


--
-- Name: professor professor_id_member_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.professor
    ADD CONSTRAINT professor_id_member_fkey FOREIGN KEY (id_member) REFERENCES public.member(id_member);


--
-- Name: project project_id_prof_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project
    ADD CONSTRAINT project_id_prof_fkey FOREIGN KEY (id_prof) REFERENCES public.professor(id_member);


--
-- Name: rate rate_id_member_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rate
    ADD CONSTRAINT rate_id_member_fkey FOREIGN KEY (id_member) REFERENCES public.member(id_member);


--
-- Name: report report_id_reported_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.report
    ADD CONSTRAINT report_id_reported_fkey FOREIGN KEY (id_reported) REFERENCES public.student(id_member);


--
-- Name: report report_id_reporter_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.report
    ADD CONSTRAINT report_id_reporter_fkey FOREIGN KEY (id_reporter) REFERENCES public.member(id_member);


--
-- Name: report report_id_signal_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.report
    ADD CONSTRAINT report_id_signal_fkey FOREIGN KEY (id_signal) REFERENCES public.signal(id_signal);


--
-- Name: sector sector_id_admin_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sector
    ADD CONSTRAINT sector_id_admin_fkey FOREIGN KEY (id_admin) REFERENCES public.admin(id_member);


--
-- Name: signal signal_id_member_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.signal
    ADD CONSTRAINT signal_id_member_fkey FOREIGN KEY (id_member) REFERENCES public.admin(id_member);


--
-- Name: signal signal_id_solution_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.signal
    ADD CONSTRAINT signal_id_solution_fkey FOREIGN KEY (id_solution) REFERENCES public.solution(id_solution);


--
-- Name: skill_evaluation skill_evaluation_id_class_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.skill_evaluation
    ADD CONSTRAINT skill_evaluation_id_class_fkey FOREIGN KEY (id_class) REFERENCES public.class(id_class);


--
-- Name: skill_evaluation skill_evaluation_id_evaluator_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.skill_evaluation
    ADD CONSTRAINT skill_evaluation_id_evaluator_fkey FOREIGN KEY (id_evaluator) REFERENCES public.member(id_member);


--
-- Name: skill_evaluation skill_evaluation_id_internship_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.skill_evaluation
    ADD CONSTRAINT skill_evaluation_id_internship_fkey FOREIGN KEY (id_internship) REFERENCES public.internship(id_internship);


--
-- Name: skill_evaluation skill_evaluation_id_student_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.skill_evaluation
    ADD CONSTRAINT skill_evaluation_id_student_fkey FOREIGN KEY (id_student) REFERENCES public.student(id_member);


--
-- Name: skill_evaluation skill_evaluation_id_team_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.skill_evaluation
    ADD CONSTRAINT skill_evaluation_id_team_fkey FOREIGN KEY (id_team) REFERENCES public.team(id_team);


--
-- Name: skill_evaluation skill_evaluation_skill_name_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.skill_evaluation
    ADD CONSTRAINT skill_evaluation_skill_name_fkey FOREIGN KEY (skill_name) REFERENCES public.skill(skill_name);


--
-- Name: skill skill_id_admin_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.skill
    ADD CONSTRAINT skill_id_admin_fkey FOREIGN KEY (id_admin) REFERENCES public.admin(id_member);


--
-- Name: student student_id_member_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_id_member_fkey FOREIGN KEY (id_member) REFERENCES public.member(id_member);


--
-- Name: supervise supervise_id_internship_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.supervise
    ADD CONSTRAINT supervise_id_internship_fkey FOREIGN KEY (id_internship) REFERENCES public.internship(id_internship);


--
-- Name: supervise supervise_id_student_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.supervise
    ADD CONSTRAINT supervise_id_student_fkey FOREIGN KEY (id_student) REFERENCES public.student(id_member);


--
-- Name: supervise supervise_id_supervisor_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.supervise
    ADD CONSTRAINT supervise_id_supervisor_fkey FOREIGN KEY (id_supervisor) REFERENCES public.supervisor(id_member);


--
-- Name: supervisor supervisor_id_member_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.supervisor
    ADD CONSTRAINT supervisor_id_member_fkey FOREIGN KEY (id_member) REFERENCES public.member(id_member);


--
-- Name: teach teach_id_class_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teach
    ADD CONSTRAINT teach_id_class_fkey FOREIGN KEY (id_class) REFERENCES public.class(id_class);


--
-- Name: teach teach_id_member_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teach
    ADD CONSTRAINT teach_id_member_fkey FOREIGN KEY (id_member) REFERENCES public.professor(id_member);


--
-- Name: team team_id_prof_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.team
    ADD CONSTRAINT team_id_prof_fkey FOREIGN KEY (id_prof) REFERENCES public.professor(id_member);


--
-- Name: team team_id_project_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.team
    ADD CONSTRAINT team_id_project_fkey FOREIGN KEY (id_project) REFERENCES public.project(id_project);


--
-- Name: team_student team_student_id_team_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.team_student
    ADD CONSTRAINT team_student_id_team_fkey FOREIGN KEY (id_team) REFERENCES public.team(id_team);


--
-- Name: team_student team_student_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.team_student
    ADD CONSTRAINT team_student_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student(id_member);


--
-- PostgreSQL database dump complete
--

