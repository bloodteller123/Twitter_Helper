import React from "react";
import axios from 'axios';
import { useSelector, useDispatch } from "react-redux";
import Api from "../api/Api"

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
import { resetUserId, selectUserId } from "../reducers/UserIdSlice";
import { Link } from "react-router-dom";

const HeaderLayer = ({SearchComp}) =>{
    const dispatch = useDispatch()
    const userId = useSelector(selectUserId)

    const logout = ()=>{
      logout_helper()
      // setUserid('')
      dispatch(resetUserId({emptyId:''}))
  }

  const logout_helper = async ()=>{
    Api.post("/api/twitter/logout")
    .then((response) =>{
        console.log(response.data)
        window.location ="https://www.twiburger.xyz/"
    })
}

    return (
        <Grid padded className="tablet computer only">
        {userId!==''?
          <Menu borderless inverted fluid fixed="top">
            <Menu.Item header >
              <Link to='/'>Tweets</Link>
            </Menu.Item>
            <Menu.Menu position="right">
              <Menu.Item>
                  <div>
                      {<SearchComp userId={userId}/>}
                  </div>
              </Menu.Item>
              <Menu.Item >Dashboard</Menu.Item>
              <Menu.Item >Settings</Menu.Item>
              <Menu.Item >
              {userId!==''?
                  <Dropdown icon='user' floating button className='icon'>
                      <DropdownMenu>
                          <DropdownItem icon='attention' text='Important' />
                          <DropdownItem icon='log out' text='Logout' onClick={logout}/>
                      </DropdownMenu>
                  </Dropdown>
                :
                {/* <TwitterLogin/> */}
            }
            </Menu.Item>
          </Menu.Menu>
        </Menu>
          :
        <></>
        }
      </Grid>
    )
}

export default HeaderLayer