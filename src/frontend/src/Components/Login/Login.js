import React, { useState } from 'react';
import Cookie from 'universal-cookie';
import './Login.css';
import Page from '../Page';
import { Row, Col, Form, Button } from '../bootstrap';
import Alert from '../Alert/Alert';
import LoginHandler from '../../Handlers/LoginHandler';
import appConfig from '../../Config/appConfig.json';

const Login = (props) => {
    let cookies = new Cookie();

    const [form, setForm] = useState({
        username: '',
        password: ''
    });

    const [response, setResponse] = useState(null);

    const setField = (e) => {
        e.persist();

        const newForm = {
            ...form
        };

        newForm[e.target.name] = e.target.value;

        setForm(newForm);
    }

    const sendForm = (e) => {
        e.preventDefault();

        LoginHandler.login(form.username, form.password).then((response) => {
            console.log('response', response);
            cookies.set(appConfig.cookies.auth.name, {
                userId: response.resources[0].userId,
                token: response.resources[0].token
            }, appConfig.cookies.auth.settings);
            setResponse(response);
            return;
        }).catch((err) => {
            setResponse(err);
            return;
        });
    }

    return (
        <Page>
            <div className="view-height">
                <div className="border-box login-box vertical-middle">
                    <div className="border-box-title">Logowanie</div>
                    <Alert response={response}></Alert>
                    <Form onSubmit={sendForm}>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Nazwa użytkownika</Form.Label>
                            <Form.Control type="text" name="username" placeholder="Nazwa użytkownika" onChange={setField} value={form.username} />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Hasło</Form.Label>
                            <Form.Control type="password" name="password" placeholder="Hasło" onChange={setField} value={form.password} />
                        </Form.Group>

                        <Form.Group className="text-right">
                            <Button variant="primary" type="submit">
                                Zaloguj
                            </Button>
                        </Form.Group>
                    </Form>
                </div>
            </div>
        </Page>
    );
}

export default Login;