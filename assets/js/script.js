var asciiHex = {
	"20": " ",
	"21": "!",
	"22": "\"",
	"23": "#",
	"24": "$",
	"25": "%",
	"26": "&",
	"27": "'",
	"28": "(",
	"29": ")",
	"2a": "*",
	"2b": "+",
	"2c": ",",
	"2d": "-",
	"2e": ".",
	"2f": "/",
	"30": "0",
	"31": "1",
	"32": "2",
	"33": "3",
	"34": "4",
	"35": "5",
	"36": "6",
	"37": "7",
	"38": "8",
	"39": "9",
	"3a": ":",
	"3b": ";",
	"3c": "<",
	"3d": "=",
	"3e": ">",
	"3f": "?",
	"40": "@",
	"41": "A",
	"42": "B",
	"43": "C",
	"44": "D",
	"45": "E",
	"46": "F",
	"47": "G",
	"48": "H",
	"49": "I",
	"4a": "J",
	"4b": "K",
	"4c": "L",
	"4d": "M",
	"4e": "N",
	"4f": "O",
	"50": "P",
	"51": "Q",
	"52": "R",
	"53": "S",
	"54": "T",
	"55": "U",
	"56": "V",
	"57": "W",
	"58": "X",
	"59": "Y",
	"5a": "Z",
	"5b": "[",
	"5c": "\\",
	"5d": "]",
	"5e": "^",
	"5f": "_",
	"60": "`",
	"61": "a",
	"62": "b",
	"63": "c",
	"64": "d",
	"65": "e",
	"66": "f",
	"67": "g",
	"68": "h",
	"69": "i",
	"6a": "j",
	"6b": "k",
	"6c": "l",
	"6d": "m",
	"6e": "n",
	"6f": "o",
	"70": "p",
	"71": "q",
	"72": "r",
	"73": "s",
	"74": "t",
	"75": "u",
	"76": "v",
	"77": "w",
	"78": "x",
	"79": "y",
	"7a": "z",
	"7b": "{",
	"7c": "|",
	"7d": "}",
	"7e": "~",
};

function swapData(string, map, keyLength, reverse) {
	if (reverse) {
		var reverseMap = {};
		for (var key in map)
			if (map.hasOwnProperty(key)) reverseMap[map[key]] = key;
		map = reverseMap;
	}
	var swapped = "";
	for (var i = 0, length = string.length; i < length; i += keyLength) {
		swapped += map[string.substring(i, i + keyLength)];
	}
	return swapped;
}

function registerIFrame(target) {
	var $iframe = $("<li></li>");
	$("<a></a>").attr("href", target).attr("target", "_blank").addClass("url pull-left").text(target + " ").append('<i class="fa fa-external-link"></i>').appendTo($iframe);
	$('<i class="close fa fa-remove fa-lg"></i>').attr("title", "Remove voting site").appendTo($iframe);
	$('<i class="close fa fa-arrows-v fa-fw"></i>').attr("title", "Maximize voting site").appendTo($iframe);
	$("<iframe></iframe>").attr("src", target).appendTo($iframe);
	$("ul").append($iframe);
	$(".fa-arrows-v").off("click").click(function maximize() {
		$(this).off("click").click(function() {
			$(this).off("click").click(maximize).removeClass("fa-long-arrow-down").addClass("fa-arrows-v").attr("title", "Maximize voting site").siblings("iframe").animate({
				height: 250
			}, 500);
			$("html, body").animate({
				scrollTop: $(this).offset().top
			}, 500);
		}).removeClass("fa-arrows-v").addClass("fa-long-arrow-down").attr("title", "Minimize voting site").siblings("iframe").animate({
			height: $(window).height()
		}, 500);
		$("html, body").animate({
			scrollTop: $(this).siblings("iframe").offset().top
		}, 500);
	});
	$(".fa-remove").off("click").click(function() {
		$(this).parent().fadeOut(function() {
			$(this).remove();
		});
	});
}
if (window.location.href.lastIndexOf("#") !== -1) {
	var config = window.location.href.substring(window.location.href.lastIndexOf("#") + 1).toLowerCase();
	var start, end;
	for (var i = 0, length = config.length; i < length; ++i) {
		if (i + 1 === length) end = length;
		else {
			if (config.charAt(i) === "g" || config.charAt(i) === "h") {
				if (isNaN(start)) start = i;
				else
					end = i;
			}
		}
		if (!(isNaN(start) || isNaN(end))) {
			var target = (config.charAt(start) === "g" ? "http://" : "https://") + swapData(config.substring(start + 1, end), asciiHex, 2, false);
			start = i;
			end = undefined;
			registerIFrame(target);
		}
	}
}
$("#export button").eq(0).click(function() {
	var config = "";
	$("iframe").each(function() {
		var target = $(this).attr("src").substring(7);
		var protocol = "g";
		if ($(this).attr("src").match(/^https/)) {
			target = target.substring(1);
			protocol = "h";
		}
		config += protocol + swapData(target, asciiHex, 1, true);
	});
	if (config !== "") $("#export input").val("http://votemc.github.io/#" + config);
});
var clipboard = new Clipboard("#copy button");
clipboard.on("success", function(event) {
	$("#copy button").attr("data-original-title", "Copied!");
	$("#copy button").tooltip("show");
	event.clearSelection();
}).on("error", function(event) {
	$("#copy button").attr("data-original-title", "Error; please copy manually.");
	$("#copy button").tooltip("show");
});
$("#copy button").click(function() {
	$(this).attr("title", "");
	if (!$("#export input").val()) {
		$(this).attr("data-original-title", "There's nothing to copy!");
		$(this).tooltip("show");
		$(this).attr("title", "Copy link");
		return false;
	} else
		$(this).attr("title", "Copy link");
});
$("#copy button").mouseleave(function() {
	$(this).tooltip("hide");
});
$("#add input").keypress(function(event) {
	if (event.which === 13) {
		$("#add button").trigger("click");
		return false;
	}
});
$("#add button").click(function() {
	var target = $("#add input").val();
	if (target.match(/\w/g) && target.match(/^.*\w\.\w/g) && !target.match(/\s/g)) {
		if (!target.match(/^https?:\/\//)) target = "http://" + target;
		if (!target.match(/^.+\/{2}.+\/+/)) target += "/";
		registerIFrame(target);
	}
});