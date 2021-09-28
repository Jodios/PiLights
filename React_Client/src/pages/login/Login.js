import React from 'react';
import {Redirect} from 'react-router-dom';
import { FirebaseAuthConsumer } from "@react-firebase/auth";
import firebase from 'firebase/compat';
import google_login from '../../resources/google-login.png';
import './login.css';

export default class Login extends React.Component {

	login = () => {
		firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
	}

	logout = () => {
		firebase.auth().signOut();
	}

	render() {
		return (
			<FirebaseAuthConsumer>
				{({ user, firebase, providerId, isSignedIn }) => {
					if (isSignedIn) {
						return (
							<Redirect to={{pathname: "/home", state: {name: user.displayName}}}/>
						)
					}
					return (
						<div className="login_wrapper">
							<div className="login_left"></div>
							<div className="login_main">
								<img className="login_icon" src={google_login} onClick={() => this.login()} />
								<h1>Please login</h1>
							</div>
							<div className="login_right"></div>
						</div>
					)
				}}
			</FirebaseAuthConsumer>
		);
	}

}