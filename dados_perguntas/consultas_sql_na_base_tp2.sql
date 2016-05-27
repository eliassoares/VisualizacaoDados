//seleciona area de computação
SELECT * FROM dataviva.attrs_course_hedu where name_pt like'%sistemas%';
SELECT * FROM dataviva.attrs_course_hedu where name_pt like'%comp%';

// seleciona valores dos cursos da area de computação
SELECT year,university_id,course_hedu_id,enrolled,students,age,graduates,entrants,morning,afternoon,night,full_time,enrolled_rca  FROM dataviva.hedu_yuc where course_hedu_id ='146F05' or course_hedu_id = '461M03' or course_hedu_id ='48' or course_hedu_id ='481A02' or course_hedu_id ='481C01' or course_hedu_id ='481C02' or course_hedu_id ='481E01' or course_hedu_id ='481I01' or course_hedu_id ='483P02' or course_hedu_id ='523E04' or course_hedu_id ='523R01' or course_hedu_id ='345A05' or course_hedu_id ='345A21' or course_hedu_id ='481S01' or course_hedu_id ='483A01' or course_hedu_id ='483A02' or course_hedu_id ='483S02';

// SELECIONA CURSOS DA AREA DE COMPUTAÇÃO , UNIVERSIDADE , POR ANO COM DESCRIÇÃO DE CURSO
SELECT 
    year,
    university_id,
	b.name_pt,
    SUM(enrolled),
    sum(students),
    sum(graduates),
    sum(entrants),
    sum(morning),
    sum(afternoon),
    sum(night),
    sum(full_time)
FROM 
    dataviva.hedu_yuc a LEFT JOIN dataviva.attrs_course_hedu b 
	on a.course_hedu_id=b.id
where
    course_hedu_id = '146F05'
        or course_hedu_id = '461M03'
        or course_hedu_id = '48'
        or course_hedu_id = '481A02'
        or course_hedu_id = '481C01'
        or course_hedu_id = '481C02'
        or course_hedu_id = '481E01'
        or course_hedu_id = '481I01'
        or course_hedu_id = '483P02'
        or course_hedu_id = '523E04'
        or course_hedu_id = '523R01'
        or course_hedu_id = '345A05'
        or course_hedu_id = '345A21'
        or course_hedu_id = '481S01'
        or course_hedu_id = '483A01'
        or course_hedu_id = '483A02'
        or course_hedu_id = '483S02'
GROUP BY 
		year,
		university_id,
		b.name_pt;

//seleciona universidade e curso por ano

SELECT 
    year,
    university_id,
	SUM(enrolled),
    sum(students),
    sum(graduates),
    sum(entrants),
    sum(morning),
    sum(afternoon),
    sum(night),
    sum(full_time)
FROM 
    dataviva.hedu_yuc 

GROUP BY 
		year,
		university_id;

// seleciona por curso e ano 

SELECT 
    year,
    course_hedu_id,
	SUM(enrolled),
    sum(students),
    sum(graduates),
    sum(entrants),
    sum(morning),
    sum(afternoon),
    sum(night),
    sum(full_time)
FROM 
    dataviva.hedu_yuc 

GROUP BY 
		year,
		course_hedu_id;
// seleciona por universidade ano, nome universidade in/out
SELECT 
    year,
    university_id,
	b.name_pt,
    SUM(enrolled),
    sum(students),
    sum(graduates),
    sum(entrants),
    sum(morning),
    sum(afternoon),
    sum(night),
    sum(full_time)
FROM 
    dataviva.hedu_yuc a LEFT JOIN dataviva.attrs_university b 
	on a.university_id=b.id

GROUP BY 
		year,
		university_id,
		b.name_en;
