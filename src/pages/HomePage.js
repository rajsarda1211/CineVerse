import React from 'react'
import Navbar from '../components/Navbar'
import Movies from '../components/Movies'
import { AppState } from '../context/AppProvider'

const HomePage = () => {
  const { movie } = AppState();
  return (
    <>
      <Navbar />
      {movie.length > 0 && <Movies />}
    </>
  )
}

export default HomePage