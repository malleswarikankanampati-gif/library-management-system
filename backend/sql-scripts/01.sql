SELECT * FROM authors;
SELECT * FROM books;
SELECT * FROM categories;
SELECT * FROM book_category;

DROP TABLE authors, books, categories, book_category
TRUNCATE TABLE authors, books, categories, book_category RESTART IDENTITY CASCADE;


SELECT 
    a.author_id,a.name AS author_name,a.biography,a.dob AS author_dob,a.author_img,b.book_id,b.title AS book_title,b.publisher,
    b.publication_year,b.total_Copies,b.available_copies,b.book_cover_img,c.category_id,c.name AS category_name,
	c.description AS category_description
FROM authors a
FULL OUTER JOIN books b ON a.author_id = b.author_id
FULL OUTER JOIN book_category bc ON b.book_id = bc.book_id
FULL OUTER JOIN categories c ON bc.category_id = c.category_id;



			

SELECT distinct b.*
	FROM books b
	JOIN authors a ON a.author_id = b.author_id
	JOIN book_category bc ON b.book_id = bc.book_id
	JOIN categories c ON bc.category_id = c.category_id
WHERE 
	UPPER(title) LIKE UPPER(CONCAT('%', 'the great', '%'))
	AND UPPER(b.publisher) LIKE UPPER(CONCAT('%', '', '%')) 
	AND b.publication_year >= 0
	AND b.publication_year <= 3000
	AND b.available_copies >= 0
ORDER BY b.title ASC










