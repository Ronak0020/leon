exports.commands = [
	"urban"
];

var urban = require("urban");

exports.urban = {
			usage: "",
			description: "looks up a random word on Urban Dictionary",
			process: function(bot,msg,suffix){
					var targetWord = suffix == "" ? urban.random() : urban(suffix);
					targetWord.first(function(json) {
							if (json) {
								var message = "Urban Dictionary: **" +json.word + "**\n\n" + json.definition;
								if (json.example) {
										message = message + "\n\n__Example__:\n" + json.example;
								}
						    msg.channel.send( message);
							} else {
								msg.channel.send( "No matches found");
							}
					});
			}
	}
