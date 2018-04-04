var app = {
  giphyURL: "https://api.giphy.com/v1/gifs/search?api_key=DvzuK96UqRD9z1BCPkPH1NVt9JvVqFLW&q=",

  initialize: function() {
    //spotify token: Start the auth procuess by using my id and secret to get an access token
    app.getToken();
  },

  getToken: function(word) {
    var id = 'd2eb59a247224506b822512d979a2f5f';
    var secret = '7abe06724e1c451e92e97e96b72ad7cc';
    //this base encodes your id and secret to pass to the spotify server
    var encoded = btoa(id + ':' + secret);
    $.ajax({
      method: "POST",
      url: "https://accounts.spotify.com/api/token",
      headers: {
        'Authorization': 'Basic ' + encoded
      },
      data: {
        'grant_type': 'client_credentials'
      },
      success: function(result) {
        //enter a new searchTerm for spotify

        $("#search").click(function() {
          console.log("Clicked search");
          //Clear the div
          // $(".resultsTarget").remove();
          $(".resultsTarget").html("");
          var newSearchTerm = $("#query").val();
          console.log(newSearchTerm);
          app.searchTracks(result.access_token, newSearchTerm)

        });

        $("#query").keypress(function(e) {
          if (e.which == 13) {
            $("#search").trigger('click');
          }
        });


      },
    });
  },

  //This is the search to spotify's track api, with the token in an authorization header
  searchTracks: function(token, searchTerm) {
    $.ajax({

      method: "GET",
      url: "https://api.spotify.com/v1/search?q=" + searchTerm + "&type=track",
      dataType: "json",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      success: function(data) {
        // debugger;
        console.log(data);

        var index = Math.floor(Math.random() * data.tracks.items.length) + 0;
        // return index;
        console.log(index);
        var trackName = data.tracks.items[index].name;
        var songurl = data.tracks.items[index].preview_url;

        console.log(trackName);
        // debugger;
        app.searchGifs(trackName);


        var audioElement = document.createElement('audio');
        audioElement.src = data.tracks.items[index].preview_url;
        audioElement.autoplay = 'true';
        audioElement.controls = 'true';

        $('.title').html(trackName);
        $('.the-track').html(audioElement);

      },

      error: function() {
        console.log("Error retrieving spotify API");
      }
    });
  },

  searchGifs: function(gifSearchTerm) {
    $.ajax({
      url: this.giphyURL + gifSearchTerm + "&limit=36&offset=0&rating=G&lang=en",
      type: 'GET',
      dataType: 'json',
      error: function(data) {
        console.log("We got problems");
        //console.log(data.status);
      },
      success: function(data) {

        console.log("WooHoo!");
        //Check the browser console to see the returned data
        console.log(data);
        // debugger;

        for (var i = 0; i < data.data.length; i++) {

          var resultURL = data.data[i].images.downsized_medium.url;

          var newImg = $("<img>");
          newImg.attr("src", resultURL);
          $(".resultsTarget").append(newImg);
          // debugger;
          //   $(".resultsTarget img:last-child").remove();
          //Use jQuery's append() function to add the searchResults to the DOM
        }
        // $(".resultsTarget").remove();
      }
    });
  }
};
