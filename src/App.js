import React from 'react';
import './App.css';
import firebase , {fireLogin} from './Firebase'
import '@ionic/core/css/core.css';
import '@ionic/core/css/ionic.bundle.css';
import {
  IonApp, IonTabs, IonTab,IonRefresher, IonRefresherContent,
  IonContent, IonList, IonListHandler, IonLabel, IonItem,
  IonCard, IonHeader, IonToolbar, IonTitle, IonFab, IonFabButton,
  IonCardHeader, IonIcon, IonTabButton, IonTabBar,
  IonCardTitle, IonRouterOutlet, IonMenu,
  IonCardSubtitle, IonSplitPane,IonPage, 
  IonButton
} from '@ionic/react';
import {Route, Switch} from 'react-router-dom'
import {Feed, Categories, Profile, YourWall, Friends} from './components/Tabs'

class PleaseLogin extends React.Component{
	render(){
		return <IonButton onClick={fireLogin}>Login or SignUp</IonButton>
		
	}
}

class App extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			selected:null,
		}
	}




	render(){
		if (! this.props.data.user) return (<PleaseLogin/>);
		return (
			<div>
		  	<IonApp>
		  		<IonContent>

			    <IonTabs>
			    	
			    	<IonRouterOutlet>
				        <Route path="/feed" render={()=><Feed data={this.props.data}/>} exact={true} />
				        <Route path="/categories" render={()=><Categories data={this.props.data}/>} exact={true} />
				        <Route path="/friends" render={()=><Friends data={this.props.data}/>} exact={true} />
				        <Route path="/yourwall" render={()=><YourWall data={this.props.data}/>} exact={true} />
				        {/*<Route path="/categories" render={()=><Categories data={this.props.data} selected={this.state.selected}/>}  exact={true} />*/}
				        <Route path="/profile"  render={()=><Profile data={this.props.data}/>} exact={true} />
      				</IonRouterOutlet>
				  	<IonTab tab="settings">
				  		  	{ this.state.selected ?
			  		  	 	<iframe title='jlj0' style={{height:'100%', width:'100%'}} 
			  		  	 		src={this.state.selected[1].link}>
			  		  	 	</iframe> : <p>Please select a tea !</p>
				  		  	}
				  	</IonTab>
				  	<IonTabBar slot="bottom">
		  			  	<IonTabButton tab="feed" href='/feed'>
		  		 	   		<IonLabel>Feed</IonLabel>
		  		 	   		<IonIcon name="paper"></IonIcon>
		  		 	   		<ion-badge>1</ion-badge>
		  			  	</IonTabButton>
				  	  	<IonTabButton tab="categories" href='/categories'>
				   	   		<IonLabel>Categories</IonLabel>
				   	   		<IonIcon name="cafe"></IonIcon>
				   	   		<ion-badge>6</ion-badge>
				  	  	</IonTabButton>
				   	 	<IonTabButton tab="friends" href='/friends'>
				   	   		<IonLabel>Friends</IonLabel>
				   	   		<IonIcon name="people"></IonIcon>
				    	</IonTabButton>
				    	<IonTabButton tab="yourwall" href='/yourwall'>
				   	   		<IonLabel>My Wall</IonLabel>
				   	   		<IonIcon name="chatboxes"></IonIcon>
				    	</IonTabButton>
				    	<IonTabButton tab="profile" href='/profile'>
				   	   		<IonLabel>Profile</IonLabel>
				   	   		<IonIcon name="person"></IonIcon>
				    	</IonTabButton>
				  	</IonTabBar>
				</IonTabs>
				</IonContent>
			</IonApp>
			</div>
		);
	}
}

export default App;
