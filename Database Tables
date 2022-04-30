-- Table: public.courses

-- DROP TABLE IF EXISTS public.courses;

CREATE TABLE IF NOT EXISTS public.courses
(
    code character varying(25) COLLATE pg_catalog."default" NOT NULL,
    title character varying(255) COLLATE pg_catalog."default",
    description character varying(50000) COLLATE pg_catalog."default",
    duration character varying(50000) COLLATE pg_catalog."default",
    full_duration character varying(50000) COLLATE pg_catalog."default",
    instructor character varying(1000) COLLATE pg_catalog."default",
    location character varying(50000) COLLATE pg_catalog."default",
    format character varying(5000) COLLATE pg_catalog."default",
    restriction character varying(50000) COLLATE pg_catalog."default",
    prereq character varying(50000) COLLATE pg_catalog."default",
    exclusions character varying(50000) COLLATE pg_catalog."default",
    notes character varying(50000) COLLATE pg_catalog."default",
    days character varying(50000) COLLATE pg_catalog."default",
    "time" character varying(50000) COLLATE pg_catalog."default",
    type character varying(5000) COLLATE pg_catalog."default",
    section character varying(25) COLLATE pg_catalog."default"
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.courses
    OWNER to masterbotaccess;

GRANT SELECT ON TABLE public.courses TO brockdataaccount;

GRANT ALL ON TABLE public.courses TO masterbotaccess;



-- Table: public.exams

-- DROP TABLE IF EXISTS public.exams;

CREATE TABLE IF NOT EXISTS public.exams
(
    code character varying(255) COLLATE pg_catalog."default",
    duration character varying(255) COLLATE pg_catalog."default",
    sectionid character varying(255) COLLATE pg_catalog."default",
    startday character varying(255) COLLATE pg_catalog."default",
    starttime character varying(255) COLLATE pg_catalog."default",
    endtime character varying(255) COLLATE pg_catalog."default",
    loc character varying(255) COLLATE pg_catalog."default"
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.exams
    OWNER to masterbotaccess;




-- Table: public.important_dates

-- DROP TABLE IF EXISTS public.important_dates;

CREATE TABLE IF NOT EXISTS public.important_dates
(
    occasion character varying(5000) COLLATE pg_catalog."default",
    session character varying(5000) COLLATE pg_catalog."default",
    stakeholder character varying(5000) COLLATE pg_catalog."default",
    date character varying(5000) COLLATE pg_catalog."default"
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.important_dates
    OWNER to masterbotaccess;
