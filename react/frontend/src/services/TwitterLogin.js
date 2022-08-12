import React from "react";
// import { CONSUMER_KEY, CONSUMER_SECRET } from "../../../../nodejs/services/Config";
import axios from 'axios'
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";




const TwitterLogin = () =>{
    // const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = useState(false)

    useEffect (() =>{
        // console.log("UseEffect")
        // https://stackoverflow.com/questions/53332321/react-hook-warnings-for-async-function-in-useeffect-useeffect-function-must-ret
        (async () =>{
            console.log("UseEffect")
            const params = new URLSearchParams(window.location.search)
              // Get the value of "some_key" in eg "https://example.com/?some_key=some_value"
            //   https://stackoverflow.com/questions/63707870/urlsearchparams-returns-empty-object
            let oauth_token = params.get('oauth_token'); // "some_value"
            let oauth_verifier = params.get('oauth_verifier')
            // console.log(oauth_token)
            // console.log(oauth_verifier)

            if(!(typeof oauth_token === 'undefined' || oauth_token === null) &&
            !(typeof oauth_verifier === 'undefined' || oauth_verifier === null)){
                try {
                    console.log('axios')
                    const payload = {
                        oauth_verifier: oauth_verifier,
                        oauth_token: oauth_token,
                    }
                    axios.post("http://localhost:3001/api/oauth/access", payload)
                    .then((response) =>{
                        console.log(response)
                        console.log("second axios")
                        // console.log(response)
                        // return axios.get("http://localhost:3001/api/twitter/profile")
                        return axios.get("http://localhost:3001/api/twitter/temp/profile",{
                            params: {
                                ids: response.data.id
                            }
                        })
                    })
                    .then((response) =>{
                        console.log(10)
                    })
                } catch (error) {
                    console.log(error)
                }

            }
        })()
    }, [])

    const login = async () =>{
        axios.post("http://localhost:3001/api/oauth/request")
        .then((response)=>{
            console.log(response)
            window.location = `https://api.twitter.com/oauth/authorize?`
                                    +`oauth_token=${response.data.oauth_token}`
            return response
        })

    }

    const logout = async ()=>{
        axios.post("http://localhost:3001/api/twitter/logout")
        .then((response) =>{
            console.log(response.data)
            setLoggedIn(false)
            window.location ="http://localhost:3000"
        })
    }




    return (
        <div>
            <button type="button" onClick={login}>Log In</button>
            <button type="button" onClick={logout}>Log out</button>
        </div>
    );
}

export default TwitterLogin;


