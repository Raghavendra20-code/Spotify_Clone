import {createContext} from 'react';

const songContext = createContext({
    currentSong:null,
    setCurrentSong:(currentSong) =>{},
    soundPlayed:null,
    setSoundPlayed:() =>{},
    isPaused:null,
    setIsPaused:() =>{},
    isLikedSong:null,
    setIsLikedSong: () => {},
    volume:null,
    setVolume:()=>{}
})

export default songContext;