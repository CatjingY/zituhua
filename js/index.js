/*
 *  Texter - Drawing with Text.
 *  - Ported from demo in Generative Design book - http://www.generative-gestaltung.de
 *  - generative-gestalung.de original licence: http://www.apache.org/licenses/LICENSE-2.0
 *
 *  - Modified and maintained by Tim Holman - tholman.com - @twholman
 */

const scale = 2;

function Texter() {
    var _this = this;

    // Application variables
    position = {
        x: 0,
        y: window.innerHeight / 2
    };
    textIndex = 0;
    this.textColor = "#000000";
    this.bgColor = "#ffffff";
    this.minFontSize = 8;
    this.maxFontSize = 300;
    this.angleDistortion = 0.01;

    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    var urlText = urlParams.get("text");

    this.text =
        urlText ||
        "There was a table set out under a tree in front of the house, and the March Hare and the Hatter were having tea at it: a Dormouse was sitting between them, fast asleep, and the other two were using it as a cushion, resting their elbows on it, and talking over its head. 'Very uncomfortable for the Dormouse,' thought Alice; 'only, as it's asleep, I suppose it doesn't mind.'";

    // Drawing Variables
    canvas = null;
    context = null;
    mouse = {
        x: 0,
        y: 0,
        down: false
    };

    bgCanvas = null;
    bgContext = null;

    this.initialize = function() {
        canvas = document.getElementById("canvas");
        context = canvas.getContext("2d");
        canvas.width = (window.innerWidth - 40) * scale;
        canvas.height = (window.innerHeight - 40) * scale;
        context.scale(scale, scale);

        canvas.addEventListener("mousemove", onMove, false);
        canvas.addEventListener("mousedown", onDown, false);
        canvas.addEventListener("mouseup", onUp, false);
        canvas.addEventListener("mouseout", onUp, false);

        canvas.addEventListener("touchstart", onDown, false);
        canvas.addEventListener("touchmove", onMove, false);
        canvas.addEventListener("touchend", onUp, false);
        canvas.addEventListener("touchcancel", onUp, false);

        bgCanvas = document.createElement("canvas");
        bgContext = bgCanvas.getContext("2d");
        bgCanvas.width = canvas.width * scale;
        bgCanvas.height = canvas.height * scale;

        _this.fillBackground()
        update();
    };

    this.fillBackground = () => {
        context.fillStyle = '#ffffff'
        context.fillRect(0, 0, canvas.width, canvas.height)
        context.fillStyle = this.textColor
    }

    var update = function() {
        requestAnimationFrame(update);
        draw();
    };

    var draw = function() {
        if (mouse.down) {
            var newDistance = distance(position, mouse);
            var fontSize = _this.minFontSize + newDistance / 2;

            if (fontSize > _this.maxFontSize) {
                fontSize = _this.maxFontSize;
            }

            var letter = _this.text[textIndex];
            var stepSize = textWidth(letter, fontSize);

            if (newDistance > stepSize) {
                var angle = Math.atan2(mouse.y - position.y, mouse.x - position.x);

                context.font = fontSize + "px Georgia";

                context.save();
                context.translate(position.x, position.y);
                context.rotate(
                    angle +
                    (Math.random() * (_this.angleDistortion * 2) -
                        _this.angleDistortion)
                );
                context.fillText(letter, 0, 0);
                context.restore();

                textIndex++;
                if (textIndex > _this.text.length - 1) {
                    textIndex = 0;
                }

                position.x = position.x + Math.cos(angle) * stepSize;
                position.y = position.y + Math.sin(angle) * stepSize;
            }
        }
    };

    var distance = function(pt, pt2) {
        var xs = 0;
        var ys = 0;

        xs = pt2.x - pt.x;
        xs = xs * xs;

        ys = pt2.y - pt.y;
        ys = ys * ys;

        return Math.sqrt(xs + ys);
    };

    var onDown = function(event) {
        const eventObject = (event.touches && event.touches.item(0)) || event;

        mouse.down = true;
        position.x = eventObject.clientX - 20;
        position.y = eventObject.clientY - 20;
        mouse.x = eventObject.clientX - 20;
        mouse.y = eventObject.clientY - 20;
    };

    var onUp = function() {
        mouse.down = false;
    };

    var onMove = function(event) {
        const eventObject = (event.touches && event.touches.item(0)) || event;
        mouse.x = eventObject.clientX - 20;
        mouse.y = eventObject.clientY - 20;
        draw();
    };

    var textWidth = function(string, size) {
        context.font = size + "px Georgia";

        if (context.fillText) {
            return context.measureText(string).width;
        } else if (context.mozDrawText) {
            return context.mozMeasureText(string);
        }
    };

    this.clear = function() {
        canvas.width = canvas.width;
        context.scale(scale, scale);
        context.fillStyle = _this.textColor;
    };

    this.applyNewColor = function(value) {
        _this.textColor = value;
        context.fillStyle = _this.textColor;
    };


    this.setText = function(text) {
        _this.text = text;
        textIndex = 0;
    };
};