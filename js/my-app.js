var myApp = new Framework7();

var mainView = myApp.addView('.view-main', {
  dynamicNavbar: true
});

AV.initialize("gosiknzn1db4o6sdlzjo2ozq17sqhyfl1wdomipneda90bbo", "x6zak5uxsty6jatbxx46al0rfsulj2lxntwpgh5125qr63j5");

function getGeoLocation(){
  var geo;
  navigator.geolocation.getCurrentPosition(function(position){
    geo = new AV.GeoPoint({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  });
  return geo;
}

function getPrice(){
  return $("#price .button.active").data("price");
}

function getFeatures(){
  return $("#feature .button.active").map(function(){return $(this).data("feature"); })
}

function getPhotoFile(){
  var fileUpload = $("#fileUpload")[0];
  if (fileUpload.files.length > 0) {
    var file = fileUpload.files[0];
    var name = "photo.jpg";

    var avFile = new AV.File(name, file);
    return avFile;
  }
  return null;
}

$(function(){
  $("#buttonSubmit").on('click', function(){
    var price = getPrice();
    var features = getFeatures();
    var geo = getGeoLocation();
    var photo = getPhotoFile();
    var name = $("#textLocation").val();

    var Lot = AV.Object.extend("Lot");
    var lot = new Lot();
    lot.set("price", price);
    lot.set("features", features);
    if (!photo) {
      lot.set("photo", photo);
    }
    lot.set("name", name);
    myApp.showPreloader('提交中...')
    lot.save(null, {
      success: function(lot){
        myApp.hidePreloader();
        location.reload();
      },
      error: function(lot, error){
        myApp.hidePreloader();
        alert('Failed to create new object, with error code: ' + error.description);
      }
    });
  });

  $("#price .button").on('click', function(){
    $("#price .button").removeClass("active");
    $(this).addClass("active");
  });

  $("#feature .button").on('click', function(){
    $(this).toggleClass("active");
  });

  $("#buttonUpload").on('click', function(){
    $("#fileUpload").click();
  });
});
