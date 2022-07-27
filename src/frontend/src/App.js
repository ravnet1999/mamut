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
import RepresentativesSearchPage from './Components/RepresentativesSearch/RepresentativesSearchPage';
import TaskContextProvider from './Contexts/TaskContext';
import TaskAppendicesContextProvider from './Contexts/TaskAppendicesContext';
import TasksContextProvider from './Contexts/TasksContext';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {

	const [cookies, setCookies] = useState(new Cookies());
	const [loggedIn, setLoggedIn] = useState(false);
	const [generalTasksCount, setGeneralTasksCount] = useState(0);
	const [currentPage, setCurrentPage] = useState('/');
	const [generalTasksInterval, setGeneralTasksInterval] = useState(null);

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
			setGeneralTasksCount(response.resources.length);
        }).catch((err) => {
        });
    }

	useEffect(() => {
		updateTaskCount();
		getCookie() ? setLoggedIn(true) : setLoggedIn(false);
		let interval = setInterval(updateTaskCount, 5000);
		setGeneralTasksInterval(interval);
	}, []);

	useEffect(() => {
		console.log(currentPage);
	}, [currentPage])

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
			<Header loggedIn={loggedIn} generalTasksCount={generalTasksCount} currentPage={currentPage}></Header>
			<Switch>
				<Route path='/' exact render={(props) => <Login cookies={cookies} setCookie={setCookie} removeCookie={removeCookie} {...props}></Login>}></Route>
				<Route path='/logout' exact render={(props) => <Logout {...props} removeCookie={removeCookie}></Logout>}></Route>
				<Route path='/representatives-search' exact render={(props) => <RepresentativesSearchPage {...props} updateTaskCount={updateTaskCount} setCurrentPage={setCurrentPage}></RepresentativesSearchPage>}></Route>
        <Route path='/clients' exact render={(props) => <Clients {...props} updateTaskCount={updateTaskCount} setCurrentPage={setCurrentPage}></Clients>}></Route>
        <Route path='/representatives/:clientId' exact render={(props) => <TaskContextProvider><Representatives {...props} updateTaskCount={updateTaskCount} setCurrentPage={setCurrentPage}></Representatives></TaskContextProvider>}></Route>
				<Route path='/task/:taskId/:options?' exact render={(props) => <Task {...props} updateTaskCount={updateTaskCount} setCurrentPage={setCurrentPage}></Task>}></Route>
				<Route path='/tasks/:general?' exact render={(props) => <TasksContextProvider><Tasks {...props} updateTaskCount={updateTaskCount} setCurrentPage={setCurrentPage}></Tasks></TasksContextProvider>}></Route>
			</Switch>
		</div>
	);
}

export default App;
