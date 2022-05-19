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
ALTER TABLE public.land ADD CONSTRAINT land_fk1 FOREIGN KEY (land_size) REFERENCES public.land_size(land_size_id);

CREATE TABLE public."user" (
	user_token_id varchar NOT NULL,
	user_name varchar NULL,
	user_description varchar NULL,
	user_profile_pic varchar NULL,
	CONSTRAINT user_pk PRIMARY KEY (user_token_id)
);

CREATE TABLE public.log_transactions (
	from_user_token_id varchar NOT NULL,
	to_user_token_id varchar NOT NULL,
	transaction_block varchar NOT NULL,
	gas_price float4 NOT NULL,
	log_description serial NOT NULL,
	CONSTRAINT log_transactions_fk FOREIGN KEY (from_user_token_id) REFERENCES public."user"(user_token_id),
	CONSTRAINT log_transactions_fk_1 FOREIGN KEY (to_user_token_id) REFERENCES public."user"(user_token_id)
);

CREATE TABLE public.notification_activity (
	activity_id serial NOT NULL,
	activity_name varchar NULL
);


CREATE TABLE public.log_description (
	log_description_id serial NOT NULL,
	log_description_name varchar NULL,
	CONSTRAINT log_description_pk PRIMARY KEY (log_description_id)
);

ALTER TABLE public.notification_activity ADD CONSTRAINT notification_activity_pk PRIMARY KEY (activity_id);

CREATE TABLE public.market_type (
	market_type_id serial NOT NULL,
	market_type_name varchar NULL,
	CONSTRAINT market_type_pk PRIMARY KEY (market_type_id)
);

ALTER TABLE public.log_transactions ADD CONSTRAINT log_transactions_fk_desc FOREIGN KEY (log_description) REFERENCES public.log_description(log_description_id);

CREATE TABLE public.notifications (
	owner_user_token_id varchar NOT NULL,
	from_user_token_id varchar NOT NULL,
	activity_id serial NOT NULL,
	price float4 NULL,
	land_token_id varchar NOT NULL,
	date_time timestamp(0) NULL,
	CONSTRAINT notifications_fk FOREIGN KEY (owner_user_token_id) REFERENCES public."user"(user_token_id),
	CONSTRAINT notifications_fk_1 FOREIGN KEY (from_user_token_id) REFERENCES public."user"(user_token_id),
	CONSTRAINT notifications_fk_2 FOREIGN KEY (activity_id) REFERENCES public.notification_activity(activity_id),
	CONSTRAINT notifications_fk_3 FOREIGN KEY (land_token_id) REFERENCES public.land(land_token_id)
);

CREATE TABLE public.land_market (
	land_token_id varchar NOT NULL,
	owner_user_token_id varchar NOT NULL,
	market_type serial NOT NULL,
	price float4 NOT NULL,
	"period" int NULL,
	CONSTRAINT land_market_fk FOREIGN KEY (land_token_id) REFERENCES public.land(land_token_id),
	CONSTRAINT land_market_fk_1 FOREIGN KEY (owner_user_token_id) REFERENCES public."user"(user_token_id),
	CONSTRAINT land_market_fk_2 FOREIGN KEY (market_type) REFERENCES public.market_type(market_type_id)
);

INSERT INTO public.notification_activity (activity_id,activity_name)
	VALUES (1,'Offer');
INSERT INTO public.notification_activity (activity_id,activity_name)
	VALUES (2,'Buy');

INSERT INTO public.log_description (log_description_id,log_description_name)
VALUES (1,'Buy');

INSERT INTO public.market_type (market_type_id,market_type_name)
	VALUES (1,'Sell');
INSERT INTO public.market_type (market_type_id,market_type_name)
	VALUES (2,'Rent');

ALTER TABLE public.land_market ADD land_market_id serial NOT NULL;
ALTER TABLE public.land_market ADD CONSTRAINT land_market_pk PRIMARY KEY (land_market_id);

ALTER TABLE public.notifications ADD notification_id serial NOT NULL;
ALTER TABLE public.notifications ADD CONSTRAINT notifications_pk PRIMARY KEY (notification_id);

ALTER TABLE public.log_transactions ADD log_transactions_id serial NOT NULL;
ALTER TABLE public.log_transactions ADD CONSTRAINT log_transactions_pk PRIMARY KEY (log_transactions_id);

ALTER TABLE public.land_market ADD fees float4 NOT NULL;


ALTER TABLE public.log_description RENAME TO log_type;
ALTER TABLE public.log_type RENAME COLUMN log_description_id TO log_type_id;
ALTER TABLE public.log_type RENAME COLUMN log_description_name TO log_type_name;
ALTER TABLE public.log_transactions RENAME COLUMN log_description TO log_type;


ALTER TABLE public.log_transactions ADD date_time timestamp(0) NULL;


ALTER TABLE public.land ADD minimum_offer_price float4 NULL;
ALTER TABLE public.land ADD created_at timestamp(0) NULL;
ALTER TABLE public.land ADD updated_at information_schema.time_stamp NULL;

ALTER TABLE public.log_transactions RENAME COLUMN date_time TO created_at;

ALTER TABLE public.land_market ADD created_at timestamp(0) NULL;
ALTER TABLE public.land_market ADD updated_at timestamp(0) NULL;
ALTER TABLE public.land_market ADD is_delete bool NULL;


CREATE TABLE public.offer_land (
	offer_id serial NOT NULL,
	from_user_token_id varchar NOT NULL,
	land_token_id varchar NOT NULL,
	offer_price float4 NOT NULL,
	is_enough_point bool NOT NULL,
	created_at timestamp(0) NOT NULL,
	updated_at timestamp(0) NOT NULL,
	is_delete bool NOT NULL,
	CONSTRAINT offer_land_pk PRIMARY KEY (offer_id),
	CONSTRAINT offer_land_fk_1 FOREIGN KEY (from_user_token_id) REFERENCES public."user"(user_token_id),
	CONSTRAINT offer_land_fk FOREIGN KEY (land_token_id) REFERENCES public.land(land_token_id)
);

ALTER TABLE public.offer_land ADD fees float4 NOT NULL;

INSERT INTO public.log_type (log_type_id,log_type_name)
	VALUES (2,'Offer');
INSERT INTO public.log_type (log_type_id,log_type_name)
	VALUES (3,'Deposit');
INSERT INTO public.log_type (log_type_id,log_type_name)
	VALUES (4,'Withdraw');

CREATE TABLE public.rent_type (
	rent_type_id serial NOT NULL,
	rent_type_text varchar NULL,
	CONSTRAINT rent_type_pk PRIMARY KEY (rent_type_id)
);

INSERT INTO public.rent_type (rent_type_id,rent_type_text)
	VALUES (1,'Day');
INSERT INTO public.rent_type (rent_type_id,rent_type_text)
	VALUES (2,'Month');

DELETE FROM public.land_status
	WHERE land_status_id=5;
UPDATE public.land_status
	SET land_status_id=5
	WHERE land_status_id=6;
UPDATE public.land_status
	SET land_status_id=6
	WHERE land_status_id=7;

CREATE TABLE public.period_type (
	period_type_id serial NOT NULL,
	period_type_text varchar NOT NULL,
	CONSTRAINT period_type_pk PRIMARY KEY (period_type_id)
);

INSERT INTO public.period_type (period_type_id,period_type_text)
	VALUES (1,'Time limit');
INSERT INTO public.period_type (period_type_id,period_type_text)
	VALUES (2,'Without time limit');

CREATE TABLE public.rent_land (
	rent_id serial NOT NULL,
	land_token_id varchar NOT NULL,
	rent_type serial NOT NULL,
	period_type serial NOT NULL,
	"period" serial NOT NULL,
	price float4 NOT NULL,
	fees float4 NOT NULL,
	created_at timestamp(0) NOT NULL,
	updated_at timestamp(0) NOT NULL,
	start_date timestamp(0) NOT NULL,
	end_date timestamp(0) NOT NULL,
	last_payment timestamp(0) NOT NULL,
	is_delete bool NOT NULL,
	CONSTRAINT rent_land_pk PRIMARY KEY (rent_id),
	CONSTRAINT rent_land_fk FOREIGN KEY (land_token_id) REFERENCES public.land(land_token_id),
	CONSTRAINT rent_land_fk_1 FOREIGN KEY (rent_type) REFERENCES public.rent_type(rent_type_id),
	CONSTRAINT rent_land_fk_2 FOREIGN KEY (period_type) REFERENCES public.period_type(period_type_id)
);

CREATE TABLE public.rent_payment (
	rent_payment_id serial NOT NULL,
	rent_id serial NOT NULL,
	log_transactions_id serial NOT NULL,
	price float4 NOT NULL,
	fees float4 NOT NULL,
	created_at timestamp(0) NOT NULL,
	updated_at timestamp(0) NOT NULL,
	CONSTRAINT rent_payment_pk PRIMARY KEY (rent_payment_id),
	CONSTRAINT rent_payment_fk FOREIGN KEY (rent_id) REFERENCES public.rent_land(rent_id),
	CONSTRAINT rent_payment_fk_1 FOREIGN KEY (log_transactions_id) REFERENCES public.log_transactions(log_transactions_id)
);

CREATE TABLE public.hire_purchase (
	hire_purchase_id serial NOT NULL,
	land_token_id varchar NOT NULL,
	"period" serial NOT NULL,
	price float4 NOT NULL,
	fees float4 NOT NULL,
	created_at timestamp(0) NOT NULL,
	updated_at timestamp(0) NOT NULL,
	start_date timestamp(0) NOT NULL,
	end_date timestamp(0) NOT NULL,
	last_payment timestamp(0) NOT NULL,
	is_delete bool NOT NULL,
	CONSTRAINT hire_purchase_pk PRIMARY KEY (hire_purchase_id),
	CONSTRAINT hire_purchase_fk FOREIGN KEY (land_token_id) REFERENCES public.land(land_token_id)
);

CREATE TABLE public.hire_purchase_payment (
	hire_purchase_payment_id serial NOT NULL,
	hire_purchase_id serial NOT NULL,
	log_transactions_id serial NOT NULL,
	price float4 NOT NULL,
	fees float4 NOT NULL,
	created_at timestamp(0) NOT NULL,
	updated_at timestamp(0) NOT NULL,
	CONSTRAINT hire_purchase_payment_pk PRIMARY KEY (hire_purchase_payment_id),
	CONSTRAINT hire_purchase_payment_fk FOREIGN KEY (hire_purchase_id) REFERENCES public.hire_purchase(hire_purchase_id),
	CONSTRAINT hire_purchase_payment_fk_1 FOREIGN KEY (log_transactions_id) REFERENCES public.log_transactions(log_transactions_id)
);

ALTER TABLE public.land_market ADD rent_type serial NOT NULL;
ALTER TABLE public.land_market ADD CONSTRAINT land_market_fk_3 FOREIGN KEY (rent_type) REFERENCES public.rent_type(rent_type_id);


INSERT INTO public.notification_activity (activity_id,activity_name)
	VALUES (3,'Rent');


ALTER TABLE public.rent_land ADD renter_token_id varchar NOT NULL;
ALTER TABLE public.rent_land ADD CONSTRAINT rent_land_fk_3 FOREIGN KEY (renter_token_id) REFERENCES public."user"(user_token_id);


ALTER TABLE public.rent_payment ADD renter_token_id varchar NOT NULL;
ALTER TABLE public.rent_payment ADD CONSTRAINT rent_payment_fk_2 FOREIGN KEY (renter_token_id) REFERENCES public."user"(user_token_id);


INSERT INTO public.log_type (log_type_id,log_type_name)
	VALUES (5,'Payout');




ALTER TABLE public.hire_purchase ADD renter_token_id varchar NOT NULL;
ALTER TABLE public.hire_purchase ADD CONSTRAINT hire_purchase_fk1 FOREIGN KEY (renter_token_id) REFERENCES public."user"(user_token_id);

ALTER TABLE public.hire_purchase_payment ADD renter_token_id varchar NOT NULL;
ALTER TABLE public.hire_purchase_payment ADD CONSTRAINT hire_purchase_payment_fk2 FOREIGN KEY (renter_token_id) REFERENCES public."user"(user_token_id);

INSERT INTO public.land_status (land_status_id,land_status_name)
	VALUES (0,'Waiting transaction');

ALTER TABLE public.land ADD price float4 NULL;


ALTER TABLE public.log_transactions ADD elapsed_time int8 NULL;
