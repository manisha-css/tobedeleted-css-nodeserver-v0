use cssnode;

-- THE SCRIPT WILL BE RE-EXECUTABLE WITHOUT AFFECTING EXISTIN DB DATA

INSERT IGNORE INTO `users`
(`id`, `givenname`, `password`, `username`, `public_profile`,
`verification_code`, `account_locked`, `created_at`, `updated_at`)
VALUES
(1, 'Admin', '$2b$10$79GUptq4MloB1g2.UMKuZua0t1WvRJEz2tvRF1kSZY1uaGPUY5d0q', 'admin@css.com', 'Admin Profile',
0, false, now(), now());

INSERT IGNORE INTO `user_roles` (`user_id`, `role`)
VALUES (1, 'USER');

INSERT IGNORE INTO `user_roles` (`user_id`, `role`)
VALUES (1, 'ADMIN');

INSERT IGNORE INTO `helpintro` (`lang`, `pageid`, `helpintro`, `created_at`, `updated_at`))
VALUES ('en', 'HOME',
'
{
    steps: [
      {
        intro: "This is a home page"
      },
      {
        element: "#selectlang",
        intro: "Change lang here",
        position: "left"
      },
      {
        element: "#aboutus",
        intro: "<b><u>This is about us</u></b><br/>second line",
        position: "right"
      },
      {
        element: "#terms",
        intro: "This is terms and services",
        position: "right"
      },
      {
        element: "#policy",
        intro: "This is policy",
        position: "left"
      }
    ],
    showProgress: true,
    skipLabel: "Skip",
    doneLabel: "Done",
    nextLabel: "Next",
    prevLabel: "Prev",
    overlayOpacity: "0.5"
  }
', now(), now()

);


INSERT IGNORE INTO `helpintro` (`lang`, `pageid`, `helpintro`)
VALUES ('en', 'ABOUTUS',
'
{
    steps: [
      {
        intro: "This is a contactus page"
      },
      {
        element: "#selectlang",
        intro: "Submit form here",
        position: "left"
      }
    ],
    showProgress: true,
    skipLabel: "Skip",
    doneLabel: "Done",
    nextLabel: "Next",
    prevLabel: "Prev",
    overlayOpacity: "0.5"
  }
');


INSERT IGNORE INTO `helpintro` (`lang`, `pageid`, `helpintro`)
VALUES ('en', 'CONTACTUS',
'
{
    steps: [
     
     
      {
        element: "#aboutus",
        intro: "<b><u>This is about us</u></b><br/>second line",
        position: "right"
      }
    ],
    showProgress: true,
    skipLabel: "Skip",
    doneLabel: "Done",
    nextLabel: "Next",
    prevLabel: "Prev",
    overlayOpacity: "0.5"
  }
');

commit;