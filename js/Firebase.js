/**
 * Created by jordankauffman on 9/9/16.
 */


// Initialize Firebase
var config = {
    apiKey: "AIzaSyCSJE-459z2nnG6fvXFuoFvBb4Wq4KgpeQ",
    authDomain: "student-recognition-se329.firebaseapp.com",
    databaseURL: "https://student-recognition-se329.firebaseio.com",
    storageBucket: "student-recognition-se329.appspot.com",
};
firebase.initializeApp(config);

var database = firebase.database();

function writeUserData() {
    takeSnapshot();
    //var id = ;
    var date = "12-34-56";
    var name = document.getElementById("student_name").value;

    database.ref('users/Professor/' + document.getElementById("student_id").value).set({
        //id: id,
        last_seen: getDate(),
        Name: name

    });

}

function getDate()
{
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    if(dd<10) {
        dd='0'+dd
    }

    if(mm<10) {
        mm='0'+mm
    }

    today = mm+'/'+dd+'/'+yyyy;
    return today;

}