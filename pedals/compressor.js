"use strict";

(function() {

$.get("pedals/compressor.html", function(data) {

  var ui = $(data).appendTo($("#pedalboard"));

  var compressor = new Tone.Compressor(20, 3);
  compressor.knee.value = 10;
  var bypassed = false;

  $(ui).find(".compressorthreshold").knob({
    "release": function(v) {
      if (!bypassed) compressor.threshold.value = v;
    }
  });

  $(ui).find(".compressorratio").knob({
    "release": function(v) {
      if (!bypassed) compressor.ratio.value = v;
    }
  });

  $(ui).find(".compressorattack").knob({
    "release": function(v) {
      compressor.attack.value = v/1000;
    }
  });

  $(ui).find(".compressorrelease").knob({
    "release": function(v) {
      compressor.release.value = v/1000;
    }
  });

  $(ui).find(".bypass").click(function() {
    $(this).toggleClass("on");
    bypassed = !$(this).hasClass("on");
    if (bypassed) {
      compressor.threshold.value = 0;
      compressor.ratio.value = 1;
    } else {
      compressor.threshold.value = $(ui).find(".compressorthreshold").val();
      compressor.ratio.value = $(ui).find(".compressorratio").val();
    }
  });

  var getValues = function() {
    return "compressor," +
      $(ui).find(".compressorthreshold").val() + "," +
      $(ui).find(".compressorratio").val() + "," +
      $(ui).find(".compressorattack").val() + "," +
      $(ui).find(".compressorrelease").val() + "," +
      (+bypassed);
  };

  var setValues = function(values) {
    var val = values.split(",");
    $(ui).find(".compressorthreshold").val(val[1]).trigger("change");
    $(ui).find(".compressorratio").val(val[2]).trigger("change");
    $(ui).find(".compressorattack").val(val[3]).trigger("change");
    $(ui).find(".compressorrelease").val(val[4]).trigger("change");
    if ($(ui).find(".bypass").hasClass("on") == val[5]) {
      $(ui).find(".bypass").click();
    }
  }

  pedals.push({
    nodes: [compressor],
    type: "compressor",
    ui: ui,
    getValues: getValues,
    setValues: setValues
  });

  rewire();

}).done(function() {
  if (queuedScripts.length > 0) $.getScript(queuedScripts.shift());
});

})();
