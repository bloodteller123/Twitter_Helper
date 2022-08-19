import React, {useState, useEffect, useCallback} from 'react'
import axios from 'axios'
import 'semantic-ui-css/semantic.min.css';
import _ from 'lodash'


import {
  Search,
  Card,
  Image,
  Button
} from "semantic-ui-react";

import{
  addFollowing,
  removeFollowing,
  selectFollowings
} from "../reducers/FollowingsSlice"

import { useSelector, useDispatch } from 'react-redux';

import '../CSS/SemanticUI.scss';


const SearchComp = ({userId}) =>{

  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");
  const [results, setResults] = useState([])


  const followings_list = useSelector(selectFollowings)
  const dispatch = useDispatch()

      // https://css-tricks.com/debouncing-throttling-explained-examples/#aa-keypress-on-autocomplete-form-with-ajax-request
  const searchUsers = useCallback(_.debounce(async (val) => {
      console.log('call searchUsers')
      if(val.length!==0){
          // console.log(value)
          const users = await axios.get("http://localhost:3001/api/twitter/users/search", {
              params: {
                  userName: val
              }
          })
          setResults(users.data)
          setLoading(!loading)
      }
    }, 200), [])


  useEffect(() =>{
    // otherwise backend fails because client api is not established yet when searchUsers() is first rendered
    if(userId!==''){
        console.log('call debounce')
        searchUsers(value)
    }
  }, [value])

  useEffect(() =>{
    console.log(results)

  }, [results])

  const handleSearchChange = useCallback((e, data) =>{
    // console.log(e.target)
    setLoading(!loading)
    setValue(data.value)
  }, [])

  const trimText = (text) =>{
    return text.length < 26 ? text : text.slice(0,26) + "..."
  }
  

  const resultRenderer = (user) => {
    return (
      <div style={{width:"auto"}}>
        <Card>
          <Card.Content style={{ pointerEvents: 'none'}}>
            <Image
              floated='left'
              style={{'fontSize':10}}
              src= {user.profile_image_url_https}
              avatar
            />
            <Card.Header textAlign="left">{user.name}</Card.Header>
            <Card.Meta textAlign="left">{'@'+user.screen_name}</Card.Meta>
            <Card.Description>
              {trimText(user.description)}
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            <Button.Group>
              {(followings_list.filter(following => following.id_str === user.id_str).length===0)?
              <Button id='follow_button' size='mini' color='twitter'>Follow</Button>:
              <Button id='dummy' size='mini' color='green'>Followed</Button>
              }
              <Button.Or />
              <Button id='remove_button' size='mini' color='grey'>Remove</Button>
            </Button.Group>
          </Card.Content>
        </Card>
      </div>
    )
  }


  return (

     <Search 
        loading={loading}
        placeholder='Search...'
        size = "small"
        onResultSelect={(e, data) =>{
          const user = data.result
          console.log(user)
          switch(e.target.id){
            case "follow_button":
              console.log("add following")
              dispatch(addFollowing({user}))
              break
            case "remove_button":
              // should we check if this user is in followings list? 
              console.log('remove')
              dispatch(removeFollowing({user}))
              break
            default:
              console.log('')
            }    
          }
        }
        onSearchChange={handleSearchChange}
        results = {results}
        resultRenderer={resultRenderer}
        value={value}
    />
  )
}

export default SearchComp