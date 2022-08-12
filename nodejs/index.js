


const express = require('express')
const cors = require('cors')
const app = express()

const oauth = require('./services/oauth')()

app.use(express.json())
app.use(cors())

// https://stackoverflow.com/questions/60495981/twitter-log-in-with-localhost

let access_tokens = {}

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

app.post('/api/oauth/request', async (req,res) =>{
    // console.log(req)
    console.log("hello")
    try {
      const results = await oauth.getOauthRequest()
      console.log(results)
      const {oauth_token, oauth_token_secret} = results
      access_tokens[oauth_token] = oauth_token_secret
      console.log(oauth_token)
      res.json({oauth_token: oauth_token})
    } catch (error) {
      console.log(error)
    }

})

app.post('/api/oauth/access', async (req, res) =>{
  try {
    const {oauth_verifier,oauth_token} = req.body
    // console.log(access_tokens[oauth_token])
    oauth_token_secret = access_tokens[oauth_token]
    const results = await oauth.getOAuthAccess({
      oauth_token, oauth_token_secret, oauth_verifier})
    console.log(results)
  } catch (error) {
    console.log(error)
  }
})

app.post('/api/twitter/logout', (req, res) =>{
  access_tokens = {}
  res.status(200).send("LOG OUT")
})

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