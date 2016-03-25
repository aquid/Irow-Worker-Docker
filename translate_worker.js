var googleTranslate = require('google-translate')('#GOOGLE_TRANSLATE_API_KEY');
// var DataSource = require('loopback-datasource-juggler').DataSource;
var worker = require('iron_worker');
var Promise = require('bluebird');
var fs = require('fs');
var path = require('path');

var params = worker.params();
var client;

// var datasource = new DataSource({
// 	connector : require('loopback-connector-remote'),
// 	name: "RemoteDS",
// 	url: params.loopbackServerUrl+":"+params.loopbackServerport+"/api"
// });


// var Message = client.models.Message;
// Message.attachTo(datasource);
// console.log(app.dataSources.remoteDS);

var createDatasourceFile = function(url,port){
	var datasourcesFile = path.join(__dirname, 'client', 'datasources.json');
	return new Promise(function(resolve,reject){
		fs.writeFile(datasourcesFile,
			JSON.stringify({
              "db": {
                "name": "db",
                "connector": "memory"
              },
              "remoteDS": {
                "url": url +'/api',
                "name": "remoteDS",
                "connector": "remote"
              }
            }, null, 2),function(err){
            	if(err){
            		reject(err);
            	}
            	else{
            		resolve("Datasource file created");
            	}
           });
	});
};

var setAuthToken = function(token) {
	client.dataSources.remoteDS.connector.remotes.auth = {
		bearer: new Buffer(token.id).toString('base64'),
		sendImmediately: true
	};
	return Promise.resolve('Access token set for request');
};

var translateToSpanish = function(text){
	return new Promise(function(resolve,reject){
		googleTranslate.translate(text, 'es', function(err, translation) {
			if(err){
				reject(err);
			}
			else{
				resolve(translation.translatedText);
			}
		});
	});
};

createDatasourceFile(params.loopbackServerUrl)
.then(function(data){
	console.log(data);
	client = require('./client/loopback.js');
	return setAuthToken(params.loopbackAccessToken);
})
.then(function(data){
	console.log(data);
	return translateToSpanish(params.text);
})
.then(function(data){
	console.log(data);
	var message = {
		text : data,
		senderId: params.senderId,
		recieverId: params.recieverId,
		created_at: new Date(),
		is_read:false
	};
	client.models.Message.create(message, function(err, response){
		if(err){
			console.log(err);
		}
		else{
			console.log(response);
		}
	});
});






