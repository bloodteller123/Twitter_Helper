import _ from 'lodash'
import React, {useState, useEffect, useCallback} from 'react'
import { Search, Grid, Header, Segment, Label } from 'semantic-ui-react'
import axios from 'axios'


const SearchComp = ({loggedIn}) =>{

  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");


      // https://css-tricks.com/debouncing-throttling-explained-examples/#aa-keypress-on-autocomplete-form-with-ajax-request
    const searchUsers = useCallback(_.debounce(async (val) => {
      console.log('call searchUsers')
      if(val.length!=0){
          // console.log(value)
          const users = await axios.get("http://localhost:3001/api/twitter/users/search", {
              params: {
                  user: val
              }
          })
          console.log(users)
      }
    }, 200), [])


  useEffect(() =>{
    // otherwise backend fails because client api is not established yet when searchUsers() is first rendered
    if(loggedIn){
        console.log('call debounce')
        searchUsers(value)
    }

}, [value])

  const handleSearchChange = useCallback((e, data) =>{
    // console.log(e.target)
    setLoading(!loading)
    setValue(data.value)
  }, [])

  return (
    <Search
        loading={loading}
        placeholder='Search...'
        size = "mini"
        // onResultSelect={(e, data) =>
        //     dispatch({ type: 'UPDATE_SELECTION', selection: data.result.title })
        // }
        onSearchChange={handleSearchChange}
        results={[]}
        value={value}
    />
  )
}

export default SearchComp