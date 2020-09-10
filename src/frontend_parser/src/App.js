import React, { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';
import { Switch, Route } from 'react-router-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Header from './Components/Header';
import Login from './Components/Login/Login';
import CompanyEmails from './Components/CompanyEmails/CompanyEmails';
import appConfig from './Config/appConfig.json';

const App = () => {
	const [cookies, setCookies] = useState(new Cookies());
	const [loggedIn, setLoggedIn] = useState(false);

	const getCookie = () => {
		return cookies.get(appConfig.cookies.auth.name);
	}

	const setCookie = (userId, token) => {
		cookies.set(appConfig.cookies.auth.name, {
			userId: userId,
			token: token
		}, appConfig.cookies.auth.settings);

		getCookie() ? setLoggedIn(true) : setLoggedIn(false);
	}

	useEffect(() => {
		getCookie() ? setLoggedIn(true) : setLoggedIn(false);
	}, []);

	const removeCookie = () => {
		cookies.remove(appConfig.cookies.auth.name, appConfig.cookies.auth.settings);
		setLoggedIn(false);
	}

	return (
		<div className="App">
			<Header loggedIn={loggedIn}></Header>
			<Switch>
				<Route path='/' exact render={(props) => <Login {...props} removeCookie={removeCookie} setCookie={setCookie}></Login>}></Route>
				<Route path='/domains' exact render={(props) => <CompanyEmails {...props}></CompanyEmails>}></Route>
			</Switch>
		</div>
	);
}

export default App;
