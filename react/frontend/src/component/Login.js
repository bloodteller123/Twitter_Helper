import React from 'react';
import "../CSS/Login.scss"

const Login = ({TwitterLogin}) => (
  <div className='login'>
    <h1 style={{color:'white'}}>Twitter Helper</h1>
    <TwitterLogin/>
  </div>
);

export default Login;