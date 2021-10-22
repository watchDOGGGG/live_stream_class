CREATE TABLE paluserDT(
    palsid uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    palsname VARCHAR(255) NOT NULL,
    palsemail VARCHAR(255) UNIQUE NOT NULL,
    palsusername VARCHAR(255) NOT NULL,
    palssecrete VARCHAR(250) NOT NULL,
    palsverify BIGINT DEFAULT 0,
    palsgender VARCHAR(100) NOT NULL,
    palsphone VARCHAR(255) NOT NULL,
    palsscountry VARCHAR(255) ,
    palslocation VARCHAR(255) ,
    palsbio VARCHAR(255),
    joined TIMESTAMP NOT NULL
)
ALTER TABLE paluserDT
    ADD COLUMN joined TIMESTAMP NOT NULL

CREATE TABLE palsPostTB(
    postid uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    userid VARCHAR(500) NOT NULL,
    mention VARCHAR(200),
    postype VARCHAR(200) NOT NULL,
    posttext TEXT,
    likes BIGINT DEFAULT 0,
    comment BIGINT DEFAULT 0,
    shares BIGINT DEFAULT 0,
    dateadded TIMESTAMP NOT NULL
);
CREATE TABLE palPostlike(
    likeid uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    userid VARCHAR(500) NOT NULL,
    postedby VARCHAR(250) NOT NULL,
    postid VARCHAR(500) NOT NULL,
    dateLiked TIMESTAMP NOT NULL
)
CREATE TABLE palpostmedia(
    media uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    filecategory VARCHAR(200) NOT NULL,
    fileid VARCHAR(500) NOT NULL,
    _filename TEXT NOT NULL,
    userid VARCHAR(500) NOT NULL,
    filetype VARCHAR(200) NOT NULL,
    dateadded TIMESTAMP NOT NULL,
    deleted BIGINT DEFAULT 0
)
CREATE TABLE Palsuserfollow(
    folloid uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    userfrom VARCHAR(500) NOT NULL,
    userto VARCHAR(500) NOT NUll,
    followed BIGINT DEFAULT 0 NOT NULL,
    dateFollowed TIMESTAMP NOT NUll
)