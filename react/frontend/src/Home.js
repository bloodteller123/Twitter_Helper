import React, {useState, useEffect, useCallback} from "react";
// import { CONSUMER_KEY, CONSUMER_SECRET } from "../../../../nodejs/services/Config";
import axios from 'axios'
import TwitterLogin from './services/TwitterLogin';


import 'semantic-ui-css/semantic.min.css';

import {
  Button,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Label,
  Menu,
  Table,
  Dropdown,
  DropdownMenu,
  DropdownItem,
} from "semantic-ui-react";

const styles = {
    body:{
        marginTop:50
    }
}


const Home = () =>{
    const [loggedIn, setLogin] = useState(false)

    const login = (val) =>{
        setLogin(val)
    }

    const logout = ()=>{
        logout_helper()
        setLogin(false)
    }

    useEffect(() =>{
        
        console.log("State Changed")
        console.log('LoggedIn State: ',loggedIn)
    }, [loggedIn])

    const logout_helper = async ()=>{
        axios.post("http://localhost:3001/api/twitter/logout")
        .then((response) =>{
            console.log(response.data)
            window.location ="http://localhost:3000"
        })
    }
    
    return (
        <div className="Home">
          <Grid padded className="tablet computer only">
            <Menu borderless inverted fluid fixed="top">
              <Menu.Item header as="a">
                Tweeter
              </Menu.Item>
              <Menu.Menu position="right">
                <Menu.Item>
                  <Input placeholder="Search..." size="small" />
                </Menu.Item>
                <Menu.Item as="a">Dashboard</Menu.Item>
                <Menu.Item as="a">Settings</Menu.Item>
                <Menu.Item as="a">
                {loggedIn?
                    <Dropdown icon='user' floating button className='icon'>
                        <DropdownMenu>
                            <DropdownItem icon='attention' text='Important' />
                            <DropdownItem icon='log out' text='Logout' onClick={logout}/>
                        </DropdownMenu>
                    </Dropdown>
                    :
                    <TwitterLogin setlogin = {login} loggedIn={loggedIn}/>
                }
                </Menu.Item>
              </Menu.Menu>
            </Menu>
          </Grid>
          {loggedIn?
            <div className="Body" style={styles.body}>
                <Grid padded columns={2}>
                    <Grid.Column
                    tablet={3}
                    computer={3}
                    only="tablet computer"
                    id="sidebar"
                    >
                    <Menu vertical borderless fluid text>
                        <Menu.Item active as="a">
                        Overview
                        </Menu.Item>
                        <Menu.Item as="a">Followers</Menu.Item>
                        <Menu.Item as="a">Tweets</Menu.Item> 
                    </Menu>
                    </Grid.Column>
                    <Grid.Column
                    mobile={16}
                    tablet={13}
                    computer={13}
                    floated="right"
                    id="content"
                    >
                    <Grid padded>
                        <Grid.Row>
                        <Header dividing size="huge" as="h1">
                            Dashboard
                        </Header>
                        </Grid.Row>
                        <Grid.Row textAlign="center">
                        <Grid.Column mobile={8} tablet={4} computer={4}>
                            <Image
                            centered
                            circular
                            size="small"
                            src="/static/images/wireframe/square-image.png"
                            />
                            <Label basic size="large">
                            Label
                            </Label>
                            <p>Something else</p>
                        </Grid.Column>
                        <Grid.Column mobile={8} tablet={4} computer={4}>
                            <Image
                            centered
                            circular
                            size="small"
                            src="/static/images/wireframe/square-image.png"
                            />
                            <Label basic size="large">
                            Label
                            </Label>
                            <p>Something else</p>
                        </Grid.Column>
                        <Grid.Column mobile={8} tablet={4} computer={4}>
                            <Image
                            centered
                            circular
                            size="small"
                            src="/static/images/wireframe/square-image.png"
                            />
                            <Label basic size="large">
                            Label
                            </Label>
                            <p>Something else</p>
                        </Grid.Column>
                        <Grid.Column mobile={8} tablet={4} computer={4}>
                            <Image
                            centered
                            circular
                            size="small"
                            src="/static/images/wireframe/square-image.png"
                            />
                            <Label basic size="large">
                            Label
                            </Label>
                            <p>Something else</p>
                        </Grid.Column>
                        </Grid.Row>
                        <Divider section hidden />
                    </Grid>
                    </Grid.Column>
                </Grid>
            </div>
            :
            <div style={styles.body}>Not logged In</div>
          }
        </div>
      );
}


export default Home;




