/*
 * Enkelt script som henter antall stillinger fra nav.no
 * kan kalles med f.eks. 
 *   https://tovare.com/api/stillinger?callback=
 *
 *
 * $ forever start simple-server.js
 * $ forever list
 */

var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();


app.get('/api', function(req, res){
    res.send("/api/stillinger - hent antall stillinger akuratt nå.");
});


app.get('/api/stillinger', function(req, res){

    url = "https://tjenester.nav.no/stillinger/";

	var json = { stillinger : "", annonser : ""};

	request(url, function(error, response, html){

		if(!error){
			var $ = cheerio.load(html);

			var stillinger, annonser, nye;
			var json = { stillinger : "", annonser : "", nye: ""};

            // Hent ut tallene fra ingressen, denne bomber med en gang
            // nettsiden blir redesignet.
			$('.ingress').filter(function(){
		        var data = $(this);

                var re = /(\d+)/g;
                m = re.exec(data.text())
                stillinger = m[0];
                re.lastIndex++;
                m = re.exec(data.text())
                annonser = m[0];
                re.lastIndex++;
                m = re.exec(data.text())
                nye = m[0];


		        json.stillinger = stillinger;
		        json.annonser = annonser;
		        json.nye = nye;
	        });
		};
		
		res.jsonp(json);
	});

});

app.listen('9615');

console.log('NGINX er allerede konfigurert for forward til localhost:9515');




exports = module.exports = app;
