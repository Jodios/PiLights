import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase/compat';
import { FirebaseAuthProvider } from "@react-firebase/auth";
import {firebaseConfig} from './firebase-config'
import './index.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import reportWebVitals from './reportWebVitals';

const App = () =>{
  return(
    <React.StrictMode>
        <FirebaseAuthProvider firebase={firebase} {...firebaseConfig}>
          <Router>
            <Switch>
              <Route path="/" exact component={Login} />
              <Route path="/home" component={Home} />
            </Switch>
          </Router>
        </FirebaseAuthProvider>
    </React.StrictMode>
  )
} 


ReactDOM.render( <App/>, document.getElementById('root') );

reportWebVitals();