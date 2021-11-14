(function ($) {
	jQuery.expr[':'].Contains = function(a,i,m){return (a.textContent || a.innerText || "").toUpperCase().indexOf(m[3].toUpperCase())>=0;};
	function listFilter(header, list,element) {
		$(document).on("keyup",header, function() {
			var filter = $(this).val();
			if(filter) {
				$(list).find(element+":not(:Contains(" + filter + "))").fadeOut("fast");
				$(list).find(element+":Contains(" + filter + ")").fadeIn("fast");
			} else {$(list).find(element).fadeIn();}
			return false;
		}).keyup(function() {$(this).change();});
	}
	$(function() {
		listFilter("#storesearch", $("body"), ".view");
	});
}(jQuery)); 
$(function() {
	$("body,#installed").tabs();
	$.each(apps, function(i,v) {
		var id = "window_" + v.name.toLowerCase().replace(".","").replace(",","").replace(" ","");
		var view = $("<div>").attr("class","view card");
		var front = $("<div>").addClass("view_front").appendTo(view);
		var icon = $("<img>").attr("src",v.icon).addClass("view_icon").appendTo(front);
		$("<span>").attr("class","view_name").html(v.name).appendTo(front);
		$("<span>").attr("class","view_author").html("by "+v.author).appendTo(front);
		var back = $("<div>").addClass("view_back").appendTo(view);
		$("<p>").addClass("view_desc").html(v.description).appendTo(back);
		$("<button>").attr({"class":"view_install button blue small","data-url":v.manifest,"data-id":id}).html("<span>Install</span>").appendTo(back);
		if(v.hdpiIconAvailable) {
			var srcsetval = v.icon + " 1x, " + v.icon.substring(0,v.icon.length - 4) + "@2x.png 2x";
			icon.attr("srcset",srcsetval);
		}
		$("#apps").append(view);
	});
	$.each(games, function(i,v) {
		var id = "games_" + v.name.toLowerCase().replace(".","").replace(",","").replace(" ","");
		var view = $("<div>").attr("class","view card");

		var front = $("<div>").addClass("view_front").appendTo(view);
		var icon = $("<img>").attr("src",v.icon).addClass("view_icon").appendTo(front);
		$("<span>").attr("class","view_name").html(v.name).appendTo(front);
		$("<span>").attr("class","view_author").html("by "+v.author).appendTo(front);
		var back = $("<div>").addClass("view_back").appendTo(view);

		$("<p>").addClass("view_desc").html(v.description).appendTo(back);

		$("<button>").attr({"class":"view_install button blue small","data-url":v.manifest,"data-id":id}).html("<span>Install</span>").appendTo(back);
		if(v.hdpiIconAvailable) {

			var srcsetval = v.icon + " 1x, " + v.icon.substring(0,v.icon.length - 4) + "@2x.png 2x";
			icon.attr("srcset",srcsetval);

		}
		$("#games").append(view);
	});
	$.each(widgets, function(i,v) {
		var id = "widget_" + v.name.toLowerCase().replace(".","").replace(",","").replace(" ","");
		var result = '<div class="view card">'+
		'<div class="view_front"><img src="'+v.icon+'" class="view_icon"/>'+
		'<span class="view_name">'+v.name+'</span><span class="view_author">by '+v.author+'</span>'+
		'</div>'+
		'<div class="view_back">'+
			'<p class="view_desc">'+v.description+'</p>'+
			'<button class="view_install button blue small" data-url="'+v.url+'" data-id="'+id+'"><span>Install</span></button>'+
		'</div>'+
		'</div>';
		$("#widgets").append(result);
	});
	$(document).on("app-change", function(e) {
		$("#apps .view_install").each(function() {
			var id = $(this).attr("data-id");
			if(parent.apps.check(id,"installed")) {
				$(this).addClass("installed green").removeClass("blue");
			}
			else {
				$(this).addClass("blue").removeClass("installed green");
			}
		});
		$("#installedapps ul").empty();
		if(parent.apps.list("custom","name").length) {
			$.each(parent.apps.list("custom","name"), function(i,data) {
				var id = "window_" + data.toLowerCase().replace(".","").replace(",","").replace(" ","");
				var li = $("<li>").attr("data-id",id).addClass("card");
				$("<span>").attr("class","title").html(data).appendTo(li);
				li.append("<span class='buttons'><button class='button green small button_launch'>Launch</button></span></li>");
				$("#installedapps ul").append(li);
			});
		}
	});
	$(document).on("game-change", function(e) {
		$("#games .view_install").each(function() {
			var id = $(this).attr("data-id");
			if(parent.apps.check(id,"installed")) {
				$(this).addClass("installed green").removeClass("blue");
			}
			else {
				$(this).addClass("blue").removeClass("installed green");
			}
		});
		$("#installedgames ul").empty();
		if(parent.games.list("custom","name").length) {
			$.each(parent.games.list("custom","name"), function(i,data) {
				var id = "games_" + data.toLowerCase().replace(".","").replace(",","").replace(" ","");
				var li = $("<li>").attr("data-id",id).addClass("card");
				$("<span>").attr("class","title").html(data).appendTo(li);
				li.append("<span class='buttons'><button class='button green small button_launch'>Launch</button></span></li>");
				$("#installedgames ul").append(li);
			});
		}
	});
	$(document).on("widget-change", function() {
		$("#widgets .view_install").each(function() {
			var id = $(this).attr("data-id");
			if(parent.widgets.isinstalled(id)) {
				$(this).addClass("installed red").removeClass("blue");
			}
			else {
				$(this).addClass("blue").removeClass("installed red");
			}
		});
		$("#installedwidgets ul").empty();
		if(parent.widgets.list().length) {
			$.each(parent.widgets.list(), function(i,data) {
				var id = "widget_" + data.toLowerCase().replace(".","").replace(",","").replace(" ","");
				var li = $("<li>").attr("data-id",id).addClass("card");
				$("<span>").attr("class","title").html(data).appendTo(li);
				li.append("<span class='buttons'><button class='button blue small button_reload'>Reload</button><button class='button red small button_remove'>Remove</button></span></li>");
				$("#installedwidgets ul").append(li);
			});
		}
	});
	$(document).on("social-change", function() {
		$("#social ul").empty();
		if(parent.social.list().length) {
			$.each(parent.social.list(),function(i,data) {
				var li = $("<li>").attr("data-id",data.app).addClass("card");
				var buttons = $("<span>").attr("class","buttons");
				$("<span>").attr("class","title").html(parent.apps.getInfo(data.app,"name")).appendTo(li);
				buttons.append("<button class='button red small button_uninstall'>Uninstall</button>").appendTo(li);
				$("#social ul").append(li);
				if(parent.social.checkInstall(data.app,"sidebar")) {
					buttons.prepend("<span class='indicator sidebar'></span>");
				}
				if(parent.social.checkInstall(data.app,"share")) {
					buttons.prepend("<span class='indicator share'></span>");
				}
			});
		}
	});
	$(document).trigger("app-change").trigger("game-change").trigger("widget-change").trigger("social-change");
	$(document).on("click","#apps .view_install:not(.installed)",function() {
		parent.apps.install($(this).attr("data-url"));
	});
	$(document).on("click","#games .view_install:not(.installed)",function() {
		parent.games.install($(this).attr("data-url"));
	});
	$(document).on("click","#widgets .view_install:not(.installed)",function() {
		parent.widgets.install($(this).attr("data-url"), $(this).parent().siblings(".view_front").children(".view_name").html())
	});
	$(document).on("click","#apps .view_install.installed",function() {
		parent.apps.open($(this).attr("data-id"));
	});
	$(document).on("click","#games .view_install.installed",function() {
		parent.games.open($(this).attr("data-id"));
	});
	$(document).on("click","#widgets .view_install.installed",function() {
		parent.widgets.remove($(this).attr("data-id"));
	});
	$(document).on("click","#installedwidgets li .buttons .button_reload",function() {
		parent.widgets.reload($(this).parent().parent().attr("data-id"));
	});
	$(document).on("click","#installedwidgets li .buttons .button_remove",function() {
		parent.widgets.remove($(this).parent().parent().attr("data-id"));
	});
	$(document).on("click","#installedapps li .buttons .button_launch",function() {
		parent.apps.open($(this).parent().parent().attr("data-id"));
	});
	$(document).on("click","#installedgames li .buttons .button_launch",function() {
		parent.games.open($(this).parent().parent().attr("data-id"));
	});
	$(document).on("click","#social .button_uninstall",function() {
		parent.social.unregister($(this).parent().parent().attr("data-id"));
	});
});
