import React, {useState, useEffect, useCallback} from "react";
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux';
import qs from 'qs';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link } from "react-router-dom";
import _ from 'lodash';

import Tweets from "./services/Tweets";

import 'semantic-ui-css/semantic.min.css';
import './CSS/SemanticUI.scss';
import './CSS/Homepage.scss';

import {
  Divider,
  Grid,
  Header,
  Menu,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Button
} from "semantic-ui-react";

import{
    addFollowing,
    removeFollowing,
    selectFollowings,
    addFollowingBulk,
    updateFollowing
  } from "./reducers/FollowingsSlice";

  import { selectUserId } from "./reducers/UserIdSlice";


const Home = () =>{
    const followings_list = useSelector(selectFollowings)
    const userId = useSelector(selectUserId)
    const dispatch = useDispatch()

    const url_prefix = 'http://localhost:3001';

    const [loggedIn, setLogin] = useState(false)
    // const[user, setUser] = useState([])
    const [newUser, setNewuser] = useState(true)

    const[tweets, setTweets] = useState([])

    const [isEnd, setisEnd] = useState(false)

    const [timeframe, setTimeframe] = useState(1)

    const [followings_lst_str, setFollowings_lst_str] = useState([])

    const [scrollState, setScrollState] = useState('auto')

    const [isGetTweet, setGetTweet] = useState(false)

    const options = [
        { key: 1, text: '24 hrs', value: 1 },
        { key: 2, text: '48 hrs', value: 2 },
        { key: 3, text: '72 hrs', value: 3 },
        { key: 4, text: 'unlimited', value: 0 },
      ]

    useEffect(() =>{
    
        (async () => {
            console.log("State Changed")
            console.log('userId', userId)
            if(userId!=='' && tweets.length==0 ){
                console.log('load first batch')
                console.log("or add dummy followings if it's empty")
                // cz
                //if(newUser || followings_list.length==0) {
                // if(followings_list.length==0) {
                const exist = await axios.get(url_prefix+'/api/db/users/exists')
                if(!exist){
                    // https://stackoverflow.com/questions/52993463/how-to-promise-all-for-nested-arrays
                    // https://stackoverflow.com/questions/57066137/axios-requests-in-parallel
                    console.log('new user')
                    const first_two_followings = await axios.get(url_prefix+"/api/twitter/user/following", {
                        params:{
                            id: userId
                        }
                    })
                    console.log('first_two_followings', first_two_followings)

                    const tasks = first_two_followings.data.map(async(following,i) =>{
                        const axiosCalls = [
                            axios.get(url_prefix+"/api/twitter/id/tweet", {
                                params: {
                                    ids: [following.id],
                                    str_ids: undefined,
                                    timeframe: timeframe
                                },
                                paramsSerializer: params => {
                                    return qs.stringify(params)
                                }
                            }), 
                            axios.get(url_prefix+"/api/twitter/users/search", {
                                params: {
                                    userName: following.username
                                }
                            })
                    ] 
                        return Promise.all(axiosCalls).then(response => {
                            const [initial_tweets, iniital_following] = response
                            // returning the first result (exact match) from search
                            const first_result = iniital_following.data[0]
                            const first_tweets = initial_tweets.data
                            return {first_tweets, iniital_following:first_result}
                          });
                    })

                    Promise.all(tasks).then( res => {
                        
                        console.log(res); 
                        const iniital_followings = res.map(obj => obj.iniital_following)
                        const initial_tweets = res.map(obj => obj.first_tweets)
                        console.log('initial_tweets', initial_tweets)

                        // setFollowings_lst_str(iniital_followings.map((i,j) => ({id: i.id, tweet_str_ids: initial_tweets[j].string_id})))
                        setFollowings_lst_str(iniital_followings.map((i,j) => ({id: i.id_str, tweet_str_ids: null})))

                        setNewuser(false)
                        dispatch(addFollowingBulk({followings:iniital_followings}))
                      })
                }
                else{ // if it's an old user
                    console.log('TBD')
                    console.log(userId)
                    const followings_db = await axios.get(url_prefix+"/api/db/users/followings", {
                        params:{
                            id: userId
                        }
                    })

                    console.log(followings_db)
                    const foll = followings_db.data.map(i => i.user_id)
                    console.log(foll)
                    const f_list = await axios.get(url_prefix+'/api/twitter/users/lookup', {
                        params:{
                            userIds: foll
                        }
                    })
                    if(f_list.status!==204){
                        const data = f_list.data
                        console.log(data)
                        // const tasks = f_list.map(async(following) =>{
                        //     return axios.get()
                        // })

                        // const retrieved_tweets = await axios.get(url_prefix+"/api/twitter/id/tweet", {
                        //             params: {
                        //                 ids: foll,
                        //                 str_ids: undefined,
                        //                 timeframe: timeframe
                        //             },
                        //             paramsSerializer: params => {
                        //                 return qs.stringify(params)
                        //             }
                        //         })
                        // console.log('retrieved_tweets: ', retrieved_tweets)

                        setFollowings_lst_str(data.map((i,j) => ({id: i.id_str, tweet_str_ids: null})))
                        dispatch(addFollowingBulk({followings:data}))
                    }else{
                        console.log('204')
                        setisEnd(true)
                    }
                }
        }})()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId])

    useEffect(() =>{
        if(userId!=='' ){
            // need to handle the case when some usrs are removed from the list
            // remove their tweets etc.
            console.log('followings_list changed ',followings_list)
            const arrs = followings_list.map((i,j) => {
                const obj = {id: i.id.toString(), str_id: followings_lst_str[j]?.str_id}
                console.log(obj)
                return obj
            })

            console.log(arrs)
            // somehow arr.id is number type... need to investigate
            setTweets(prevTweets => prevTweets.filter(tweet => arrs.some(arr => arr.id.toString() === tweet.author_id ))
                                                .map(tweet=>tweet))
            setFollowings_lst_str(arrs)
            setGetTweet(true)
            
        }
    }, [followings_list])


    useEffect(() =>{
        console.log('update tweets')
        console.log(tweets)
    }, [tweets])

    useEffect(()=>{
        // const t = JSON.parse(window.localStorage.getItem('tweets'))
        // if(t) setTweets(t)
        // else setTweets([])
        console.log('from localstorage')
        const t = JSON.parse(window.localStorage.getItem('isEnd'))
        if(t)setisEnd(t)
        else setisEnd(false)
        const fls = JSON.parse(window.localStorage.getItem('followings_lst_str'))
        if(fls)setFollowings_lst_str(fls)
        else setFollowings_lst_str([])
        const tf = JSON.parse(window.localStorage.getItem('timeframe'))
        console.log(tf)
        if(tf !== null) setTimeframe(tf)
        else setTimeframe(1)
    }, [])

    // save states to localstorage
    useEffect(()=>{
        console.log('update localstorage')
        console.log(timeframe, isEnd)
        // window.localStorage.setItem('tweets', JSON.stringify(tweets));
        // window.localStorage.setItem('followings_lst_str', JSON.stringify(followings_lst_str));
        window.localStorage.setItem('followings_lst_str', JSON.stringify(followings_lst_str));
        window.localStorage.setItem('timeframe', JSON.stringify(timeframe));
        window.localStorage.setItem('isEnd',isEnd.toString())
    }, [tweets, followings_lst_str, timeframe,newUser,isEnd])

    const arrayIsEqual = (a1, a2) => 
        a1 === a2 ||
        (a1.length === a2.length &&
        a1.every((f,i) => 
            f.id === a2[i].id &&
            f.title === a2[i].title)
    )
    
    const sortTweets = (a,b) =>{
        const fa = parseFloat(a.id)
        const fb = parseFloat(b.id)
        return  fa > fb ? 1 : (fa<fb ? -1 : 0)
    }

    useEffect(() =>{
        console.log("followings_lst_str changed ", followings_lst_str)
        if(isGetTweet){
            
            // getTweet()
            console.log('calling setisend')
            // setisEnd(false)
            console.log('calling getTweet')
            getTweet()
            setGetTweet(false)
        }
    }, [followings_lst_str,isGetTweet])

    // with useCallback, getTweet() will re-render whenever followings_list is updated...
    const getTweet = useCallback(async ()=>{
        if(userId!=='' && !isEnd ){
            console.log(followings_list)
            console.log("getTweet")

            const res = await axios.get(url_prefix+"/api/twitter/id/tweet",{
                params: {
                    ids: followings_list.map(i => i.id_str),
                    tweet_str_ids: followings_lst_str.map(i => i.tweet_str_ids),
                    timeframe: timeframe
                },
                paramsSerializer: params => {
                    return qs.stringify(params)
                }
            });
            
            let str_ids_res = res.data.map(i => i.string_id)
            // console.log(str_ids_res)
            let tweets_res = res.data.map(i => i.tweets)
            console.log(tweets_res)

            const filtered_res = tweets_res.map((res) =>{
                return res.map(arr =>{
                    // console.log(arr)
                    const id = arr.id_str
                    const full_text = arr.full_text
                    const imgurl = arr.user.profile_image_url_https
                    const screen_name = arr.user.screen_name
                    const name = arr.user.name
                    const last_created = arr.created_at
                    const author_id = arr.user.id_str
                    const media_photo = arr.extended_entities?.media.map(m=>({id:m.id_str, url:m.media_url_https}))
                    // video, gif later
                    return {
                        id,
                        full_text,
                        imgurl,
                        screen_name,
                        name,
                        last_created,
                        author_id,
                        media_photo
                    }
                })
            })
            // console.log(filtered_res)
    //https://stackoverflow.com/questions/10865025/merge-flatten-an-array-of-arrays
            const concat_arr = filtered_res.flat() 
            
            console.log(concat_arr)

            if(concat_arr.length==0){
                console.log('End of fetch')
                setisEnd(true)
            }
            /* eslint eqeqeq: 0 */
            else if(!arrayIsEqual(concat_arr,tweets)){
                console.log("Not equal")
                // append arrays to a array state
                // https://stackoverflow.com/questions/70690542/react-js-how-to-properly-append-multiple-items-to-an-array-state-using-its-use
                //https://stackoverflow.com/questions/37057746/javascript-merge-two-arrays-of-objects-and-de-duplicate-based-on-property-valu
                concat_arr.sort(sortTweets)
                console.log('sorted')
                setTweets((prevTweets) => _.unionBy(prevTweets, [...concat_arr], 'id'))
                // by design, str_ids_res should contain last str_ids for every following in the following list
                // dispatch(updateFollowing({str_ids_res}))
            }


            setFollowings_lst_str(followings_list.map((i,j) => ({id: i.id_str, tweet_str_ids: str_ids_res[j]})))

        }
    },[followings_list, followings_lst_str, isEnd, timeframe])


    const logout_helper = async ()=>{
        axios.post(url_prefix+"/api/twitter/logout")
        .then((response) =>{
            console.log(response.data)
            window.location ="http://localhost:3000"
        })
    }

    const handleScrolling = () =>{
        if(!isEnd){
            console.log('scrolling')
            getTweet()
        }
    }

    const handleDropdown = (e, {value}) =>{
        console.log(value)
        setTimeframe(value)
    }

    //use useEffect can guarantee isEnd has been updated
    useEffect(() =>{
        console.log('isEnd: ',isEnd)
        if(userId!=='' && !isEnd ){
            
            // console.log('calling getTweet')
            // getTweet()
            setGetTweet(true)
        }
    }, [isEnd])

    useEffect(() =>{
        console.log('time frame changed')
        if(userId!==''){
            console.log('setting !isEnd')
            // when dropdown is changed == > current time - last tweet's time must be bigger than selected timeframe*24hrs
            if(timeframe===0 || (tweets.length!==0 &&(Date.now()-Date.parse((tweets[tweets.length-1].last_created)) < timeframe*8.76e7 ))){
                console.log('satisfied')
                setisEnd(false)
            }
            // getTweet()
        }
    }, [timeframe])
    
    const test = async () =>{
        console.log('click test')
        await axios.delete(url_prefix+"/api/db/delete/followings", {data:{followings:['123','1234']}})
    }

    return (
        <div className="Home">
          {userId!==''?
            <div className="Body" style={{'marginTop':'80px'}}>
                <Grid padded columns={2}>
                    <Grid.Column
                    tablet={3}
                    computer={3}
                    only="tablet computer"
                    id="sidebar"
                    >
                    <Menu vertical borderless fluid text>
                        <Menu.Item active >
                            <Link to="/">Tweets</Link>
                        </Menu.Item>
                        <Menu.Item >
                            <Link to="/followings">Followings</Link>
                        </Menu.Item>
                        <Menu.Item >
                            <Link to="/favourites">Favourites</Link>
                        </Menu.Item>
                        {/* <Menu.Item>
                            <Link to="/tweets">Tweets</Link>
                        </Menu.Item> */}
                    </Menu>
                    </Grid.Column>
                    <Grid.Column
                    mobile={16}
                    tablet={13}
                    computer={13}
                    floated="right"
                    id="content"
                    >
                    <Grid padded>
                        <Grid.Row columns={2}>
                        <Grid.Column>
                        <Header floated="left" dividing size="huge" as="h1">
                            Dashboard
                        </Header>
                        </Grid.Column>
                        <Grid.Column >
                        <Dropdown
                            placeholder='24 hours'
                            compact
                            selection
                            closeOnEscape
                            options={options}
                            onChange={handleDropdown}
                        />
                        </Grid.Column>
                        <Button primary onClick={test}>Get Tweet</Button>
                        <Button primary onClick={()=>console.log('refresh')}>Refresh</Button>
                        </Grid.Row>                        
                        <Grid.Row textAlign="center">
                        {/* <div class="ui two column centered grid"> */}
                        {/* {tweets && <Tweets tweets = {tweets}/>} */}

                        {/* https://semantic-ui.com/collections/grid.html#/definition */}
                            <div className="twelve wide column">
                                <div id="scrollableDiv" style={{ height: '100%', overflow: "auto" }}>
                                        <InfiniteScroll 
                                            style={{ overflowY: scrollState }}
                                            dataLength={tweets.length}
                                            next={handleScrolling}
                                            hasMore={!isEnd}
                                            loader={<div className="ui active centered inline loader"></div>}
                                            scrollThreshold={0.8}
                                            // height does the trick????
                                            height={500}
                                            endMessage={
                                                <p style={{textAlign:'center'}}><b>Yay! You've seen it all!</b></p>
                                            }
                                            scrollableTarget="scrollableDiv"
                                            >
                                            {<Tweets tweets = {tweets} scroll={(val)=>setScrollState(val)} userId={userId}/>}
                                        </InfiniteScroll>
                                </div>
                                {/* <Followings/> */}
                            </div>
                            <div className="four wide column">
                            </div>
                        {/* </div> */}
                            
                        </Grid.Row>
                        <Divider section hidden />
                    </Grid>
                    </Grid.Column>
                </Grid>
            </div>
            :
            <div style={{'marginTop':'80px'}}>Not logged In</div>
          }
        </div>
      );
}


export default Home;







