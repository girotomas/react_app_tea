import {
  IonApp, IonTabs, IonTab,IonRefresher, IonRefresherContent,
  IonContent, IonList, IonListHandler, IonLabel, IonItem,
  IonCard, IonHeader, IonToolbar, IonTitle, IonFab, IonFabButton,
  IonCardHeader, IonIcon, IonTabButton, IonTabBar, IonSearchbar,
  IonCardTitle, IonRouterOutlet, IonTextarea, IonInfiniteScroll,
  IonCardSubtitle, IonListHeader, IonMenu,
  IonButton
} from '@ionic/react';
import React from 'react';
import '@ionic/core/css/core.css';
import '@ionic/core/css/ionic.bundle.css';
import firebase from '../Firebase';
import FuzzySet from 'fuzzyset.js'
import { sendFriendRequest, addFriend, deleteFriendRequest, get_user_file, sendMessage} from '../Firestore'
import PersonListItem from './PersonListItem'
import Material from '../Material'


var db = firebase.firestore();
var auth = firebase.auth();

class Feed_Shower extends React.Component{


	constructor(props){
		super(props);
		this.state = {
			messages : {},
			message_uids:[],
			asking:true,
			wanted:2,
		}
		console.log('constructing Feed_Shower')
	}


	componentDidMount(){
		this.componentDidUpdate()
	}

	componentDidUpdate(prevState){
		if(Object.keys(this.state.messages).length>=this.state.wanted) return
		console.log('updating feed shower')
		var props_message_uids = Object.keys(this.props.messages)
		console.log('Feed_Shower mounted with', this.props.messages)
		if(props_message_uids.length!=this.state.message_uids.length) {
			var state_message_uids = props_message_uids.sort((a,b)=>{return -this.props.messages[a]+this.props.messages[b]})
			this.setState({message_uids:state_message_uids })
		}
		if( this.state.asking ) this.more()
		console.log('message_uids',props_message_uids)
	}



	more(){
		console.log('calling more in shower')
		var number = 3;
		var getMess = (uid)=>{
			console.log('getting message in Feed_Shower', uid)
			firebase.firestore().collection('feed').doc(uid).get().then((doc)=> {
		        this.setState((state)=>{state.messages[uid]=doc.data(); return state});
	    	});
	    }
		var count =0
		this.state.message_uids.some((uid)=>{
			console.log('called some with uid', uid)
			var done = Object.keys(this.state.messages)
			if (!done.includes(uid)){
				count+=1
				getMess(uid)
			}
			return count==number
		})
		console.log('more called',this.state.message_uids)
		var number = this.props.number || 3;
	}

	orderedMessages(){
		if ( !this.state.messages) return [];
		var sortable = [];
		var keys= Object.keys(this.state.messages)
		for (var key in keys) {
			key = keys[key]
			console.log(key,'key')
		    sortable.push(this.state.messages[key]);
		}
		console.log('sortable', sortable, JSON.stringify(this.state.messages))
		sortable.sort(function(a, b) {
		    return -a.date + b.date;
		});
		return sortable
	}

	render(){
		var dateOptions = { month: 'long', day: 'numeric', hour:'numeric', minute:'numeric' };
		console.log('rendering feed')
		return <div style={{display:'flex', flexDirection:'column', alignItems:'stretch'}}>
		  	{this.orderedMessages().map((message)=>
	  			{console.log(this.orderedMessages())
	  				return <IonCard key={message.message+message.date}>
		  			<div style={{display:'flex', flexDirection:'row'}}>
		  				<PersonListItem uid={message.author}/>
		  				<p style={{padding:'10px'}}>{message.date && new Date(message.date).toLocaleDateString('en-US',dateOptions)}</p>
		  			</div>
	  				<IonItem>{message.message}</IonItem>
	  			</IonCard>})}
		  	{this.state.message_uids.length > Object.keys(this.state.messages).length && <div style={{display:'flex', alignItems:'center', flexDirection:'column'}}><IonButton fill='clear' onClick={()=>this.more()}>Load more...</IonButton></div>}
		</div>
	}
}

class Feed extends React.Component{
	constructor(props){
		super(props)
		console.log('constructing feed')
		this.state={
			messages:{},
		}
	}
	componentDidMount(){
		this.componentDidUpdate()
	}
	componentDidUpdate(prevProps){
		console.log('componentDidUpdate feed')
		if( this.props.data.friends){
			var messages={}
			Object.keys(this.props.data.friends).map((author)=>{
				author= this.props.data.friends[author]
				console.log('iterating author', author)
				messages = {...messages, ...author.sent_messages }
			})
			console.log('feed messages',messages)
			if (Object.keys(this.state.messages).length != Object.keys(messages).length)
			{this.setState({messages:messages})
			console.log('feed messages',messages)}
		}
		
	}

	render(){
		console.log('rerenderin feed', JSON.stringify(this.state),JSON.stringify(this.props) )
		return <div>{/*<IonContent>
			<IonHeader>
		  		<IonToolbar>
		  			<IonTitle>Feed ! </IonTitle>
		  		</IonToolbar>
	  		</IonHeader>*/}
			{ this.state.messages  && <Feed_Shower messages={this.state.messages}/>}</div>
	}
}


class Categories extends React.Component{
	constructor(props){
		super(props);
		this.state={
			selected:null,
			reading:false,
		}
	}


	render(){
		var reading = this.state.selected ?
  	 	<iframe title='jlj0' style={{ height:'100%', width:'100%'}} 
  	 		src={this.state.selected[1].link}>
  	 	</iframe> : <p>Please select a tea !</p>
		  	

		var not_reading = <div>
			<div  style={{padding:'20px'}}>
		  		<p>Hi, I hope you are enjoying the app so far. Please select a category
		  		 and then press the <IonIcon name='md-information-circle'/> button to see the information on 
		  		 the selected category !</p>
		  	</div>
	  		<IonList>
			  	{this.props.data.tea_categories.map((value, index)=>{
			  		return	<IonItem onClick={()=> this.setState({selected: value})}
			  		color={ (value === this.state.selected) ? 'primary' : '' }>
			  		<IonLabel>{value[0]}</IonLabel>
					</IonItem>
				})}
			</IonList>
			<div  style={{padding:'20px'}}>
				<p>Hi, welcome to this app, I'm sure you will find plenty of things that you like.</p>
				<p>The purpose of this app is that any user can share his thoughts on tea. About any brand, type or place related to tea.</p>
			</div>
		</div>

		var fab = <IonFab vertical="bottom" horizontal="end" slot="fixed">
			<IonFabButton size='small' onClick={()=>this.setState((state)=>{state.reading=!state.reading; return state})}>
				<IonIcon name={this.state.reading ? 'close' : 'md-information-circle'}/>
			</IonFabButton>
		</IonFab>

		return(<IonContent>
			{this.state.reading ? reading : not_reading}
			{fab}
		</IonContent>)
	}
}

class Profile extends React.Component {
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


class YourWall extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			writing_comment:false,
			text:'',
		}
	}

	send(){
		var post = {
			message:this.state.text,
			date:  Date.now() ,
			author: this.props.data.user.uid,
		}
		console.log(post);
		sendMessage(firebase, post).then(()=>this.setState({text:'', writing_comment:false}))
	}


	render(){

		return <IonContent>
			<Material />
	  		<IonHeader>
		  		<IonToolbar>
		  			<IonTitle>Your wall </IonTitle>
		  		</IonToolbar>
	  		</IonHeader>

	  			{this.state.writing_comment ? 
	  				<div >
	  					<IonCard>
	  						<IonTextarea rows="5" auto-grow value={this.state.text} onIonChange={(e)=>{this.setState({text: e.detail.value}); console.log(e.detail.value);}} type="text" placeholder="Write your comment..."/>
	  					</IonCard>
	  					<IonFab horizontal="end">
		  					<IonFabButton size='small' onClick={()=>this.send()}>
			  		    		<IonIcon name='send' />
			  		    	</IonFabButton>
			  		    </IonFab>
	  				</div> : 
	  				<div >
	  					{this.props.data.user_file && this.props.data.user_file.sent_messages && <Feed_Shower key='1' messages={this.props.data.user_file.sent_messages}/>}
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
		this.state = {
			searching : false, 
			users:[],
			fuz:null,
			text:'',
		}

		

	}

	componentDidMount(){
		db.collection('/users').get()
	    .then((querySnapshot)=> {
	        querySnapshot.forEach((doc) =>{
	            this.state.users.push(doc.data());
	        });
	        this.setState({fuz:FuzzySet(this.state.users.map((u)=>(u.fbDisplayName)))});
	    })
	}

	search(e){
		var text = e.detail.value
		this.setState({text:text})
		if (this.state.fuz){
			var res = this.state.fuz.get(text);
			if(res) res = res.map((val)=>val[1]) // null or array of names
			this.setState({selected_names:res})
		}
		console.log(this.state);
	}

	render(){
		var friends = null;
		var friend_requests = null;
		try{friends = Object.keys(this.props.data.user_file.friends)} catch{}
		try{friend_requests =  Object.keys(this.props.data.user_file.friend_requests)} catch{}
		return <IonContent>
			{this.state.searching ?
			<div><IonSearchbar onIonChange={(e)=>this.search(e)} value={this.state.text}/>
				<IonList>
					{this.state.users && this.state.selected_names && this.state.users.filter((user)=>{
						console.log(user)
						return this.state.selected_names.includes(user.fbDisplayName)
					}).map((user)=>{
						return <IonItem>
							<PersonListItem key={user.uid} uid={user.uid}/>
							<IonIcon name='person-add' onClick={()=>sendFriendRequest(firebase, user.uid)} style={{padding:'10px'}} />
						</IonItem>
					})}
				</IonList>
			</div>
			:
			<div>
				<IonList>
					{<IonListHeader>
						FRIEND REQUESTS:
					</IonListHeader>}
					{friend_requests && friend_requests.map((uid)=>{ 
						return <IonItem>
						<PersonListItem uid={uid}/ >
						<IonIcon name='add-circle' onClick={()=>addFriend(firebase,uid)} style={{padding:'10px'}}/> <IonIcon name='close' onClick={()=>deleteFriendRequest(firebase,uid)}/>
					</IonItem>})
					}
				</IonList>
				{
					<IonListHeader>
						FRIENDS:
					</IonListHeader>
				}
				<IonList>
					{console.log(this.props.data.user_file)
					}
					{friends && friends.map((uid)=>
					<PersonListItem key={uid} uid={uid}/>)}
				</IonList>
			</div>
		}
			<IonFab vertical="bottom" horizontal="end">
	  		    <IonFabButton size='small' onClick={()=>this.setState(
  		    		(state)=>{
  		    			state.searching = ! state.searching;
  		    			return(state);
  		    		})}>
	  		    {this.state.searching ? 
	  		    	<IonIcon name='close' />:
	  		    	<IonIcon name='search'/>}
	  		    </IonFabButton>
	  		</IonFab>
		</IonContent>
	}
}

export {Feed, Categories, Profile, YourWall, Friends}