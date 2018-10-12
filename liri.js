require("dotenv").config();

var keys = require("./key");
console.log(keys.spotify);

var spotify = require("node-spotify-api");

var fs = require("fs");

var command = process.argv[2];
console.log("your command is "+ command);

// WHEN THE FIRST COMMAND IS SPOTIFY-THIS-SONG
if(command === "spotify-this-song"){

    // STORES SONG NAME AS AVARIABLE
    var song_name = process.argv[3];
    console.log("you want to sarch for "+song_name)

    spotify = new spotify({
        id: keys.spotify.id,
        secret: keys.spotify.secret
    })

    spotify.search({type: "track", query: "diamonds dancing"}, function(error, data){
    if(error){
        return console.log("ERROR"+error);
    }
    console.log(JSON.parse(data));
    })
}

else if(command === "concert-this"){
    var lename = process.argv[3];
    console.log("you want to search concerts with " + lename)
}

else if(command === "movie-this"){
    var Mname = process.argv[3];
    console.log("you want to search movies with " + Mname)
}

else if (command === "do-what-it-says"){

}

// fs.readFile("random.txt", "utf8", function (error, Data){
//     if(error){
//         return console.log(error);
//     }
//     console.log(Data);
//     var dataArr = Data.split(",");
  
//     console.log(dataArr);
// })