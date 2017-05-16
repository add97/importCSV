var fs = require('fs');
var converter = require('json-2-csv');
var DDPClient = require('ddp');
var json;

var ddpclient = new DDPClient({
  // host : "localhost",
  // port : 3000,
  url: 'wss://habitat-market.ngrok.io/websocket',
  ssl  : false,
  autoReconnect : true,
  autoReconnectTimer : 500,
  maintainCollections : true,
  ddpVersion : '1',
  // useSockJs: true,
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
  getDocuments();

});

function getDocuments() {
  console.log(`inside getdocuments`)
  try {
    file = fs.readFileSync('Vendor Sales & Retention Sheet - Prospect Vendors.csv', "utf8");
    console.log('got file');
      return converter.csv2json(file, (err, json) => {
        console.log(`ran async`)
          if (err) { throw err; }
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

          console.log(`${json.length} prospects`)

          // json.forEach((prospect) => {
          //   console.log(`running on ${prospect.company_name}`)
          //   ddpclient.call('Prospects.methods.create', prospect, (err, result) => {
          //       console.log(`ddp err`, err)
          //       console.log(`ddp res`, result );
          //
          //       console.log('called function, result: ' + result);
          //     }, () => {
          //       console.log('updated');
          //     }
          //   );
          // })
          ddpclient.call('test', 'test', (err, result) => {
            console.log(err); console.log(result);
          });
      });

  } catch (err) {
    throw(err);
  }
}
