var myApp = new Framework7();

var mainView = myApp.addView('.view-main', {
  dynamicNavbar: true
});

AV.initialize("gosiknzn1db4o6sdlzjo2ozq17sqhyfl1wdomipneda90bbo", "x6zak5uxsty6jatbxx46al0rfsulj2lxntwpgh5125qr63j5");

$(document).ready(function(){

  FastClick.attach(document.body);

  function initPage(){
    //location.reload();
    $("a").removeClass("active");
    $("input").val(null);
    $("#buttonUpload span").show();
    $("#buttonUpload img").remove();
    $("#price a").on('click', moveToolbar);
  }

  //function isCanvasSupported(){
    //var elem = document.createElement('canvas');
    //return !!(elem.getContext && elem.getContext('2d'));
  //}

  function resizeToBase64(image, maxWidth, maxHeight){
    //if (!isCanvasSupported()) { return null; }

    var max_width = 400;
    var max_height = 300;
    var width = image.width;
    var height = image.height;
    if (width > height) {
      if (width > max_width) {
        height *= max_width / width;
        width = max_width;
      }
    } else {
      if (height > max_height) {
        width *= max_height / height;
        height = max_height;
      }
    }

    var canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.getContext("2d").drawImage(image, 0, 0, width, height);
    return canvas.toDataURL("image/jpeg").split(",")[1];
  }

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
    var avFile;
    //var support = true;
    var fileUpload = $("#fileUpload")[0];
    if (fileUpload.files.length > 0) {
      var name = "photo.jpg";
      //if (isCanvasSupported()) {
        var dataBase64 = $("#imgUpload").data("base64");
        avFile = new AV.File(name, { base64: dataBase64 });
      //} else {
        //var file = fileUpload.files[0];
        //avFile = new AV.File(name, file);
      //}
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

  function getComment(){
    return $("#textComment").val() ? $("#textComment").val() : "";
  }

  $("#buttonSubmit").on('click', function(){
    var price = getPrice();
    var features = getFeatures();
    var photo = getPhotoFile();
    var name = getName();
    var geo = new AV.GeoPoint({
      latitude: $("#hiddenLocation").data("latitude"),
      longitude: $("#hiddenLocation").data("longitude")
    });
    var comment = getComment();

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
    lot.set("comment", comment);

    $("#toolbar a").text("提交中...")
    lot.save(null, {
      success: function(lot){
        setTimeout(function(){
          $("#toolbar a").text("提交成功")
          lot = null;
          initPage();
          $("#toolbar").animate({
            "bottom": "-=50px"
          }, 1000, function(){
          });
        }, 1000);
      },
      error: function(lot, error){
        alert('Failed to create new object, with error code: ' + error.description);
      }
    });
  });

  $("#price a").on('click', function(){
    $("#price a").removeClass("active");
    $(this).addClass("active");
  });

  $("#price a").on('click', moveToolbar);

  function moveToolbar(){
    $("#price a").off('click', moveToolbar);
    $("#toolbar").animate({
      "bottom": "+=50px"
    }, 1000, function(){
      $("#toolbar").removeClass('beneath');
    });
  }

  $("#feature .required a").on('click', function(){
    if ($(this).hasClass("active")) {
      $("#feature .required a").removeClass("active");
    } else {
      $("#feature .required a").removeClass("active");
      $(this).addClass("active");
    }
  });

  $("#feature .optional a").on('click', function(){
    $(this).toggleClass("active");
  });

  $("#buttonUpload").on('mousedown', function(){
    $(this).addClass("pressed");
  });

  $("#buttonUpload").on('mouseup', function(){
    $(this).removeClass("pressed");
  });

  $("#buttonUpload").on('touchstart', function(){
    $(this).addClass("pressed");
  });

  $("#buttonUpload").on('touchend', function(){
    $(this).removeClass("pressed");
  });

  $("#buttonUpload").on('click', function(){
    $("#fileUpload").click();
  });

  $("#fileUpload").on('change', function(e){
    var loadingImage = loadImage(
      e.target.files[0],
      function(img){
        $("#buttonUpload").removeClass('button button-big button-camera')
        $("#buttonUpload span").hide();
        $("#buttonUpload img").remove();
        $("#buttonUpload")[0].appendChild(img);
        $("#buttonUpload").addClass('preview');
      },
      {maxWidth: 300}
    );
    loadingImage.onload = function() {
      var dataBase64 = resizeToBase64(loadingImage, 400, 300);
      $(loadingImage).data("base64", dataBase64);
      loadingImage.id = "imgUpload";
      $(loadingImage).css("max-width", "300px");

      $("#buttonUpload").removeClass('button button-big button-camera');
      $("#buttonUpload span").hide();
      $("#buttonUpload img").remove();
      $("#buttonUpload")[0].appendChild(loadingImage);
      $("#buttonUpload").addClass('preview');
    }

    if (!loadingImage){
    }
  });

  getGeoLocation();

  $("#buttonSubmit").removeClass('disabled');
});
