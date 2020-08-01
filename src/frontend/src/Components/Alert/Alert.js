import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

const Alert = (props) => {

    console.log('response in alert', props.response);

    const [redirect, setRedirect] = useState(null);

    useEffect(() => {
        if(props.response && props.response.redirect) {
            setRedirect(props.response.redirect);
        }
    }, [props.response ? (props.response.redirect ? props.response.redirect : null) : null]);

    if(!props.response) return '';

    const type = props.response.error ? 'warning' : 'success';

    console.log(props.response);

    const messages = props.response.messages.map((message, index) => {
        return <div key={index}>{ message }</div>;
    });

    return (
        <div className={`alert alert-${type}`}>
            { messages }
            { redirect ? <Redirect to={redirect}></Redirect> : '' }
        </div>
    )
}

export default Alert;