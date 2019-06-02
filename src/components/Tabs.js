import {
  IonApp, IonTabs, IonTab,IonRefresher, IonRefresherContent,
  IonContent, IonList, IonListHandler, IonLabel, IonItem,
  IonCard, IonHeader, IonToolbar, IonTitle, IonFab, IonFabButton,
  IonCardHeader, IonIcon, IonTabButton, IonTabBar,
  IonCardTitle, IonRouterOutlet,
  IonCardSubtitle,
  IonButton
} from '@ionic/react';
import React from 'react';
import '@ionic/core/css/core.css';
import '@ionic/core/css/ionic.bundle.css';
import firebase from '../Firebase'


var db = firebase.firestore();
var auth = firebase.auth();

class Feed extends React.Component{


	constructor(){
		super()
		this.state = {
			messages : [],
		}
		var that = this
		var db = firebase.firestore();
		db.collection('/feed').get().then(function(querySnapshot) {
	    	querySnapshot.forEach(function(doc) {
		        // doc.data() is never undefined for query doc snapshots
		        console.log(doc.id, " => ", doc.data());
		        that.setState((state)=>{state.messages.push(doc.data()); return state});
		    });
		});
	}

	render(){
		return <IonContent>
			<IonHeader>
		  		<IonToolbar>
		  			<IonTitle>Feed ! </IonTitle>
		  		</IonToolbar>
	  		</IonHeader>
			{/*<IonRefresher slot="fixed">
		    	<IonRefresherContent>
		    		
		    	</IonRefresherContent>
		  	</IonRefresher>*/}
		  	{this.state.messages.map((message)=>
		  		<IonCard><IonItem>{message.message}</IonItem></IonCard>)}
		</IonContent>
	}
}


class Categories extends React.Component{
	constructor(props){
		super(props);
	}


	render(){
		return <IonContent style={{ 'justifyContent': 'center',	'alignItems':'center',display:'flexbox'}}>
	  		<IonList>
			  	{this.props.data.tea_categories.map((value, index)=>{
		  		return	<IonItem onClick={()=> this.setState({selected: value})}
		  		color={ (value === this.state.selected) ? 'primary' : '' }>
		  			<IonLabel>{value[0]}</IonLabel>
		  		}
		  		</IonItem>
		  		})
			  	}
			</IonList>
			<div  style={{padding:'20px'}}>
				<p>Hi, welcome to this app, I'm sure you will find plenty of things that you like.</p>
				<p>The purpose of this app is that any user can share his thoughts on tea. About any brand, type or place related to tea.</p>
			</div>
		</IonContent>
	}
}

class Profile extends React.Component{
	constructor(props){
		super(props);
	}


	render(){
		return 	<IonContent>
			{this.props.data.user && this.props.data.user.displayName}
			<IonButton onClick={()=>firebase.auth().signOut()}>Log Out</IonButton>
		</IonContent>
				  	
	}
}


class Comments extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			writing_comment:false,
		}
	}


	render(){
		return <IonContent>
	  		<IonHeader>
		  		<IonToolbar>
		  			<IonTitle>Comments here ! </IonTitle>
		  		</IonToolbar>
	  		</IonHeader>
	  			{this.state.writing_comment ? 
	  				<div >
	  					<IonCard>
	  						<ion-textarea auto-grow type="text" placeholder="Write your comment..."/>
	  					</IonCard>
	  					<IonFab horizontal="end">
		  					<IonFabButton size='small'>
			  		    		<IonIcon name='send' />
			  		    	</IonFabButton>
			  		    </IonFab>
	  				</div> : 
	  				<div>
	  					reading_comments
	  				</div>}
		  		<IonFab vertical="bottom" horizontal="end">
		  		    <IonFabButton size='small' onClick={()=>this.setState(
	  		    		(state)=>{
	  		    			state.writing_comment = ! state.writing_comment;
	  		    			return(state);
	  		    		})}>
		  		    {this.state.writing_comment ? 
		  		    	<IonIcon name='close' />:
		  		    	<IonIcon name='add'/>}
		  		    </IonFabButton>
		  		</IonFab>
		  	</IonContent>
	}
}



class Friends extends React.Component {
	constructor(props){
		super(props);
	}

	render(){
		return <IonContent>
			<IonList>
				{this.props.data.user_file.friends.map((uid)=>
					<IonItem>{uid}</IonItem>)}
			</IonList>
		</IonContent>
	}
}

export {Feed, Categories, Profile, Comments, Friends}