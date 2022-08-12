import React, {useState, useEffect, useCallback} from "react";

import 'semantic-ui-css/semantic.min.css';

import {
    Image,
    Card
  } from "semantic-ui-react";

const Tweets = ({tweets}) =>{
    console.log(tweets)
    const style = {
        // height: 30,
        // border: "1px solid green",
        // margin: 6,
        // padding: 8
      };
    return (
        <>
            {tweets.map(tweet =>(
                <div key={tweet.id} style={style}>
                    <Card>
                        <Card.Content>
                            <Image src={tweet.imgurl} avatar floated="left"/>
                            <Card.Header>{tweet.screen_name}</Card.Header>
                            <Card.Meta>{tweet.name}</Card.Meta>
                            <Card.Description>
                            {tweet.full_text}
                            </Card.Description>
                        </Card.Content>
                    </Card>
                </div>
            ))}
        </>
    );
}

export default Tweets