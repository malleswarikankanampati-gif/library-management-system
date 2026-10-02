SELECT m.username AS username, m.email, m.status, r.name AS role_name
FROM members m
JOIN member_roles mr ON m.member_id = mr.member_id
JOIN roles r ON mr.role_id = r.role_id;

select * from members;
select * from member_roles;
select * from roles;
select * from book_requests;
select * from wishlist;
select * from borrow;
select * from borrow_history;

TRUNCATE TABLE members, member_roles RESTART IDENTITY CASCADE;
TRUNCATE TABLE wishlist RESTART IDENTITY CASCADE;
TRUNCATE TABLE borrow_history RESTART IDENTITY CASCADE;
