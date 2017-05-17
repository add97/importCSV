var fs = require('fs');
var converter = require('json-2-csv');
var DDPClient = require('ddp');
var json;

var ddpclient = new DDPClient({
  host : "localhost",
  port : 3000,
  // url: 'wss://habitat-market.ngrok.io/websocket',
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
    return;
  }
  console.log('connected!');
  // ddpclient.call('testmethod', ['a'] , (err, result) => {
  //   console.log('call successful');
  //   return;
  // });
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
        yelp = typeof parseFloat(obj['Yelp Rating']) === 'number' ? parseFloat(obj['Yelp Rating']) : 0;
        console.log(obj['Restaurants'], yelp);
        return {
          company_name: obj['Restaurants'] || obj.Restaurants,
          company_address: obj['Street'] || obj.Street,
          habitat: obj['Habitat'] || obj.Habitat,
          platform_priority: obj['Platform Priority'],
          company_type: obj['Vendor Type'],
          menu_difficulty: obj['Menu Difficulty'],
          status: obj['Sales Step'],
          eat24: obj['EAT 24'] === 'Y',
          grubhub: obj['GRUBHUB'] === 'Y' || obj.GRUBHUB === 'Y',
          reviews: obj['GH & Yelp Reviews'],
          priority: obj['Priority'] || obj.Priority,
          yelp_rating: yelp,
          categories: obj['Cuisine'] || obj.Cuisine,
          hiring: obj['Outsourced vs. in house'],
          uberEats: obj['Uber Eats'] === 'Y',
          postmates: obj['Postmates'] === 'Y' || obj.Postmates === 'Y',
          caviar: obj['Caviar'] === 'Y' || obj.Caviar === 'Y',
          catering: obj['Catering'] === 'Y' || obj.Catering === 'Y',
          DaaS: obj['DaaS'] === 'Y' || obj.DaaS === 'Y',
          DaaSGH: obj['DaaS - GH'] === 'Y',
          notificationPreference: obj['Order Method'],
          serialNumber: obj['iPad Serial No.'],
          direct_deposit: obj['Direct Deposit'] === 'Y'
        };
      });

      console.log(`${json.length} prospects`)



      json.forEach((prospect) => {
        console.log(`running on ${prospect.company_name}`);
        ddpclient.call('Prospects.methods.create', [prospect], (err, result) => {
          if (err) {
            console.log(`ddp err`, err.reason)
          }
          // console.log(`ddp res`, result );
          console.log('called function, result: ' + result);
          return;
        }, () => {
          console.log('updated');
          return;
        }
      );
    })
  });

  } catch (err) {
    throw(err);
  }
}
