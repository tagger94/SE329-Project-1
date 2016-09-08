/*
global Webcam, tracking, $
*/

var gallery_id = "test1";
var imageToSend;


Webcam.attach('#my_camera');

function takeSnapshot() {
  Webcam.snap(function(data_uri) {
    document.getElementById('my_image').innerHTML = "<img id='img_me' src='" + data_uri + "'/>";
    prepareToSend(data_uri);
  });
}



function prepareToSend(i) {
  //Determine if there is a face

  var img = document.getElementById('img_me');
  console.log(img);
  var tracker = new tracking.ObjectTracker('face');
  tracking.track(img, tracker);
  tracker.on('track', function(event) {
    event.data.forEach(function(rect) {
      //plotRectangle(rect.x, rect.y, rect.width, rect.height);
      console.log("Face Found, POST");
      //POST
      enrollFace(i, "tagger94", "test1");
    });
  });
}

function enrollFace(face, userID, classID) {
  // Enroll face into Kairos gallery
  
  //Create Data for API request
  var data = {
    "image": face,
    "subject_id": userID,
    "gallery_name": classID
  };
  
  console.log(face);

  //Setup API request
  var request = new XMLHttpRequest();

  request.open('POST', 'https://api.kairos.com/enroll');

  request.setRequestHeader('Content-Type', 'application/json');
  request.setRequestHeader('app_id', '736a8c89');
  request.setRequestHeader('app_key', '84c89489e8dff8622e049ba2eb553b3c');
  //request.setRequestHeader('Access-Control-Allow-Origin', '*');
  //request.setRequestHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  //request.setRequestHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
  

  request.onreadystatechange = function() {
    if (this.readyState === 4) {
      console.log('Status:', this.status);
      console.log('Headers:', this.getAllResponseHeaders());
      console.log('Body:', this.responseText);
    }
  };

  

  request.send(JSON.stringify(data));

}