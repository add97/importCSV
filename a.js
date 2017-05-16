var fs = require('fs');
var converter = require('json-2-csv');
var DDPClient = require("ddp");

function convert() {
  fs.readFile('Vendor Sales & Retention Sheet - Prospect Vendors.csv', "utf8", function(err, csv) {
    if (err) {
      throw err;
    }
    var csv2jsonCallback = function(err, json) {
      if (err) {
        throw err;
      }
      json = json.map((obj) => {
        return {
          company_name: obj['Restaurants'] || obj.Restaurants,
          company_address: obj['Street'] || obj.Street,
          habitat: obj['Habitat'] || obj.Habitat,
          platform_priority: obj['Platform Priority'],
          company_type: obj['Vendor Type'],
          menu_difficulty: obj['Menu Difficulty'],
          status: obj['Sales Step'],
          eat24: obj['EAT 24'],
          grubhub: obj['GRUBHUB'] || obj.GRUBHUB,
          reviews: obj['GH & Yelp Reviews'],
          priority: obj['Priority'] || obj.Priority,
          yelp_rating: obj['Yelp Rating'],
          categories: obj['Cuisine'] || obj.Cuisine,
          hiring: obj['Outsourced vs. in house'],
          uberEats: obj['Uber Eats'],
          postmates: obj['Postmates'] || obj.Postmates,
          caviar: obj['Caviar'] || obj.Caviar,
          catering: obj['Catering'] || obj.Catering,
          DaaS: obj['DaaS'] || obj.DaaS,
          DaaSGH: obj['DaaS - GH'],
          notificationPreference: obj['Order Method'],
          serialNumber: obj['iPad Serial No.'],
          direct_deposit: obj['Direct Deposit']
        };
      });
    };
    return converter.csv2json(csv, csv2jsonCallback);
  });
}

var ddpclient = new DDPClient({
  host : "localhost",
  port : 3000,
  ssl  : false,
  autoReconnect : true,
  autoReconnectTimer : 500,
  maintainCollections : true,
  ddpVersion : '1',
  useSockJs: true,
});

ddpclient.connect(function(err, wasReconnect) {
  if (err) {
    console.log('DDP connection error!');
    return;
  }

  if (wasReconnect) {
    console.log('Reestablishment of a connection.');
  }

  console.log('connected!');

  convert().forEach((prospect) => {
    console.log(prospect.company_name);
  })
});


  // setTimeout(function () {
  //   ddpclient.call(
  //     'Prospects.methods.create',
  //     //[],            // parameters to send to Meteor Method
  //     function (err, result) {   // callback which returns the method call results
  //       console.log('called function, result: ' + result);
  //     },
  //     function () {              // callback which fires when server has finished
  //       console.log('updated');  // sending any updated documents as a result of
  //       console.log(ddpclient.collections.posts);  // calling this method
  //     }
  //   );
  // }, 3000);
