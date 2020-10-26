import React, { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';
import Login from './Components/Login/Login';
import Logout from './Components/Logout/Logout';
import Clients from './Components/Clients/Clients';
import Task from './Components/Tasks/Task';
import Tasks from './Components/Tasks/Tasks';
import Header from './Components/Header';
import appConfig from './Config/appConfig.json';
import { Switch, Route } from 'react-router-dom';
import TaskHandler from '../src/Handlers/TaskHandler';
import Representatives from './Components/Representatives/Representatives';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {

	const [cookies, setCookies] = useState(new Cookies());
	const [loggedIn, setLoggedIn] = useState(false);
	const [generalTasksCount, setGeneralTasksCount] = useState(0);
	const [taskCountInterval, setTaskCountInterval] = useState(null);

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

    const updateTaskCount = () => {
        TaskHandler.getTasks(true).then((response) => {
			console.log('updating count...');
			setGeneralTasksCount(response.resources.length);
        }).catch((err) => {
			console.log(err);
        });
    }

	useEffect(() => {
		updateTaskCount();
		getCookie() ? setLoggedIn(true) : setLoggedIn(false);
	}, []);

	useEffect(() => {
		console.log(generalTasksCount);
	}, [generalTasksCount])

	const removeCookie = () => {
		cookies.remove(appConfig.cookies.auth.name, appConfig.cookies.auth.settings);
		setLoggedIn(false);
	}

	if(!cookies) return '';
	return (
		<div className="App">
			<Header loggedIn={loggedIn} generalTasksCount={generalTasksCount}></Header>
			<Switch>
				<Route path='/' exact render={(props) => <Login cookies={cookies} setCookie={setCookie} removeCookie={removeCookie} {...props}></Login>}></Route>
				<Route path='/logout' exact render={(props) => <Logout {...props} removeCookie={removeCookie}></Logout>}></Route>
				<Route path='/clients' exact render={(props) => <Clients {...props} updateTaskCount={updateTaskCount}></Clients>}></Route>
				<Route path='/representatives/:clientId' exact render={(props) => <Representatives {...props} updateTaskCount={updateTaskCount}></Representatives>}></Route>
				<Route path='/task/:taskId' exact render={(props) => <Task {...props} updateTaskCount={updateTaskCount}></Task>}></Route>
				<Route path='/tasks/:general?' exact render={(props) => <Tasks {...props} updateTaskCount={updateTaskCount}></Tasks>}></Route>
			</Switch>
		</div>
	);
}

export default App;
