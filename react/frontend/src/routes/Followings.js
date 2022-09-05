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


  const Followings = () =>{
    
    const followings = useSelector(selectFollowings)
    const userId = useSelector(selectUserId)
    const dispatch = useDispatch()
    const [isShow, setShow] = useState(false)

//https://stackoverflow.com/questions/55733903/how-to-align-a-text-and-a-button-element-in-the-div-right-next-to-each-other
    const style = {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            // height: '70px'

    }

    const handleCLick = async (user) =>{
        console.log(user)
        dispatch(removeFollowing({user}))
        const x = await axios.delete("http://localhost:3001/api/db/delete/followings", 
        {
            data:{
                followings_id:user.id_str,
                follower_id: userId
                }
        })
        setShow(true)
        console.log(x)
        console.log('done removing following')
    }

    return(
        <>
            <div style={{coloumns: "2 auto", 'marginTop':'70px'}}>
                {isShow?<NotificationPop isShow={isShow} setShow={setShow} title={'Unfollow Successfully!'} />:<></>}
                {followings.map(following => (
                    <div style={style} key={following.id}>
                        <Card style={{flex:1,flexBasis:0}}>
                            <Card.Content>
                                <Image
                                floated='left'
                                size='mini'
                                src={following.profile_image_url_https}
                                />
                                <Card.Header>{following.name}</Card.Header>
                                <Card.Meta>{following.screen_name}</Card.Meta>
                                <Card.Description>
                                    <strong>{following.description}</strong>
                                </Card.Description>
                            </Card.Content>
                        </Card>
                        {/* make a popup: are you sure you want to unfollow him/her? */}
                        <Button onClick={() => handleCLick(following)}>Followed</Button>
                    </div>
                ))}
            </div>
        </>
    );
  }

  export default Followings