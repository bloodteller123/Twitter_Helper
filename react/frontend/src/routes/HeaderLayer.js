import React from "react";
import axios from 'axios';

import 'semantic-ui-css/semantic.min.css';
import '../CSS/SemanticUI.scss';


import {
  Divider,
  Grid,
  Header,
  Menu,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Button
} from "semantic-ui-react";

const HeaderLayer = ({SearchComp, TwitterLogin, userId, setUserid}) =>{

    const logout = ()=>{
      logout_helper()
      setUserid('')
  }

  const logout_helper = async ()=>{
    axios.post("http://localhost:3001/api/twitter/logout")
    .then((response) =>{
        console.log(response.data)
        window.location ="http://localhost:3000"
    })
}

    return (
        <Grid padded className="tablet computer only">
        <Menu borderless inverted fluid fixed="top">
          <Menu.Item header as="a">
            Tweeter
          </Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item>
                <div>
                    {<SearchComp userId={userId}/>}
                </div>
            </Menu.Item>
            <Menu.Item as="a">Dashboard</Menu.Item>
            <Menu.Item as="a">Settings</Menu.Item>
            <Menu.Item as="a">
            {userId!==''?
                <Dropdown icon='user' floating button className='icon'>
                    <DropdownMenu>
                        <DropdownItem icon='attention' text='Important' />
                        <DropdownItem icon='log out' text='Logout' onClick={logout}/>
                    </DropdownMenu>
                </Dropdown>
                :
                <TwitterLogin setUserid = {setUserid} userId={userId}/>
            }
            </Menu.Item>
          </Menu.Menu>
        </Menu>
      </Grid>
    )
}

export default HeaderLayer