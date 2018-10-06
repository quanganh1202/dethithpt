var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');
var fs = require('fs');

var START_URL = "https://tuyensinh247.com/eAjax/loadDistrict";
var SCHOOL_URL = "https://tuyensinh247.com/eAjax/loadSchool";
var SEARCH_WORD = "stemming";
var MAX_PAGES_TO_VISIT = 10;

var pagesVisited = {};
var numPagesVisited = 0;
var pagesToVisit = [];
var url = new URL(START_URL);
var baseUrl = url.protocol + "//" + url.hostname;

let finishs = [];

pagesToVisit.push(START_URL);
crawl();

async function crawl() {
  if(numPagesVisited >= MAX_PAGES_TO_VISIT) {
    console.log("Reached max limit of number of pages to visit.");
    return;
  }

  const city = await visitPage(START_URL, {});
  for (let i = 0; i <= city.length - 1; i ++) {
    const districts = await visitPage(START_URL, {
        form: {
            city_id: city[i].id,
        }
    });
    let newDistricts = [];
    for (let j = 0; j <= districts.length - 1; j ++) {
        let newschool = [];
        for (let k = 1; k <= 13; k ++) {
            const school = await visitPage(SCHOOL_URL, {
                form: {
                    city_id: city[i].id,
                    district_id: districts[j].id,
                    level_id: 0,
                    school_id: 99999,
                    level_number_id: k,
                }
            });
            newschool.push({
                id: k,
                name: k,
                code: k,
                school,
                level: k,
            });
        }

        
        newDistricts.push({ ...districts[j], school: newschool });
    }
    finishs.push({...city[i], districts: newDistricts});
  }

  fs.writeFileSync('newLocal.json', JSON.stringify(finishs));
  console.log('done!');
}

async function visitPage(url, options) {
  // Add page to our set
  pagesVisited[url] = true;
  numPagesVisited++;

  // Make the request
//   console.log("Visiting page " + url);
const data = await new Promise((resolve, reject) => {
    request.post(url, options, function(error, response, body) {
        if(!response || response.statusCode !== 200) {
          reject();
        }
        // Check status code (200 is HTTP OK)
        console.log("Status code: " + response.statusCode);
        // Parse the document body
        var $ = cheerio.load(body);
        vals = [];
       var sel = $('html > body').children();
       Object.keys(sel).forEach((e) => {
           const element = sel[e];
           if (element && element.attribs && element.attribs.value !== '0') {
               vals.push(
                   {
                       id: element.attribs.value,
                       code: element.attribs.value,
                       name: element.children[0].data
                   });
           }
       })
   
       resolve(vals);
     });
})
return data;
}
