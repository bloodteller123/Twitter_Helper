import React, {useState, useEffect, useCallback} from "react";
// import { CONSUMER_KEY, CONSUMER_SECRET } from "../../../../nodejs/services/Config";
import axios from 'axios'
import TwitterLogin from './services/TwitterLogin';
import Tweets from "./services/Tweets";
import qs from 'qs';
import 'semantic-ui-css/semantic.min.css';

import InfiniteScroll from 'react-infinite-scroll-component';

// import InfiniteScroll from 'react-infinite-scroller';



import {
  Button,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Label,
  Menu,
  Table,
  Dropdown,
  DropdownMenu,
  DropdownItem,
} from "semantic-ui-react";

const styles = {
    body:{
        marginTop:50
    }
}


const Home = () =>{
    const [loggedIn, setLogin] = useState(false)
    const[user, setUser] = useState([])
    const[tweets, setTweets] = useState(JSON.parse(window.localStorage.getItem('tweets')) || [])

    const [isEnd, setisEnd] = useState(false)


    const [followings, setFollowings] = useState(JSON.parse(window.localStorage.getItem('followings')) || [
        {
            id: '295218901',
            
        }
    ])

    // const [fetch, setFetch] = useState(false)

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
        if(loggedIn && tweets.length==0){
            console.log('load first batch')
            getTweet();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loggedIn])



    // useEffect(() =>{
    //     setTweets(JSON.parse(window.localStorage.getItem('tweets')));
    //     setTweets(JSON.parse(window.localStorage.getItem('followings')));
    // }, [])
    useEffect(()=>{
        window.localStorage.setItem('tweets', JSON.stringify(tweets));
        window.localStorage.setItem('followings', JSON.stringify(followings));
    }, [tweets, followings])

    const arrayIsEqual = (a1, a2) => 
        a1 === a2 ||
        (a1.length === a2.length &&
        a1.every((f,i) => 
            f.id === a2[i].id &&
            f.title === a2[i].title)
    )
    const getTweet = async ()=>{

        console.log("getTweet")

        const res = await axios.get("http://localhost:3001/api/twitter/id/tweet",{
            params: {
                ids: followings.map(i => i.id),
                str_ids: followings.map(i => i.str_id)
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

        const filtered_res = tweets_res[0].map((res) =>{
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

        /* eslint eqeqeq: 0 */
        if(!arrayIsEqual(filtered_res,tweets)){
            console.log("Not equal")
            // append arrays to a array state
            // https://stackoverflow.com/questions/70690542/react-js-how-to-properly-append-multiple-items-to-an-array-state-using-its-use
            setTweets((prevTweets) => prevTweets.concat([...filtered_res]))
        }
        if(filtered_res.length==0){
            console.log('End of fetch')
            setisEnd(true)
        }

        setFollowings(followings.map((i,j) => ({id: i.id, str_id: str_ids_res[j]})))

    }


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
    
    return (
        <div className="Home">
          <Grid padded className="tablet computer only">
            <Menu borderless inverted fluid fixed="top">
              <Menu.Item header as="a">
                Tweeter
              </Menu.Item>
              <Menu.Menu position="right">
                <Menu.Item>
                  <Input placeholder="Search..." size="small" />
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
                            <div class="twelve wide column">
                            <div id="scrollableDiv" style={{ height: 300, overflow: "auto" }}>
                                        <InfiniteScroll
                                        dataLength={tweets.length}
                                        next={handleScrolling}
                                        hasMore={!isEnd}
                                        loader={<div class="ui active centered inline loader"></div>}
                                        scrollThreshold={1}
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
                            </div>
                            <div class="four wide column">
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







