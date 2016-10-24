// Main container which contain player details and Start/Exit buttons

import React from 'react';
import base64 from 'base-64';
import restUrl from '../../restUrl';

// Custom Components
import PlayerList from './PlayerList.jsx';
// var username = 'abc@xyz.in';

var me;

var players = [];

var Lobby = React.createClass({
	getInitialState: function() {
		var username = (JSON.parse(base64.decode(localStorage.token.split('.')[1])).sub);
		me = this;
		return ({
            playr: [{'name': username, 'status': 'active'}],
        });
	},
	componentWillMount: function()
	{
		var me = this;
		this.context.socket.on('updatePlayer', function(data) {
			console.log('-------------- COMMAND TO UPDATE PLAYER RECEIVED --------------');
			console.log(data.data);
			me.setState({
				playr: data.data
			});
			players = data.data;
	    });
	},
	componentDidMount: function ()
	{
		var url = window.location.href;
		var startPos = url.lastIndexOf('/lobby/') + 7;
	    var lobbyId = url.substr(startPos, 13);

	    //this.context.socket.emit('getLobbyPlayer', {data: lobbyId});
	},
	addPlayerHandler: function(newname) {
		players.push({'name': newname, 'status': 'waiting for player','user': 'player'});

		var url = window.location.href;
		var startPos = url.lastIndexOf('/lobby/') + 7;
	    var lobbyId = url.substr(startPos, 13);

		var addPlayerDetails = {
			player: newname,
			lobby: lobbyId
		};

		// Notify Middleware to update in Microservice
		this.context.socket.emit('lobbyPlayerAdd', {data: addPlayerDetails});
		
		// Set State
		this.setState({
            playr: players
        });
	},
	delPlayerHandler: function(index) {
		var delName = players[index].name;

		var url = window.location.href;
		var startPos = url.lastIndexOf('/lobby/') + 7;
	    var lobbyId = url.substr(startPos, 13);

		var removePlayerDetails = {
			player: delName,
			lobby: lobbyId
		};

		this.context.socket.emit('lobbyPlayerDelete', {data: removePlayerDetails});

		players.splice(index, 1);
		this.setState({
            playr: players
        });
	},
	render: function() {
		console.log('Rerender for Lobby : ');
		console.log(this.state.playr);
	    return (
        	<div style={{width: '100%',display: 'block'}}>
        		<div style={{overflow: 'hidden'}}>
		            <PlayerList
		            	players={this.state.playr}
		            	addPlayerHandle={this.addPlayerHandler}
		            	delPlayerHandle={this.delPlayerHandler}
		            	heightDiff={this.props.heightDiff}
		            	// addRemovePlayerSocket={addRemovePlayerSocket}
		            	device={this.props.device}
		            />
		        </div>
	        </div>
		);
    }
});

// addRemovePlayerSocket.on('add new player', function (data) {
// 	me.addPlayerHandler(data);
// });

// addRemovePlayerSocket.on('delete player', function (data) {
// 	me.delPlayerHandler(data);
// });

Lobby.contextTypes = {
    socket: React.PropTypes.object.isRequired
};

export default Lobby;