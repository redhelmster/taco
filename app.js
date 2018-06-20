/* simple node.js app to take filter result from 
    https://data.sfgov.org/resource/6a9r-agq8.json
    by facilitytype and fooditems.

    sample use case localhost:3000/?ftype=truck&food=bacon%20wrapped
*/

var express = require('express');
var fetch = require ('node-fetch');
var app = express();


/* factory function that generates the appropriate matching function for the given parameter
 */
function getMatchFunction(param, field){
    if( param != null) {
        let lowerParam = param.toLowerCase();
        //Return a function to case insensitive filter the data in field by param.
        return function(data){
            if( data[field] != null){
                return data[field].toLowerCase().indexOf(lowerParam) != -1;
            }
            return false;
        };
    }
    //If the param was null we return a fuction that always returns true.
    // this is so that it will always match like a wildcard.
    return function(data){return true;};
}

app.get('/', function (req, res) {
    let ftype = req.query.ftype;
    let food = req.query.food;

    console.log("ftype " + ftype);
    console.log("food " +  food);

    let checkftype = getMatchFunction(ftype, 'facilitytype'); 
    let checkfood = getMatchFunction(food, 'fooditems'); 

    let checkAll = function(data) { return (checkftype(data) && checkfood(data))};
    

    fetch('https://data.sfgov.org/resource/6a9r-agq8.json')
        .then(resx => resx.json())
            .then(json => {
                let jsonout = json.filter(checkAll);
                res.send(jsonout);
            });
    
});


app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});
