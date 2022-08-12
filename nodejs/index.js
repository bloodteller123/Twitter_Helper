
const express = require('express')
const cors = require('cors')
const { default: axios } = require('axios')
const app = express()

const oauth = require('./services/oauth')()
// const METHODS = require('./services/MENUMS')
const {CONSUMER_KEY, CONSUMER_SECRET } = require('./services/Config.js')
const {TwitterApi} = require('twitter-api-v2')


app.use(express.json())
app.use(cors())

// https://stackoverflow.com/questions/60495981/twitter-log-in-with-localhost

let access_tokens = {}

// tmp solution
let tmp_token

let loggedInClient

// placeholders data
const all_followings = [
    {
        name: 'ABC zxc',
        id: 123455,
        userName: "someNames_1"
    },
    {
        name: 'QWE asd',
        id: 413354,
        userName: "someNames_2"
    },
    {
        name: 'BVX iop',
        id: 634231,
        userName: "someNames_3"
    }
]



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

app.get('/followings/:userName', (req,res) =>{

})

app.get('/', (req, res) =>{
    res.send('<h1>Hello</h1>')
})

// app.get('/api/twitter/temp/profile', async (req, res) =>{
//   const { oauth_access_token, oauth_access_token_secret } = access_tokens[tmp_token]; 
//   try {
//     // const ids = req.query.ids.join()
//     const ids = req.query.ids
//     console.log("ids "+ids)
//     console.log(oauth_access_token, oauth_access_token_secret)
//     const response = await oauth.sendRequest({
//       method: 'get',
//       url: `https://api.twitter.com/2/users?ids=${ids}`,
//       oauth_access_token,
//       oauth_access_token_secret
//     })
//     console,log(response)
//     res.json({message: 'ok'})
//   } catch (error) {
//     console.log(error)
//   }
// })

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
      // loggedClient is an authenticated client in behalf of some user
      // Store accessToken & accessSecret somewhere
      console.log("logged in done")
      const oauth_access_token = response.accessToken
      const oauth_access_token_secret = response.accessSecret
      access_tokens[oauth_token] = { ...access_tokens[oauth_token], oauth_access_token, oauth_access_token_secret };
      loggedInClient = response.client
      res.json({id: response.userId})
    })
    .catch(() => res.status(403).send('Invalid verifier or access tokens!'));
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





const OAuth = require('oauth-1.0a');
const crypto = require('crypto');


app.get('/api/twitter/temp/profile', async (req, res) =>{
  try {
    const ids = req.query.ids
    console.log("ids "+ids)
    const user = await loggedInClient.v2.users(ids)
    console.log(user)
  } catch (error) {
    console.log(error)
  }
})

// app.get('/api/twitter/temp/profile', async (req, res) => {
//     try {
//         const oauth = OAuth({
//             consumer: {
//                 key: CONSUMER_KEY,
//                 secret: CONSUMER_SECRET
//             },
//             signature_method: 'HMAC-SHA1',
//             hash_function: (baseString, key) => crypto.createHmac('sha1', key).update(baseString).digest('base64')
//         });

//         const token = {
//             key: '',
//             secret: ''
//         };

//         const ids = req.query.ids
//         const { oauth_access_token, oauth_access_token_secret } = access_tokens[tmp_token]; 

//         console.log("ids "+ids)
//         console.log(oauth_access_token, oauth_access_token_secret)

//         const authHeader = oauth.toHeader(oauth.authorize({
//             url: `https://api.twitter.com/2/users?ids=${ids}`,
//             method: 'GET'
//         }, token));




//         const response = await axios.get(`https://api.twitter.com/2/users?ids=${ids}`,
//             {
//                 headers: {
//                     Authorization: authHeader["Authorization"]
//                 }
//             }
//         );
//         console.log(response)
//         res.status(201).send({ message: "Tweet successful" });
//     } catch (error) {
//         console.log("error", error)
//         res.status(403).send({ message: "Missing, invalid, or expired tokens" });
//     }
// });



















const PORT = 3001
app.listen(PORT, ()=>{console.log(`listen on port ${PORT}`)})

// const express = require('express')
// const app = express()
// const port = 3001

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })