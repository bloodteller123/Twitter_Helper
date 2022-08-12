import React, {useState, useEffect, useCallback} from "react";

import 'semantic-ui-css/semantic.min.css';

import {
    Image,
    Card,
    Dropdown
  } from "semantic-ui-react";



  const Followings = ({user_followings}) =>{
    

    return(
        <>
            <div>
                <Dropdown
                placeholder='State'
                fluid
                multiple
                search
                selection
                inline
                options={user_followings}
                // defaultValue={friendOptions[0].value}
                />
            </div>
        </>
    );
  }

  export default Followings