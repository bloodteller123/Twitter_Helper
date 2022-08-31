
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
const db = require('./db/db')

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
    if(loggedInClient){
      console.log('req.query: ', req.query)
      const ids = req.query.ids
      const str_ids = req.query.tweet_str_ids
      let timeframe

      switch(req.query.timeframe){
        case '0':
          timeframe = 0
          break;
        case '1':
          timeframe = 8.76e7
          break;
        case '2':
          timeframe = 1.752e8
          break;
        case '3':
          timeframe = 2.628e8
          break;
        default:
          timeframe = 8.76e7
      }
      console.log('timeframe: ', timeframe)

      if(str_ids && str_ids.length != ids.length) {
        res.status(400).send("arrays length doesn't match")
      }
      console.log('ids', ids)
      const zip_arr = ids.map((i, j) => [i, str_ids?str_ids[j]:undefined])
      // console.log('ID '+id)
      let all_tweets = []
      // each id = one user
      for (const pair of zip_arr){
        // https://github.com/PLhery/node-twitter-api-v2/blob/429c93d982cb460cb690a7239358fcbf175968d3/src/types/v1/tweet.v1.types.ts#L82

        console.log("pair", pair)
        let string_id = pair[1]
        let id = pair[0]

        let params = { 
          include_entities: true,
          count: 5,
          include_rts: true,
        }

        if(string_id && string_id!==''){
          console.log('string_id', string_id)
          params.max_id = string_id;
          console.log("max_id: ", params.max_id)
        }
        // console.log(string_id);
        console.log('id: ', id)
        const response = await loggedInClient.v1.userTimeline(id, params);

        const fetchedTweets = response.tweets;
        let tweets = fetchedTweets.filter(tweet => {
          if(timeframe===0) return tweet
          const diff = Date.now() - Date.parse(tweet.created_at);
          if(diff < timeframe) return tweet
        })
        // console.log(tweets)
        // next fetch will start from (string_id -1) to avoid duplicate entries
        // bigInt(undefined) ===0

        // string_id = tweets.length!==0 ? bigInt(tweets[tweets.length-1].id_str).minus(1).toString()
        //             :
        // (undefined || '') returns ''
        //             (string_id===(undefined||'') ? '':bigInt(string_id).minus(1).toString())
        if(tweets.length!==0){
          string_id = bigInt(tweets[tweets.length-1].id_str).minus(1).toString()
        }else{
          if(string_id===undefined || string_id===''){
            string_id = ''
          }else{
            string_id = bigInt(string_id).minus(1).toString()
          }
        }
        all_tweets.push({tweets, string_id});
        // console.log(tweets)
      }

      console.log('before sending back response: ', all_tweets)
      res.status(200).send(all_tweets);
    }
   } catch (error) {
    console.log(error)
   }
})

app.get('/api/twitter/user/following', async(req,res) =>{
  const id = req.query.id
  let params = { 
    asPaginator: true,
    max_results: 2,
    // 'user.fields': ['created_at', 'description', 'entities', 'id', 'location',
    //   'name', 'pinned_tweet_id', 'profile_image_url', 'public_metrics', 'url', 'username']
  }
  const response = await loggedInClient.v2.following(id, params);
  // console.log(response._realData.data)
  
  res.status(200).send(response._realData.data)
})


app.get('/api/twitter/users/search' , async(req, res) =>{
  const user_query = req.query.userName
  console.log('user_query: ',user_query)
  const params = {
    page:1,
    count: 5,
    include_entities: false
  }
  const foundUsers = await loggedInClient.v1.searchUsers(user_query, params);
  res.status(200).send(foundUsers._realData)
})

// should call this after retrieve followings id from db
app.get('/api/twitter/users/lookup', async(req,res) =>{
  const user_ids = req.query.userIds;
  console.log('user Ids ', user_ids)
  const users = await loggedInClient.v1.users({
    user_id: user_ids
  })
  res.status(200).send(users)
})


app.get('/api/db/users/followings', async(req,res) =>{
  const user_id = req.query.userId;
  console.log('user id', user_id)
  // const result = await db.query("SELECT * FROM follower where user_id = $1", [user_id])
  const result = await db.query("SELECT * FROM user_table")

  res.status(200).send(result)
})


app.get('/api/db/users/tweets', async(req,res) =>{

})

app.delete('/api/db/delete/followings', async(req,res) =>{
  const followings_id =req.body.followings_id
  console.log(followings_id)
  const qry = ` (${req.body.id}, ${followings_id})`
  const result = await db.query("DELETE FROM follower WHERE (user_id, follower_id) = ($1, $2) RETURNING *",[followings_id, req.body.id])
  console.log(result)
  res.status(204).send()
})

const PORT = 3001
app.listen(PORT, ()=>{console.log(`listen on port ${PORT}`)})
