import React from 'react';
import "../CSS/Login.scss"

const Login = ({TwitterLogin}) => (
  <div className='login'>
    {/* <h1 className='loginBanner'>Twitter Helper</h1> */}
    <TwitterLogin/>
  </div>
);

export default Login;