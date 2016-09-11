/*
global Webcam, tracking, $, Kairos
*/

//Handles calls to Kairos Server
var kairos = new Kairos();

var GALLERY = "class1";

$(document).ready(function() {
    // var canvas = document.getElementById("my_canvas");
    // canvas.height = 240;
    // canvas.width = 320;

    jQuery('.tabs .tab-links a').on('click', function(e) {
            var currentAttrValue = jQuery(this).attr('href');
    
            // Show/Hide Tabs
            //jQuery('.tabs ' + currentAttrValue).show().siblings().hide();
            jQuery('.tabs ' + currentAttrValue).fadeIn(400).siblings().hide();
    
            // Change/remove current tab to active
            jQuery(this).parent('li').addClass('active').siblings().removeClass('active');
    
            e.preventDefault();
        });
    //Set up webcam's size
    Webcam.set({
        width: 320,
        height: 240
    });

    //Formatting
    document.getElementById("my_camera").style.border = "thick black solid";
    document.getElementById("my_camera").style.width = "320";
    document.getElementById("my_camera").style.height = "240";
    document.getElementById("my_camera").style.border = "thick black solid";
    document.getElementById("my_image").style.width = "320";
    document.getElementById("my_image").style.height = "240";

    //Attach webcam to DOM element
    Webcam.attach('#my_camera');
});


//Saves webcam image to a canvas
function takeSnapshot() {
    //var canvas = document.getElementById("my_canvas");
    Webcam.snap(function(data_uri) {
        document.getElementById('my_image').innerHTML = "<img id='img_me' src='" + data_uri + "'/>";
        hasFace();
    });

    document.getElementById("img_me").style.border = "thick red solid";

}

//Attempt to submit image in canvas to Kairos for enrollment
function attemptToEnroll() {
    //Check that User has correct data in fields
    
    //Get that data
    var user = document.getElementById('netID').value;

    //Make call to Kairos
    hasFace(null, enrollFace, GALLERY, user);
}

//Attempt to submit image in canvas to Kairos for check in
function attemptToCheckIn() {
    
    //Make call to Kairos
    hasFace(null, checkFace, GALLERY);
}

//Check if there is a face. if found set to Kairos
function hasFace(face, onFound, classID, userID) {
    var img = document.getElementById('img_me');
    //console.log(img);

    //Set up Tracker
    var tracker = new tracking.ObjectTracker('face', 'eye');

    //Tell it to track image
    tracking.track(img, tracker);

    //Submit to Kairos when face is found
    tracker.on('track', function(event) {
        if (!(event.data.length === 0)) {
            //POST
            console.log("POST");
            document.getElementById("img_me").style.border = "thick green solid";

            if (onFound) {
                onFound(img.src, classID, userID);
            }
        }
    });
}

//Send face to enroll in Kairos and set up response
function enrollFace(face, classID, userID) {
    console.log("submitting face for enrollment");

    var junk = 'data:image/jpeg;base64,';
    var to_use = face.substring(23, face.length);
    kairos.enroll(to_use, classID, userID, function(response) {
        console.log(response);

        var data = JSON.parse(response.responseText);
        var status = data.images[0].transaction.status;
        if(status === "success") {
            var subject_id = data.images[0].transaction.subject_id
            var student_name = document.getElementById('student_name').value
            console.log(subject_id + " " + student_name);
            writeUserData(subject_id, student_name);
            //send info to database
        }
    });
}

function checkFace(face, classID) {
    console.log("submitting face for verification");

    var junk = 'data:image/jpeg;base64,';
    var to_use = face.substring(23, face.length);
    kairos.recognize(to_use, classID, function(response) {

        //Convert data to object
        var data = JSON.parse(response.responseText);
        console.log(data);

        //Verify user was found
        if (data.images[0].transaction.success != "success") {
            //Failure
            console.log("ERROR");
        }
        else {
            //User found

            //Get user from object
            var user = data.images[0].transaction.subject;

            //Print to DOM the user info
            retrieveUserData(user);
            var p = document.getElementById('student_info');
            p.innerHTML = "Student ID: " + user;

            //Check user in
            updateLastSeenDate(user);
        }

    });
}

function printResponse(response) {
    console.log(response);
    var data = JSON.parse(response.responseText);
    console.log(data);
    var user = data.images[0].transaction.subject;
    console.log(user);
}
