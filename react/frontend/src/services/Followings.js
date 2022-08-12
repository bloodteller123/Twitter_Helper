import React, {useState, useEffect, useCallback} from "react";

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
  
  import { useSelector, useDispatch } from 'react-redux';

  const Followings = () =>{
    
    const followings = useSelector(selectFollowings)
    const dispatch = useDispatch()

    const style = {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            // height: '70px'

    }

    const handleCLick = (user) =>{
        console.log(user)
        dispatch(removeFollowing({user}))
        console.log('done')
    }

    return(
        <>
            <div style={{coloumns: "2 auto"}}>
                {followings.map(following => (
                    <div style={style}>
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