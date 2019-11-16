exports.commands = [
  "servers",
  "create",
  "voice",
  "delete",
  "topic"
]

// need to style all commands below
exports.create = {
	usage: "<channel name>",
	description: "creates a new text channel with the given name.",
	process: function(bot,msg,suffix) {
    if (!checkPermission(msg)) {
      return;
    }
		msg.channel.guild.createChannel(suffix,"text").then(function(channel) {
			msg.channel.send("created text channel " + channel);
		}).catch(function(error){
			msg.channel.send("failed to create channel: **" + error + "**");
		});
	}
}

exports.voice = {
	usage: "<channel name>",
	description: "creates a new voice channel with the given name.",
	process: function(bot,msg,suffix) {
    if (!checkPermission(msg)) {
      return;
    }
		msg.channel.guild.createChannel(suffix,"voice").then(function(channel) {
			msg.channel.send("created voice channel " + channel);
			console.log("created " + channel);
		}).catch(function(error){
			msg.channel.send("failed to create channel: " + error);
		});
	}
}

exports["delete"] = {
	usage: "<channel name>",
	description: "deletes the specified channel",
	process: function(bot,msg,suffix) {
    if (!checkPermission(msg)) {
      return;
    }
		var channel = bot.channels.get(suffix);
		if(suffix.startsWith('<#')){
			channel = bot.channels.get(suffix.substr(2,suffix.length-3));
		}
		if(!channel){
			var channels = msg.channel.guild.channels.findAll("name",suffix);
			if(channels.length > 1){
				var response = "Multiple channels match, please use id:";
				for(var i=0;i<channels.length;i++){
					response += channels[i] + ": " + channels[i].id;
				}
				msg.channel.send(response);
				return;
			}else if(channels.length == 1){
				channel = channels[0];
			} else {
				msg.channel.send( "Couldn't find channel " + suffix + " to delete!");
				return;
			}
		}
		msg.channel.send("deleting channel " + suffix + " at " +msg.author + "'s request");
		channel.delete().then(function(channel){
			console.log("deleted " + suffix + " at " + msg.author + "'s request");
		}).catch(function(error){
			msg.channel.send("couldn't delete channel: " + error);
		});
	}
}

exports.servers = {
  description: "Tells you what servers the bot is in",
  process: function(bot,msg) {
  	msg.channel.send(`__**${bot.user.username} is currently on the following servers:**__ \n\n${bot.guilds.map(g => `${g.name} - **${g.memberCount} Members**`).join(`\n`)}`, {split: true});
  }
}

exports.topic = {
	usage: "[topic]",
	description: 'Sets the topic for the channel. No topic removes the topic.',
	process: function(bot,msg,suffix) {
    if (!checkPermission(msg)) {
      return;
    }
		msg.channel.setTopic(suffix);
	}
}

function checkPermission(msg) {
  if (msg.member == null) {
    return false;
  }
  if (!msg.member.hasPermission("MANAGE_CHANNELS")) {
    msg.channel.send("Access Denied :x:");
    return false;
  } else {
    return true;
  }
}
