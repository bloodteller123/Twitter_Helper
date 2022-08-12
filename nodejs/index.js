
const express = require('express')
const cors = require('cors')
const { default: axios } = require('axios')
const qs = require('qs')
const app = express()

const oauth = require('./services/oauth')()
// const METHODS = require('./services/MENUMS')
const {CONSUMER_KEY, CONSUMER_SECRET } = require('./services/Config.js')
const {TwitterApi} = require('twitter-api-v2')
const bigInt = require("big-integer");

app.use(express.json())
app.use(cors())

// https://stackoverflow.com/questions/60495981/twitter-log-in-with-localhost

let access_tokens = {}

// tmp solution
let tmp_token

let loggedInClient = null


//  get a list of all followings in the current account
app.get('/followings', (req, res) =>{
    try{
        //  retrieve sth from the database
        // for now just returns the hardcoded data
        res.status(200).json(all_followings)
        
    }
    catch (error){
        console.log(error)
        return next(error)
    }
})

app.get('/', (req, res) =>{
    res.send('<h1>Hello</h1>')
})

app.post('/api/oauth/request', async (req,res) =>{
    // console.log(req)
    console.log("hello")
    try {
      const results = await oauth.getOauthRequest()
      console.log(results)
      const {oauth_token, oauth_token_secret} = results
      access_tokens[oauth_token] = oauth_token_secret
      console.log('Oauth_token ' + oauth_token)
      res.json({oauth_token: oauth_token})
    } catch (error) {
      console.log(error)
    }

})

app.post('/api/oauth/access', async (req, res) =>{

    const {oauth_verifier,oauth_token} = req.body
    tmp_token = oauth_token
    // console.log(access_tokens[oauth_token])
    oauth_token_secret = access_tokens[oauth_token]
    // const results = await oauth.getOAuthAccess({
    //   oauth_token, oauth_token_secret, oauth_verifier})
    
    // const {oauth_access_token, oauth_access_token_secret} = results
    // access_tokens[oauth_token] = { ...access_tokens[oauth_token], oauth_access_token, oauth_access_token_secret };

    
    const client = new TwitterApi({
      appKey: CONSUMER_KEY,
      appSecret: CONSUMER_SECRET,
      accessToken: oauth_token,
      accessSecret: oauth_token_secret,
    })
    console.log("Login starts: ")
    // https://github.com/PLhery/node-twitter-api-v2/blob/master/src/client/readonly.ts
    client.login(oauth_verifier).then((response) => {
      // loggedClient is an authenticated client on behalf of some user
      // Store accessToken & accessSecret somewhere
      console.log("logged in done")
      const oauth_access_token = response.accessToken
      const oauth_access_token_secret = response.accessSecret
      access_tokens[oauth_token] = { ...access_tokens[oauth_token], oauth_access_token, oauth_access_token_secret };
      loggedInClient = response.client
      res.json({id: response.userId})
    }).catch(() => res.status(403).send('Invalid verifier or access tokens!'));
  })

app.post('/api/twitter/logout', (req, res) =>{
  access_tokens = {}
  res.status(200).send("LOG OUT")
})



app.get('/api/twitter/followings', async (req, res) =>{
    const { oauth_token} = req.body
    const oauth_token_secret = access_tokens[oauth_token]
    const url = "https://api.twitter.com/2/users/by/username/${}"
    const responses = await oauth.sendRequest({method: 'get', url, oauth_token, oauth_token_secret})
    console.log(responses)
    res.send("OK")
})


app.get('/api/twitter/temp/profile', async (req, res) =>{
  try {
    const ids = req.query.ids
    console.log("ids "+ids)
    const user = await loggedInClient.v2.users(ids)
    console.log(user)
    res.json({user})
  } catch (error) {
    console.log(error)
  }
})

app.get('/api/twitter/user', async(req,res)=>{
  try {
    const userName = req.query.username
    console.log('User name ' + userName)
    // console.log(loggedInClient===undefined)
    // console.log(loggedInClient)
    const response = await loggedInClient.v2.userByUsername(userName)
    console.log(response)
    console.log(response.data)
    res.json({id:response.data.id })
  } catch (error) {
    console.log(error)
  }

})

app.get('/api/twitter/id/tweet', async (req, res) =>{
   try {
    console.log(req.query)
    const ids = req.query.ids
    const str_ids = req.query.str_ids

    if(str_ids && str_ids.length != ids.length) {
      res.status(400).send("arrays length doesn't match")
    }

    const zip_arr = ids.map((i, j) => [i, str_ids?str_ids[j]:undefined])
    // console.log('ID '+id)
    let all_tweets = []
    // each id = one user
    for (const pair of zip_arr){
      // https://github.com/PLhery/node-twitter-api-v2/blob/429c93d982cb460cb690a7239358fcbf175968d3/src/types/v1/tweet.v1.types.ts#L82
      let is_older_24hrs = false;
      console.log("pair", pair)
      let string_id = pair[1]
      let id = pair[0]

      // while(!is_older_24hrs){

      let params = { 
        include_entities: true,
        count: 2,
        include_rts: true,
      }
      if(string_id)
        params.max_id = string_id;
        console.log("max_id: ", params.max_id)
      // console.log(string_id);
      const response = await loggedInClient.v1.userTimeline(id, params);

      const fetchedTweets = response.tweets;
      let tweets = fetchedTweets.filter(tweet => {
        const diff = Date.now() - Date.parse(tweet.created_at);
        if(diff < 8.76e7) return tweet
      })

      // next fetch will start from (string_id -1) to avoid duplicate entries
      string_id = tweets.length!=0? bigInt(tweets[tweets.length-1].id_str).minus(1).toString():"";

      // if(tweets.length != fetchedTweets.length){
      //   // is_older_24hrs=true
      //   string_id = undefined
      // }
      // console.log(tweets)
      all_tweets.push({tweets, string_id});
      // }

      // console.log(tweets)
    }

    res.status(200).send(all_tweets);

   } catch (error) {
    console.log(error)
   }
})



app.get('/api/twitter/users/search' , async(req, res) =>{
  const user_query = req.query.user
  console.log(user_query)
  const params = {
    page:1,
    count: 3,
    include_entities: false
  }
  const foundUsers = await loggedInClient.v1.searchUsers(user_query, params);
  res.status(200).send(foundUsers._realData)
})

const PORT = 3001
app.listen(PORT, ()=>{console.log(`listen on port ${PORT}`)})
