
window.onload = function(){ //Calls required functions for jquery and other misc information
    $( function() {
        $( "#contentPlaylist" ).accordion({
            collapsible: true,
            heightStyle: "fill"
          });
      } );
      jQuery('.stellarnav').stellarNav({
        theme: 'dark', // adds default color to nav. (light, dark)
        breakpoint: 768, // number in pixels to determine when the nav should turn mobile friendly
        menuLabel: 'Dashboard', // label for the mobile nav
        sticky: false, // makes nav sticky on scroll (desktop only)
        position: 'static', // 'static', 'top', 'left', 'right' - when set to 'top', this forces the mobile nav to be placed absolutely on the very top of page
        openingSpeed: 250, // how fast the dropdown should open in milliseconds
        closingDelay: 250, // controls how long the dropdowns stay open for in milliseconds
        showArrows: true, // shows dropdown arrows next to the items that have sub menus
        phoneBtn: '', // adds a click-to-call phone link to the top of menu - i.e.: "18009084500"
        phoneLabel: 'Call Us', // label for the phone button
        locationBtn: '', // adds a location link to the top of menu - i.e.: "/location/", "http://site.com/contact-us/"
        locationLabel: 'Location', // label for the location button
        closeBtn: false, // adds a close button to the end of nav
        closeLabel: 'Close', // label for the close button
        mobileMode: false,
        scrollbarFix: false // fixes horizontal scrollbar issue on very long navs
      });
      //Referenced from : https://api.jquery.com/submit/

}

var videoArr = new Array();

const defaultValue = "whoops";

const ytApiKey = "000000"; //Blank as to not reveal API Key

//All information for the next ~50 lines is given from youtube directly: https://developers.google.com/youtube/iframe_api_reference#Loading_a_Video_Player

var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: 'M7lc1UVf-VE',
    playerVars: {
      'playsinline': 1
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
  
  if (event.data === 0){
    newVid();
  }
}
function stopVideo() {
  player.stopVideo();
}


function YouTubeGetID(url){
  //This basically gives you the ID no matter what youtube link you submit.
  //Reference: https://stackoverflow.com/a/54200105

  url = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
  return (url[2] !== undefined) ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0];
}

document.getElementById('urlForm').onsubmit = function( event ){
  event.preventDefault(); //Prevents default behavior
  var inputs = document.getElementById("urlForm").elements; //Grabs form object
  const urlObj = inputs[0] //Gets URL object
  
  //Testing URL: https://www.youtube.com/watch?v=kTht2hYJiBM
  
  let preURL = urlObj.value; // Referenced from : https://www.javascripttutorial.net/javascript-dom/javascript-form/

  var scrubbedURL = YouTubeGetID(preURL); // Gets the ID of video, used for API calls later.

  // Refernce to change embedded value: document.getElementById("ytplayer").src = "https://www.youtube.com/embed/" + scrubbedURL + "?autoplay=1&origin=http://example.com";
  videoArr.push(scrubbedURL);
  console.log(videoArr); //testing
  refreshAccordion();

}

function newVid(){
  //possibly redundant obfistication, but it might be useful later so here it stays
  //pushes new vid

  if (videoArr.length == 1){
    player.loadVideoById({videoId:videoArr[0]});
  }
  else{
    player.loadVideoById({videoId:videoArr[0]});
    videoArr.shift();
    console.log(videoArr);
    refreshAccordion();
  }
}

function refreshAccordion(){ //Refreshes the accordion with new elements everytime a new URL is passed.
  var newHTML = "";

  $( "#contentPlaylist" ).html(newHTML);
  if (videoArr.length == 1){
    newVid();
  }

  for (var i in videoArr){
    if (i == 0){
      newHTML += "<h3> Currently Playing: " + getvideoName(videoArr[i]) + '</h3><div><img src="' + getvideoThumnail(videoArr[i]) + '" alt="whoops"><p>Creator: ' + getvideoCreator(videoArr[i]) + '</p></div>';
    }
    else if (i == 1){
      newHTML += "<h3> Up Next: " + getvideoName(videoArr[i]) +  '</h3><div><img src="' + getvideoThumnail(videoArr[i]) + '" alt="whoops"><p>Creator:' + getvideoCreator(videoArr[i]) + '</p></div>'
    }
    else{
      newHTML += "<h3> Coming Soon </h3><div>"; //Creates a Coming soon that is just a list of names instead of the thumbnail and creator
      var temp = 2;
      while (temp < videoArr.length){
        var tempTemp = temp + 1; //A very dumb way of getting temp + 1 for the comming soon to look a bit nicer
        newHTML += "<p>" + tempTemp +": " + getvideoName(videoArr[temp]) + "<p>";
        temp++;
      }
      newHTML += "</div>"
      break;
    }
    
  }

  $( "#contentPlaylist" ).html(newHTML);
  $( "#contentPlaylist" ).accordion( "refresh" ); //Refreshes accordion 
}

function getvideoName(videoId){ //Gets video name from youtube API
  //Referenced some from here: https://stackoverflow.com/a/30444248

  var output = null;
  var URL = "https://www.googleapis.com/youtube/v3/videos?part=snippet&id=" + videoId + "&key=" + ytApiKey;

  $.ajax({
    url: URL,
    type: 'get',
    dataType: 'json',
    async: false,
    success: function(data) {
      output = data.items[0].snippet.title;
    }
  })

  return output;
}

function getvideoThumnail(videoId){ // Gets thumbnail from youtube API

  var output = null;
  var URL = "https://www.googleapis.com/youtube/v3/videos?part=snippet&id=" + videoId + "&key=" + ytApiKey;

  $.ajax({
    url: URL,
    type: 'get',
    dataType: 'json',
    async: false,
    success: function(data) {
      output = data.items[0].snippet.thumbnails.default.url;
    }
  })

  return output;
}

function getvideoCreator(videoId){ //Gets creator name from youtube API
  var output = null;
  var URL = "https://www.googleapis.com/youtube/v3/videos?part=snippet&id=" + videoId + "&key=" + ytApiKey;

  $.ajax({
    url: URL,
    type: 'get',
    dataType: 'json',
    async: false,
    success: function(data) {
      output = data.items[0].snippet.channelTitle;
    }
  })

  return output;
}
