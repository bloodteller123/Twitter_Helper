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


import {
  Divider,
  Grid,
  Header,
  Menu,
  Dropdown,
  DropdownMenu,
  DropdownItem,
} from "semantic-ui-react";

import{
    selectFollowings
  } from "./reducers/FollowingsSlice";


const Home = () =>{
    const followings_list = useSelector(selectFollowings)

    const [loggedIn, setLogin] = useState(false)
    // const[user, setUser] = useState([])
    const [newUser, setNewuser] = useState(true)

    const[tweets, setTweets] = useState(JSON.parse(window.localStorage.getItem('tweets')) || [])

    const [isEnd, setisEnd] = useState(false)

    const [followings_lst_str, setFollowings_lst_str] = useState(JSON.parse(window.localStorage.getItem('followings')) || [])

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
        
        console.log("State Changed")
        console.log('LoggedIn State: ',loggedIn)
        console.log(tweets)
        if(loggedIn && tweets.length==0 ){
            console.log('load first batch')
            console.log("or add dummy followings if it's empty")
            // cz
            if(newUser || followings_list.length==0) {
                setTweets([...dummy])
                return;
            }
            getTweet();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loggedIn])

    useEffect(() =>{
        console.log('followings_list changed')
        const arr = followings_list.map((i,j) => {
            const obj = {id: i.id, str_id: followings_lst_str[j]?.str_id}
            console.log(obj)
            return obj
        })
        console.log(arr)
        setFollowings_lst_str(arr)
        getTweet()

    }, [followings_list])

    // useEffect(() =>{
    //     setTweets(JSON.parse(window.localStorage.getItem('tweets')));
    //     setTweets(JSON.parse(window.localStorage.getItem('followings')));
    // }, [])
    useEffect(()=>{
        window.localStorage.setItem('tweets', JSON.stringify(tweets));
        window.localStorage.setItem('followings_lst_str', JSON.stringify(followings_lst_str));
        window.localStorage.setItem('followings', JSON.stringify(followings_list));
    }, [tweets, followings_lst_str, followings_list])

    const arrayIsEqual = (a1, a2) => 
        a1 === a2 ||
        (a1.length === a2.length &&
        a1.every((f,i) => 
            f.id === a2[i].id &&
            f.title === a2[i].title)
    )
    const getTweet = useCallback(async ()=>{
        console.log(followings_list)
        console.log("getTweet")

        // const empty = dummy.length===0

        const res = await axios.get("http://localhost:3001/api/twitter/id/tweet",{
            params: {
                ids: followings_list.map(i => i.id),
                str_ids: followings_list.map(i => i.str_id)
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

        setFollowings_lst_str(followings_lst_str.map((i,j) => ({id: i.id, str_id: str_ids_res[j]})))

    },[])


    const logout_helper = async ()=>{
        axios.post("http://localhost:3001/api/twitter/logout")
        .then((response) =>{
            console.log(response.data)
            window.location ="http://localhost:3000"
        })
    }

    const handleScrolling = () =>{
        if(!isEnd){
            getTweet()
        }
    }

    const styles = {
        body:{
            marginTop:100
        }
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
                        <Grid.Row>
                        <Header dividing size="huge" as="h1">
                            Dashboard
                        </Header>
                        {/* <Button primary onClick={getTweet}>Get Tweet</Button> */}
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







