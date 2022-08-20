import React, {useState, useEffect, useCallback} from "react";

import 'semantic-ui-css/semantic.min.css';

import {
    Image,
    Card
  } from "semantic-ui-react";

const Tweets = ({tweets}) =>{
    // console.log(tweets)
    const style = {
        // height: 30,
        border: "1px solid green",
        margin: 6,
        padding: 8,
        width: "auto"
      };
    return (
        <>
            {tweets && tweets.map(tweet =>(
                <div key={tweet.id} style={style}>
                    <Card fluid>
                        <Card.Content>
                            <Image style={{'fontSize':20}} src={tweet.imgurl} avatar floated="left"/>
                            <Card.Header textAlign="left">{tweet.name}</Card.Header>
                            <Card.Meta textAlign="left">{"@"+tweet.screen_name}</Card.Meta>
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