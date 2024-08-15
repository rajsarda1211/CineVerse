import React, { useEffect, useRef, useState } from 'react';
import { Box, Input, Flex, Link, List, ListItem, InputGroup, InputRightElement, Heading, Button, useColorMode, useColorModeValue } from '@chakra-ui/react';
import { SearchIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
import { AppState } from '../context/AppProvider';

const Navbar = () => {
  const { setSearchQuery } = AppState();
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const suggestionBoxRef = useRef(null);
  const { colorMode, toggleColorMode } = useColorMode();

  // Get color values
  const navbarBg = useColorModeValue('gray.800', 'gray.900');
  const headingColor = useColorModeValue('teal.300', 'teal.400');
  const inputBg = useColorModeValue('gray.700', 'gray.200');
  const inputBorderColor = useColorModeValue('gray.600', 'gray.400');
  const searchIconColor = useColorModeValue('teal.300', 'teal.400');
  const suggestionBg = useColorModeValue('white', 'gray.800');
  const buttonBg = useColorModeValue('gray.200', 'gray.700');
  const buttonTextColor = useColorModeValue('gray.800', 'gray.200');

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchTerm(query);

    if (query.length > 2) {
      const response = await fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=d5ebde38&s=${query}`);
      const data = await response.json();
      if (data.Search) {
        setSuggestions(data.Search);
      } else {
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (movie) => {
    setSuggestions([]);
    setSearchQuery(movie.Title);  
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setSuggestions([]);
      setSearchQuery(e.target.value);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionBoxRef.current && !suggestionBoxRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Box
      bg={navbarBg}
      px={4}
      py={2}
      position="fixed"
      width="100%"
      top="0"
      zIndex="1000"
      height="70px"
    >
      <Flex align="center" justify="space-between" height="100%">
        <Link href="/" _hover={{ textDecoration: 'none' }}>
          <Heading color={headingColor} fontSize="2xl" fontWeight="bold">
            CineVerse
          </Heading>
        </Link>

        <Flex align="center" ml={4}>
          <Button
            onClick={toggleColorMode}
            bg={buttonBg}
            color={buttonTextColor}
            _hover={{ bg: useColorModeValue('gray.300', 'gray.600') }}
            mr={4}
          >
            {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          </Button>

          <InputGroup maxW="400px" position="relative" zIndex="1000">
            <Input
              placeholder="Search for a movie..."
              value={searchTerm}
              onChange={handleSearch}
              onKeyDown={handleKeyDown}
              color={useColorModeValue('white', 'gray.800')}
              bg={inputBg}
              borderColor={inputBorderColor}
              _placeholder={{ color: useColorModeValue('gray.400', 'gray.500') }}
              _hover={{ borderColor: 'teal.400' }}
              _focus={{ borderColor: 'teal.500', boxShadow: '0 0 0 1px teal.500' }}
            />
            <InputRightElement>
              <SearchIcon color={searchIconColor} />
            </InputRightElement>

            {suggestions.length > 0 && (
              <List 
                ref={suggestionBoxRef}
                bg={suggestionBg}
                mt={10}
                borderRadius="md"
                boxShadow="md"
                maxW="400px"
                mx="auto"
                zIndex="1000"
                position="absolute"
                left="0"
                right="0"
              >
                {suggestions.map((movie) => (
                  <ListItem key={movie.imdbID} p={2} borderBottom="1px solid #eee" cursor="pointer" onClick={() => handleSuggestionClick(movie)}>
                    {movie.Title} ({movie.Year})
                  </ListItem>
                ))}
              </List>
            )}
          </InputGroup>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;
