import React, {useState, useEffect, useCallback} from "react";
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';
import qs from 'qs';

import Tweets from './Tweets';

import 'semantic-ui-css/semantic.min.css';

import {
    Image,
    Card,
    Dropdown
  } from "semantic-ui-react";



  const ScrollComponent = ({user}) =>{
    const[tweets, setTweets] = useState([])
    console.log(user)

    const getTweet = async ()=>{
        // const res = await axios.get("http://localhost:3001/api/twitter/user", {
        //     params:{
        //         username: 'suku8899'
        //     }
        // });
        // console.log(res.data)
        const tweets_res = await axios.get("http://localhost:3001/api/twitter/id/tweet",{
            params: {
                ids: [user.id]
              },
              paramsSerializer: params => {
                return qs.stringify(params)
              }
        });
        console.log(tweets_res.data.length)
        const filtered_res = tweets_res.data.map((res) =>{
            const id = res.id_str
            const full_text = res.full_text
            const imgurl = res.user.profile_image_url_https
            const screen_name = res.user.screen_name
            const name = res.user.name

            return {
                id,
                full_text,
                imgurl,
                screen_name,
                name
            }
        })

        // append arrays to a array state
        // https://stackoverflow.com/questions/70690542/react-js-how-to-properly-append-multiple-items-to-an-array-state-using-its-use
        setTweets((prevTweets) => prevTweets.concat([...filtered_res]))
        console.log(tweets)
    }
    

    return (
        <div id="scrollableDiv" style={{ height: 300, overflow: "auto" }}>
            <InfiniteScroll
            dataLength={tweets.length}
            next={getTweet}
            hasMore={true}
            loader={<h5>Loading...</h5>}
            scrollableTarget="scrollableDiv"
            >
            {<Tweets tweets = {tweets}/>}
            </InfiniteScroll>
      </div>
    )

  }

  export default ScrollComponent