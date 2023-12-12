import React, { useContext, useLayoutEffect, useRef, useState } from 'react'
import spotify_logo from '../assets/images/spotify_logo_white.svg'
import IconText from '../Components/shared/IconText'
import { Icon } from '@iconify/react'
import TextWithHover from '../Components/shared/TextWithHover'
import {Howl,Howler} from 'howler'
import songContext from '../contexts/songContext'
import CreatePlaylistModal from '../modals/CreatePlaylistModal'
import AddToPlaylistModal from '../modals/AddToPlaylistModal'
import { makeAuthenticatedPOSTRequest } from '../utils/serverHelpers'
import { useCookies } from 'react-cookie'
import LogoutBox from '../modals/LogoutBox';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function LoggedInContainer({children,curActiveScreen}) {
    
    const {currentSong,soundPlayed, setSoundPlayed, isPaused, setIsPaused,isLikedSong,setIsLikedSong,volume,setVolume} = useContext(songContext);
    const [createPlaylistModalOpen,setCreatePlaylistModalOpen] = useState(false)
    const [addToPlaylistModalOpen,setAddToPlaylistModalOpen] = useState(false)
    const [logoutModal,setLogoutModal] = useState(false);
    const [cookie,setCookie] = useCookies(['firstName','lastName'])
    const [isVolume,setIsVolume] = useState(false)

   const {firstName,lastName} = cookie;

    const  firstUpdate = useRef(true);

    useLayoutEffect(() =>{
        //the following if statement if for prevent useeffect run at 1st render
        if(firstUpdate.current){
            firstUpdate.current = false;
            return;
        }
        if(!currentSong){
            return;
        }
        changeSound(currentSong.track)
    },[currentSong && currentSong.track])

    const addSongToPlaylist = async(playlistId) =>{
        const songId = currentSong._id;
        const payload = {playlistId,songId}
        //console.log(payload)
        const response = await makeAuthenticatedPOSTRequest("/playlist/add/song",payload);
        if(response._id){
            setAddToPlaylistModalOpen(false)
        } else if(response.message){
            toast(response.message, {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                });
            } else {
              toast('Song added to playlist successfully', {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                });
        }
    }

    const playSound = () =>{
        if(!soundPlayed){
            return
        }
        soundPlayed.play();
    }
    
    const changeSound = (songSrc) =>{
        if(soundPlayed){
            soundPlayed.stop();
        }
        let sound = new Howl({
            src: [songSrc],
            volume:0.19,
            html5: true
          });
          setSoundPlayed(sound)
          sound.play();
          setIsPaused(false)
    }

    const pauseSound = () =>{
        soundPlayed.pause();
    }

    const togglePlayPause = () =>{
        if(isPaused){
            playSound();
            setIsPaused(false)
        } else {
            pauseSound();
            setIsPaused(true)
        }
    }

    const postLikedSong = async () =>{
        const songId = currentSong._id
        const response = await makeAuthenticatedPOSTRequest('/song/add/likedSongs',{songId});
        //console.log('response',response);
        if(response.message){
            toast(response.message, {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                });
        }else{
            toast('song liked', {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                });
        }
        
    }

    const changeVolume = (e) =>{
        Howler.mute(false)
        setVolume(e.target.value);
        Howler.volume(parseFloat(volume/100).toFixed(2))
    }

    const addToPlaylist = () =>{
        setAddToPlaylistModalOpen(true);

    }

  return (
    <div className='h-full w-full bg-app-black'>
        {createPlaylistModalOpen && <CreatePlaylistModal closeModal = {()=>{setCreatePlaylistModalOpen(false)}}/>}
        {addToPlaylistModalOpen && <AddToPlaylistModal closeModal = {()=>setAddToPlaylistModalOpen(false)} addSongToPlaylist = {addSongToPlaylist}/>}
        {logoutModal && <LogoutBox closeModal={() => setLogoutModal(false)}/>}
        <div className={`${currentSong?"h-9/10":"h-full"} w-full flex`}>
            <div className='left-panel h-full w-1/5 bg-black flex flex-col justify-between pb-10'>
                <div>
                    <div className='logo p-6'>
                        <img src={spotify_logo}  alt='spotify logo' width={125}/>
                    </div>
                    <div className='py-5'>
                        <IconText 
                        iconName={"material-symbols:home"} 
                        displayText={"Home"}
                        targetLink={"/home"}
                        active={curActiveScreen === 'home'}
                        />
                        <IconText 
                        iconName={"material-symbols:search-rounded"} 
                        displayText={"Search"}
                        targetLink={"/search"}
                        active={curActiveScreen === 'search'}
                        />
                        <IconText 
                        iconName={"icomoon-free:books"} 
                        displayText={"Library"}
                        active={curActiveScreen === 'library'}
                        targetLink={'/library'}
                        />
                        <IconText 
                        iconName={"material-symbols:library-music-sharp"} 
                        displayText={"My Music"}
                        targetLink={"/myMusic"}
                        active={curActiveScreen === 'myMusic'}
                        />
                    </div>
                    <div className='pt-5'>
                        <IconText 
                        iconName={"material-symbols:add-box"} 
                        displayText={"Create Playlist"}
                        onClick={()=>setCreatePlaylistModalOpen(true)}
                        />
                        <IconText 
                        iconName={"mdi:cards-heart"} 
                        displayText={"Liked Songs"}
                        targetLink={'/likedSongs'}
                        active={curActiveScreen === 'likedSongs'}
                        />
                    </div>   
                </div>
                <div className='px-5'>
                    <div className='border border-gray-100 rounded-full text-white w-2/5 flex px-2 py-1 items-center justify-center hover:border-white cursor-pointer'>
                        <Icon icon="carbon:earth-europe-africa"/>
                        <div className='ml-2 text-sm font-semibold'>
                            English
                        </div>                    
                    </div>  
                </div>                    
            </div>
            <div className='right-panel h-full w-4/5 bg-app-black overflow-auto'>
                <div className='navbar w-full bg-black bg-opacity-30 h-1/10 flex items-center justify-end'>
                    <div className='w-1/2 flex h-full'>
                        <div className='w-2/3 flex justify-around items-center' >
                            <TextWithHover displayText={"Premium"}/>
                            <TextWithHover displayText={"Support"}/>
                            <TextWithHover displayText={"Download"}/>
                            <div className='h-1/2 border-r border-white'></div>
                        </div>
                        <div className='w-1/3 flex justify-around h-full items-center'>
                        <TextWithHover 
                        displayText={"Upload Song"}
                        target = "/uploadSong"
                        active = {curActiveScreen === 'uploadMusic'}
                        />
                        <div className='bg-white w-10 h-10 flex items-center justify-center rounded-full cursor-pointer'
                            onClick={()=>setLogoutModal(!logoutModal)}
                        >
                            {(firstName[0]+lastName[0]).toUpperCase()}
                        </div>
                        </div>
                        
                    </div>
                </div>
                <div className='main-content p-8 pt-0 overflow-auto'>
                    {children}
                </div>
            </div>
            </div>
            {
                currentSong &&
                <div className='songBar w-full h-1/10 bg-black bg-opacity-20 text-white flex items-center px-4'>
                    <div className=' w-1/4 flex items-center'>
                        <img src = {currentSong.thumbnail}
                        alt = "Current Song"
                        className='h-14 w-14 rounded'
                        />
                        <div className='pl-4'>
                            <div className='text-sm hover:underline cursor-pointer'>{currentSong.name}</div>
                            <div className='text-xs text-gray-500 hover:underline cursor-pointer'>{currentSong.artist.firstName+" "+currentSong.artist.lastName}</div>
                        </div>
                        
                    </div>
                    <div className='songControlar w-1/2 flex justify-center h-full flex-col items-center'>
                        <div className='flex w-1/3 justify-between items-center'>
                            <Icon icon={"ph:shuffle-fill"}
                                fontSize={30}
                                className='cursor-pointer text-gray-500 hover:text-white'
                                />
                            <Icon icon={"mdi:skip-previous-outline"}
                            fontSize={30}
                            className='cursor-pointer text-gray-500 hover:text-white'/>
                            <Icon icon = {isPaused?"ic:baseline-play-circle":`ic:baseline-pause-circle`}
                            fontSize={50}
                            className='cursor-pointer text-gray-500 hover:text-white'
                            onClick={togglePlayPause}
                            />
                            <Icon icon={"mdi:skip-next-outline"}
                            fontSize={30}
                            className='cursor-pointer text-gray-500 hover:text-white'/>
                            <Icon icon = "ic:twotone-repeat"
                            fontSize={30}
                            className='cursor-pointer text-gray-500 hover:text-white'/>
                        </div>
                        {/* <div>Progress Bar</div> */}
                    </div>
                        <div className='w-1/4 flex justify-end items-center pr-4 space-x-4'>
                            <Icon 
                                icon="tabler:volume-3" 
                                fontSize={30}
                                className='cursor-pointer text-gray-500 hover:text-white'
                                onClick={() => Howler.mute(true)}
                            />
                            <Icon icon="tabler:volume" 
                                fontSize={30}
                                className='cursor-pointer text-gray-500 hover:text-white'
                                onClick={e => setIsVolume(!isVolume)}
                            />
                            {
                                isVolume &&
                                    <input 
                                        type='range' 
                                        min = "0" 
                                        max = "100" 
                                        value={volume} 
                                        className='cursor-pointer transition duration-500'
                                        onChange={e =>changeVolume(e)}
                                    />
                            }
                            
                            <Icon icon = 'ic:round-playlist-add'
                            fontSize={30}
                            className='cursor-pointer text-gray-500 hover:text-white'
                            onClick={addToPlaylist}
                            />
                            <Icon icon={`${isLikedSong?"mdi:cards-heart":"ph:heart-bold"}`}
                            fontSize={25}
                            className='cursor-pointer text-gray-500 hover:text-white'
                            onClick={() => {
                                setIsLikedSong(true);
                                postLikedSong();
                            }}
                            />
                        </div>
                </div>
                
            }
        </div>
    )
}

export default LoggedInContainer