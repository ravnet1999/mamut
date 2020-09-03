import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';

const Logout = (props) => {

    props.removeCookie();

    return <Redirect to='/'></Redirect>;
}

export default Logout;