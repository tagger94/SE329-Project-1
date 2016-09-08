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
         });
     });

 }
 