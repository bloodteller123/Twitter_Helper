
// https://stackoverflow.com/questions/39599514/vs-code-add-a-new-file-under-the-selected-working-directory
https://stackoverflow.com/questions/8595509/how-do-you-share-constants-in-nodejs-modules


module.exports = () => {
    // const OAUTH = require('oauth-1.0a');
    const OAuth = require('oauth').OAuth
    const crypto = require('crypto');
    const post_request_url = "https://api.twitter.com/oauth/request_token";
    const post_access_url = "https://api.twitter.com/oauth/access_token";
    const callback_url = "http://www.localhost:3000/";
    const { CONSUMER_KEY,CONSUMER_SECRET } = require('./Config');
    const axios = require('axios');

    const oa = new OAuth(
        post_request_url,
        post_access_url,
        CONSUMER_KEY, 
        CONSUMER_SECRET, 
        '1.0',
        callback_url,
        'HMAC-SHA1'
    );

    const oauth_func = {
        getOauthRequest: () =>{

            // https://developer.twitter.com/en/docs/authentication/guides/log-in-with-twitter#obtain-a-request-token
            
            return new Promise((resolve, reject) => {
                oa.getOAuthRequestToken((error, oauth_token, oauth_token_secret, results) => {
                  if(error) {
                    reject(error);  
                  } else {
                    resolve({oauth_token, oauth_token_secret, results});  
                  }
                });
              });

        },

        // getOAuthAccess: ({oauth_verifier, oauth_access_token, oauth_access_token_secret}) => { 
        //     return new Promise((resolve, reject) => {
        //       oa.getOAuthAccessToken(oauth_access_token, oauth_access_token_secret,oauth_verifier,
        //         (error, oauth_access_token, oauth_access_token_secret, results) => {
        //             if(error) {
        //             reject(error);  
        //             } else {
        //             resolve({oauth_access_token, oauth_access_token_secret, results});  
        //             }
        //       });
        //     });
        //   }
        getOAuthAccess: ({oauth_token, oauth_token_secret, oauth_verifier}) => { 
            return new Promise((resolve, reject) => {
              oa.getOAuthAccessToken(oauth_token, oauth_token_secret, oauth_verifier, 
                (error, oauth_access_token, oauth_access_token_secret, results) => {
                if(error) {
                  reject(error);  
                } else {
                  resolve({oauth_access_token, oauth_access_token_secret, results});  
                }
              });
            });
          },
    };

    return oauth_func
}

