//importing the react router tools to creat and manage the different pages in my gallery
import { Routes, Route, Navigate, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import apiKey from './config.js'

// I am creating a Photo component to display one image
// I use the photo prop to access the image URL and description
 function Photo({ photo }) {
   return (
     <li>
       <img src={photo.webformatURL} alt={photo.tags} />
     </li>
   )
 }
 // I am creating a PhotoList component to display all my photos
 // I use map to create a separate Photo component for each image
 function PhotoList({ photos, title }) {
   return (
     <div className="photo-container">
       <h2>{title}</h2>
       <ul>
         {photos.map((photo) => (
           <Photo key={photo.id} photo={photo} />
         ))}
       </ul>
     </div>
   )
 }

 // I am creating a Search component so users can search for photos
 // The form includes an input for typing and a button for submitting
 // I will connect the search functionality when I work with the Pixabay API

 function Search({ fetchPhotos }) {
  const [query, setQuery] = useState('')

  //using navigate to change the url when someone searches
  const navigate = useNavigate()
  function handleSubmit(event) {
    event.preventDefault()
    const searchTerm = query.trim()
if (!searchTerm) return
fetchPhotos(searchTerm)
navigate(`/search/${encodeURIComponent(searchTerm)}`)
  }
   return (
     <form className="search-form" onSubmit={handleSubmit}>
       <input 
       type="search" 
       placeholder="Search" 
       value={query}
       onChange={(e) => setQuery(e.target.value)}
       />
       <button type="submit">Search</button>
     </form>
   )
 }

 // App is my main component that brings everything together
 function App() {
   // I am starting with an empty array because Pixabay will provide my actual photo data later
   const [photos, setPhotos] = useState([])

//checking what gallery pagee the user is viewing

  const location = useLocation()

   async function fetchPhotos(query) {
    try {
      const response = await fetch(
  `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}&image_type=photo`
)
        if (!response.ok) {
          throw new Error('Unable to fetch photos') }
    
      const data = await response.json()
      setPhotos(data.hits)
    }
      catch (error) {
        console.error('Error fetching photos:', error)
      }
          }

//check url to load the photos for the country selected
useEffect(() => {
  const query = location.pathname.slice(1)
  if (['italy', 'mexico', 'spain'].includes(query)) {
    Promise.resolve().then(() =>
      fetchPhotos(query)
  )
}
}, [location.pathname])

   // I am displaying Search above my photo results
   // I pass the photos and page title to PhotoList
   return (
     <main className="container">
       <Search fetchPhotos={fetchPhotos} />
       <Nav />
       {/* creating routes for each galler page */}
       <Routes>
          <Route path="/" element={<Navigate to="/italy" replace />} />
          <Route path="/italy" element={<PhotoList photos={photos} title="Italy" />} />
          <Route path="/mexico" element={<PhotoList photos={photos} title="Mexico" />} />
          <Route path="/spain" element={<PhotoList photos={photos} title="Spain" />} />
          <Route path="/search/:query" element={<PhotoList photos={photos} title="Search Results" />} />
       </Routes>
     </main>
   )
 }

 // I export App so React can display it in the browser
 export default App

 //I am creating a Nav componenent so that users can browwe different photo categories wihtout using the sarch bar and then I will connect these links to react router later
  function Nav() {
    return (
      <nav className="main-nav">
        <ul>
          <li><NavLink to="/italy">Italy</NavLink></li>
          <li><NavLink to="/mexico">Mexico</NavLink></li>
          <li><NavLink to="/spain">Spain</NavLink></li>
        </ul>
      </nav>
    )  
  }
