-- Restore original images for Holiday Giving Gala and Spring Career Fair
UPDATE public.events 
SET image = '/images/sheRisesEvent/7059925313154428637.jpg' 
WHERE id = 'holiday-giving-gala';

UPDATE public.events 
SET image = '/images/sheRisesEvent/693318440489445220.jpg' 
WHERE id = 'spring-job-fair';