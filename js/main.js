"use strict";

// enforce https
// TODO: remove debug localhost
if (window.location.host != "127.0.0.1:3000" && window.location.protocol != "https:") {
  window.location.protocol = "https:" + window.location.href.substring(window.location.protocol.length);
}


// vars
var input;
var pedalTypes = [/*"chorus", "compressor", */"delay", /*"distortion", "eq", "pitchshifter", */"reverb", "superverb", "tremolo"];
var pedalUIs = [];
var pedalFXs = [];


// main code
$(function() {

  // browser supported?
  if (!Tone.ExternalInput.supported) {
    $("#message").html("Sorry, your browser is currently not supported. Try Chrome.");
    return;
  }

  // wait for mic access
  var _test = new Tone.ExternalInput().open(function(error) {

    if (error) {
      return; // not allowed
    } else {
      $("#message").hide(); // all ok
      _test.close();
    }

    // get available inputs
    Tone.ExternalInput.getSources(function(sources) {

      if (sources.length == 0) {  // ok, that's weird (firefox bug?)
        // $("#message").html("No audio input found.").show();
        // return;

      } else if (sources.length > 1) {  // selectable
        $("#intro").removeClass("hideselect");

      }

      // add inputs to dropdown menu
      for (var i = 0; i < sources.length; i++) {
        $("#selectinput").append($("<option>", {
          value: i,
          text: (sources[i].label == "") ? ("input " + (i+1)) : sources[i].label
        }));
      }

      // let's be ready
      $("#getready").show();

    });

  });


  // load available pedals (knobs!)
  for (var i = 0; i < pedalTypes.length; i++) {
    $.get("pedals/" + pedalTypes[i] + ".html", function(data) {
      $("#allpedals").append(data);
      $("#allpedals .knob input").attr("data-readOnly", "true").knob();
    });
  }

  // start monitoring and switch to normal mode
  $("#getready").click(function() {

    input = new Tone.ExternalInput($("#selectinput").val()).toMaster();
    input.open(function() {
      input.start();
    });

    $("body").attr("class", "normal");
  });

  // switch between normal and addpedal mode
  $("#addpedal").click(function() {
    $("body").toggleClass("showallpedals normal");
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
