// firestore functions


var add_to_map=(firebase, document, name, map) =>{
	return firebase.firestore().doc(document).set({[name]:map} , {merge:true}).
	then(()=>{
		console.log('added', map, 'to', name, 'in', document);
	})
	.catch((error)=>{
		console.error('adding', map, 'to', name, 'in', document);
	    console.error("Error writing document: ", error);
	})
}


var delete_from_map=(firebase, document, map_name, key_to_delete) =>{
	firebase.firestore().doc(document).get().
	then((doc)=>{
		doc= doc.data();
		delete doc[map_name][key_to_delete];
		firebase.firestore().doc(document).set({[map_name]:doc[map_name]}, {merge:true})
	})
	
}


var other_user_set= (firebase,other_user_uid , name, value) =>{
	firebase.firestore().doc('/users/'+other_user_uid).set({[name]:value }, {merge:true})
	.then(function() {
	    console.log("Document successfully written!");
	})
	.catch(function(error) {
	    console.error("Error writing document: ", error);
	});
}

var user_set= (firebase, name, value) =>{
	other_user_set(firebase, firebase.auth().currentUser.uid, name, value)
}

// add an element to collection
var other_user_add = (firebase, uid, collection, object) =>{
	return firebase.firestore().collection('/users/'+uid+'/'+collection).add(object)
	.then(function() {
	    console.log("object successfully written!", object);
	})
	.catch(function(error) {
	    console.error("Error writing document: ", error, object);
	});
}

var user_add= (firebase, collection, object) =>{
	other_user_add(firebase, firebase.auth().currentUser().uid, collection, object)
}





var sendFriendRequest= (firebase, friend_uid) =>{
	add_to_map(firebase, 'users/'+friend_uid, 'friend_requests', {[firebase.auth().currentUser.uid]:Date.now()})
	//firebase.firestore().doc('users/'+friend_uid).set({friend_requests:{[firebase.auth().currentUser.uid] : Date.now()}}, {merge:true})
	//other_user_add(firebase, friend_uid, 'friend_requests', {'uid': firebase.auth().currentUser.uid})
}



var deleteFriendRequest = (firebase, uid) =>{
		var myUid = firebase.auth().currentUser.uid
		delete_from_map(firebase,'/users/'+myUid, 'friend_requests', uid )
}

var addFriend = (firebase, uid)=>{
	var myUid = firebase.auth().currentUser.uid
	add_to_map(firebase, '/users/'+myUid,'friends', {[uid]: Date.now()})
	add_to_map(firebase, '/users/'+uid,'friends', {[myUid]: Date.now()})
	delete_from_map(firebase,'/users/'+myUid, 'friend_requests', uid )

}

var get_user_file = (firebase, uid) =>{
	return firebase.firestore().doc('users/'+uid).get()
}

var subscribeToUserFile = (firebase, uid, onChange)=>{
	firebase.firestore().doc('users/'+uid).onSnapshot((doc)=> {
        console.log("Current data user ", uid, doc.data());
        onChange(doc.data());
    });
}


var sendMessage=(firebase, post) =>{
		return firebase.firestore().collection('/feed/').add(post)
		.then((docRef) =>{
		    return add_to_map(firebase, '/users/'+post.author, 'sent_messages', {[docRef.id]: post.date})
		})
}


export {user_set, other_user_add, sendFriendRequest, addFriend, deleteFriendRequest, get_user_file, sendMessage, subscribeToUserFile}