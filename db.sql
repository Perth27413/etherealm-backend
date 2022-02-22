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
	VALUES ('Listed on Market');
