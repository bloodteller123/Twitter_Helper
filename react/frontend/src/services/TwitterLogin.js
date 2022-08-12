import React from "react";
// import { CONSUMER_KEY, CONSUMER_SECRET } from "../../../../nodejs/services/Config";
import axios from 'axios'
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import 'semantic-ui-css/semantic.min.css';

import { Button } from "semantic-ui-react";



const TwitterLogin = (props) =>{
    // const navigate = useNavigate();
    const [clicked, setClick] = useState(false)
    const {setlogin,loggedIn} = props
    console.log(setlogin)
    console.log(loggedIn)

    useEffect (() =>{
        // console.log("UseEffect")
        // https://stackoverflow.com/questions/53332321/react-hook-warnings-for-async-function-in-useeffect-useeffect-function-must-ret
        console.log('In useEffect loggedin: ',loggedIn)
        if(!loggedIn){
            (async () =>{
                console.log("UseEffect")
                console.log(setlogin)
                const params = new URLSearchParams(window.location.search)
                // Get the value of "some_key" in eg "https://example.com/?some_key=some_value"
                //   https://stackoverflow.com/questions/63707870/urlsearchparams-returns-empty-object
                let oauth_token = params.get('oauth_token'); // "some_value"
                let oauth_verifier = params.get('oauth_verifier')
        
                if(!(typeof oauth_token === 'undefined' || oauth_token === null) &&
                !(typeof oauth_verifier === 'undefined' || oauth_verifier === null)){
                    try {
                        console.log('first axios')
                        const payload = {
                            oauth_verifier: oauth_verifier,
                            oauth_token: oauth_token,
                        }
                        axios.post("http://localhost:3001/api/oauth/access", payload)
                        .then((response) =>{
                            console.log("response from first axios: ", response)
                            console.log("second axios")
                            axios.get("http://localhost:3001/api/twitter/temp/profile",{
                                params: {
                                    ids: response.data.id
                                }
                            }).then((response) =>{
                                console.log(response)
                                // this.props.login(true)
                                console.log('set loggedin')
                                setlogin(true)
                            })
                        })
                    }catch (error) {
                        console.log(error)
                    }
                }
            })()
        }
        console.log('i fire once');
    }, [setlogin, loggedIn])

    const login = async () =>{
        console.log('Click')
        axios.post("http://localhost:3001/api/oauth/request")
        .then((response)=>{
            console.log(response)
            window.location = `https://api.twitter.com/oauth/authorize?`
                                    +`oauth_token=${response.data.oauth_token}`;
            // return response
        })
        
    }


    const logout = async ()=>{
        axios.post("http://localhost:3001/api/twitter/logout")
        .then((response) =>{
            console.log(response.data)
            // this.props.login(false)
            window.location ="http://localhost:3000"
        })
    }


    console.log(props);

    return (
       // <div>
            
            <Button primary onClick={login}>Log In</Button>
            //{/* <button type="button" onClick={logout}>Log out</button> */}
        //</div>
    );
}

export default TwitterLogin;


