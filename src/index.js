import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import firebase, {fireLogin, authStateChanged} from './Firebase.js'
import { Router} from "react-router";
import { BrowserRouter } from 'react-router-dom';

var db = firebase.firestore();

class PleaseLogin extends React.Component{
	render(){
		return <ion-button onClick={fireLogin}>Login or SignUp</ion-button>
		
	}
}


class Index extends React.Component {
	constructor() {
		super();
	    this.state = {
	    	data: {
				tea_categories: [],
				user:null,
				user_file:null,
			}
		};
		var that = this;
		var db= firebase.firestore()
		db.collection('/data/teas/categories').get()
	    .then(function(querySnapshot) {
	        querySnapshot.forEach(function(doc) {
	            // doc.data() is never undefined for query doc snapshots
	            console.log(doc.id, " => ", doc.data());
	            that.setState((state)=>{
	            	state.data['tea_categories'].push([doc.id, doc.data()]);
	            	return state}
	            )});
	    });
	}

	componentDidMount() {
    	firebase.auth().onAuthStateChanged((user) => {
        	this.setState((state)=>{state.data.user=user; return state})
        	var that =this
        	db.doc('/users/'+user.uid).onSnapshot(function(doc) {
		        console.log("Current user_file: ", doc.data());
		        	that.setState((state)=>{state.data.user_file = doc.data(); return state;})
		    });
	    })
	}



  render() {
  	//return <App data={this.state.data}/>
  	return (<App data={this.state.data}/>);
  }
}


ReactDOM.render(<BrowserRouter><Index/></BrowserRouter>, document.getElementById('root'));
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
