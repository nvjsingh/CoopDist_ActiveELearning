--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.4
-- Dumped by pg_dump version 9.6.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: courses; Type: TABLE; Schema: public; Owner: mypls
--

CREATE TABLE courses (
    c_name text,
    c_url text,
    t_name text,
    c_id integer NOT NULL
);


ALTER TABLE courses OWNER TO mypls;

--
-- Name: courses_c_id_seq; Type: SEQUENCE; Schema: public; Owner: mypls
--

CREATE SEQUENCE courses_c_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE courses_c_id_seq OWNER TO mypls;

--
-- Name: courses_c_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mypls
--

ALTER SEQUENCE courses_c_id_seq OWNED BY courses.c_id;


--
-- Name: mygroups; Type: TABLE; Schema: public; Owner: mypls
--

CREATE TABLE mygroups (
    gname text,
    g_id integer NOT NULL,
    t_id text,
    members integer[],
    admin integer
);


ALTER TABLE mygroups OWNER TO mypls;

--
-- Name: groups_g_id_seq; Type: SEQUENCE; Schema: public; Owner: mypls
--

CREATE SEQUENCE groups_g_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE groups_g_id_seq OWNER TO mypls;

--
-- Name: groups_g_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mypls
--

ALTER SEQUENCE groups_g_id_seq OWNED BY mygroups.g_id;


--
-- Name: localnotif_110; Type: TABLE; Schema: public; Owner: mypls
--

CREATE TABLE localnotif_110 (
    fr_uuid integer,
    to_uuid integer,
    type text,
    id integer NOT NULL,
    gid integer,
    fr_name text,
    to_name text,
    gp_name text
);


ALTER TABLE localnotif_110 OWNER TO mypls;

--
-- Name: localnotif_110_id_seq; Type: SEQUENCE; Schema: public; Owner: mypls
--

CREATE SEQUENCE localnotif_110_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE localnotif_110_id_seq OWNER TO mypls;

--
-- Name: localnotif_110_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mypls
--

ALTER SEQUENCE localnotif_110_id_seq OWNED BY localnotif_110.id;


--
-- Name: localnotif_111; Type: TABLE; Schema: public; Owner: mypls
--

CREATE TABLE localnotif_111 (
    fr_uuid integer,
    to_uuid integer,
    type text,
    id integer NOT NULL,
    gid integer,
    fr_name text,
    to_name text,
    gp_name text
);


ALTER TABLE localnotif_111 OWNER TO mypls;

--
-- Name: localnotif_111_id_seq; Type: SEQUENCE; Schema: public; Owner: mypls
--

CREATE SEQUENCE localnotif_111_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE localnotif_111_id_seq OWNER TO mypls;

--
-- Name: localnotif_111_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mypls
--

ALTER SEQUENCE localnotif_111_id_seq OWNED BY localnotif_111.id;


--
-- Name: localnotif_112; Type: TABLE; Schema: public; Owner: mypls
--

CREATE TABLE localnotif_112 (
    fr_uuid integer,
    to_uuid integer,
    type text,
    id integer NOT NULL,
    gid integer,
    fr_name text,
    to_name text,
    gp_name text
);


ALTER TABLE localnotif_112 OWNER TO mypls;

--
-- Name: localnotif_112_id_seq; Type: SEQUENCE; Schema: public; Owner: mypls
--

CREATE SEQUENCE localnotif_112_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE localnotif_112_id_seq OWNER TO mypls;

--
-- Name: localnotif_112_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mypls
--

ALTER SEQUENCE localnotif_112_id_seq OWNED BY localnotif_112.id;


--
-- Name: localnotif_113; Type: TABLE; Schema: public; Owner: mypls
--

CREATE TABLE localnotif_113 (
    fr_uuid integer,
    to_uuid integer,
    type text,
    id integer NOT NULL,
    gid integer,
    fr_name text,
    to_name text,
    gp_name text
);


ALTER TABLE localnotif_113 OWNER TO mypls;

--
-- Name: localnotif_113_id_seq; Type: SEQUENCE; Schema: public; Owner: mypls
--

CREATE SEQUENCE localnotif_113_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE localnotif_113_id_seq OWNER TO mypls;

--
-- Name: localnotif_113_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mypls
--

ALTER SEQUENCE localnotif_113_id_seq OWNED BY localnotif_113.id;


--
-- Name: localuser_110; Type: TABLE; Schema: public; Owner: mypls
--

CREATE TABLE localuser_110 (
    uuid integer NOT NULL,
    t_ids text[],
    my_gids integer[],
    uname text
);


ALTER TABLE localuser_110 OWNER TO mypls;

--
-- Name: localuser_110_uuid_seq; Type: SEQUENCE; Schema: public; Owner: mypls
--

CREATE SEQUENCE localuser_110_uuid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE localuser_110_uuid_seq OWNER TO mypls;

--
-- Name: localuser_110_uuid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mypls
--

ALTER SEQUENCE localuser_110_uuid_seq OWNED BY localuser_110.uuid;


--
-- Name: localuser_111; Type: TABLE; Schema: public; Owner: mypls
--

CREATE TABLE localuser_111 (
    uuid integer NOT NULL,
    t_ids text[],
    my_gids integer[],
    uname text
);


ALTER TABLE localuser_111 OWNER TO mypls;

--
-- Name: localuser_111_uuid_seq; Type: SEQUENCE; Schema: public; Owner: mypls
--

CREATE SEQUENCE localuser_111_uuid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE localuser_111_uuid_seq OWNER TO mypls;

--
-- Name: localuser_111_uuid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mypls
--

ALTER SEQUENCE localuser_111_uuid_seq OWNED BY localuser_111.uuid;


--
-- Name: localuser_112; Type: TABLE; Schema: public; Owner: mypls
--

CREATE TABLE localuser_112 (
    uuid integer NOT NULL,
    t_ids text[],
    my_gids integer[],
    uname text
);


ALTER TABLE localuser_112 OWNER TO mypls;

--
-- Name: localuser_112_uuid_seq; Type: SEQUENCE; Schema: public; Owner: mypls
--

CREATE SEQUENCE localuser_112_uuid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE localuser_112_uuid_seq OWNER TO mypls;

--
-- Name: localuser_112_uuid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mypls
--

ALTER SEQUENCE localuser_112_uuid_seq OWNED BY localuser_112.uuid;


--
-- Name: localuser_113; Type: TABLE; Schema: public; Owner: mypls
--

CREATE TABLE localuser_113 (
    uuid integer NOT NULL,
    t_ids text[],
    my_gids integer[],
    uname text
);


ALTER TABLE localuser_113 OWNER TO mypls;

--
-- Name: localuser_113_uuid_seq; Type: SEQUENCE; Schema: public; Owner: mypls
--

CREATE SEQUENCE localuser_113_uuid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE localuser_113_uuid_seq OWNER TO mypls;

--
-- Name: localuser_113_uuid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mypls
--

ALTER SEQUENCE localuser_113_uuid_seq OWNED BY localuser_113.uuid;


--
-- Name: notif; Type: TABLE; Schema: public; Owner: mypls
--

CREATE TABLE notif (
    fr_uuid integer,
    to_uuid integer,
    type text,
    id integer NOT NULL,
    gid integer,
    fr_name text,
    to_name text,
    gp_name text
);


ALTER TABLE notif OWNER TO mypls;

--
-- Name: notif_id_seq; Type: SEQUENCE; Schema: public; Owner: mypls
--

CREATE SEQUENCE notif_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE notif_id_seq OWNER TO mypls;

--
-- Name: notif_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mypls
--

ALTER SEQUENCE notif_id_seq OWNED BY notif.id;


--
-- Name: topics; Type: TABLE; Schema: public; Owner: mypls
--

CREATE TABLE topics (
    t_id integer NOT NULL,
    t_name text
);


ALTER TABLE topics OWNER TO mypls;

--
-- Name: topic_t_id_seq; Type: SEQUENCE; Schema: public; Owner: mypls
--

CREATE SEQUENCE topic_t_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE topic_t_id_seq OWNER TO mypls;

--
-- Name: topic_t_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mypls
--

ALTER SEQUENCE topic_t_id_seq OWNED BY topics.t_id;


--
-- Name: userlocal; Type: TABLE; Schema: public; Owner: mypls
--

CREATE TABLE userlocal (
    uuid integer NOT NULL,
    my_gids integer[],
    t_ids text[],
    uname text
);


ALTER TABLE userlocal OWNER TO mypls;

--
-- Name: users; Type: TABLE; Schema: public; Owner: mypls
--

CREATE TABLE users (
    uuid integer NOT NULL,
    uname text
);


ALTER TABLE users OWNER TO mypls;

--
-- Name: users_UUID_seq; Type: SEQUENCE; Schema: public; Owner: mypls
--

CREATE SEQUENCE "users_UUID_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "users_UUID_seq" OWNER TO mypls;

--
-- Name: users_UUID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mypls
--

ALTER SEQUENCE "users_UUID_seq" OWNED BY users.uuid;


--
-- Name: courses c_id; Type: DEFAULT; Schema: public; Owner: mypls
--

ALTER TABLE ONLY courses ALTER COLUMN c_id SET DEFAULT nextval('courses_c_id_seq'::regclass);


--
-- Name: localnotif_110 id; Type: DEFAULT; Schema: public; Owner: mypls
--

ALTER TABLE ONLY localnotif_110 ALTER COLUMN id SET DEFAULT nextval('localnotif_110_id_seq'::regclass);


--
-- Name: localnotif_111 id; Type: DEFAULT; Schema: public; Owner: mypls
--

ALTER TABLE ONLY localnotif_111 ALTER COLUMN id SET DEFAULT nextval('localnotif_111_id_seq'::regclass);


--
-- Name: localnotif_112 id; Type: DEFAULT; Schema: public; Owner: mypls
--

ALTER TABLE ONLY localnotif_112 ALTER COLUMN id SET DEFAULT nextval('localnotif_112_id_seq'::regclass);


--
-- Name: localnotif_113 id; Type: DEFAULT; Schema: public; Owner: mypls
--

ALTER TABLE ONLY localnotif_113 ALTER COLUMN id SET DEFAULT nextval('localnotif_113_id_seq'::regclass);


--
-- Name: localuser_110 uuid; Type: DEFAULT; Schema: public; Owner: mypls
--

ALTER TABLE ONLY localuser_110 ALTER COLUMN uuid SET DEFAULT nextval('localuser_110_uuid_seq'::regclass);


--
-- Name: localuser_111 uuid; Type: DEFAULT; Schema: public; Owner: mypls
--

ALTER TABLE ONLY localuser_111 ALTER COLUMN uuid SET DEFAULT nextval('localuser_111_uuid_seq'::regclass);


--
-- Name: localuser_112 uuid; Type: DEFAULT; Schema: public; Owner: mypls
--

ALTER TABLE ONLY localuser_112 ALTER COLUMN uuid SET DEFAULT nextval('localuser_112_uuid_seq'::regclass);


--
-- Name: localuser_113 uuid; Type: DEFAULT; Schema: public; Owner: mypls
--

ALTER TABLE ONLY localuser_113 ALTER COLUMN uuid SET DEFAULT nextval('localuser_113_uuid_seq'::regclass);


--
-- Name: mygroups g_id; Type: DEFAULT; Schema: public; Owner: mypls
--

ALTER TABLE ONLY mygroups ALTER COLUMN g_id SET DEFAULT nextval('groups_g_id_seq'::regclass);


--
-- Name: notif id; Type: DEFAULT; Schema: public; Owner: mypls
--

ALTER TABLE ONLY notif ALTER COLUMN id SET DEFAULT nextval('notif_id_seq'::regclass);


--
-- Name: topics t_id; Type: DEFAULT; Schema: public; Owner: mypls
--

ALTER TABLE ONLY topics ALTER COLUMN t_id SET DEFAULT nextval('topic_t_id_seq'::regclass);


--
-- Name: users uuid; Type: DEFAULT; Schema: public; Owner: mypls
--

ALTER TABLE ONLY users ALTER COLUMN uuid SET DEFAULT nextval('"users_UUID_seq"'::regclass);


--
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: mypls
--

COPY courses (c_name, c_url, t_name, c_id) FROM stdin;
learn c++ programming	https://www.programiz.com/cpp-programming	c++	1
Introduction to Java	https://www.coursera.org/courses?languages=en&query=introduction+to+java	java	2
java J2EE	https://www.gangboard.com/app-programming-scripting-training/j2ee-training	java	3
Html Basics	https://www.codecademy.com/courses/web-beginner-en-HZA3b/0/1	html	4
Learn Python	https://www.codecademy.com/learn/learn-python	python	5
Diploma in Programming in c	https://alison.com/course/Diploma-in-Programming-in-C	c	6
c Programming for beginners	https://www.udemy.com/c-programming-for-beginners/	c	7
c++ language	http://www.cplusplus.com/doc/tutorial/	c++	8
javascript tutorial	https://www.w3schools.com/js/	javascript	9
javaScript	https://www.codeschool.com/learn/javascript	javascript	10
Western University Cooperative Distributed Systems	http://www.eng.uwo.ca/electrical/pdf/grad_course_outlines/ECE_9607.pdf	distributed	11
\.


--
-- Name: courses_c_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mypls
--

SELECT pg_catalog.setval('courses_c_id_seq', 11, true);


--
-- Name: groups_g_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mypls
--

SELECT pg_catalog.setval('groups_g_id_seq', 149, true);


--
-- Data for Name: localnotif_110; Type: TABLE DATA; Schema: public; Owner: mypls
--

COPY localnotif_110 (fr_uuid, to_uuid, type, id, gid, fr_name, to_name, gp_name) FROM stdin;
\.


--
-- Name: localnotif_110_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mypls
--

SELECT pg_catalog.setval('localnotif_110_id_seq', 1, false);


--
-- Data for Name: localnotif_111; Type: TABLE DATA; Schema: public; Owner: mypls
--

COPY localnotif_111 (fr_uuid, to_uuid, type, id, gid, fr_name, to_name, gp_name) FROM stdin;
\.


--
-- Name: localnotif_111_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mypls
--

SELECT pg_catalog.setval('localnotif_111_id_seq', 1, false);


--
-- Data for Name: localnotif_112; Type: TABLE DATA; Schema: public; Owner: mypls
--

COPY localnotif_112 (fr_uuid, to_uuid, type, id, gid, fr_name, to_name, gp_name) FROM stdin;
\.


--
-- Name: localnotif_112_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mypls
--

SELECT pg_catalog.setval('localnotif_112_id_seq', 1, false);


--
-- Data for Name: localnotif_113; Type: TABLE DATA; Schema: public; Owner: mypls
--

COPY localnotif_113 (fr_uuid, to_uuid, type, id, gid, fr_name, to_name, gp_name) FROM stdin;
\.


--
-- Name: localnotif_113_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mypls
--

SELECT pg_catalog.setval('localnotif_113_id_seq', 1, false);


--
-- Data for Name: localuser_110; Type: TABLE DATA; Schema: public; Owner: mypls
--

COPY localuser_110 (uuid, t_ids, my_gids, uname) FROM stdin;
110	{java,python,c,c++,javascript,css}	{149}	Taran
\.


--
-- Name: localuser_110_uuid_seq; Type: SEQUENCE SET; Schema: public; Owner: mypls
--

SELECT pg_catalog.setval('localuser_110_uuid_seq', 1, false);


--
-- Data for Name: localuser_111; Type: TABLE DATA; Schema: public; Owner: mypls
--

COPY localuser_111 (uuid, t_ids, my_gids, uname) FROM stdin;
111	{java,python,c,c++,javascript,css,html}	{149}	Samira
\.


--
-- Name: localuser_111_uuid_seq; Type: SEQUENCE SET; Schema: public; Owner: mypls
--

SELECT pg_catalog.setval('localuser_111_uuid_seq', 1, false);


--
-- Data for Name: localuser_112; Type: TABLE DATA; Schema: public; Owner: mypls
--

COPY localuser_112 (uuid, t_ids, my_gids, uname) FROM stdin;
112	{java,python,c,c++,javascript,css,html}	{}	Ajai
\.


--
-- Name: localuser_112_uuid_seq; Type: SEQUENCE SET; Schema: public; Owner: mypls
--

SELECT pg_catalog.setval('localuser_112_uuid_seq', 1, false);


--
-- Data for Name: localuser_113; Type: TABLE DATA; Schema: public; Owner: mypls
--

COPY localuser_113 (uuid, t_ids, my_gids, uname) FROM stdin;
113	{java,python,c,c++,javascript,css,html,sql}	{149}	Navjot
\.


--
-- Name: localuser_113_uuid_seq; Type: SEQUENCE SET; Schema: public; Owner: mypls
--

SELECT pg_catalog.setval('localuser_113_uuid_seq', 1, false);


--
-- Data for Name: mygroups; Type: TABLE DATA; Schema: public; Owner: mypls
--

COPY mygroups (gname, g_id, t_id, members, admin) FROM stdin;
s c++	149	c++	{111,110,113}	111
\.


--
-- Data for Name: notif; Type: TABLE DATA; Schema: public; Owner: mypls
--

COPY notif (fr_uuid, to_uuid, type, id, gid, fr_name, to_name, gp_name) FROM stdin;
\.


--
-- Name: notif_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mypls
--

SELECT pg_catalog.setval('notif_id_seq', 79, true);


--
-- Name: topic_t_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mypls
--

SELECT pg_catalog.setval('topic_t_id_seq', 20, true);


--
-- Data for Name: topics; Type: TABLE DATA; Schema: public; Owner: mypls
--

COPY topics (t_id, t_name) FROM stdin;
1	java
2	python
3	c
4	c++
5	javascript
6	css
7	html
8	sql
9	linux
10	windows
11	drivers
12	algebra
13	calculus
14	organic chemistry
15	inorganic chemistry
16	mechanics
17	thermodynamics
18	wave physics
19	quantum mechanics
20	electromagnetic induction
\.


--
-- Data for Name: userlocal; Type: TABLE DATA; Schema: public; Owner: mypls
--

COPY userlocal (uuid, my_gids, t_ids, uname) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: mypls
--

COPY users (uuid, uname) FROM stdin;
110	Taran
111	Samira
112	Ajai
113	Navjot
\.


--
-- Name: users_UUID_seq; Type: SEQUENCE SET; Schema: public; Owner: mypls
--

SELECT pg_catalog.setval('"users_UUID_seq"', 113, true);


--
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: mypls
--

ALTER TABLE ONLY courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (c_id);


--
-- Name: mygroups groups_pkey; Type: CONSTRAINT; Schema: public; Owner: mypls
--

ALTER TABLE ONLY mygroups
    ADD CONSTRAINT groups_pkey PRIMARY KEY (g_id);


--
-- Name: localnotif_110 localnotif_110_pkey; Type: CONSTRAINT; Schema: public; Owner: mypls
--

ALTER TABLE ONLY localnotif_110
    ADD CONSTRAINT localnotif_110_pkey PRIMARY KEY (id);


--
-- Name: localnotif_111 localnotif_111_pkey; Type: CONSTRAINT; Schema: public; Owner: mypls
--

ALTER TABLE ONLY localnotif_111
    ADD CONSTRAINT localnotif_111_pkey PRIMARY KEY (id);


--
-- Name: localnotif_112 localnotif_112_pkey; Type: CONSTRAINT; Schema: public; Owner: mypls
--

ALTER TABLE ONLY localnotif_112
    ADD CONSTRAINT localnotif_112_pkey PRIMARY KEY (id);


--
-- Name: localnotif_113 localnotif_113_pkey; Type: CONSTRAINT; Schema: public; Owner: mypls
--

ALTER TABLE ONLY localnotif_113
    ADD CONSTRAINT localnotif_113_pkey PRIMARY KEY (id);


--
-- Name: localuser_110 localuser_110_pkey; Type: CONSTRAINT; Schema: public; Owner: mypls
--

ALTER TABLE ONLY localuser_110
    ADD CONSTRAINT localuser_110_pkey PRIMARY KEY (uuid);


--
-- Name: localuser_111 localuser_111_pkey; Type: CONSTRAINT; Schema: public; Owner: mypls
--

ALTER TABLE ONLY localuser_111
    ADD CONSTRAINT localuser_111_pkey PRIMARY KEY (uuid);


--
-- Name: localuser_112 localuser_112_pkey; Type: CONSTRAINT; Schema: public; Owner: mypls
--

ALTER TABLE ONLY localuser_112
    ADD CONSTRAINT localuser_112_pkey PRIMARY KEY (uuid);


--
-- Name: localuser_113 localuser_113_pkey; Type: CONSTRAINT; Schema: public; Owner: mypls
--

ALTER TABLE ONLY localuser_113
    ADD CONSTRAINT localuser_113_pkey PRIMARY KEY (uuid);


--
-- Name: notif notif_pkey; Type: CONSTRAINT; Schema: public; Owner: mypls
--

ALTER TABLE ONLY notif
    ADD CONSTRAINT notif_pkey PRIMARY KEY (id);


--
-- Name: topics topic_pkey; Type: CONSTRAINT; Schema: public; Owner: mypls
--

ALTER TABLE ONLY topics
    ADD CONSTRAINT topic_pkey PRIMARY KEY (t_id);


--
-- Name: userlocal userLocal_pkey; Type: CONSTRAINT; Schema: public; Owner: mypls
--

ALTER TABLE ONLY userlocal
    ADD CONSTRAINT "userLocal_pkey" PRIMARY KEY (uuid);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: mypls
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (uuid);


--
-- Name: public; Type: ACL; Schema: -; Owner: mypls
--

REVOKE ALL ON SCHEMA public FROM postgres;
REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO mypls;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

