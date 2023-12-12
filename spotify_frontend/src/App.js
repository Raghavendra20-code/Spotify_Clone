import './output.css'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import LoginComponent from './routes/Login'
import SignupComponent from './routes/Singup';
import HomeComponent from './routes/Home';
import { useCookies } from 'react-cookie';
import { Navigate } from 'react-router-dom';
import LoggedInHomeComponent from './routes/LoggedInHome';
import UploadSong from './routes/UploadSong'
import MyMusic from './routes/MyMusic'
import songContext from './contexts/songContext';
import { useState } from 'react';
import SearchPage from './routes/SearchPage'
import Library from './routes/Library';
import SinglePlaylistView from './routes/SinglePlaylistView'
import LikeSongs from './routes/LikeSongs';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [cookie,setCookie] = useCookies(["token"]);
  const [currentSong,setCurrentSong] = useState(null);
  const [soundPlayed,setSoundPlayed] = useState(null);
  const [isPaused,setIsPaused] = useState(true);
  const [isLikedSong,setIsLikedSong] = useState(false);
  const [volume,setVolume] = useState(0.3);

  return (
    <div className="w-screen h-screen font-poppins">
      <ToastContainer/>
      <BrowserRouter>
        
          {
            cookie.token?
            (
              //Loggedin routes
              <songContext.Provider value={{currentSong,setCurrentSong, soundPlayed, setSoundPlayed, isPaused, setIsPaused,isLikedSong,setIsLikedSong,volume,setVolume}}>
                <Routes>           
                      <Route path='/home'  element={<LoggedInHomeComponent/>}/>
                      <Route path='/uploadSong' element={<UploadSong/>} />
                      <Route path='/myMusic' element={<MyMusic/>} />
                      <Route path='/search' element = {<SearchPage/>}/>
                      <Route path='/library' element = {<Library/>}/>
                      <Route path='/likedSongs' element = {<LikeSongs/>}/>
                      <Route path='/playlist/:playlistId' element = {<SinglePlaylistView/>}/>
                      <Route path='*' element = {<Navigate to={'/home'}/>}/>

                </Routes>
              </songContext.Provider>
            ):(
              //Loggedout routes
              <Routes>
                 <Route path='/home'  element={<HomeComponent/>}/>
                  <Route path='/login'  element={<LoginComponent/>}/>
                  <Route path='/signup'  element={<SignupComponent/>}/>
                  <Route path='*' element = {<Navigate to={'/login'}/>}/>
              </Routes>
            )
          }
          
      </BrowserRouter>
    
    </div>
  );
}

export default App;
