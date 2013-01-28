function Multiplayer(game) {
	this.game = game;
	this.connect();
}

Multiplayer.prototype.connect = function() {
	var that = this;
	this.sendMsg('/connect', null, function(data) {
		var msg = JSON.parse(data);
		that.initChannel(msg.me, msg.token);
	});
};

Multiplayer.prototype.initChannel = function(id, token) {
	var channel = new goog.appengine.Channel(token);
	this.socket = channel.open(this);
	this.id = id;
};

Multiplayer.prototype.onopen = function(e) {
	console.info('channel open');
};

Multiplayer.prototype.startGame = function(player) {
	var that = this;
	var obs = function(identifier) {
		var previous = {};
		return {
			id: identifier,
			notify: function(y, direction) {
				if (y != previous.y || direction != previous.d) {
					that.sendMsg('/move', 'id=' + this.id + '&y=' + y + '&d=' + direction);
					previous.y = y;
					previous.d = direction;
				}
			}
		};
	};
	this.remotePlayer = new RemotePlayer();
	if (player === 0) {
		this.game = new Game(new HumanPlayer(obs(this.id)), this.remotePlayer);
	} else {
		this.game = new Game(this.remotePlayer, new HumanPlayer(obs(this.id)));
	}
};

Multiplayer.prototype.onmessage = (function() {
	var waitingPartner = function() {
		console.info("Waiting partner");
	};

	var foundPartner = function(data) {
		console.info("Found partner, starting as player ", data.p);
		m.startGame(data.p);
	};

	var partnerLeft = function() {
		console.info("Partner left");
	};

	var partnerMoved = function(data) {
		m.remotePlayer.paddle.updatePosition(data.y, data.d);
	};

	var sync = function() {};

	var messageCallbacks = [
		waitingPartner,
		foundPartner,
		partnerLeft,
		partnerMoved,
		sync
	];

	return function(e) {
		var data = JSON.parse(e.data);
		messageCallbacks[data.t](data);
	};
})();

Multiplayer.prototype.onerror = function(e) {
	console.info('error', e);
};

Multiplayer.prototype.onclose = function(e) {
	console.info('channel closed');
};

Multiplayer.prototype.sendMsg = function(uri, payload, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open('POST', uri, true);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			if (callback) {
				callback(xhr.responseText);
			}
		}
	};
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.send(payload);

};

var m = new Multiplayer();
