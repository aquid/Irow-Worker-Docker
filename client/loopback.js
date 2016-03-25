var loopback = require('loopback');
var boot = require('loopback-boot');

var client = module.exports = loopback();
console.log(__dirname);
boot(client, __dirname,function(err){
	if(err){
		console.log(err);
		throw err;
	} 
});