import React, {useState, useEffect, useCallback} from "react";
import axios from 'axios';

import 'semantic-ui-css/semantic.min.css';

import {
    Image,
    Card,
    Dropdown,
    Grid,
    Button
  } from "semantic-ui-react";

  import{
    addFollowing,
    removeFollowing,
    selectFollowings
  } from "../reducers/FollowingsSlice";

import { selectUserId } from "../reducers/UserIdSlice";

  
import { useSelector, useDispatch } from 'react-redux';
import NotificationPop from "../services/NotificationPopup";
import InfiniteScroll from 'react-infinite-scroll-component';
import Tweets from "../services/Tweets";



  const FavouritesComp = () =>{
    
    const userId = useSelector(selectUserId)
    const dispatch = useDispatch()
    const [isShow, setShow] = useState(false)
    const [favourites, setFavourites] = useState([])
    const [local_fav, setLocalFav] = useState([])
    // const [index, setIndex] = useState(5)
    const [scrollState, setScrollState] = useState('auto')
    const [isEnd, setEnd] = useState(false)


    const url_prefix = 'http://localhost:3001';

//https://stackoverflow.com/questions/55733903/how-to-align-a-text-and-a-button-element-in-the-div-right-next-to-each-other
    const style = {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            // height: '70px'

    }

    useEffect(()=>{
        (async() =>{ 

            const results = await axios.get(url_prefix+'/api/db/get/favourites', {
                params: {
                    userId:userId
                }
            })
            console.log(results)
            const tweets_fav = await axios.get(url_prefix+'/api/db/get/tweet', {
                params:{
                    tweetIds:results.data.map(i=>i.tweet_id)
                }
            })
            let data = tweets_fav.data

            console.log(data)
            setFavourites(data)
            setLocalFav(data.slice(0,5))
        })()
    },[])

    useEffect(()=>{
        window.localStorage.setItem('fav',JSON.stringify(favourites));
        // window.localStorage.setItem('local_fav',JSON.stringify(local_fav));
    }, [favourites])

    const appendMoreFav = () =>{
        if(local_fav.length === favourites.length){
            setEnd(true)
            return
        }
        setLocalFav(favourites.slice(0, local_fav.length+5))
    }

    // useEffect(()=>{
    //     setLocalFav(favourites.splice(0, index))
    // }, [index])

    const handleScrolling = () =>{
        if(!isEnd){
            console.log('scrolling')
            appendMoreFav()
        }
    }

    return(
        <>
             <div id="scrollableDiv" style={{ height: '100%', overflow: "auto", 'marginTop':'70px' }}>
                <InfiniteScroll 
                    style={{ overflowY: scrollState }}
                    dataLength={local_fav.length}
                    next={handleScrolling}
                    hasMore={!isEnd}
                    loader={<div className="ui active centered inline loader"></div>}
                    scrollThreshold={0.6}
                    // height does the trick????
                    height={500}
                    endMessage={
                        <p style={{textAlign:'center'}}><b>Yay! You've seen it all!</b></p>
                    }
                    scrollableTarget="scrollableDiv"
                    >
                    {<Tweets tweets = {local_fav} scroll={(val)=>setScrollState(val)} userId={userId} page={'fav'}/>}
                </InfiniteScroll>
            </div>
        </>
    );
  }

  export default FavouritesComp