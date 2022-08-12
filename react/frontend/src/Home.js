import React from "react";
// import { CONSUMER_KEY, CONSUMER_SECRET } from "../../../../nodejs/services/Config";
import axios from 'axios'

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
  Table
} from "semantic-ui-react";

const styles = {
    body:{
        marginTop:50
    }
}

const Home = () =>{
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
                <Menu.Item as="a">Profile</Menu.Item>
              </Menu.Menu>
            </Menu>
          </Grid>
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
        </div>
      );
}


export default Home;




