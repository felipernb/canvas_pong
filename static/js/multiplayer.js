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

Multiplayer.prototype.startGame = function() {
	var obs = function(identifier) {
		return {
			id: identifier,
			notify: function(y, direction) {
				console.info(identifier, y, direction);
			}
		};
	};
	this.game = new Game(HumanPlayer, CPUPlayer, obs(1), obs(2));
};

Multiplayer.prototype.onmessage = (function() {
	var that = this;
	var waitingPartner = function() {
		console.info("Waiting partner");
	};

	var foundPartner = function() {
		console.info("Found partner");
		m.startGame();
	};

	var partnerLeft = function() {
		console.info("Partner left");
	};

	var partnerMoved = function(data) {
		console.info("Partner moved", data);
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
