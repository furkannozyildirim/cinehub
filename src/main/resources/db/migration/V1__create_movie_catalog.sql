CREATE TABLE genres (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE UNIQUE INDEX uq_genres_name_lower ON genres (LOWER(name));

CREATE TABLE movies (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    overview TEXT NOT NULL,
    poster_url VARCHAR(2048),
    backdrop_url VARCHAR(2048),
    release_date DATE NOT NULL,
    runtime_minutes INTEGER NOT NULL,
    rating NUMERIC(4, 2) NOT NULL,
    vote_count BIGINT NOT NULL DEFAULT 0
);

CREATE TABLE movie_genres (
    movie_id BIGINT NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    genre_id BIGINT NOT NULL REFERENCES genres(id),
    PRIMARY KEY (movie_id, genre_id)
);

CREATE INDEX ix_movie_genres_genre_id ON movie_genres (genre_id);
CREATE INDEX ix_movies_release_date ON movies (release_date DESC);
