import React, {useState, useEffect, useCallback} from "react";

import 'semantic-ui-css/semantic.min.css';
import '../CSS/Tweet.scss';

import {
    Image,
    Card
  } from "semantic-ui-react";

const Tweets = ({tweets, scroll}) =>{
    // console.log(tweets)
    const [clickId, setClickID] = useState(0)
    const style = {
        // height: 30,
        border: "1px solid green",
        margin: 6,
        padding: 8,
        width: "auto"
      };

    const handleClickContainer = (e) =>{
        // e.target.style.display='none'
        console.log('exit full screen')
        setClickID(0)
        scroll('auto')
    }

    const handleClickImg = (e) =>{
        console.log('click image')
        const id = e.target.getAttribute('data-key')
        console.log(id)
        setClickID(id)
        scroll('hidden')
    }

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
                            {tweet.media_photo && tweet.media_photo.map(photo => (
                                <div className="backg" key={photo.id}>
                                    <Image className="img" key={photo.id} data-key={photo.id} src={photo.url} onClick={handleClickImg}/>
                                    {clickId ===photo.id ?
                                        <div key={photo.id} className="container" style={{backgroundImage:"url(" + photo.url + ")"}} 
                                            onClick={handleClickContainer}></div>
                                        : 
                                        <></>
                                    }
                                </div>
                            ))}
                        </Card.Content>
                    </Card>
                </div>
            ))}
        </>
    );
}

export default Tweets