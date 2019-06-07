// person list item
import React from 'react';
import firebase from '../Firebase';
import {get_user_file} from '../Firestore';
import { IonCardSubtitle, IonListHeader,
  IonButton, IonItem, IonAvatar,
} from '@ionic/react';


class PersonListItem extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			user: null,
		}
	}

	componentDidMount(){
		get_user_file(firebase, this.props.uid).then((doc)=>{
			var doc = doc.data();
			this.setState({user:doc})
			console.log('PersonListItem', doc)
		})
	}

	render(){
		return <div style={{ flexDirection: 'row', display: 'flex', alignItems:'center'}} >
			<IonAvatar style={{padding:'10px'}}>
		      	{this.state.user && this.state.user.photoURL && <img src={this.state.user.photoURL} />}
		    </IonAvatar>
		    {this.state.user && this.state.user.fbDisplayName} 
		</div>
	}
}


export default PersonListItem;

