package com.cinehub.service;

import com.cinehub.dto.MoviePageResponse;
import com.cinehub.exception.BadRequestException;
import com.cinehub.repository.GenreRepository;
import com.cinehub.repository.MovieRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MovieServiceImplTest {

    @Mock
    private MovieRepository movieRepository;

    @Mock
    private GenreRepository genreRepository;

    @InjectMocks
    private MovieServiceImpl movieService;

    @Test
    void searchReturnsPageMetadataAndNormalizesFilters() {
        when(movieRepository.search(org.mockito.ArgumentMatchers.eq("arrival"),
                org.mockito.ArgumentMatchers.eq("sci-fi"), org.mockito.ArgumentMatchers.any()))
                .thenReturn(new PageImpl<>(List.of(), PageRequest.of(1, 10), 0));

        MoviePageResponse response = movieService.search("  arrival ", " sci-fi ", 1, 10);

        assertEquals(1, response.page());
        assertEquals(10, response.size());
        assertEquals(0, response.totalElements());
        verify(movieRepository).search(org.mockito.ArgumentMatchers.eq("arrival"),
                org.mockito.ArgumentMatchers.eq("sci-fi"), org.mockito.ArgumentMatchers.any());
    }

    @Test
    void searchRejectsOutOfRangePageSizeBeforeQuerying() {
        assertThrows(BadRequestException.class, () -> movieService.search(null, null, 0, 101));
        verifyNoInteractions(movieRepository, genreRepository);
    }
}
