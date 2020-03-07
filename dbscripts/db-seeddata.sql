use cssnode;

-- THE SCRIPT WILL BE RE-EXECUTABLE WITHOUT AFFECTING EXISTIN DB DATA

INSERT IGNORE INTO `users`
(`id`, `givenname`, `password`, `username`, `public_profile`, `profile_image`,
`verification_code`, `account_locked`, `created_at`, `updated_at`)
VALUES
(1, 'Admin', '$2b$10$79GUptq4MloB1g2.UMKuZua0t1WvRJEz2tvRF1kSZY1uaGPUY5d0q', 'admin@css.com', 'Admin Profile', 'default-user.png'
0, false, now(), now());
default-user.png
INSERT IGNORE INTO `user_roles` (`user_id`, `role`)
VALUES (1, 'USER');

INSERT IGNORE INTO `user_roles` (`user_id`, `role`)
VALUES (1, 'ADMIN');

INSERT IGNORE INTO `helpintro` (`lang`, `pageid`, `helpintro`, `created_at`, `updated_at`)
VALUES ('en', '/home',
'
{
    "steps": [
      {
        "intro": "This is a home page"
      },
      {
        "element": "#selectlang",
        "intro": "Change lang here",
        "position": "left"
      },
      {
        "element": "#aboutus",
        "intro": "<b><u>This is about us</u></b><br/>second line",
        "position": "right"
      },
      {
        "element": "#terms",
        "intro": "This is terms and services",
        "position": "right"
      },
      {
        "element": "#policy",
        "intro": "This is policy",
        "position": "left"
      }
    ]
  }
', now(), now()

);


INSERT IGNORE INTO `helpintro` (`lang`, `pageid`, `helpintro`, `created_at`, `updated_at`)
VALUES ('en', '/contactus',
'
{
    "steps": [
      {
        "intro": "This is a contactus page"
      }
    ]
}    
', now(), now());


INSERT IGNORE INTO `helpintro` (`lang`, `pageid`, `helpintro`, `created_at`, `updated_at`)
VALUES ('en', '/aboutus',
'
{
  "steps": [

    {
     "element": "#aboutus",
     "intro": "<b><u>This is about us</u></b><br/>second line",
     "position": "right"
    }
  ]
}
', now(), now());

commit;