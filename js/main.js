"use strict";

// enforce https
// TODO: remove debug localhost
if (window.location.host != "127.0.0.1:3000" && window.location.protocol != "https:") {
  window.location.protocol = "https:" + window.location.href.substring(window.location.protocol.length);
}


// vars
var input = new Tone.ExternalInput().toMaster();
// var input = new Tone.Player({
//   "url": "output.wav",
//   "autostart": true,
//   "loop": true,
// }).toMaster();
var pedalTypes = ["delay", /*"distortion",*/ "reverb", "superverb", "tremolo"];
var pedalUIs = [];
var pedalFXs = [];


input.open(function() {
  input.start();
});


// main code
$(function() {

  // load available pedals (knobs!)
  for (var i = 0; i < pedalTypes.length; i++) {
    $.get("pedals/" + pedalTypes[i] + ".html", function(data) {
      $("#allpedals").append(data);
      $("#allpedals .knob input").attr("data-readOnly", "true").knob();
    });
  }


  $("#addpedal").click(function() {

    if ($("body").hasClass("showallpedals")) {
      if (pedalUIs.length == 0) {
        $("body").removeAttr("class");
      } else {
        $("body").toggleClass("showallpedals normal");
      }
    }

    else if ($("body").hasClass("normal")) {
      $("body").attr("class", "showallpedals");
    }

    else {
      $("body").attr("class", "showallpedals");
    }

  });


  // pedal selected -> add
  $("#allpedals").on("click", ".pedal", function() {

    // get pedal type
    var type = $(this).attr("class").replace("pedal", "").trim();

    // load html and add it (setup pedal)
    $.get("pedals/" + type + ".html", function(data) {

      // store ui
      var ui = $(data).appendTo($("#pedalboard"));
      pedalUIs.push(ui[0]);

      // execute pedal script and rewire audio nodes
      $.getScript("pedals/" + type + ".js").done(function() {
        rewire();
      });

    });

    // close allpedals and show pedalboard
    $("body").toggleClass("showallpedals normal");

  });

  // bypass clicked
  // $("#pedalboard").on("click", ".pedal .bypass", function() {
  //   $(this).toggleClass("on");
  //   var index = pedalUIs.indexOf($(this).parent()[0]);
  //   pedalFXs[index].wet.value = ($(this).hasClass("on")) ? () : 0;
  // });

});


// connect the audio nodes
function rewire() {

  input.stop();
  input.disconnect();

  if (pedalFXs.length > 0) {

    input.connect(pedalFXs[0]);

    for (var i = 0; i < pedalFXs.length - 1; i++) {
      pedalFXs[i].disconnect();
      pedalFXs[i].connect(pedalFXs[i + 1]);
    }

    pedalFXs[pedalFXs.length - 1].toMaster();

  } else {
    input.toMaster();
  }

  input.start();

}
