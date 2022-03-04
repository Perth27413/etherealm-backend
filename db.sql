CREATE TABLE public.land (
	land_token_id varchar NOT NULL,
	land_name varchar NULL,
	land_description varchar NULL,
	land_owner_token_id varchar NOT NULL,
	land_location varchar NOT NULL,
	land_status serial NOT NULL,
	land_assets varchar NULL,
	on_recommend boolean NOT NULL
);

ALTER TABLE public.land ADD CONSTRAINT land_pk PRIMARY KEY (land_token_id);

CREATE TABLE public.land_status (
	land_status_id serial NOT NULL,
	land_status_name varchar NOT NULL,
	CONSTRAINT land_status_pk PRIMARY KEY (land_status_id)
);

ALTER TABLE public.land ADD CONSTRAINT land_fk FOREIGN KEY (land_status) REFERENCES public.land_status(land_status_id);

INSERT INTO public.land_status (land_status_name)
	VALUES ('No Owner');
INSERT INTO public.land_status (land_status_name)
	VALUES ('Already owned');
INSERT INTO public.land_status (land_status_name)
	VALUES ('For sell on market');
INSERT INTO public.land_status (land_status_name)
	VALUES ('For rent on market');
INSERT INTO public.land_status (land_status_name)
	VALUES ('Rent out');
INSERT INTO public.land_status (land_status_name)
	VALUES ('Renting');
INSERT INTO public.land_status (land_status_name)
	VALUES ('Hiring');

ALTER TABLE public.land ALTER COLUMN land_owner_token_id DROP NOT NULL;

CREATE TABLE public.land_size (
	land_size_id serial NOT NULL,
	land_size int NULL
);
ALTER TABLE public.land_size ADD CONSTRAINT land_size_pk PRIMARY KEY (land_size_id);

INSERT INTO public.land_size (land_size_id,land_size)
	VALUES (1,20);
INSERT INTO public.land_size (land_size_id,land_size)
	VALUES (2,60);
INSERT INTO public.land_size (land_size_id,land_size)
	VALUES (3,120);

ALTER TABLE public.land ADD land_position varchar NOT NULL;
ALTER TABLE public.land ADD land_size serial NOT NULL;
ALTER TABLE public.land ADD CONSTRAINT land_fk FOREIGN KEY (land_size) REFERENCES public.land_size(land_size_id);

CREATE TABLE public."user" (
	user_token_id varchar NOT NULL,
	user_name varchar NULL,
	user_description varchar NULL,
	user_profile_pic varchar NULL,
	CONSTRAINT user_pk PRIMARY KEY (user_token_id)
);
