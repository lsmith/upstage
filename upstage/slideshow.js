YUI.add("s7-slideshow", function (Y) {

    Y.namespace("S7");
    Y.augment(Y.S7, Y.EventTarget);

    Y.S7.on("start", function () {
        // give every slide a #slide{n} id
        Y.all(".slide").each(function (node, idx) {
            idx++;
            node.set("id", "slide" + idx);
            node.setData("slide", idx);
        });
        // navigate to slide 1
        Y.S7.fire("position", 1);
    });

    // warp: give a relative number of steps to navigate to
    Y.S7.on("warp", function (rel, mouseEvent) {
        if (mouseEvent && mouseEvent.halt) mouseEvent.halt(); // prevent navigation to "#"

        var idx = Y.S7.currentSlide + parseInt(rel, 10);

        Y.log("warp: to slide " + idx + " from slide " + Y.S7.currentSlide);
        Y.S7.fire("position", idx);
    });

    // position: give the slide number you'd like to navigate to
    Y.S7.on("position", function (next) {
        // can't go earlier than the first slide
        // can't go further than the last slide
        next = Math.max(1, next),
        next = Math.min(next, Y.all(".slide").size());
        Y.log("position: should the next slide be " + next);

        var previous = Y.S7.currentSlide || 1;
        Y.S7.currentSlide = parseInt(next, 10);

        if (previous != next) {
            Y.log("position: yes, firing transition and navigate");
            Y.S7.fire("navigate", next); // fired only when navigation is happening
            Y.S7.fire("transition",
                Y.one("#slide" + previous),
                Y.one("#slide" + next)
            );
        }
    });

    // transition: moves from slide A to B. may be overriden with preventDefault.
    Y.S7.publish("transition", {
        emitFacade : true,
        defaultFn : function (ev) {    
            var prev = ev.details[0],
                next = ev.details[1];
            prev.setStyle("display", "none");
            next.setStyle("display", "block");
        }
    });

}, "0.0.1", {
    requires : [
        "event-custom",
        "node"
    ]
});