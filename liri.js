require("dotenv").config();

//Bring in required
const keys = require("./key");

var spotify = require("node-spotify-api");

const fs = require("fs");

const opn = require('opn');

var request = require("request");

var moment = require("moment");

// Adds arguments together to make up search
if(process.argv[2]){

var command = process.argv[2];

console.log("your command is "+ command);

}else{

    console.log("You need to add a command");
}

if(process.argv[3]){

    var First_Word = process.argv[3];
    var The_Thing = First_Word;
}
if(process.argv[4]){

var Second_Word = process.argv[4];

The_Thing = The_Thing +" "+ Second_Word

}else{
    console.log("no second word")
}

if(process.argv[5]){

var Third_Word = process.argv[5];

The_Thing = 

First_Word+" "+
Second_Word+" "+
Third_Word

}else{
    console.log("no third word");
}


// Handles Spotify API
function spotit (){
if(command === "spotify-this-song"){

    // if there isnt an argument play this
    if(!process.argv[3]){
        The_Thing = "Swag Surfin'"
    }
    console.log("you want to sarch for "+The_Thing);

    spotify = new spotify({
        id: keys.spotify.id,
        secret: keys.spotify.secret
    });

    //starts search
    spotify.search({type: "track", query: The_Thing, limit: 1}, function(error, data){

    //if theres an error, log it
    if(error){
        return console.log("ERROR"+error);
    }
    
    //if theres search data display it
    if(data.tracks.items[0]){

        console.log("------Spotify Results------")
        
        var Artist = (data.tracks.items[0].artists[0].name);
        console.log("Artist: " + Artist);

        var Song_Album = (data.tracks.items[0].album.name);
        console.log("Album: " + Song_Album);

        var Song_Name = (data.tracks.items[0].name);
        console.log("Song Name: " + Song_Name);

        var Song_url = data.tracks.items[0].external_urls.spotify;
        console.log("Song Url: "+Song_url);
        opn(Song_url);
        console.log("------ End Results ------")

    }
    // if theres no data tell user they fkd up the search
    else{

        console.log("you did something wrong");
    }
    });
}
}

// Handles BandsInTown API
if(command === "concert-this"){
    
    if(!process.argv[3]){
        The_Thing = "Foo Fighters"
    }

    console.log("you want to sarch for "+The_Thing);


    request("https://rest.bandsintown.com/artists/" + The_Thing + "/events?app_id=codingbootcamp", function (error, response, body){

    if(error){
        console.log("Something went wrong: "+error);
    }

    //Assign variables
    var venue_name = JSON.parse(body)[0].venue.name;
    var venue_Location = JSON.parse(body)[0].venue.city;
    var event_date = JSON.parse(body)[0].datetime;

        //Format Date with moment
        event_date = moment(event_date).format("MM/DD/YYYY");

        //Display Results
        console.log("------Concert Results------");

        console.log("Venue Name: " + venue_name);
        console.log("Venue Location: " + venue_Location);
        console.log("Date: " + event_date);

        console.log("------- End Results -------");
    })
}

// Handles IMBD API
else if(command === "movie-this"){

    if(!process.argv[3]){
        The_Thing = "Mr. Nobody"
    }
    console.log("you want to sarch for "+The_Thing);

    //Makes request
    request("http://www.omdbapi.com/?t="+ The_Thing +"&y=&plot=short&apikey=trilogy", function(error, response, body){

    //Logs an error
        if(error){
            console.log("an error occured: "+error);
        }

        //Making variables for all of the things
        var Movie_Title = JSON.parse(body).Title;
        var Release_Year = JSON.parse(body).Year;
        var IMBD_Rating = JSON.parse(body).Ratings[0].Value;  
        var Rotten_Tomatoes = JSON.parse(body).Ratings[1].Value;
        var country = JSON.parse(body).Country;
        var Movie_Language =  JSON.parse(body).Language;
        var Plot = JSON.parse(body).Plot;
        var Actors =  JSON.parse(body).Actors; 

        //Displays results
        console.log("------Movie Results------");

        console.log("Movie Title: "+Movie_Title);
        console.log("Release Year: "+Release_Year);
        console.log("IMBD Rating: "+IMBD_Rating);
        console.log("Rotton Tomatoes Score : " + Rotten_Tomatoes);
        console.log("Country Produced: " + country);
        console.log("Language: " + Movie_Language);
        console.log("Plot: "+Plot);
        console.log("Actors: " + Actors);

        console.log("------ End Results ------");

    })
}

else if (command === "do-what-it-says"){

    //reads txt file
    fs.readFile("random.txt", "utf8", function (error, Data){

        //if theres an error log it
        if(error){
            return console.log(error);
        }

        //turns text file into a useable array
        var dataArr = Data.split(",");

        //change command, sets argument to true so I dont call default spotify search, sets the search query = 1th array string  
        command = dataArr[0];
        process.argv[3] = true;
        The_Thing = dataArr[1];
        
        //use spotify
       spotit();
    
    })
 
}

