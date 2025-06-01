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
    start_date date DEFAULT CURRENT_DATE,
    sector_id character varying(100) NOT NULL
);


--
-- Name: coach; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.coach (
    id_member character varying(100) NOT NULL,
    field character varying(50)
);


--
-- Name: evaluations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.evaluations (
    id_evaluation integer NOT NULL,
    note_skill double precision,
    skill_name character varying(100) NOT NULL
);


--
-- Name: follow_up; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.follow_up (
    id_coach character varying(100) NOT NULL,
    id_student character varying(100) NOT NULL,
    id_solution integer NOT NULL,
    message character varying(1000),
    start_date date DEFAULT CURRENT_DATE,
    date_done date
);


--
-- Name: internship; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.internship (
    id_internship integer NOT NULL,
    date_start date,
    date_done date,
    subject_internship character varying(100)
);


--
-- Name: internship_id_internship_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.internship_id_internship_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: internship_id_internship_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.internship_id_internship_seq OWNED BY public.internship.id_internship;


--
-- Name: member; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.member (
    id_member character varying(100) NOT NULL,
    cin character varying(50),
    phone character varying(50),
    password character varying(255) NOT NULL,
    role character varying(50) NOT NULL,
    full_name character varying(50),
    email character varying(50) NOT NULL,
    profile_picture character varying(100),
    description character varying(1000),
    date_add timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT member_role_check CHECK (((role)::text = ANY ((ARRAY['admin'::character varying, 'student'::character varying, 'Supervisor'::character varying, 'Professor'::character varying, 'coach'::character varying])::text[])))
);


--
-- Name: news; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.news (
    id_news integer NOT NULL,
    id_member character varying(100),
    message character varying(1000),
    type character varying(50),
    date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT news_type_check CHECK (((type)::text = ANY ((ARRAY['admin'::character varying, 'Professor'::character varying])::text[])))
);


--
-- Name: news_id_news_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.news_id_news_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: news_id_news_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.news_id_news_seq OWNED BY public.news.id_news;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notifications (
    id_notification integer NOT NULL,
    content_notification character varying(100),
    date_notification timestamp without time zone,
    id_member character varying(100),
    id_reporter character varying(100)
);


--
-- Name: notifications_id_notification_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.notifications_id_notification_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: notifications_id_notification_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.notifications_id_notification_seq OWNED BY public.notifications.id_notification;


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
    id_project integer NOT NULL,
    description_project character varying(1000),
    date_project date,
    subject_project character varying(1000),
    id_prof character varying(100) NOT NULL
);


--
-- Name: project_id_project_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.project_id_project_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: project_id_project_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.project_id_project_seq OWNED BY public.project.id_project;


--
-- Name: rate; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rate (
    id_rate integer NOT NULL,
    id_member character varying(100)
);


--
-- Name: rate_id_rate_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.rate_id_rate_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: rate_id_rate_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.rate_id_rate_seq OWNED BY public.rate.id_rate;


--
-- Name: report; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.report (
    id_reporter character varying(100) NOT NULL,
    id_reported character varying(100) NOT NULL,
    id_signal integer NOT NULL
);


--
-- Name: sector; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sector (
    id_sector character varying(100) NOT NULL,
    description character varying(2000),
    id_admin character varying(100)
);


--
-- Name: signal; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.signal (
    id_signal integer NOT NULL,
    approved boolean,
    message character varying(1000),
    anony boolean,
    option_signal character varying(100),
    id_solution integer,
    id_member character varying(100),
    date_add date DEFAULT CURRENT_DATE,
    solution_state character varying(100)
);


--
-- Name: signal_id_signal_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.signal_id_signal_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: signal_id_signal_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.signal_id_signal_seq OWNED BY public.signal.id_signal;


--
-- Name: skill; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.skill (
    skill_name character varying(100) NOT NULL,
    description_skill character varying(1000),
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
    id_internship integer,
    id_class character varying(100),
    id_team integer,
    id_student character varying(100),
    id_evaluator character varying(100),
    date_add date DEFAULT CURRENT_DATE,
    evaluation_context character varying(100),
    CONSTRAINT skill_evaluation_evaluation_context_check CHECK (((evaluation_context)::text = ANY ((ARRAY['class'::character varying, 'project'::character varying, 'internship'::character varying])::text[]))),
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
    id_solution integer NOT NULL,
    option_solution character varying(100),
    subject_solution character varying(100),
    periode character varying(100),
    state character varying(100) DEFAULT 'New'::character varying,
    CONSTRAINT solution_state_check CHECK (((state)::text = ANY ((ARRAY['New'::character varying, 'Approved'::character varying, 'Rejected'::character varying])::text[])))
);


--
-- Name: solution_id_solution_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.solution_id_solution_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: solution_id_solution_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.solution_id_solution_seq OWNED BY public.solution.id_solution;


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
    id_internship integer NOT NULL
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
    id_team integer NOT NULL,
    note double precision,
    id_prof character varying(100) NOT NULL,
    id_project integer
);


--
-- Name: team_id_team_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.team_id_team_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: team_id_team_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.team_id_team_seq OWNED BY public.team.id_team;


--
-- Name: team_student; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.team_student (
    id_team integer NOT NULL,
    student_id character varying(100) NOT NULL
);


--
-- Name: internship id_internship; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.internship ALTER COLUMN id_internship SET DEFAULT nextval('public.internship_id_internship_seq'::regclass);


--
-- Name: news id_news; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news ALTER COLUMN id_news SET DEFAULT nextval('public.news_id_news_seq'::regclass);


--
-- Name: notifications id_notification; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id_notification SET DEFAULT nextval('public.notifications_id_notification_seq'::regclass);


--
-- Name: project id_project; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project ALTER COLUMN id_project SET DEFAULT nextval('public.project_id_project_seq'::regclass);


--
-- Name: rate id_rate; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rate ALTER COLUMN id_rate SET DEFAULT nextval('public.rate_id_rate_seq'::regclass);


--
-- Name: signal id_signal; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.signal ALTER COLUMN id_signal SET DEFAULT nextval('public.signal_id_signal_seq'::regclass);


--
-- Name: skill_evaluation id_evaluation; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.skill_evaluation ALTER COLUMN id_evaluation SET DEFAULT nextval('public.skill_evaluation_id_evaluation_seq'::regclass);


--
-- Name: solution id_solution; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solution ALTER COLUMN id_solution SET DEFAULT nextval('public.solution_id_solution_seq'::regclass);


--
-- Name: team id_team; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.team ALTER COLUMN id_team SET DEFAULT nextval('public.team_id_team_seq'::regclass);


--
-- Data for Name: admin; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.admin (id_member, assigned_zone) FROM stdin;
M001	info
\.


--
-- Data for Name: class; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.class (id_class, start_date, sector_id) FROM stdin;
CLS001	2025-05-03	SEC001
GINF1	2025-05-05	CI1
GIND1	2025-05-05	CI1
CYS1	2025-05-05	CI1
\.


--
-- Data for Name: coach; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.coach (id_member, field) FROM stdin;
4cf96e59-1cca-46b1-8cff-2bfa379b1e95	Informatique
\.


--
-- Data for Name: evaluations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.evaluations (id_evaluation, note_skill, skill_name) FROM stdin;
7	8.5	Communication
7	9	Teamwork
7	7.5	Problem-solving
7	8.3	Time Management
7	8.8	Critical Thinking
7	9.2	Creativity
\.


--
-- Data for Name: follow_up; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.follow_up (id_coach, id_student, id_solution, message, start_date, date_done) FROM stdin;
4cf96e59-1cca-46b1-8cff-2bfa379b1e95	da93bdeb-a589-4bd3-9138-a207f691c62b	2	I recommend scheduling a session with a licensed psychologist 	2025-05-01	2025-06-15
\.


--
-- Data for Name: internship; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.internship (id_internship, date_start, date_done, subject_internship) FROM stdin;
1	2025-05-01	2025-08-01	Création d'une application 
\.


--
-- Data for Name: member; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.member (id_member, cin, phone, password, role, full_name, email, profile_picture, description, date_add) FROM stdin;
M002	CIN002	0600000002	$2b$10$lXwUpW569qS9f4ICGYeTnOwR0k5mDC16gw3dz86tY9ot9I4FTloNO	admin	Soukaina Elouansaidi	elouansaidisoukaina@gmail.com	soukaina.jpg	Admin secondaire	2025-05-03 15:54:01.377623
M003	\N	\N	pass	student	\N	email	\N	\N	2025-05-03 20:03:51.815812
P004	AA123456	0600123456	$2b$10$lXwUpW569qS9f4ICGYeTnOwR0k5mDC16gw3dz86tY9ot9I4FTloNO	Professor	Youssef El Fassi	youssef.fassi@example.com	youssef.jpg	Étudiant en génie informatique	2025-05-03 23:02:42.749681
S100	ST123456	0611122233	hashed_pwd123	student	Imane Benali	imane.benali@example.com	imane.jpg	Étudiante en 1ère année GI	2025-05-03 23:26:53.03388
1e6edf29-9b83-4080-9963-31e50ddf46a8	c1245	\N	$2b$10$z3R5A1GlxbfWQURN0KVyeOpbhYdiZr/hCn93GDbC21MZ4l2iqpkhO	Professor	ghailani	ghailani@gmail.com	uploads\\1746403702580-R.png	nouveau	2025-05-05 00:13:36.967843
da93bdeb-a589-4bd3-9138-a207f691c62b	CIN653	\N	$2b$10$vMk20kgZwo4VYWZsAmxXo.FtuUN/joMukeTbetOAsBlT18qIsp2MK	student	hamza 	hamza@gamil.com	uploads\\1746404178323-R.png	nouveau 	2025-05-05 00:21:32.703476
4cf96e59-1cca-46b1-8cff-2bfa379b1e95	AB12456	\N	$2b$10$FJiwb6rA8GbqWoz24Iu./uFosB7FLhamWkOp3AQZrSX9tCajyEEd.	coach	Omar Benjelloun	omar.benjelloun@example.com	\N	Professeur expérimenté en développement web.	2025-05-05 10:28:29.096535
c01e7026-20df-49b5-aa54-df62b1b0771f	AB123456	\N	$2b$10$2PNjO9Bl.a8HiqUkIZKdNO2lbTcmSl92gt54tSeNeUpw/.YZCyz36	Supervisor	Ali Ben Salah	ali.salah@example.com	uploads\\1746441778868-R.png	Projet très important pour le département IT.	2025-05-05 10:48:13.761072
M001	CIN001	0600000001	$2b$10$lXwUpW569qS9f4ICGYeTnOwR0k5mDC16gw3dz86tY9ot9I4FTloNO	admin	Nada	eloukili.nada@etu.uae.ac.ma	nada.jpg	Admin principale	2025-05-03 15:54:01.377623
\.


--
-- Data for Name: news; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.news (id_news, id_member, message, type, date) FROM stdin;
11	M001	Création d’un nouveau programme de formation pour les étudiants.	\N	2025-05-03 19:49:01.69892
12	M001	Mise à jour des informations de la salle B.	\N	2025-05-03 19:49:01.69892
13	M001	Signalement d’un étudiant ayant perturbé le cours.	\N	2025-05-03 19:49:01.69892
14	M002	Demande d’intervention pour du matériel pédagogique manquant.	\N	2025-05-03 19:49:01.69892
15	M002	Suppression d’un compte utilisateur inactif.	\N	2025-05-03 19:49:01.69892
16	M001	Création d’un nouveau programme de formation pour les étudiants.	admin	2025-05-03 20:17:35.255732
17	M002	Mise à jour des informations de la salle B.	admin	2025-05-03 20:17:35.255732
18	M002	Signalement d’un étudiant ayant perturbé le cours.	Professor	2025-05-03 20:17:35.255732
19	M002	Demande d’intervention pour du matériel pédagogique manquant.	Professor	2025-05-03 20:17:35.255732
20	M001	Suppression d’un compte utilisateur inactif.	admin	2025-05-03 20:17:35.255732
21	M001	Création nouveau programme de formation pour les étudiants.	admin	2024-01-01 00:00:00
23	M001	Création nouveau programme de formation pour les étudiants.	Professor	2024-01-01 00:00:00
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.notifications (id_notification, content_notification, date_notification, id_member, id_reporter) FROM stdin;
2	I recommend scheduling a session with a licensed psychologist 	\N	da93bdeb-a589-4bd3-9138-a207f691c62b	\N
3	 Important : vous devez venir demain à l'administration à 10h.  	\N	da93bdeb-a589-4bd3-9138-a207f691c62b	da93bdeb-a589-4bd3-9138-a207f691c62b
\.


--
-- Data for Name: professor; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.professor (id_member, department, code) FROM stdin;
1e6edf29-9b83-4080-9963-31e50ddf46a8	\N	100
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
da93bdeb-a589-4bd3-9138-a207f691c62b	da93bdeb-a589-4bd3-9138-a207f691c62b	1
da93bdeb-a589-4bd3-9138-a207f691c62b	da93bdeb-a589-4bd3-9138-a207f691c62b	2
\.


--
-- Data for Name: sector; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sector (id_sector, description, id_admin) FROM stdin;
SEC001	Filière Génie Informatique et Réseaux	M001
CI1	Cycle d'Ingenieure 1	M001
\.


--
-- Data for Name: signal; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.signal (id_signal, approved, message, anony, option_signal, id_solution, id_member, date_add, solution_state) FROM stdin;
2	f	signal2	\N	\N	\N	\N	2025-03-11	\N
1	f	signal 	\N	\N	2	\N	2025-05-05	in progress
\.


--
-- Data for Name: skill; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.skill (skill_name, description_skill, question1, question2, question3, id_admin) FROM stdin;
Communication	Ability to convey ideas clearly and understandably.	Does this person express their ideas clearly and understandably?	Do they listen actively and let others finish speaking?	Do they adapt their communication style depending on the audience?	M001
Teamwork	Ability to collaborate and contribute effectively in group settings.	Does this person collaborate effectively with teammates?	Are they open to others’ ideas and feedback?	Do they support the team in achieving common goals?	M001
Problem-solving	Ability to address challenges analytically and effectively.	Does this person approach problems calmly and analytically?	Do they contribute useful solutions when challenges arise?	Are they willing to seek help or input when needed?	M001
Time Management	Skill in prioritizing and managing tasks efficiently.	Does this person prioritize tasks effectively to meet deadlines?	Does this person allocate time appropriately across multiple responsibilities?	Does this person avoid unnecessary delays or procrastination?	M001
Critical Thinking	Capacity to analyze and evaluate information constructively.	Does this person analyze information carefully before forming conclusions?	Does this person question assumptions or challenge ideas constructively?	Does this person evaluate the strengths and weaknesses of arguments or solutions?	M001
Creativity	Ability to generate and explore innovative ideas and solutions.	Does this person generate original or innovative ideas?	Does this person approach tasks with imagination or out-of-the-box thinking?	Does this person explore multiple possibilities before settling on a solution?	M001
\.


--
-- Data for Name: skill_evaluation; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.skill_evaluation (id_evaluation, note_evaluation, type_evaluation, comment_evaluation, id_internship, id_class, id_team, id_student, id_evaluator, date_add, evaluation_context) FROM stdin;
7	4.7	Professor	Bonne participation en classe	\N	CLS001	\N	S100	P004	2025-05-03	class
8	4.7	Professor	Bonne participation en classe	\N	CLS001	\N	S100	P004	2025-05-03	class
4	17.2	Professor	Très bon travail.	\N	GINF1	\N	M001	M002	2025-05-03	\N
3	17.2	Professor	Très bon travail.	\N	GINF1	\N	da93bdeb-a589-4bd3-9138-a207f691c62b	M001	2025-05-03	\N
\.


--
-- Data for Name: solution; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.solution (id_solution, option_solution, subject_solution, periode, state) FROM stdin;
1	therapy_recommended	therapy_recommended..	\N	New
2	Tutoring Support	L'étudiant a été orienté vers un coach pour suivi psychologique.	\N	New
\.


--
-- Data for Name: student; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.student (id_member, cne, id_class) FROM stdin;
M001	\N	\N
M002	\N	\N
S100	CNE789456	CLS001
da93bdeb-a589-4bd3-9138-a207f691c62b	p1373	GINF1
\.


--
-- Data for Name: supervise; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.supervise (id_supervisor, id_student, id_internship) FROM stdin;
c01e7026-20df-49b5-aa54-df62b1b0771f	da93bdeb-a589-4bd3-9138-a207f691c62b	1
\.


--
-- Data for Name: supervisor; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.supervisor (id_member, registration_number, company, "position") FROM stdin;
c01e7026-20df-49b5-aa54-df62b1b0771f	0600123456	Tech Solutions	Senior Engineer
\.


--
-- Data for Name: teach; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.teach (id_member, id_class, course) FROM stdin;
1e6edf29-9b83-4080-9963-31e50ddf46a8	GINF1	Mathématiques
1e6edf29-9b83-4080-9963-31e50ddf46a8	GIND1	Programmation
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
-- Name: internship_id_internship_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.internship_id_internship_seq', 1, true);


--
-- Name: news_id_news_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.news_id_news_seq', 23, true);


--
-- Name: notifications_id_notification_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.notifications_id_notification_seq', 3, true);


--
-- Name: project_id_project_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.project_id_project_seq', 1, false);


--
-- Name: rate_id_rate_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.rate_id_rate_seq', 1, false);


--
-- Name: signal_id_signal_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.signal_id_signal_seq', 2, true);


--
-- Name: skill_evaluation_id_evaluation_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.skill_evaluation_id_evaluation_seq', 8, true);


--
-- Name: solution_id_solution_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.solution_id_solution_seq', 2, true);


--
-- Name: team_id_team_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.team_id_team_seq', 1, false);


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
-- Name: evaluations evaluations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evaluations
    ADD CONSTRAINT evaluations_pkey PRIMARY KEY (id_evaluation, skill_name);


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
-- Name: news news_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_pkey PRIMARY KEY (id_news);


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
-- Name: evaluations evaluations_id_evaluation_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evaluations
    ADD CONSTRAINT evaluations_id_evaluation_fkey FOREIGN KEY (id_evaluation) REFERENCES public.skill_evaluation(id_evaluation);


--
-- Name: evaluations evaluations_skill_name_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.evaluations
    ADD CONSTRAINT evaluations_skill_name_fkey FOREIGN KEY (skill_name) REFERENCES public.skill(skill_name);


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
-- Name: news news_id_member_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_id_member_fkey FOREIGN KEY (id_member) REFERENCES public.member(id_member);


--
-- Name: notifications notifications_id_member_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_id_member_fkey FOREIGN KEY (id_member) REFERENCES public.member(id_member);


--
-- Name: notifications notifications_id_reporter_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_id_reporter_fkey FOREIGN KEY (id_reporter) REFERENCES public.member(id_member);


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
    ADD CONSTRAINT signal_id_member_fkey FOREIGN KEY (id_member) REFERENCES public.member(id_member);


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
-- Name: skill skill_id_admin_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.skill
    ADD CONSTRAINT skill_id_admin_fkey FOREIGN KEY (id_admin) REFERENCES public.admin(id_member);


--
-- Name: student student_id_class_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_id_class_fkey FOREIGN KEY (id_class) REFERENCES public.class(id_class);


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

