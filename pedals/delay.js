"use strict";

(function() {

$.get("pedals/delay.html", function(data) {

  var ui = $(data).appendTo($("#pedalboard"));

  var delay = new Tone.FeedbackDelay(0.2, 0.5);
  var wet = 0.5;
  delay.wet.value = wet;
  var bypassed = false;

  $(ui).find(".delaytime").knob({
    "release": function(v) {
      delay.delayTime.value = v/1000;
    }
  });

  $(ui).find(".delayfeedback").knob({
    "release": function(v) {
      delay.feedback.value = v/100;
    }
  });

  $(ui).find(".delaymix").knob({
    "release": function(v) {
      wet = v/100;
      if (!bypassed) delay.wet.value = wet;
    }
  });

  $(ui).find(".bypass").click(function() {
    $(this).toggleClass("on");
    bypassed = !$(this).hasClass("on");
    if (bypassed) {
      delay.wet.value = 0;
    } else {
      delay.wet.value = wet;
    }
  });

  var getValues = function() {
    return "delay," +
      $(ui).find(".delaytime").val() + "," +
      $(ui).find(".delayfeedback").val() + "," +
      $(ui).find(".delaymix").val() + "," +
      (+bypassed);
  };

  var setValues = function(values) {
    var val = values.split(",");
    $(ui).find(".delaytime").val(val[1]).trigger("change");
    $(ui).find(".delayfeedback").val(val[2]).trigger("change");
    $(ui).find(".delaymix").val(val[3]).trigger("change");
    if ($(ui).find(".bypass").hasClass("on") == val[4]) {
      $(ui).find(".bypass").click();
    }
  }

  pedals.push({
    nodes: [delay],
    type: "delay",
    ui: ui,
    getValues: getValues,
    setValues: setValues
  });

  rewire();

}).done(function() {
  if (queuedScripts.length > 0) $.getScript(queuedScripts.shift());
});

})();
