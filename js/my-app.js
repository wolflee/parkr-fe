// Initialize your app
var myApp = new Framework7();

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    //dynamicNavbar: true
});

var btnUpload = document.getElementById("upload");
btnUpload.onclick = function(){
  document.getElementById("uploader").click();
};
