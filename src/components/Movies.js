import React, { useState } from "react";
import { AppState } from "../context/AppProvider";
import { Card, CardBody, Image, Heading, Box, Button, useColorModeValue, Flex } from "@chakra-ui/react";
import MovieModal from "./MovieModal";

const Movies = () => {
  const { movie } = AppState();
  const cardBg = useColorModeValue('#4dd8d4', 'inherit');
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 16;

  const openModal = (id) => {
    setSelectedMovieId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMovieId(null);
  };

  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = movie.slice(indexOfFirstMovie, indexOfLastMovie);

  const totalPages = Math.ceil(movie.length / moviesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= maxPagesToShow; i++) {
          pageNumbers.push(i);
        }
      } else if (currentPage > 3 && currentPage < totalPages - 2) {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pageNumbers.push(i);
        }
      } else {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      }
    }

    return pageNumbers.map((number) => (
      <Button
        key={number}
        onClick={() => handlePageChange(number)}
        isActive={currentPage === number}
        colorScheme={currentPage === number ? "teal" : "gray"}
        mx={1}
      >
        {number}
      </Button>
    ));
  };

  return (
    <Box>
      <Flex mt = {16} wrap="wrap" justifyContent="center" gap={5}>
        {currentMovies.map((currMovie) => (
          <Box key={currMovie.imdbID} maxW="sm">
            <Card 
              width="300px" 
              height="520px"
              boxShadow="lg"
              borderRadius="lg"
              bg={cardBg}
              onClick={() => openModal(currMovie.imdbID)}
              _hover={{ boxShadow: "2xl", transform: "scale(1.04)" }}
            >
              <CardBody 
                display="flex" 
                flexDirection="column" 
                alignItems="center" 
              >
                <Box
                  width="280px"
                  height="440px"
                  backgroundImage="url(https://img.freepik.com/free-photo/background-gradient-lights_23-2149304985.jpg)"
                  backgroundRepeat="no-repeat"
                  backgroundSize="cover"
                  backgroundPosition="center"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Image
                    src={currMovie.Poster}
                    alt={`${currMovie.Title} Poster`}
                    borderRadius="lg"
                    width="97%" 
                    height="97%" 
                    objectFit="cover"
                  />
                </Box>
                <Box
                  width="90%"
                  height="35px"
                  marginTop="10px"
                  marginBottom="10px"
                  overflow="hidden"
                >
                  <Heading
                    size="md"
                    textAlign="center"
                    whiteSpace="nowrap"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    _hover={{
                      whiteSpace: 'normal',
                      overflow: 'visible',
                      textOverflow: 'clip',
                      padding: '0 5px',
                      position: 'absolute',
                      zIndex: 1,
                      width: '80%',
                    }}
                  >
                    {`${currMovie.Title} (${currMovie.Year})`}
                  </Heading>
                </Box>
              </CardBody>
            </Card>
          </Box>
        ))}
      </Flex>
      
      <Box mt={8} mb={4} display="flex" justifyContent="center" alignItems="center">
        <Button
          onClick={() => setCurrentPage(currentPage - 1)}
          isDisabled={currentPage === 1}
          mr={2}
          colorScheme="teal"
          _hover={{ bg: "teal.500", color: "white" }} 
        >
          Previous
        </Button>

        {renderPageNumbers()}

        <Button
          onClick={() => setCurrentPage(currentPage + 1)}
          isDisabled={currentPage === totalPages}
          ml={2}
          colorScheme="teal"
          _hover={{ bg: "teal.500", color: "white" }} 
        >
          Next
        </Button>
      </Box>

      <MovieModal
        isOpen={isModalOpen}
        onClose={closeModal}
        movieId={selectedMovieId}
      />
    </Box>
  );
};

export default Movies;
