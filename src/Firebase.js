import * as firebase from 'firebase';
import pick from 'lodash/pick';
import {user_set} from './Firestore'

var firebaseConfig = {
    apiKey: "AIzaSyDe-JgL1_glAu9YAyJvp5-MqjRI7afEHTQ",
    authDomain: "project-7132361624553856916.firebaseapp.com",
    databaseURL: "https://project-7132361624553856916.firebaseio.com",
    projectId: "project-7132361624553856916",
    storageBucket: "project-7132361624553856916.appspot.com",
    messagingSenderId: "1001027747205",
    appId: "1:1001027747205:web:4e84edb4c400d901"
  };
  // Initialize Firebase




export default !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

var provider = new firebase.auth.FacebookAuthProvider();

var fireLogin = ()=>firebase.auth().signInWithPopup(provider).then(function(result) {
	// This gives you a Facebook Access Token. You can use it to access the Facebook API.
	var token = result.credential.accessToken;
	// The signed-in user info.
	var user = result.user;
	console.log('fireLogin user');
	var user =  pick(user, ['createdAt', 'displayName', 'email', 'lastLoginAt', 'photoURL', 'uid'])
	if (user.photoURL) user_set(firebase,'fbPhoto', user.photoURL);
	if (user.uid) user_set(firebase,'uid', user.uid);
	if (user.displayName) user_set(firebase,'fbDisplayName', user.displayName)
	console.log('/users/'+firebase.auth().currentUser.uid+'/fireLogin/fireLogin')
	firebase.firestore().doc('/users/'+firebase.auth().currentUser.uid).set(user, {merge:true})
	.then(function() {
	    console.log("Document successfully written!");
	})
	.catch(function(error) {
	    console.error("Error writing document: ", error);
	});
  // ...
}).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // The email of the user's account used.
  var email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  var credential = error.credential;
  // ...
});


export {fireLogin};