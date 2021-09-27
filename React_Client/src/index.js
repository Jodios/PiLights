import React from 'react';
import ReactDOM from 'react-dom';
import * as firebase from 'firebase';
import {firebaseConfig} from './firebase-config'
import './index.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import reportWebVitals from './reportWebVitals';

const firebaseApp = firebase.initializeApp(firebaseConfig);
const auth = firebaseApp.auth();

const App = () =>{
  return(
    <React.StrictMode>
        <Router>
          <Switch>
            <Route path="/" exact component={Login} />
            <Route path="/home" component={Home} />
          </Switch>
        </Router>
    </React.StrictMode>
  )
} 


ReactDOM.render( <App/>, document.getElementById('root') );

reportWebVitals();