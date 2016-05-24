"use strict";

(function() {

$.get("pedals/tremolo.html", function(data) {

  var ui = $(data).appendTo($("#pedalboard"));

  var tremolo = new Tone.Tremolo(2, 0.5).start();
  var wet = 0.5;
  tremolo.wet.value = wet;
  tremolo.spread = 0;
  var bypassed = false;

  $(ui).find(".tremolorate").knob({
    "release": function(v) {
      tremolo.frequency.value = v;
    }
  });

  $(ui).find(".tremolodepth").knob({
    "release": function(v) {
      tremolo.depth.value = v/100;
    }
  });

  $(ui).find(".tremolostereo").knob({
    "release": function(v) {
      tremolo.spread = (v/100) * 180;
    }
  });

  $(ui).find(".tremololevel").knob({
    "release": function(v) {
      wet = v/100;
      if (!bypassed) tremolo.wet.value = wet;
    }
  });

  $(ui).find(".bypass").click(function() {
    $(this).toggleClass("on");
    bypassed = !$(this).hasClass("on");
    if (bypassed) {
      tremolo.wet.value = 0;
    } else {
      tremolo.wet.value = wet;
    }
  });

  var getValues = function() {
    return "tremolo," +
      $(ui).find(".tremolorate").val() + "," +
      $(ui).find(".tremolodepth").val() + "," +
      $(ui).find(".tremolostereo").val() + "," +
      $(ui).find(".tremololevel").val() + "," +
      (+bypassed);
  };

  var setValues = function(values) {
    var val = values.split(",");
    $(ui).find(".tremolorate").val(val[1]).trigger("change");
    $(ui).find(".tremolodepth").val(val[2]).trigger("change");
    $(ui).find(".tremolostereo").val(val[3]).trigger("change");
    $(ui).find(".tremololevel").val(val[4]).trigger("change");
    if ($(ui).find(".bypass").hasClass("on") == val[5]) {
      $(ui).find(".bypass").click();
    }
  }

  pedals.push({
    nodes: [tremolo],
    type: "tremolo",
    ui: ui,
    getValues: getValues,
    setValues: setValues
  });

  rewire();

}).done(function() {
  if (queuedScripts.length > 0) $.getScript(queuedScripts.shift());
});

})();
