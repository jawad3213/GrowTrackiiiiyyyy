--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

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
    id_prof character varying(100) NOT NULL,
    end_date date,
    id_class character varying(100),
    name_project character varying(100),
    id_sector character varying(100),
    group_number integer
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
    id_project integer,
    team_name character varying(100)
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
M006	\N
ADM001	Informatique et Systèmes
ADM002	Filières Ingénierie
ADM003	Sciences et Technologies
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
ginf1	2023-09-01	CI1
gind1	2023-09-01	CI1
cys1	2023-09-01	CI1
gsea1	2023-09-01	CI1
gsr1	2023-09-01	CI1
ginf2	2023-09-01	CI2
gind2	2023-09-01	CI2
cys2	2023-09-01	CI2
gsea2	2023-09-01	CI2
gsr2	2023-09-01	CI2
ginf3	2023-09-01	CI3
gind3	2023-09-01	CI3
cys3	2023-09-01	CI3
gsea3	2023-09-01	CI3
gsr3	2023-09-01	CI3
td1	2023-09-01	AP1
td2	2023-09-01	AP1
td3	2023-09-01	AP1
td4	2023-09-01	AP2
td5	2023-09-01	AP2
td6	2023-09-01	AP2
hello1	2025-05-31	Hello
b4	2025-05-31	Hello
GINF4	2025-05-31	AP3
GINF5	2025-05-31	AP3
\.


--
-- Data for Name: coach; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.coach (id_member, field) FROM stdin;
4cf96e59-1cca-46b1-8cff-2bfa379b1e95	Informatique
14e80305-c60c-42e7-ab1b-625c34599455	Informatique
COA001	Développement personnel
COA002	Leadership
COA003	Communication
b1ac018d-8590-47cd-9d32-f9d7251b191c	GINF1
\.


--
-- Data for Name: evaluations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.evaluations (id_evaluation, note_skill, skill_name) FROM stdin;
1	8.2	Communication
1	7.9	Teamwork
1	9.1	Problem-Solving
2	6.7	Communication
2	8.3	Problem-Solving
3	9	Critical Thinking
3	7.5	Time Management
4	8.9	Teamwork
4	9.3	Critical Thinking
5	6.8	Communication
5	7.2	Time Management
6	9.1	Teamwork
6	8	Time Management
7	7.6	Critical Thinking
7	7.4	Time Management
8	9.5	Critical Thinking
8	8.7	Problem-Solving
9	7.9	Teamwork
9	8.1	Communication
10	9.6	Communication
10	9.2	Critical Thinking
11	6.4	Time Management
11	7	Creativity
12	7.8	Communication
12	8.6	Critical Thinking
13	9.3	Critical Thinking
13	7.7	Problem-Solving
14	8.8	Time Management
14	9.1	Critical Thinking
15	8	Teamwork
15	8.9	Critical Thinking
16	9.7	Time Management
16	8.4	Creativity
17	7.3	Communication
17	9	Critical Thinking
18	8.5	Creativity
18	7.6	Teamwork
19	6.9	Critical Thinking
19	8.8	Time Management
20	9.2	Communication
20	8.6	Critical Thinking
21	9.3	Critical Thinking
21	9.1	Time Management
22	9	Teamwork
22	8.2	Communication
23	7.4	Critical Thinking
23	7.1	Teamwork
24	8.7	Time Management
24	6.5	Communication
25	9.2	Critical Thinking
25	8.5	Problem-Solving
26	8.3	Communication
26	7.9	Teamwork
26	9.1	Problem-Solving
26	8.5	Time Management
26	9	Critical Thinking
26	8.7	Creativity
27	7.8	Communication
27	8.4	Teamwork
27	8.9	Problem-Solving
27	9.2	Time Management
27	9.4	Critical Thinking
27	9	Creativity
28	9	Communication
28	8.1	Teamwork
28	7.5	Problem-Solving
28	8	Time Management
28	8.6	Critical Thinking
28	8.3	Creativity
\.


--
-- Data for Name: follow_up; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.follow_up (id_coach, id_student, id_solution, message, start_date, date_done) FROM stdin;
COA001	STU001	1	Séances hebdomadaires de tutorat en programmation	2023-10-20	2023-12-20
COA002	STU004	2	Ateliers de renforcement en mathématiques deux fois par semaine	2023-11-25	2024-01-25
COA003	STU011	3	Séances de gestion du stress et techniques de relaxation	2023-12-10	\N
COA001	STU003	5	Sessions personnalisées sur les algorithmes complexes	2023-11-05	2024-01-10
COA002	STU009	9	Médiation et résolution de conflits au sein de l'équipe	2024-01-25	2024-02-15
COA003	STU020	3	Programme d'intégration et activités de groupe	2023-11-15	2023-12-30
COA001	STU013	9	Ateliers de communication et travail d'équipe	2024-01-30	\N
COA002	STU015	3	Formation en techniques de présentation et prise de parole	2023-12-15	2024-02-15
COA003	STU008	5	Tutorat en data mining et analyse de données	2023-11-20	2024-01-20
COA001	STU016	8	Accompagnement dans la gestion du projet de sécurité	2024-03-05	\N
\.


--
-- Data for Name: internship; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.internship (id_internship, date_start, date_done, subject_internship) FROM stdin;
1	2025-05-01	2025-08-01	Création d'une application 
2	2023-07-01	2023-08-31	Analyse de données clients pour Attijariwafa Bank
3	2023-07-01	2023-08-31	Optimisation des processus IT chez OCP Group
4	2023-07-01	2023-08-31	Renforcement de la sécurité informatique chez CIH Bank
5	2023-07-01	2023-08-31	Développement d'API pour les services cloud d'Inwi
6	2024-07-01	2024-08-31	Intelligence artificielle appliquée aux télécommunications
7	2024-07-01	2024-08-31	Blockchain pour les services financiers
8	2024-07-01	2024-08-31	Internet des objets industriels
9	2024-07-01	2024-08-31	Cybersécurité des infrastructures critiques
10	2024-07-01	2024-08-31	Cloud computing pour applications mobiles
\.


--
-- Data for Name: member; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.member (id_member, cin, phone, password, role, full_name, email, profile_picture, description, date_add) FROM stdin;
M002	CIN002	0600000002	$2b$10$lXwUpW569qS9f4ICGYeTnOwR0k5mDC16gw3dz86tY9ot9I4FTloNO	admin	Soukaina Elouansaidi	elouansaidisoukaina@gmail.com	soukaina.jpg	Admin secondaire	2025-05-03 15:54:01.377623
M003	\N	\N	pass	student	\N	email	\N	\N	2025-05-03 20:03:51.815812
P004	AA123456	0600123456	$2b$10$lXwUpW569qS9f4ICGYeTnOwR0k5mDC16gw3dz86tY9ot9I4FTloNO	Professor	Youssef El Fassi	youssef.fassi@example.com	youssef.jpg	Étudiant en génie informatique	2025-05-03 23:02:42.749681
4cf96e59-1cca-46b1-8cff-2bfa379b1e95	AB12456	\N	$2b$10$FJiwb6rA8GbqWoz24Iu./uFosB7FLhamWkOp3AQZrSX9tCajyEEd.	coach	Omar Benjelloun	omar.benjelloun@example.com	\N	Professeur expérimenté en développement web.	2025-05-05 10:28:29.096535
7ba19de9-a3b5-45fc-b64b-bdb68799088e	CIN6590	\N	$2b$10$saf/DuMGWEMgTc92K28ui.ER7RrnFmSyg6mqmv5S9CFC6j5yfy2Dm	student	khaled 	khaled@gamil.com	\N	nouveau 	2025-05-08 11:54:10.880063
M006	\N	\N	1234	admin	hamza	hamza1@gmail.com	\N	\N	2025-05-11 20:56:23.183266
1187420c-f668-4056-bde5-c13d30c67162	Kfdf	\N	$2b$10$Zk5CCoSfnPezqYlmU4W0IO.IZ.qKMkxGCQQfk3L4VISpRk4D4KfHK	student	Salman	salman@gmail.com	\N	Hello everyone	2025-05-13 00:45:25.111824
fb594a87-e90e-4240-b3f4-7e4489577c9f	test	\N	$2b$10$m7ElqSfJknQ4GZEyJ9j1reSyKH0q8E0zi.ZyFxTUPXAGIgalwdCzO	student	Salman	helloi@gmail.com	\N	fdafdaf	2025-05-13 00:48:21.839506
5942bf3a-a344-4515-a6f0-54c04f0ce750	K87785544	\N	$2b$10$Q706NBFT9bD9/NZG4uOXX.fuEUddVv0LMrbNeVjc/vvNwpoEc3aJO	student	Salman	salmanhello@gmail.com	\N	Hello	2025-05-13 12:00:52.331791
bbed467a-f2b0-45f8-9c5d-8b1f5f8f8fc0	K877421311	\N	$2b$10$21Bes/i/h6IQlpKZ5s8ExeDiwBAXldLRKI6dExNZu5EQWMK51l2NG	student	Salman	salmanhello2313@gmail.com	\N	Hello	2025-05-13 12:02:50.672687
14e80305-c60c-42e7-ab1b-625c34599455	K74302	\N	$2b$10$ufj/t9tb/bojmQczAZUBUeJCUeJ3B7XUjXteKfNlK0qR2gj6BLPzq	coach	Helo	elo@gmailc.oj	\N	jfkldja;l	2025-05-13 18:01:32.48775
ADM001	AB123456	0661234567	$2a$10$abcdefghijklmnopqrstuv	admin	Karim Bensouda	karim.bensouda@univ.ma	profile_karim.jpg	Administrateur principal - Responsable informatique	2023-01-15 09:00:00
ADM002	CD789012	0662345678	$2a$10$bcdefghijklmnopqrstuvw	admin	Samira Alaoui	samira.alaoui@univ.ma	profile_samira.jpg	Administratrice des affaires académiques	2023-01-20 10:30:00
ADM003	EF345678	0663456789	$2a$10$cdefghijklmnopqrstuvwx	admin	Younes Kabbaj	younes.kabbaj@univ.ma	profile_younes.jpg	Administrateur des filières scientifiques	2023-02-01 08:45:00
PRF002	IJ567890	0665678901	$2a$10$efghijklmnopqrstuvwxyz	Professor	Dr. Fatima Zahra Mernissi	fatima.mernissi@univ.ma	profile_fatima.jpg	Professeure en Sciences de Données	2023-01-08 13:20:00
S100	ST123456	0611122233	hashed_pwd123	student	Imane Benali Updated	imane.benali@example.com	imane.jpg	Étudiante en 1ère année GI	2025-05-03 23:26:53.03388
M001	CIN001	0600000001	$2b$10$lXwUpW569qS9f4ICGYeTnOwR0k5mDC16gw3dz86tY9ot9I4FTloNO	admin	Nadad	eloukili.nada@etu.uae.ac.ma	nada.jpg	Admin principale	2025-05-03 15:54:01.377623
da93bdeb-a589-4bd3-9138-a207f691c62b	CIN125433	\N	$2b$10$vMk20kgZwo4VYWZsAmxXo.FtuUN/joMukeTbetOAsBlT18qIsp2MK	student	hamza 	hamza@gamil.co	uploads\\1746404178323-R.png	nouveau 	2025-05-05 00:21:32.703476
PRF001	GH901234	0664567890	$2b$10$lXwUpW569qS9f4ICGYeTnOwR0k5mDC16gw3dz86tY9ot9I4FTloNO	Professor	Dr. Hassan Benjelloun	hassan.benjelloun@univ.ma	profile_hassan.jpg	Professeur en Informatique - Spécialiste en IA	2023-01-05 11:15:00
PRF003	KL123456	0666789012	$2a$10$fghijklmnopqrstuvwxyza	Professor	Dr. Mohammed Chaoui	mohammed.chaoui@univ.ma	profile_mohammed.jpg	Professeur en Réseaux et Sécurité	2023-01-12 14:30:00
PRF004	MN789012	0667890123	$2a$10$ghijklmnopqrstuvwxyzab	Professor	Dr. Laila Bennani	laila.bennani@univ.ma	profile_laila.jpg	Professeure en Génie Logiciel	2023-01-18 09:45:00
PRF005	OP345678	0668901234	$2a$10$hijklmnopqrstuvwxyzabc	Professor	Dr. Nabil El Fasi	nabil.elfasi@univ.ma	profile_nabil.jpg	Professeur en Mathématiques Appliquées	2023-02-05 10:15:00
SUP001	QR901234	0669012345	$2a$10$ijklmnopqrstuvwxyzabcd	Supervisor	Rachid Tazi	rachid.tazi@maroctelecom.ma	profile_rachid.jpg	Chef de Projet chez Maroc Telecom	2023-02-10 11:30:00
SUP002	ST567890	0670123456	$2a$10$jklmnopqrstuvwxyzabcde	Supervisor	Nadia Cherkaoui	nadia.cherkaoui@attijariwafa.ma	profile_nadia.jpg	Directrice IT chez Attijariwafa Bank	2023-02-15 13:45:00
SUP003	UV123456	0671234567	$2a$10$klmnopqrstuvwxyzabcdef	Supervisor	Omar Benali	omar.benali@ocp.ma	profile_omar.jpg	Ingénieur Systèmes chez OCP Group	2023-02-20 14:15:00
SUP004	WX789012	0672345678	$2a$10$lmnopqrstuvwxyzabcdefg	Supervisor	Salma Bouazizi	salma.bouazizi@cih.ma	profile_salma.jpg	Responsable Cybersécurité chez CIH Bank	2023-03-01 09:30:00
COA001	AB876543	0674567890	$2a$10$nopqrstuvwxyzabcdefghi	coach	Amal Fassi	amal.fassi@univ.ma	profile_amal.jpg	Coach en développement personnel et professionnel	2023-03-10 11:15:00
COA002	CD654321	0675678901	$2a$10$opqrstuvwxyzabcdefghij	coach	Tariq Benjelloun	tariq.benjelloun@univ.ma	profile_tariq.jpg	Coach en leadership et travail d 'équipe	2023-03-15 13:30:00
COA003	EF432109	0676789012	$2a$10$pqrstuvwxyzabcdefghijk	coach	Houda Bekkali	houda.bekkali@univ.ma	profile_houda.jpg	Coach en communication et gestion du stress	2023-03-20 14:45:00
STU001	GH210987	0677890123	$2a$10$qrstuvwxyzabcdefghijkl	student	Youssef Benabdallah	youssef.benabdallah@student.univ.ma	profile_youssef.jpg	Étudiant en Génie Informatique	2023-09-01 08:00:00
STU002	IJ098765	0678901234	$2a$10$rstuvwxyzabcdefghijklm	student	Imane Chahid	imane.chahid@student.univ.ma	profile_imane.jpg	Étudiante en Data Science	2023-09-01 08:15:00
STU003	KL876543	0679012345	$2a$10$stuvwxyzabcdefghijklmn	student	Amine Rahmani	amine.rahmani@student.univ.ma	profile_amine.jpg	Étudiant en Réseaux et Systèmes	2023-09-01 08:30:00
STU004	MN654321	0680123456	$2a$10$tuvwxyzabcdefghijklmno	student	Yasmine Tazi	yasmine.tazi@student.univ.ma	profile_yasmine.jpg	Étudiante en Génie Logiciel	2023-09-01 08:45:00
STU005	OP432109	0681234567	$2a$10$uvwxyzabcdefghijklmnop	student	Mehdi Ouazzani	mehdi.ouazzani@student.univ.ma	profile_mehdi.jpg	Étudiant en Intelligence Artificielle	2023-09-01 09:00:00
STU006	QR210987	0682345678	$2a$10$vwxyzabcdefghijklmnopq	student	Hajar Mansouri	hajar.mansouri@student.univ.ma	profile_hajar.jpg	Étudiante en Cybersécurité	2023-09-01 09:15:00
STU007	ST098765	0683456789	$2a$10$wxyzabcdefghijklmnopqr	student	Karim Zidani	karim.zidani@student.univ.ma	profile_karimz.jpg	Étudiant en Développement Web	2023-09-01 09:30:00
STU008	UV876543	0684567890	$2a$10$xyzabcdefghijklmnopqrs	student	Leila Benjelloun	leila.benjelloun@student.univ.ma	profile_leilab.jpg	Étudiante en Business Intelligence	2023-09-01 09:45:00
STU009	WX654321	0685678901	$2a$10$yzabcdefghijklmnopqrst	student	Omar Fadil	omar.fadil@student.univ.ma	profile_omarf.jpg	Étudiant en Systèmes Embarqués	2023-09-01 10:00:00
STU010	YZ432109	0686789012	$2a$10$zabcdefghijklmnopqrstu	student	Safia Idrissi	safia.idrissi@student.univ.ma	profile_safia.jpg	Étudiante en Cloud Computing	2023-09-01 10:15:00
STU011	AC987654	0687890123	$2a$10$abcdefghijklmnopqrstuv	student	Bilal Kadiri	bilal.kadiri@student.univ.ma	profile_bilal.jpg	Étudiant en Génie Informatique	2023-09-01 10:30:00
STU012	CD765432	0688901234	$2a$10$bcdefghijklmnopqrstuvw	student	Fatima Mouhib	fatima.mouhib@student.univ.ma	profile_fatimam.jpg	Étudiante en Data Science	2023-09-01 10:45:00
STU013	EF543210	0689012345	$2a$10$cdefghijklmnopqrstuvwx	student	Nabil Chaoui	nabil.chaoui@student.univ.ma	profile_nabilc.jpg	Étudiant en Réseaux et Systèmes	2023-09-01 11:00:00
STU014	GH321098	0690123456	$2a$10$defghijklmnopqrstuvwxy	student	Hiba Lemkadem	hiba.lemkadem@student.univ.ma	profile_hiba.jpg	Étudiante en Génie Logiciel	2023-09-01 11:15:00
STU015	IJ109876	0691234567	$2a$10$efghijklmnopqrstuvwxyz	student	Tarik Doukkali	tarik.doukkali@student.univ.ma	profile_tarik.jpg	Étudiant en Intelligence Artificielle	2023-09-01 11:30:00
STU016	KL987654	0692345678	$2a$10$fghijklmnopqrstuvwxyza	student	Zineb El Alaoui	zineb.elalaoui@student.univ.ma	profile_zineb.jpg	Étudiante en Cybersécurité	2023-09-01 11:45:00
STU017	MN765432	0693456789	$2a$10$ghijklmnopqrstuvwxyzab	student	Hamid Touati	hamid.touati@student.univ.ma	profile_hamid.jpg	Étudiant en Développement Web	2023-09-01 12:00:00
STU018	OP543210	0694567890	$2a$10$hijklmnopqrstuvwxyzabc	student	Salma Berrada	salma.berrada@student.univ.ma	profile_salmab.jpg	Étudiante en Business Intelligence	2023-09-01 12:15:00
STU019	QR321098	0695678901	$2a$10$ijklmnopqrstuvwxyzabcd	student	Yassine Bennis	yassine.bennis@student.univ.ma	profile_yassine.jpg	Étudiant en Systèmes Embarqués	2023-09-01 12:30:00
STU020	ST109876	0696789012	$2a$10$jklmnopqrstuvwxyzabcde	student	Amal Tahiri	amal.tahiri@student.univ.ma	profile_amalt.jpg	Étudiante en Cloud Computing	2023-09-01 12:45:00
6307d7ff-a584-4046-a841-246b375484a0	K6064211	\N	$2b$10$9QNZ0NKpQ67Tu26aXqP7PeNhJPMECR.e7ugqB7dfQ3p5p1hynB8oS	student	Salman Test	testtest@gmaill.com	\N	fff	2025-05-18 14:16:09.416257
b1ac018d-8590-47cd-9d32-f9d7251b191c	K7879437894	\N	$2b$10$UKwCKL3pHsDVKuXIHDjGbeO6LemerV7EduL5iQCacv3.g4KBG0cwG	coach	Salman	Helofd@gmai.cff	\N	HELLO TEST	2025-05-31 15:13:52.456022
c8a7c097-3d09-4638-aacd-3b346a291186	AB123456fffffda44	\N	$2b$10$SxsDQZIjDKP7Xl6kIqlzou1ekZQOssw7PXyWw7UGFiT1qjNV2FhDG	Supervisor	Salman	alfdfadfdfd@example.com	\N	\N	2025-06-02 20:12:55.928574
729a7732-c68d-467e-87ad-1981b5980196	12345	\N	$2b$10$u3J0kQbCH1lNJxmgD5NXVeo2msyhF.W5dWekOCdNrwwFp.iiWLSi.	student	yyyyyyyyy	hamzsssa@gamil.com	\N	jlkdsjcklasjlkjlkv'dk	2025-06-03 18:16:34.616996
2c0d4e63-00b4-46ed-851f-3ef59aac19bf	CN12354	\N	$2b$10$b0ntP0atDCDQAav.bbUBgOGMmKGRd80UbELTWF88NZZBTq9dheXI2	student	jijijijiijuij	eloukili.nadaQQQ@etu.uae.ac.ma	\N	SJLDSJLKNVKJNJN ZJX,CNKCN/	2025-06-03 18:23:47.967975
28efff6b-fa78-42b5-89ed-911590b33e31	12112212121	\N	$2b$10$0a9uAB8MxwEOE5Rm9NQZ8Oh1ucxLjJitH.69UHxacPE6H6XteZULG	student	QQQQ	eloukili.nadsssa@etu.uae.ac.ma	\N	DDCSDADavffdsaczs	2025-06-03 18:24:38.664833
d26151a7-5ac8-41cd-8460-c4abf4fc67cf	qqwqew	\N	$2b$10$ZkwjPzN/McDCL4I9yTuCy.GE416gTT1hhD8UNryZMUUetK/f17NMi	student	jaousde	eloukili.nadsssxdsca@etu.uae.ac.ma	\N	sdvcdcascsa	2025-06-03 18:48:57.559193
0dfeeb2d-11b4-4a10-9a12-3dfbf102e447	qqwqeww	\N	$2b$10$Mg1Xcot/Sv1y9OvJyMZXLeG9nFWErfnitIKxy38zfYioyLAZmLMKO	student	jaousde	eloukili.nadsssswwxdscaxx@etu.uae.ac.ma	\N	sdvcdcascsa	2025-06-03 18:49:23.850784
941181b7-e1f8-435e-8cf6-4f6f551208de	C232343	\N	$2b$10$meaDhRqrRestznIj..5JPurltH4nsTfugI5YDCszu/lu0Wnt.Ifdy	student	jskljdklaj	hamzadedasd@gamil.com	\N	ejekljkhjaksjdiljàljlk	2025-06-03 18:54:34.865484
7617a2ab-6241-4e4f-8cb0-27536f5e4796	ELJLSFV	\N	$2b$10$U2FQ0QXHLitS62W5WCjfLu8XOh2tsMSk/xfANsuWWP0N846v3E3Xm	Professor	JAOUAD	eloukili.nada@etu.uae.ac.SDSma	\N	MCSD.KVNXFZ,V	2025-06-03 19:23:59.595635
SUP005	YZ345678	0673456789	$2a$10$mnopqrstuvwxyzabcdefgh	Supervisor	Hamza El Alami	hamza.elalami@inwi.ma	profile_hamza.jpg	Architecte Solutions chez Inwi	2023-03-05 10:45:00
15128dd0-f5c6-43ad-ad49-ada45edb9a4d	K794789	\N	$2b$10$QXxXI2j8s/AT65Pkko.z2uJE0jjSlWnnoIXdqxg1YsldnRWKhG2eW	Professor	Salman	elghrich.sky@gmail.com	\N	Very good teacher	2025-06-04 19:32:30.398483
4372c117-fa1d-4eff-9062-0b94f94e2659	22122	\N	$2b$10$7Qh78Bx4yizKLi.BnZB0gOYEEHsiH4yXwbgoEn1IPBuoeGMyV5Qey	student	SNMNM	NZAJON2J@JNXL	\N	holla	2025-06-04 23:53:07.700976
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
1	ADM001	Ouverture des inscriptions pour les certifications Microsoft et Cisco pour tous les étudiants	admin	2023-09-10 09:00:00
2	PRF001	Publication des résultats du hackathon national - Félicitations à nos étudiants pour leur 2ème place!	Professor	2023-10-05 14:30:00
3	ADM002	Modification du calendrier des examens de fin de semestre suite à la semaine culturelle	admin	2023-12-01 10:15:00
4	PRF002	Atelier sur l'intelligence artificielle et le machine learning animé par des experts de Casablanca Tech Hub	Professor	2024-01-15 11:45:00
5	ADM003	Signature d'une nouvelle convention avec OCP pour des stages et des projets de fin d'études	admin	2024-02-20 13:00:00
6	PRF003	Conférence sur la cybersécurité avec des intervenants de l'ANRT prévue le mois prochain	Professor	2024-03-05 15:30:00
7	ADM001	Lancement du programme d'entrepreneuriat étudiant en partenariat avec Maroc PME	admin	2024-03-20 10:45:00
8	PRF004	Les projets de fin d'année seront exposés lors du salon national de l'innovation à Rabat	Professor	2024-04-10 09:15:00
9	ADM002	Nouvelle plateforme de cours en ligne disponible pour tous les étudiants	admin	2024-04-25 11:30:00
10	PRF005	Organisation d'un concours mathématique inter-universités - Inscriptions ouvertes	Professor	2024-05-05 14:00:00
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.notifications (id_notification, content_notification, date_notification, id_member, id_reporter) FROM stdin;
2	I recommend scheduling a session with a licensed psychologist 	\N	da93bdeb-a589-4bd3-9138-a207f691c62b	\N
3	 Important : vous devez venir demain à l'administration à 10h.  	\N	da93bdeb-a589-4bd3-9138-a207f691c62b	da93bdeb-a589-4bd3-9138-a207f691c62b
4	 Important : vous devez venir demain à l'administration à 10h.  	\N	da93bdeb-a589-4bd3-9138-a207f691c62b	da93bdeb-a589-4bd3-9138-a207f691c62b
1	Votre signal a été approuvé et une solution est proposée	2023-10-16 10:30:00	PRF001	\N
5	Nouvelle actualité concernant votre filière	2024-01-10 09:30:00	STU003	\N
6	Votre solution a été mise en place - premier rendez-vous planifié	2023-11-26 14:15:00	STU004	\N
7	Rappel: Date limite de remise du projet dans 3 jours	2024-01-12 10:00:00	STU009	\N
8	Un nouveau coach vous a été assigné	2023-11-16 13:45:00	STU020	\N
9	Votre demande de stage a été approuvée	2024-05-15 11:30:00	STU013	\N
10	Nouvelle ressource pédagogique disponible dans votre espace	2023-12-20 15:20:00	STU001	\N
11	Invitation à l'atelier "Communication professionnelle"	2024-02-05 09:15:00	STU015	\N
12	Votre note de projet a été publiée	2024-01-30 16:30:00	STU008	\N
13	Rappel: Session de coaching demain à 10h00	2024-03-06 14:45:00	STU016	\N
14	Nouvelle offre de stage disponible dans votre domaine	2024-04-10 11:00:00	STU001	\N
15	Un enseignant a signalé un problème vous concernant	2023-11-05 13:15:00	STU003	\N
\.


--
-- Data for Name: professor; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.professor (id_member, department, code) FROM stdin;
PRF001	Informatique	PROF-INF-001
PRF002	Data Science	PROF-DS-001
PRF003	Réseaux	PROF-RES-001
PRF004	Génie Logiciel	PROF-GL-001
7617a2ab-6241-4e4f-8cb0-27536f5e4796	\N	DDFASDFV
PRF005	Mathématiques	PROF-MAT-001
15128dd0-f5c6-43ad-ad49-ada45edb9a4d	\N	K747897
\.


--
-- Data for Name: project; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.project (id_project, description_project, date_project, subject_project, id_prof, end_date, id_class, name_project, id_sector, group_number) FROM stdin;
3	Système d'analyse de données pour l'agriculture marocaine	2024-02-10	Plateforme Big Data pour optimiser les rendements agricoles	PRF002	2024-05-10	ginf3	Analyse Agricole	CI3	4
4	Solution de cybersécurité pour le secteur bancaire marocain	2024-03-01	Système de détection d'intrusion basé sur l'IA	PRF003	2024-06-01	gsr2	Sécurité Bancaire	AP2	2
5	Plateforme numérique pour l'administration publique	2024-03-15	Portail citoyen avec authentification sécurisée	PRF004	2024-06-15	td3	E-Administration	AP1	3
2	Création d'une solution de paiement mobile adaptée au marché marocain	2025-04-01	Application mobile de paiement avec authentification biométrique	PRF004	2025-06-01	gind2	FinTech Marocaine	CI2	3
1	Développement d'une plateforme de gestion intelligente pour les villes marocaines	2025-01-01	Application IoT pour la gestion urbaine intelligente	PRF001	2025-02-01	ginf1	Smart City Maroc	CI1	4
\.


--
-- Data for Name: rate; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.rate (id_rate, id_member) FROM stdin;
1	STU001
2	STU002
3	STU003
4	STU004
5	STU005
6	PRF001
7	PRF002
8	PRF003
9	PRF004
10	PRF005
11	COA001
12	COA002
13	COA003
14	SUP001
15	SUP002
\.


--
-- Data for Name: report; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.report (id_reporter, id_reported, id_signal) FROM stdin;
PRF001	STU001	1
PRF005	STU004	2
COA001	STU011	3
PRF004	STU003	5
COA002	STU009	9
COA003	STU020	11
PRF004	STU013	12
PRF002	STU015	14
\.


--
-- Data for Name: sector; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sector (id_sector, description, id_admin) FROM stdin;
SEC001	Filière Génie Informatique et Réseaux	M001
CI1	Cycle d Ingénieur 1ère année - Tronc commun	ADM001
CI2	Cycle d Ingénieur 2ème année - Tronc commun	ADM001
CI3	Cycle d Ingénieur 3ème année - Tronc commun	ADM002
AP1	Année préparatoire 1ère année	ADM003
AP2	Année préparatoire 2ème année	ADM003
Hello	Just testing 	\N
AP3	hello fdljfaduflku	M001
\.


--
-- Data for Name: signal; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.signal (id_signal, approved, message, anony, option_signal, id_solution, id_member, date_add, solution_state) FROM stdin;
2	f	signal2	\N	\N	\N	\N	2025-03-11	\N
1	f	signal 	\N	\N	2	\N	2025-05-05	in progress
3	t	Étudiant souffrant de stress excessif avant les examens	t	Psychologique	3	COA001	2023-12-05	Approved
4	f	Besoin d'orientation professionnelle pour les stages de fin d'études	f	Professionnel	4	STU011	2024-02-10	New
5	t	Difficultés avec les algorithmes complexes pour plusieurs étudiants	f	Académique	5	PRF004	2023-10-25	Approved
6	f	Proposition d'un groupe d'étude pour réviser les examens	f	Académique	6	STU003	2024-01-05	Rejected
7	t	Plusieurs étudiants ont des difficultés avec la documentation technique en anglais	f	Académique	7	PRF002	2024-03-12	New
9	t	Signalement d'un conflit entre membres d'une équipe projet	t	Social	9	COA002	2024-01-15	Approved
10	f	Besoin de formation complémentaire en techniques de cybersécurité avancées	f	Académique	10	STU016	2024-03-05	New
11	t	Étudiant ayant des difficultés d'intégration dans la classe	t	Social	3	COA003	2023-11-10	Approved
12	t	Problèmes de communication au sein d'une équipe projet	f	Social	9	PRF004	2024-01-20	Approved
13	f	Difficultés avec les concepts avancés de data mining	f	Académique	5	STU008	2023-11-15	Approved
14	t	Besoin d'aide pour améliorer les compétences en présentation orale	f	Académique	3	PRF002	2023-12-12	Approved
15	t	Signalement de difficultés financières affectant les études	t	Financier	\N	ADM002	2024-02-15	\N
89	\N	signal 	t	Académique	\N	STU001	2025-06-03	\N
8	t	Besoin d'assistance pour la gestion de projet complexe	f	Académique	8	SUP001	2024-02-28	Approved
\.


--
-- Data for Name: skill; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.skill (skill_name, description_skill, question1, question2, question3, id_admin) FROM stdin;
Communication	Ability to express ideas clearly and adapt communication to different audiences	Does this person express their ideas clearly and understandably?	Do they listen actively and let others finish speaking?	Do they adapt their communication style depending on the audience?	ADM001
Teamwork	Ability to collaborate and support group efforts effectively	Does this person collaborate effectively with teammates?	Are they open to others’ ideas and feedback?	Do they support the team in achieving common goals?	ADM001
Problem-Solving	Ability to approach and resolve challenges with logical and creative thinking	Does this person approach problems calmly and analytically?	Do they contribute useful solutions when challenges arise?	Are they willing to seek help or input when needed?	ADM001
Time Management	Ability to manage time and prioritize tasks efficiently	Does this person prioritize tasks effectively to meet deadlines?	Does this person allocate time appropriately across multiple responsibilities?	Does this person avoid unnecessary delays or procrastination?	ADM001
Critical Thinking	Ability to assess situations logically and question assumptions constructively	Does this person analyze information carefully before forming conclusions?	Does this person question assumptions or challenge ideas constructively?	Does this person evaluate the strengths and weaknesses of arguments or solutions?	ADM001
Creativity	Ability to generate innovative ideas and explore alternative approaches	Does this person generate original or innovative ideas?	Does this person approach tasks with imagination or out-of-the-box thinking?	Does this person explore multiple possibilities before settling on a solution?	ADM001
\.


--
-- Data for Name: skill_evaluation; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.skill_evaluation (id_evaluation, note_evaluation, type_evaluation, comment_evaluation, id_internship, id_class, id_team, id_student, id_evaluator, date_add, evaluation_context) FROM stdin;
1	16.5	Professor	Excellent travail d'équipe et bonnes compétences techniques	\N	\N	1	STU001	PRF001	2023-07-15	project
2	15	Supervisor	Communication claire, mais pourrait améliorer la résolution de problèmes	1	\N	\N	STU001	SUP001	2023-08-05	internship
5	14.5	Self	Je dois améliorer mes compétences en communication technique	\N	ginf1	\N	STU004	STU004	2023-09-10	class
6	16	Pair	Bon esprit d'équipe et aide volontiers les autres	\N	\N	5	STU002	STU008	2024-07-05	project
11	14	Self	Je dois améliorer ma gestion du temps et mon organisation	\N	ginf2	\N	STU007	STU007	2023-06-20	class
15	15.5	Professor	Bon travail d'équipe mais peut améliorer ses compétences techniques	\N	\N	2	STU015	PRF001	2023-06-18	project
17	16	Professor	Bonne compréhension des concepts mais doit travailler sa communication	\N	ginf3	\N	STU015	PRF002	2024-08-12	class
18	17.5	Pair	Excellent leadership et capacité à motiver l'équipe	\N	\N	7	STU010	STU016	2024-08-15	project
19	15	Self	Je dois améliorer mes compétences en analyse de données	\N	ginf3	\N	STU012	STU012	2024-09-01	class
20	16.5	Professor	Très bonne présentation et maîtrise du sujet	\N	\N	3	STU019	PRF004	2024-09-05	project
21	18	Supervisor	Compétences techniques excellentes et bonne intégration en entreprise	8	\N	\N	STU013	SUP003	2024-07-20	internship
22	17	Professor	Très bon travail d'équipe et excellente communication	\N	\N	8	STU017	PRF004	2024-06-10	project
23	15.5	Pair	Bonnes compétences en programmation, peut améliorer l'esprit d'équipe	\N	\N	6	STU005	STU015	2024-08-28	project
24	16	Supervisor	Bonne autonomie mais peut améliorer sa communication avec l'équipe	9	\N	\N	STU016	SUP004	2024-07-30	internship
25	17.5	Professor	Excellente maîtrise des concepts de machine learning	\N	ginf3	\N	STU008	PRF001	2024-06-15	class
3	8.2	Professor	Bonne implication dans le projet et respect des délais	\N	\N	\N	STU003	PRF001	2023-06-20	project
4	9.1	Professor	Participation active en réunion, peut approfondir l'aspect technique	\N	\N	\N	STU004	PRF001	2023-06-25	project
7	7.5	Professor	Doit améliorer la régularité du travail et la communication	\N	\N	\N	STU007	PRF001	2023-07-02	project
8	9.1	Professor	Très bon niveau technique et esprit collaboratif	\N	\N	\N	STU008	PRF001	2023-07-05	project
9	8	Professor	Bonne compréhension du sujet mais manque d’initiative	\N	\N	\N	STU009	PRF001	2023-07-10	project
10	9.4	Professor	Travail rigoureux, mais peut mieux gérer le temps imparti	\N	\N	\N	STU010	PRF001	2023-07-15	project
12	8.2	Professor	Bonne autonomie, mais documentation insuffisante	\N	\N	\N	STU012	PRF001	2024-06-12	project
13	8.5	Professor	Très bonne capacité à résoudre les problèmes techniques	\N	\N	\N	STU013	PRF001	2024-06-17	project
14	8.9	Professor	Bonne présentation finale, peut approfondir certains points	\N	\N	\N	STU014	PRF001	2024-06-22	project
16	9.1	Professor	Collaboration efficace avec les membres de l'équipe	\N	\N	\N	STU002	PRF001	2024-08-10	project
26	8.6	Professor	Travail bien structuré et bonne compréhension du sujet	\N	\N	\N	STU010	PRF001	2025-06-26	project
27	8.8	Professor	Capacité à s'adapter rapidement et à gérer les imprévus	\N	\N	\N	STU001	PRF001	2025-07-02	project
28	8.2	Professor	Bonne maîtrise des outils utilisés durant le projet	\N	\N	\N	STU002	PRF001	2025-09-03	project
\.


--
-- Data for Name: solution; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.solution (id_solution, option_solution, subject_solution, periode, state) FROM stdin;
1	therapy_recommended	therapy_recommended..	\N	New
2	Tutoring Support	L'étudiant a été orienté vers un coach pour suivi psychologique.	\N	New
3	Séances de coaching	Stress et anxiété	Année académique 2023-2024	Approved
4	Programme de mentorat	Orientation professionnelle	Semestre 1 2024-2025	New
5	Cours de rattrapage	Difficultés en algorithmique	Semestre 1 2023-2024	Approved
6	Groupe d'étude supervisé	Préparation aux examens	Semestre 2 2023-2024	Rejected
7	Soutien linguistique	Difficultés en anglais technique	Année académique 2024-2025	New
8	Accompagnement projet	Gestion de projet difficile	Semestre 1 2024-2025	Approved
9	Médiation	Conflit au sein d'une équipe	Semestre 2 2023-2024	Approved
10	Formation complémentaire	Lacunes en cybersécurité	Semestre 1 2024-2025	New
\.


--
-- Data for Name: student; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.student (id_member, cne, id_class) FROM stdin;
M001	\N	\N
M002	\N	\N
7ba19de9-a3b5-45fc-b64b-bdb68799088e	p13790	GINF1
STU001	D13456789	ginf1
STU002	G98765432	ginf2
STU003	R14785236	ginf3
STU004	S36925814	gind1
STU005	B12345678	gind2
STU006	M25836914	gind3
STU007	K74185296	cys1
STU008	H96385274	cys2
STU009	F45678912	cys3
STU010	E78945612	gsea1
STU011	Z15975364	gsea2
STU012	Y75395146	gsea3
STU013	U12378945	gsr1
STU014	V45612378	gsr2
STU015	T78945632	gsr3
STU016	W12356479	td1
STU017	X78945613	td2
STU018	P12397845	td3
STU019	O89456123	td4
STU020	N56123789	td5
S100	CNE789456	GINF1
\.


--
-- Data for Name: supervise; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.supervise (id_supervisor, id_student, id_internship) FROM stdin;
SUP001	STU001	1
SUP002	STU002	2
SUP003	STU003	3
SUP004	STU006	4
SUP005	STU007	5
SUP001	STU011	6
SUP002	STU012	7
SUP003	STU013	8
SUP004	STU016	9
SUP005	STU017	10
\.


--
-- Data for Name: supervisor; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.supervisor (id_member, registration_number, company, "position") FROM stdin;
SUP001	SUP-MT-001	Maroc Telecom	Chef de Projet
SUP002	SUP-AWB-001	Attijariwafa Bank	Directrice IT
SUP003	SUP-OCP-001	OCP Group	Ingénieur Systèmes
SUP004	SUP-CIH-001	CIH Bank	Responsable Cybersécurité
SUP005	SUP-INWI-001	Inwi	Architecte Solutions
\.


--
-- Data for Name: teach; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.teach (id_member, id_class, course) FROM stdin;
7617a2ab-6241-4e4f-8cb0-27536f5e4796	GINF1	JAOUD
PRF001	ginf1	Intelligence Artificielle
PRF001	ginf2	Machine Learning
PRF002	ginf3	Data Mining
PRF002	cys2	Big Data Analytics
PRF003	cys3	Sécurité des Réseaux
PRF003	gsr3	Cryptographie Avancée
PRF004	gind1	Génie Logiciel
PRF004	gsea2	Méthodes Agiles
PRF005	ginf1	Analyse Numérique
PRF005	gsr1	Statistiques pour Data Science
15128dd0-f5c6-43ad-ad49-ada45edb9a4d	GINF1	Maths
\.


--
-- Data for Name: team; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.team (id_team, note, id_prof, id_project, team_name) FROM stdin;
1	17.5	PRF001	1	Innovators
2	16	PRF001	1	TechPioneers
3	18	PRF004	2	CodeMasters
4	15.5	PRF004	2	DevGurus
5	16.5	PRF002	3	DataCrunchers
6	17	PRF002	3	AIExplorers
7	18.5	PRF003	4	CyberShield
8	16	PRF004	5	WebWizards
\.


--
-- Data for Name: team_student; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.team_student (id_team, student_id) FROM stdin;
3	STU003
3	STU009
3	STU013
3	STU019
4	STU007
4	STU017
5	STU002
5	STU008
5	STU012
5	STU018
6	STU005
6	STU015
7	STU006
7	STU010
7	STU016
7	STU020
8	STU007
8	STU017
\.


--
-- Name: internship_id_internship_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.internship_id_internship_seq', 4, true);


--
-- Name: news_id_news_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.news_id_news_seq', 23, true);


--
-- Name: notifications_id_notification_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.notifications_id_notification_seq', 4, true);


--
-- Name: project_id_project_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.project_id_project_seq', 31, true);


--
-- Name: rate_id_rate_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.rate_id_rate_seq', 1, false);


--
-- Name: signal_id_signal_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.signal_id_signal_seq', 6, true);


--
-- Name: skill_evaluation_id_evaluation_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.skill_evaluation_id_evaluation_seq', 24, true);


--
-- Name: solution_id_solution_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.solution_id_solution_seq', 2, true);


--
-- Name: team_id_team_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.team_id_team_seq', 1, true);


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
-- Name: project fk_project_class; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project
    ADD CONSTRAINT fk_project_class FOREIGN KEY (id_class) REFERENCES public.class(id_class);


--
-- Name: project fk_project_sector; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.project
    ADD CONSTRAINT fk_project_sector FOREIGN KEY (id_sector) REFERENCES public.sector(id_sector);


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

