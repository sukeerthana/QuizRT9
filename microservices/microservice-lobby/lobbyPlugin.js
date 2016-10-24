module.exports = function(){

	var seneca = require('seneca');
	var lobby = {};
	var lobbyAll = [];
	var lobbyClient = seneca();

	this.add('role:lobby,action:createLobbyId', function(msg, respond) {
		console.log('-----------Inside Lobby MicroService---------');
		// console.log(msg);
		var d = new Date();
		console.log('User Id : ' + msg.data);
		console.log('Game Id generated : ' + Number(d));
		var resp = Number(d) + '';
		console.log('---------------------------------------------');

		lobbyClient.use('redis-transport');

	    lobbyClient.client({
	      type: 'redis',
	      pin: 'role:lobbySub,lobbyId:'+resp+',cmd:*',
	      host: '172.23.238.251'
	    });

		return respond(null, {gameId: resp});	
	});

	this.add('role:lobby,action:addLobbyDetails', function(msg, respond) {
		console.log('-----------Inside Lobby MicroService---------');
		// console.log(msg);
		console.log('Lobby Id : ' + msg.data.lobby);

		lobby.id = msg.data.lobby;
		lobby.playerCount = 1;
		lobby.topic = '';
		lobby.admin = msg.data.player;
		// lobby.admin = 'demoPlayer@demo.com';
		lobby.players = [{
			name: msg.data.player,
			status: 'active',
			user: 'admin'
		}];

		lobbyAll[msg.data.lobby] = lobby;

		console.log(lobbyAll[msg.data.lobby].admin);
		console.log('---------------------------------------------');
		return respond(null, {gameId: 'success'});
	});
 
	this.add('role:lobby,action:addPlayer', function(msg, respond) {
		console.log('-----------Inside Lobby MicroService---------');
		console.log('Add Player triggered for ' + msg.data.player);

		lobby = lobbyAll[msg.data.lobby];
		console.log(lobby.players);
		var playr = {
			'name': msg.data.player,
			'status': 'waiting for player',
			'user': 'player'
		};
		lobby.players.push(playr);
		lobbyAll[msg.data.lobby] = lobby;
		console.log('lobby :');
		console.log(lobbyAll[msg.data.lobby]);
		console.log('---------------------------------------------');
		
		// lobbyClient.act('role:lobbySub,lobbyId:'+msg.data.lobby+',cmd:updatePlayerDetails', {data: lobby.players}, function(err, response) {
  //         console.log('Response from Middleware : ');
  //         console.log(response);
  //       });
		sendPlayers(msg.data.lobby, lobby.players);

		return respond(null, {players: lobby.players});
	});

	this.add('role:lobby,action:remPlayer', function(msg, respond) {
		console.log('-----------Inside Lobby MicroService---------');
		console.log('Remove Player triggered for ' + msg.data.player);

		lobby = lobbyAll[msg.data.lobby];

		var indexToDelete = -1;
		lobby.players.map(function (row, i){
			if(row.name == msg.data.player)
			{
				indexToDelete = i;
				return;
			}			
		});

		console.log('Index to Delete = ' + indexToDelete);
		console.log('User Deleted : ' + lobby.players.name);
		lobby.players.splice(indexToDelete, 1);

		lobbyAll[msg.data.lobby] = lobby;

		console.log('lobby :');
		console.log(lobbyAll[msg.data.lobby]);
		console.log('---------------------------------------------');
		
		sendPlayers(msg.data.lobby, lobby.players);
		
		return respond(null, {players: lobby.players});
	});

	this.add('role:lobby,action:setActive', function(msg, respond) {
		console.log('-----------Inside Lobby MicroService---------');
		console.log('Set Active triggered for ' + msg.data.username);
		console.log('Lobby Id ' + msg.data.lobbyId);

		lobby = lobbyAll[msg.data.lobbyId];

		// sendPlayers(msg.data.lobbyId, lobby.players);

		return respond(null, {response: lobby});
	});

	function sendPlayers(lobbyId, playerDetails) {
		console.log(' To Middleware : ' + lobbyId + ' and ');
		console.log(playerDetails);
		
		lobbyClient.act('role:lobbySub,lobbyId:'+lobbyId+',cmd:updatePlayerDetails', {data: playerDetails}, function(err, response) {
          console.log('Response from Middleware : ');
          console.log(response);
        });
	}
}