exports = module.exports = function(lobbyId,socket) {
  
	var self = this;

	self.lobbyId = lobbyId;
	self.socket = socket;

	console.log('Inside Middleware for Subscribing ' + lobbyId);

	const seneca = require('seneca');

	const lobbyServer = seneca();

	lobbyServer.add('role:lobbySub,lobbyId:'+lobbyId+',cmd:updatePlayerDetails',function(msg, callback) {
	   //console.log(msg.msg);
	  console.log('----//// Inside Server Middleware for update player ////----');
	  socket.emit('updatePlayer', {data: msg.data});
	  return callback(null,{response: msg.data});
	});

	lobbyServer.use('redis-transport');
	lobbyServer.listen({
		type:'redis',
		pin: 'role:lobbySub,lobbyId:'+lobbyId+',cmd:*',
		host:'172.23.238.251'
	});
}