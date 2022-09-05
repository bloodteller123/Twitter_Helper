import React, {useState, useEffect, useCallback} from "react";

import 'semantic-ui-css/semantic.min.css';
import '../CSS/Tweet.scss';

import {
    Image,
    Card,
    Button,
    Icon
  } from "semantic-ui-react";

import Tweet from "./Tweet";

const Tweets = ({tweets, scroll, userId, page, updateFav}) =>{
    // console.log(tweets)
    // const [clickId, setClickID] = useState(0)
    // const style = {
    //     // height: 30,
    //     border: "1px solid green",
    //     margin: 6,
    //     padding: 8,
    //     width: "auto"
    //   };

    // const handleClickContainer = (e) =>{
    //     // e.target.style.display='none'
    //     console.log('exit full screen')
    //     setClickID(0)
    //     scroll('auto')
    // }

    // const handleClickImg = (e) =>{
    //     console.log('click image')
    //     const id = e.target.getAttribute('data-key')
    //     console.log(id)
    //     setClickID(id)
    //     scroll('hidden')
    // }

    const handleClickSave = () =>{

    }

    return (
        <>
            {tweets && tweets.map(tweet =>(
                <Tweet tweet={tweet} scroll={scroll} userId={userId} page={page} updateFav={updateFav}/>
            ))}
        </>
    );
}

export default Tweets