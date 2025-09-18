ALTER TABLE administrators
    ADD COLUMN is_news_viewed BOOLEAN DEFAULT FALSE;

ALTER TABLE administrators
    ADD COLUMN is_notif_viewed BOOLEAN DEFAULT FALSE;