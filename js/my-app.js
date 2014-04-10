var myApp = new Framework7();

var mainView = myApp.addView('.view-main', {
  dynamicNavbar: true
});

AV.initialize("gosiknzn1db4o6sdlzjo2ozq17sqhyfl1wdomipneda90bbo", "x6zak5uxsty6jatbxx46al0rfsulj2lxntwpgh5125qr63j5");

function getPrice(){
  return $("#price .button.active").data("price");
}

function getFeatures(){
  return AV._.toArray(
    $("#feature .button.active").map(function(){
    return $(this).data("feature");
  }));
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

function getName(){
  return $("#textLocation").val() ? $("#textLocation").val() : "";
}

function getGeoLocation(){
  navigator.geolocation.getCurrentPosition(function(position){
    $("#hiddenLocation").data("latitude", position.coords.latitude);
    $("#hiddenLocation").data("longitude", position.coords.longitude);
  });
}


$(document).ready(function(){

  FastClick.attach(document.body);

  $("#buttonSubmit").on('click', function(){
    var price = getPrice();
    var features = getFeatures();
    var photo = getPhotoFile();
    var name = getName();
    var geo = new AV.GeoPoint({
      latitude: $("#hiddenLocation").data("latitude"),
      longitude: $("#hiddenLocation").data("longitude")
    });

    var Lot = AV.Object.extend("Lot");
    var lot = new Lot();
    lot.set("price", price);
    lot.set("features", {});
    lot.set("features", features);
    if (photo) {
      lot.set("photo", photo);
    }
    lot.set("name", name);
    lot.set("location", geo);
    myApp.showPreloader('提交中...');
    lot.save(null, {
      success: function(lot){
        setTimeout(function(){
          myApp.hidePreloader();
          $("#toolbar a").text("提交成功")
          $("#toolbar").animate({
            "bottom": "-=50px"
          }, 1000, function(){
            //$("#toolbar").removeClass('beneath');
            location.reload();
          });
        }, 1000);
      },
      error: function(lot, error){
        myApp.hidePreloader();
        alert('Failed to create new object, with error code: ' + error.description);
      }
    });
  });

  $("#price a").on('click', function(){
    $("#price a").removeClass("active");
    $(this).addClass("active");

    if($("#toolbar").hasClass("beneath")){
      $("#toolbar").animate({
        "bottom": "+=50px"
      }, 1000, function(){
        $("#toolbar").removeClass('beneath');
      });
    }
  });

  $("#feature .required a").on('click', function(){
    $("#feature .required a").removeClass("active");
    $(this).addClass("active");
  });

  $("#feature .optional a").on('click', function(){
    $(this).toggleClass("active");
  });

  $("#buttonUpload").on('click', function(){
    $("#fileUpload").click();
  });

  getGeoLocation();

  $("#buttonSubmit").removeClass('disabled');
});
