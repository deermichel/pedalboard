(function() {

var distortion = new Tone.Distortion(0.5);
$(".distortiondrive").knob({
  "release": function(v) {
    distortion.distortion = v/100;
  }
});

pedalFXs.push(distortion);

})();
