import React, {useState, useEffect, useCallback} from "react";
// import { CONSUMER_KEY, CONSUMER_SECRET } from "../../../../nodejs/services/Config";
import axios from 'axios'
import TwitterLogin from './services/TwitterLogin';
import Tweets from "./services/Tweets";
import SearchComp from "./services/SearchComp";

import qs from 'qs';
import 'semantic-ui-css/semantic.min.css';
import Followings from './services/Followings';
import _ from 'lodash';

import { useSelector, useDispatch } from 'react-redux';


import InfiniteScroll from 'react-infinite-scroll-component';

import './CSS/SemanticUI.scss';


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
    addFollowingBulk
  } from "./reducers/FollowingsSlice";


const Home = () =>{
    const followings_list = useSelector(selectFollowings)
    const dispatch = useDispatch()

    const [loggedIn, setLogin] = useState(false)
    // const[user, setUser] = useState([])
    const [newUser, setNewuser] = useState(true)

    const[tweets, setTweets] = useState(JSON.parse(window.localStorage.getItem('tweets')) || [])

    const [isEnd, setisEnd] = useState(false)

    const [followings_lst_str, setFollowings_lst_str] = useState(JSON.parse(window.localStorage.getItem('followings')) || [])

    const [timeframe, setTimeframe] = useState(JSON.parse(window.localStorage.getItem('timeframe')) || 1)
    const dummy = [
        {
            id: '9029269414134538241',
            full_text: 'Example text1',
            imgurl: 'https://pbs.twimg.com/profile_images/1542550265013739520/R5l2K97l_normal.jpg',
            screen_name: 'example screen_name 1',
            name: 'example name 1'
        },
        {
            id: '9029269414134538242',
            full_text: 'Example text 2',
            imgurl: 'https://pbs.twimg.com/profile_images/1426627919951114250/hJuvHByO_normal.jpg',
            screen_name: 'example screen_name 2',
            name: 'example name 2'
        }
    ]


    const login = (val) =>{
        setLogin(val)
        // setFollowings(followings=>followings.concat([...dummy_followings]))
    }

    const logout = ()=>{
        logout_helper()
        setLogin(!loggedIn)
    }

    useEffect(() =>{
    
        (async () => {
            console.log("State Changed")
            console.log('LoggedIn State: ',loggedIn)
            console.log(tweets)
            if(loggedIn && tweets.length==0 ){
                console.log('load first batch')
                console.log("or add dummy followings if it's empty")
                // cz
                if(newUser || followings_list.length==0) {
                    // setTweets([...dummy])
                    // return;
                    // https://stackoverflow.com/questions/52993463/how-to-promise-all-for-nested-arrays
                    // https://stackoverflow.com/questions/57066137/axios-requests-in-parallel
                    console.log('new user')
                    const first_two_followings = await axios.get("http://localhost:3001/api/twitter/user/following", {
                        params:{
                            id: '1422773305254334464'
                        }
                    })
                    console.log(first_two_followings)

                    const tasks = first_two_followings.data.map(async(following) =>{
                        const axiosCalls = [
                            axios.get("http://localhost:3001/api/twitter/id/tweet", {
                                params: {
                                    ids: [following.id],
                                    str_ids: [following.str_id],
                                    timefame: timeframe
                                },
                                paramsSerializer: params => {
                                    return qs.stringify(params)
                                }
                            }), 
                            axios.get("http://localhost:3001/api/twitter/users/search", {
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
                        // const initial_tweets = res.map(obj => obj.first_tweets)
                        dispatch(addFollowingBulk({iniital_followings}))
                        
                        // getTweet();
                      });

                }
                
        }})()
            
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loggedIn])

    useEffect(() =>{
        if(loggedIn){
            // need to handle the case when some usrs are removed from the list
            // remove their tweets etc.
            console.log('followings_list changed')
            const arr = followings_list.map((i,j) => {
                const obj = {id: i.id, str_id: followings_lst_str[j]?.str_id}
                console.log(obj)
                return obj
            })
            console.log(arr)
            // setFollowings_lst_str(arr)
            getTweet()
        }
    }, [followings_list])

    // save states to localstorage
    useEffect(()=>{
        window.localStorage.setItem('tweets', JSON.stringify(tweets));
        window.localStorage.setItem('followings_lst_str', JSON.stringify(followings_lst_str));
        window.localStorage.setItem('followings', JSON.stringify(followings_list));
        window.localStorage.setItem('timeframe', JSON.stringify(timeframe));
    }, [tweets, followings_lst_str, followings_list, timeframe])

    const arrayIsEqual = (a1, a2) => 
        a1 === a2 ||
        (a1.length === a2.length &&
        a1.every((f,i) => 
            f.id === a2[i].id &&
            f.title === a2[i].title)
    )

    // with useCallback, getTweet() will re-render whenever followings_list is updated...
    const getTweet = useCallback(async ()=>{
        if(loggedIn){
            console.log(followings_list)
            console.log("getTweet")

            // const empty = dummy.length===0

            const res = await axios.get("http://localhost:3001/api/twitter/id/tweet",{
                params: {
                    ids: followings_list.map(i => i.id_str),
                    tweet_str_ids: followings_list.map(i => i.tweet_str_ids),
                    timefame: timeframe
                },
                paramsSerializer: params => {
                    return qs.stringify(params)
                }
            });
            // console.log(res)
            console.log(res.data.length)
            console.log(res.data)
            console.log(res.data[0])
            let str_ids_res = res.data.map(i => i.string_id)
            let tweets_res = res.data.map(i => i.tweets)
            console.log(tweets_res)

            const filtered_res = tweets_res.map((res) =>{
                return res.map(arr =>{
                    console.log(arr)
                    const id = arr.id_str
                    const full_text = arr.full_text
                    const imgurl = arr.user.profile_image_url_https
                    const screen_name = arr.user.screen_name
                    const name = arr.user.name

                    return {
                        id,
                        full_text,
                        imgurl,
                        screen_name,
                        name
                    }
                })
                    
            })
            // console.log(filtered_res)
    //https://stackoverflow.com/questions/10865025/merge-flatten-an-array-of-arrays
            const concat_arr = filtered_res.flat() 

            console.log(concat_arr)

            /* eslint eqeqeq: 0 */
            if(!arrayIsEqual(concat_arr,tweets)){
                console.log("Not equal")
                // append arrays to a array state
                // https://stackoverflow.com/questions/70690542/react-js-how-to-properly-append-multiple-items-to-an-array-state-using-its-use
                setTweets((prevTweets) => prevTweets.concat([...concat_arr]))
            }
            if(concat_arr.length==0){
                console.log('End of fetch')
                setisEnd(true)
            }

            setFollowings_lst_str(followings_lst_str.map((i,j) => ({id: i.id, tweet_str_ids: str_ids_res[j]})))
        }
    },[followings_list])


    const logout_helper = async ()=>{
        axios.post("http://localhost:3001/api/twitter/logout")
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

    const styles = {
        body:{
            marginTop:100
        }
    }

    const options = [
        { key: 1, text: '24 hrs', value: 1 },
        { key: 2, text: '48 hrs', value: 2 },
        { key: 3, text: '72 hrs', value: 3 },
        { key: 4, text: 'unlimited', value: 0 },
      ]

    const handleDropdown = (e, {value}) =>{
        console.log(value)
        setTimeframe(value)
    }

    useEffect(() =>{
        console.log('time frame changed')
        if(loggedIn){
            console.log('calling getTweet')
            getTweet()
        }
    }, [timeframe])
    
    const test = () =>{
        axios.get("http://localhost:3001/api/twitter/user/following", {
            params:{
                id:'1422773305254334464'
            }
        })
    }

    return (
        <div className="Home">
          <Grid padded className="tablet computer only">
            <Menu borderless inverted fluid fixed="top">
              <Menu.Item header as="a">
                Tweeter
              </Menu.Item>
              <Menu.Menu position="right">
                <Menu.Item>
                    <div>
                        <SearchComp loggedIn={loggedIn}/>
                    </div>
                </Menu.Item>
                <Menu.Item as="a">Dashboard</Menu.Item>
                <Menu.Item as="a">Settings</Menu.Item>
                <Menu.Item as="a">
                {loggedIn?
                    <Dropdown icon='user' floating button className='icon'>
                        <DropdownMenu>
                            <DropdownItem icon='attention' text='Important' />
                            <DropdownItem icon='log out' text='Logout' onClick={logout}/>
                        </DropdownMenu>
                    </Dropdown>
                    :
                    <TwitterLogin setlogin = {login} loggedIn={loggedIn}/>
                }
                </Menu.Item>
              </Menu.Menu>
            </Menu>
          </Grid>
          {loggedIn?
            <div className="Body" style={styles.body}>
                <Grid padded columns={2}>
                    <Grid.Column
                    tablet={3}
                    computer={3}
                    only="tablet computer"
                    id="sidebar"
                    >
                    <Menu vertical borderless fluid text>
                        <Menu.Item active as="a">
                        Overview
                        </Menu.Item>
                        <Menu.Item as="a">Followers</Menu.Item>
                        <Menu.Item as="a">Tweets</Menu.Item> 
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
                        </Grid.Row>                        
                        <Grid.Row textAlign="center">
                        {/* <div class="ui two column centered grid"> */}
                        {/* {tweets && <Tweets tweets = {tweets}/>} */}

                        {/* https://semantic-ui.com/collections/grid.html#/definition */}
                            <div className="twelve wide column">
                                <div id="scrollableDiv" style={{ height: 300, overflow: "auto" }}>
                                        <InfiniteScroll
                                        dataLength={tweets.length}
                                        next={handleScrolling}
                                        hasMore={!isEnd}
                                        loader={<div className="ui active centered inline loader"></div>}
                                        scrollThreshold={0.8}
                                        // height does the trick????
                                        height={300}
                                        endMessage={
                                            <p style={{textAlign:'center'}}><b>Yay! You've seen it all!</b></p>
                                        }
                                        scrollableTarget="scrollableDiv"
                                        >
                                        {<Tweets tweets = {tweets}/>}
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
            <div style={styles.body}>Not logged In</div>
          }
        </div>
      );
}


export default Home;







