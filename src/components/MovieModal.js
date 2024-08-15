import React, { useState, useEffect } from "react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, Image, Box, Text, Spinner } from "@chakra-ui/react";
import axios from "axios";
import youtubeAPI from "../api/youtubeApi";

const MovieModal = ({ isOpen, onClose, movieId }) => {
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trailerUrl, setTrailerUrl] = useState("");
  const apiKey = process.env.REACT_APP_OMDB_API_KEY;

  useEffect(() => {
    if (movieId) {
      const fetchMovieDetails = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            `https://www.omdbapi.com/?i=${movieId}&apikey=${apiKey}`
          );
          setMovieDetails(response.data);

          const youtubeResponse = await youtubeAPI.get('/search', {
            params: {
              q: `${response.data.Title} ${response.data.Year} trailer`,
              type: 'video'
            }
          });
          
          const trailer = youtubeResponse.data.items[0];

          if (trailer) {
            setTrailerUrl(`https://www.youtube.com/embed/${trailer.id.videoId}`);
          }
        } catch (error) {
          console.error("Error fetching movie details or trailer:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchMovieDetails();
    }
  }, [movieId]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent width="70%">
        <ModalHeader textAlign="center">{movieDetails?.Title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {loading ? (
            <Spinner size="xl" />
          ) : (
            <Box display="flex" flexDirection={{ base: "column", md: "row" }}>
              <Image
                src={movieDetails?.Poster}
                alt={movieDetails?.Title}
                borderRadius="lg"
                boxSize="300x150"  
                objectFit="cover"
                mr={6}
              />
              <Box>
                <Text mb={2}><strong>Plot:</strong> {movieDetails?.Plot}</Text>
                <Text mb={2}><strong>Director:</strong> {movieDetails?.Director}</Text>
                <Text mb={2}><strong>Writer:</strong> {movieDetails?.Writer}</Text>
                <Text mb={2}><strong>Actors:</strong> {movieDetails?.Actors}</Text>
                <Text mb={2}><strong>Release Date:</strong> {movieDetails?.Released}</Text>
                <Text mb={2}><strong>Genre:</strong> {movieDetails?.Genre}</Text>
                <Text mb={2}><strong>Runtime:</strong> {movieDetails?.Runtime}</Text>
                <Text mb={2}><strong>Box Office:</strong> {movieDetails?.BoxOffice}</Text>
                <Text mb={2}>
                  <strong>IMDb Rating:</strong> {`${movieDetails?.imdbRating} (${movieDetails?.imdbVotes} votes)`}
                </Text>
                <Text mb={2}><strong>Rotten Tomatoes:</strong> {movieDetails?.Ratings?.find(rating => rating.Source === "Rotten Tomatoes")?.Value}</Text>
              </Box>
            </Box>
          )}
          {trailerUrl && (
            <Box mt={6}>
              <Text fontSize="lg" fontWeight="bold">Watch Trailer</Text>
              <Box
                position="relative"
                paddingBottom="56.25%" // 16:9 aspect ratio
                height={0}
                overflow="hidden"
              >
                <Box
                  as="iframe"
                  position="absolute"
                  top={0}
                  left={0}
                  width="100%"
                  height="100%"
                  src={trailerUrl}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </Box>
            </Box>
          )}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MovieModal;
