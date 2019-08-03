use cssnode;

-- THE SCRIPT WILL BE RE-EXECUTABLE WITHOUT AFFECTING EXISTIN DB DATA

INSERT IGNORE INTO `users`
(`id`, `givenname`, `password`, `username`, `public_profile`,
`verification_code`, `account_locked`, `created_at`, `updated_at`)
VALUES
(1, 'Admin', '$2b$10$79GUptq4MloB1g2.UMKuZua0t1WvRJEz2tvRF1kSZY1uaGPUY5d0q', 'admin@css.com', 'Admin Profile',
0, false, '2019-07-22 00:00:00', '2019-07-22 00:00:00');

INSERT IGNORE INTO `user_roles` (`user_id`, `role`)
VALUES (1, 'USER');

INSERT IGNORE INTO `user_roles` (`user_id`, `role`)
VALUES (1, 'ADMIN');
commit;