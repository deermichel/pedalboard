"use strict";

// enforce https
// TODO: remove debug localhost
if (window.location.host != "127.0.0.1:3000" && window.location.protocol != "https:") {
  window.location.protocol = "https:" + window.location.href.substring(window.location.protocol.length);
}


// vars
var input;
var recorder;
var pedalTypes = ["chorus", /*"compressor", */"delay", /*"distortion", "eq", "pitchshifter", */"reverb", "superverb", "tremolo"];
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
      recorder = new Recorder(Tone.Master)
    });

    $("body").attr("class", "normal");
  });

  // switch between normal and addpedal mode
  $("#addpedal").click(function() {
    $("body").toggleClass("showallpedals normal");
  });

  // record button
  $("#record").click(function() {

    if (recorder.recording) {

      // stop recording
      recorder.stop();
      $("#record").removeClass("recording");
      $("#recordshare").addClass("show");

    } else {

      // start recording
      recorder.record();
      $("#record").addClass("recording");
      $("#recordshare").removeClass("show");

    }

  });

  // record share actions
  $("#recordshare i.ion-ios-download-outline").click(function() {

    // download wav
    recorder.exportWAV(function(blob) {
      Recorder.forceDownload(blob, "Pedalboard_" + Math.floor(Date.now() / 1000) + ".wav");
    });

    // mp3 export
    /*
    recorder.getBuffer(function(buffers) {

      // encode mp3
      var encoder = new lamejs.Mp3Encoder(2, 44100, 256);
      var mp3Data = [];
      var sampleBlockSize = 1152;

      var left = new Int16Array(buffers[0].length);
      var right = new Int16Array(buffers[1].length);

      for (var i = 0; i < buffers[0].length; i++) {
        left[i] = convert(buffers[0][i]);
        right[i] = convert(buffers[1][i]);
      }
      function convert(n) {
        var v = n < 0 ? n * 32768 : n * 32767;
        return Math.max(-32768, Math.min(32768, v));
      }

      for (var i = 0; i < buffers[0].length; i += sampleBlockSize) {
        var chunkL = left.subarray(i, i + sampleBlockSize);
        var chunkR = right.subarray(i, i + sampleBlockSize);
        var buffer = encoder.encodeBuffer(chunkL, chunkR);
        if (buffer.length > 0) {
          mp3Data.push(buffer);
        }
      }
      var buffer = encoder.flush();
      if (buffer.length > 0) {
        mp3Data.push(buffer);
      }

      // download mp3
      var blob = new Blob(mp3Data, {type: "audio/mp3"});
      Recorder.forceDownload(blob, "Pedalboard_" + Math.floor(Date.now() / 1000) + ".mp3");

    });
    */

  });
  $("#recordshare i.ion-ios-cloud-outline").click(function() {

    // upload to SoundCloud
    
    // connect and upload
    SC.connect().then(function() {
      recorder.exportWAV(function(blob) {

        $("#recordshare i").css("visibility", "hidden");    // hide share options

        var upload = SC.upload({    // start upload process
          file: blob,
          title: "Pedalboard Recording " + new Date().toLocaleString(),
          description: "Check out Pedalboard: https://deermichel.github.io/pedalboard/",
          progress: function(e) {
            $("#recordshare span").html(Math.round(((e.loaded / e.total) * 100)) + "%");  // progress in %
          }
        }).then(function(track) {   // upload finished
            $("#recordshare span").html($("<a>", {    // add link to new track
              text: "Link",
              href: track.permalink_url,
              target: "_blank",
              click: function() {     // reset UI
                $("#recordshare span").html("");
                $("#recordshare i").css("visibility", "");
              }
            }));
        });

      });
    });

  });
  $("#recordshare i.ion-ios-close-outline").click(function() {

    // delete recording
    recorder.clear();
    $("#recordshare").removeClass("show");

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


// init SoundCloud SDK
SC.initialize({
  client_id: "aa8ffd757dea381ac3ac2eb5abe894df",
  redirect_uri: "https://deermichel.github.io/pedalboard/soundcloud_callback.html"
});
