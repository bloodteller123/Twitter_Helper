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
import { set } from "lodash";



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
            let data = []
            if(results.data.length!==0){
                const tweets_fav = await axios.get(url_prefix+'/api/db/get/tweet', {
                    params:{
                        tweetIds:results.data.map(i=>i.tweet_id)
                    }
                })
                data = tweets_fav.data
            }else{
                setEnd(true)
            }
            console.log(data)
            setFavourites(data)
            
        })()
    },[])

    useEffect(()=>{
        window.localStorage.setItem('fav',JSON.stringify(favourites));
        // window.localStorage.setItem('local_fav',JSON.stringify(local_fav));
        setLocalFav(favourites.slice(0,5))
    }, [favourites])

    const updateFav = (tweet) =>{
        setFavourites(prevT => prevT.filter(t => t.id!==tweet.id).map(t=>t))
        setShow(true)
    }


    const appendMoreFav = () =>{
        if(local_fav.length === favourites.length){
            setEnd(true)
            return
        }
        setLocalFav(favourites.slice(0, local_fav.length+5))
    }

    const handleScrolling = () =>{
        if(!isEnd){
            console.log('scrolling fav')
            appendMoreFav()
        }
    }

    return(
        <>
             <div id="scrollableDiv" style={{ height: '100%', overflow: "auto", 'marginTop':'70px' }}>
             {isShow?<NotificationPop isShow={isShow} setShow={setShow} title={'Remove from Favourites Successfully!'} />:<></>}
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
                    {<Tweets tweets = {local_fav} scroll={(val)=>setScrollState(val)} userId={userId} page={'fav'} updateFav={updateFav}/>}
                </InfiniteScroll>
            </div>
        </>
    );
  }

  export default FavouritesComp