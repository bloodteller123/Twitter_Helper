import React, {useState, useEffect, useCallback} from "react";
import axios from 'axios';
import Api from "../api/Api"

import 'semantic-ui-css/semantic.min.css';
import '../CSS/Tweet.scss';

import {
    Image,
    Card,
    Button,
    Icon
  } from "semantic-ui-react";

import { useSelector } from 'react-redux';


const Tweet = ({tweet, scroll, userId, page,updateFav}) =>{

    const [clickId, setClickID] = useState(0)
    const [isliked, setLike] = useState('')
    const style = {
        // height: 30,
        border: "1px solid green",
        margin: 6,
        padding: 8,
        width: "auto"
      };
    const url_prefix = 'http://localhost:3001';
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

    useEffect(()=>{
        const s = page==='fav'?'red' : 'grey';
        setLike(s)
    }, [])

    const handleClickSave = async () =>{
        if(isliked==='red'){
            // setLike('grey')

            const result = await Api.delete('/db/delete/favourite',{
                data:{
                    id:tweet.id,
                    userId:userId
                }
            })
            console.log(result)
            updateFav(tweet)
        }
        else{
            setLike('red')
            const params = {
                userId: userId,
                author_id: tweet.author_id,
                full_text: tweet.full_text,
                id: tweet.id,
                imgurl: tweet.imgurl,
                last_created: tweet.last_created,
                name: tweet.name,
                screen_name: tweet.screen_name,
                media_photo: JSON.stringify(tweet.media_photo)
            }

            const result = await Api.post('/db/add/favourite', params)
            console.log(result)
        }
    }

    return (
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
                {/* <Button circular style={{color:'red', backgroundColor:'white'}} icon='like' onClick={handleClickSave}/> */}
                <Button icon labelPosition='left' onClick={handleClickSave}>
                    <Icon name='like' style={{color:isliked, backgroundColor:'white'}} />
                    Like
                </Button>
            </Card>
        </div>
    )
}

export default Tweet