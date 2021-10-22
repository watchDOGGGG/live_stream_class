CREATE DATABASE palsElearning;

CREATE TABLE palsEMedia(
    media uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    filecategory VARCHAR(200) NOT NULL,
    __filename TEXT NOT NULL,
    startedby VARCHAR(500) NOT NULL,
    __address TEXT NOT NULL,
    filetype VARCHAR(200) NOT NULL,
    dateadded TIMESTAMP NOT NULL,
    deleted BIGINT DEFAULT 0
);
