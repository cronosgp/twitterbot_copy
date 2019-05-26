
console.log("Iniciando BotCopicola");
console.log();

var twit = require("twit");
var config = require("./config/config.js");//puxando config
var app = require("./config/server.js");//puxando express

console.log(config);
console.log();

var Twitter = new twit(config);
var uID = "2564238914";//vini id

var server_port = process.env.YOUR_PORT || process.env.PORT || 3000;

var server_host = process.env.YOUR_HOST || '0.0.0.0';

// find latest tweet according the query 'q' in params
var upDados = function() {//função que faz a atualização visual do perfil
	var params = {
	Name: 'ViniData', 
	user_id: uID,
	}
            Twitter.get('users/lookup', params, function(err, data) {
              if (!err) {
				  var snome = data[0].screen_name + "_bot";
				  var local = data[0].location;
				  var desc = data[0].description;
				  var pcolor = data[0].profile_background_color;			  
				  console.log(snome, local, desc, pcolor);
					Twitter.post('account/update_profile',
					{Name: 'ViniChange', screen_name: snome, location: local,
					description: desc, profile_background_color: pcolor},
					function(err,data){
						if(!err) {
							console.log('ATUALIZAÇÃO DIARIA OK (ARRUMAR FOTO E BANNER)')
						}
						if (err){
						console.log('Algo deu errado na atualização primaria...');
						console.log(err);
						}
					}
					);
  
				}
                if (err) {
                    console.log('Algo deu errado no lookup...');
					console.log(err);
					
                }
            });
}
var Tweetar = function() {
		
		var stream = Twitter.stream('statuses/filter', { follow: uID });
		stream.on('tweet', function (tweet) {
			console.log("RECEBIDO");
			texto = tweet.text;
					Twitter.post('statuses/update',{status: texto},function(err, data){
						if(!err){
							console.log("COPIADO");
						}
						if(err){
						console.log("ERRO NA HORA DE COPIAR");
						console.log(err);
						}
					});
		stream.on;
});
}
/*var fs = require('fs'),
request = require('request');

var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};


function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}*/

app.listen(server_port, server_host, function () {
    console.log("Aplicação online.");
});

upDados();
setInterval(upDados, 1000 * 60 * 60 * 24);

Tweetar();