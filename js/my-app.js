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

AV.initialize("gosiknzn1db4o6sdlzjo2ozq17sqhyfl1wdomipneda90bbo", "x6zak5uxsty6jatbxx46al0rfsulj2lxntwpgh5125qr63j5");

var TestObject = AV.Object.extend("TestObject");
var testObject = new TestObject();
testObject.save({foo: "bar"}, {
  success: function(object) {
    alert("AVOS Cloud works!");
  }
});
