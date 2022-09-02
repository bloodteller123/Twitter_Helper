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


  const FavouritesComp = () =>{
    
    const userId = useSelector(selectUserId)
    const dispatch = useDispatch()
    const [isShow, setShow] = useState(false)
    const [favourites, setFavourites] = useState([])

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
        })()
    },[])

    return(
        <>

        </>
    );
  }

  export default FavouritesComp