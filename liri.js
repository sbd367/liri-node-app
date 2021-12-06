require("dotenv").config();

//Bring in required
const Spotify = require("node-spotify-api"),
 fs = require("fs"),
 opn = require('opn'),
 request = require("request"),
 moment = require("moment"),
 argumentArray = process.argv;

 let bs = '', command = '';
 argumentArray.forEach(arg => bs+=`${arg} `);
 bs = bs.trim();
 The_Thing = bs;

 !process.argv[2] ? console.log("You need to add a command") : command = process.argv[2];

// Handles Spotify API
function spotit (){
if(command === "spotify-this-song"){

    // if there isnt an argument play this
    if(!process.argv[3]){
        The_Thing = "Swag Surfin'"
    }
    console.log("Searching for "+The_Thing);

    new Spotify({
        id: process.env.SPOTIFY_API_ID,
        secret: process.env.SPOTIFY_API_SECRET
    }).search({type: "track", query: The_Thing, limit: 1}, (error, data) => {
    //if theres an error, log it
    if(error){
        console.warn('Error while connecting to spotify');
        throw new Error(error);
    }
    const {items} = data.tracks;
    
    //if theres search data display it
    if(data.tracks.items[0]){
        let bs = "",
            Artist = items[0].artists[0].name,
            Song_Album = items[0].album.name,
            Song_Name = items[0].name,
            Song_url = items[0].external_urls.spotify;

        bs+=`
        ------Spotify Results------
        Artist: ${Artist}
        Song Name: ${Song_Name}
        Album Name: ${Song_Album}
        Song URL: ${Song_url}
        ------ End Results ------`;
        //opens a new window with the song url
        opn(Song_url);
        console.log(bs);
    }
    // if theres no data tell user they did it wrong
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


    request("https://rest.bandsintown.com/artists/" + The_Thing + "/events?app_id=codingbootcamp",  (error, response, body) => {
        if(error){
            throw new Error(error);
        }

        const data = JSON.parse(body)[0];

        //Assign variables
        let venue_name = data.venue.name,
        venue_location = data.venue.city,
        event_date = data.datetime,
        bs = '';
        //Format Date with moment
        event_date = moment(event_date).format("MM/DD/YYYY");

        //Display Results
        bs+=`
        ------Concert Results------
        Venue Name: ${venue_name}
        Venue Location: ${venue_location}
        Date: ${event_date}
        ------- End Results -------`;
        console.log(bs);
    })
}

// Handles IMBD API
else if(command === "movie-this"){

    if(!process.argv[3]){
        The_Thing = "Mr. Nobody"
    }
    console.log("Searching for "+The_Thing);

    //Makes request
    request("http://www.omdbapi.com/?t="+ The_Thing +"&y=&plot=short&apikey=trilogy", (error, response, body) => {

    //Logs an error
        if(error){
            console.log("an error occured: "+error);
        }

        const data = JSON.parse(body);

        //Making variables for all of the things
        let  Movie_Title = data.Title,
         Release_Year = data.Year,
         IMBD_Rating = data.Ratings[0].Value,  
         Rotten_Tomatoes = data.Ratings[1].Value,
         country = data.Country,
         Movie_Language =  data.Language,
         Plot = data.Plot,
         Actors =  data.Actors,
         bs = ''; 

        //Displays results
        bs+=`
        ------Movie Results------
        Movie Title: ${Movie_Title}
        Release Year: ${Release_Year}
        IMBD Rating: ${IMBD_Rating}
        Rotten Tomatoes Score: ${Rotten_Tomatoes}
        Country Produced: ${country}
        Language: ${Movie_Language}
        Plot: ${Plot}
        Actors: ${Actors}
        ------ End Results ------`;

        console.log(bs);
    })
}

else if (command === "do-what-it-says"){

    //reads txt file
    fs.readFile("random.txt", "utf8", (error, Data) => {

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
spotit();
