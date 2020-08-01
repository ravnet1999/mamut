import React from 'react';
import Login from './Components/Login/Login';
import Clients from './Components/Clients/Clients';
import { Switch, Route } from 'react-router-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
	return (
		<div className="App">
			<header className="App-header">
			</header>
			<Switch>
				<Route path='/' exact component={Login}></Route>
				<Route path='/clients' exact component={Clients}></Route>
			</Switch>
		</div>
	);
}

export default App;
