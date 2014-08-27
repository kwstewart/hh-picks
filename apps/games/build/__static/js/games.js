SRC.Games = {
	DOCUMENT : $(document),
	TYPE : "internal",
	WINDOW:$(window),
	
	/******* VARIABLES **********/
	appId:'54',
	
	teams : {"1":{"name":"Cardinals","abbr":"ARI","city":"Arizona","teamId":"1"},"2":{"name":"Falcons","abbr":"ATL","city":"Atlanta","teamId":"2"},"3":{"name":"Ravens","abbr":"BAL","city":"Baltimore","teamId":"3"},"4":{"name":"Bills","abbr":"BUF","city":"Buffalo","teamId":"4"},"5":{"name":"Panthers","abbr":"CAR","city":"Carolina","teamId":"5"},"6":{"name":"Bears","abbr":"CHI","city":"Chicago","teamId":"6"},"7":{"name":"Bengals","abbr":"CIN","city":"Cincinati","teamId":"7"},"8":{"name":"Browns","abbr":"CLE","city":"Cleveland","teamId":"8"},"9":{"name":"Cowboys","abbr":"DAL","city":"Dallas","teamId":"9"},"10":{"name":"Broncos","abbr":"DEN","city":"Denver","teamId":"10"},"11":{"name":"Lions","abbr":"DET","city":"Detroit","teamId":"11"},"12":{"name":"Packers","abbr":"GB","city":"Green Bay","teamId":"12"},"13":{"name":"Texans","abbr":"HOU","city":"Houston","teamId":"13"},"14":{"name":"Colts","abbr":"IND","city":"Indianapolis","teamId":"14"},"15":{"name":"Jaguars","abbr":"JAC","city":"Jacksonville","teamId":"15"},"16":{"name":"Chiefs","abbr":"KC","city":"Kansas City","teamId":"16"},"17":{"name":"Dolphins","abbr":"MIA","city":"Miami","teamId":"17"},"18":{"name":"Vikings","abbr":"MIN","city":"Minnesota","teamId":"18"},"19":{"name":"Patriots","abbr":"NE","city":"New England","teamId":"19"},"20":{"name":"Saints","abbr":"NO","city":"New Orleans","teamId":"20"},"21":{"name":"Giants","abbr":"NYG","city":"New York","teamId":"21"},"22":{"name":"Jets","abbr":"NYJ","city":"New York","teamId":"22"},"23":{"name":"Raiders","abbr":"OAK","city":"Oakland","teamId":"23"},"24":{"name":"Eagles","abbr":"PHI","city":"Philadelphia","teamId":"24"},"25":{"name":"Steelers","abbr":"PIT","city":"Pittsburg","teamId":"25"},"26":{"name":"Chargers","abbr":"SD","city":"San Diego","teamId":"26"},"27":{"name":"49ers","abbr":"SF","city":"San Fransisco","teamId":"27"},"28":{"name":"Seahawks","abbr":"SEA","city":"Seattle","teamId":"28"},"29":{"name":"Rams","abbr":"STL","city":"St. Louis","teamId":"29"},"30":{"name":"Buccaneers","abbr":"TB","city":"Tampa Bay","teamId":"30"},"31":{"name":"Titans","abbr":"TEN","city":"Tennessee","teamId":"31"},"32":{"name":"Redskins","abbr":"WAS","city":"Washington","teamId":"32"}},
  
  initialize : function() {
    SRC.Loading.update({"type":"load","action":"end"});
  },

	submitPick : function(gameId,teamId) {
	  SRC.Games.DOCUMENT.find("#gameId-"+gameId).gs_loadingMini("start", {text: "Submitting"});
	  pickId = SRC.Games.DOCUMENT.find("#gameId-"+gameId).attr("data-pickId");
    $.ajax({url:SRC.BASE_URI+"api/games/pick/"+gameId+(pickId ? "/"+pickId : "")+".json",type:"POST",data:{"teamId":teamId},dataType:"json",success:SRC.Games.pickSuccess,error:SRC.Games.pickError});
  },
  
  pickSuccess : function(json) {
    var pickInfo = json.items[0];
  	SRC.Games.DOCUMENT.find("#gameId-"+pickInfo.gameId).removeClass("games-week-unpicked");  	
  	SRC.Games.DOCUMENT.find("#gameId-"+pickInfo.gameId+" a").addClass("games-week-checkbox").removeClass("games-week-mypick");
  	SRC.Games.DOCUMENT.find("#teamId-"+pickInfo.teamId+" a").removeClass("games-week-checkbox").addClass("games-week-mypick");
  	SRC.Games.DOCUMENT.find("#gameId-"+pickInfo.gameId).attr("data-pickId",pickInfo.id);
  	SRC.Games.DOCUMENT.find("#gameId-"+pickInfo.gameId).gs_loadingMini("end");
  	
    
    /*
  	$("#teamId-"+json.teamId+" .games-week-bar-wrap div").animate({"width":(parseInt(json.totals.pickCount) / parseInt(json.totals.total) * 100)+"px"});
  	$("#teamId-"+json.oid+" .games-week-bar-wrap div").animate({"width":((parseInt(json.totals.total) - parseInt(json.totals.pickCount)) / parseInt(json.totals.total) * 100)+"px"});
  	$("#teamId-"+json.teamId+" .games-week-bar-wrap").attr("title",(parseInt(json.totals.pickCount) == 1 ? "1 person has" : parseInt(json.totals.pickCount)+" people have")+" picked the "+teams[json.teamId].name);
  	$("#teamId-"+json.oid+" .games-week-bar-wrap").attr("title",((parseInt(json.totals.total) - parseInt(json.totals.pickCount)) == 1 ? "1 person has" : (parseInt(json.totals.total) - parseInt(json.totals.pickCount))+" people have")+" picked the "+teams[json.oid].name);
  	*/
  },

  pickError : function(error) {
  	console.log(error);
  },



	submitScore : function(gameId,score) {
	  SRC.Games.DOCUMENT.find("#score-gameId-"+gameId).gs_loadingMini("start", {text: ""});
	  pickId = SRC.Games.DOCUMENT.find("#gameId-"+gameId).attr("data-pickId");
    $.ajax({url:SRC.BASE_URI+"api/games/pick/"+gameId+"/"+pickId+".json",type:"POST",data:{"score":score},dataType:"json",success:SRC.Games.scoreSuccess,error:SRC.Games.scoreError});
  },

  scorekSuccess : function(json) {
    SRC.Games.DOCUMENT.find("#score-gameId-"+gameId).gs_loadingMini("end");
  },
  scoreError : function(error) {
    SRC.Games.DOCUMENT.find("#score-gameId-"+gameId).gs_loadingMini("end");
  	console.log(error);
  },
  getGames : function(season, week, reccur) {
  	reccur = typeof(reccur) == "undefined" ? 0 : reccur
  	$.ajax({url:base_uri + "ctrl/games/"+season+"/"+week+".json",type:"GET",success:updateGames});
  	if(reccur > 0) setTimeout(function(){ getGames(season,week,reccur) },reccur);
  },

  updateGames : function(json) {
  	
  	if(window.location.pathname.indexOf("picks") > 0) {
  		updatePicks(json);
  		return false;
  	}
  	for(i in json) {
  		// Check if the games has started
  		var gDate = new Date(json[i].jsTime);
  		var now = new Date();
  		if(gDate.getTime() - now.getTime() < 0) {
  			if($("#gameId-"+json[i].gameId+" .games-week-overlay").css("display") == "none") {
  				$("#gameId-"+json[i].gameId+ " .games-week-overlay").addClass("games-week-overlay-locked");
  			}
  		}
  		
  		// If there is no winner, skip
  		if(json[i].wteamId == null) continue;
  		
  		// If the game is already updated, skip
  		if($("#gameId-"+json[i].gameId+" .games-week-overlay-correct").css("display") == "block" || $("#gameId-"+json[i].gameId+" .games-week-overlay-wrong").css("display") == "block") continue;
  		
  		var myPick = $("#gameId-"+json[i].gameId+" .games-week-mypick").parent().attr("id").replace("teamId-","");
  		if(myPick == json[i].wteamId) $("#gameId-"+json[i].gameId+ " .games-week-overlay").addClass("games-week-overlay-correct");
  		else $("#gameId-"+json[i].gameId+ " .games-week-overlay").addClass("games-week-overlay-wrong");
  		
  		// Update records
  		var atr = $("#teamId-"+json[i].ateamId+" .games-week-record").html().split(" - ");
  		var htr = $("#teamId-"+json[i].hteamId+" .games-week-record").html().split(" - ");
  		
  		if(json[i].wteamId == json[i].ateamId) {
  			atr[0] = parseInt(atr[0]) + 1;
  			htr[1] = parseInt(htr[1]) + 1;
  		}
  		else if(json[i].wteamId == json[i].hteamId) {
  			atr[1] = parseInt(atr[1]) + 1;
  			htr[0] = parseInt(htr[0]) + 1;
  		}
  		else {
  			atr[2] = parseInt(atr[2]) + 1;
  			htr[2] = parseInt(htr[2]) + 1;
  		}
  		$("#teamId-"+json[i].ateamId+" .games-week-record").html(atr.join(" - "));
  		$("#teamId-"+json[i].hteamId+" .games-week-record").html(htr.join(" - "));
  	}
  },
  
  updatePicks : function(json) {
  	for(i in json) {
  		// Check if the games has started
  		var gDate = new Date(json[i].jsTime);
  		var now = new Date();
  		if(gDate.getTime() - now.getTime() < 0) {
  			if($("#gameId-"+json[i].gameId).attr("class").length < 20) {
  				$("#gameId-"+json[i].gameId).addClass("picks-grid-game-locked");
  			}
  		}
  		
  		// If there is no winner, skip
  		if(json[i].wteamId == null) continue;
  		
  		// If the game is already updated, skip
  		if($("#gameId-"+json[i].gameId).attr("class").indexOf("correct") > 0 || $("#gameId-"+json[i].gameId).attr("class").indexOf("wrong") > 0) continue;
  		
  		var myPick = $("#gameId-"+json[i].gameId+" .picks-grid-game-helmet").attr("teamId");
  		if(myPick == json[i].wteamId) $("#gameId-"+json[i].gameId).addClass("picks-grid-game-correct");
  		else $("#gameId-"+json[i].gameId+ " .games-week-overlay").addClass("picks-grid-game-wrong");
  		
  	}
  },
  menuChoice: function(choice){
			switch(choice){
			case "openApp":
				SRC.Navigation.openTab({name: 'Games', src: SRC.BASE_URI +"view/games/games.html", title: 'Games'});
				break;
			}
		},
  toggleView : function(view) {
    SRC.Games.DOCUMENT.find("#frame-games").gs_loadingMini("start", {text: "Loading "+view});
    SRC.OPEN({url:SRC.BASE_URI+"view/games/"+view+".html",dataType:"html",load:false,success:function(viewHtml){ 
      SRC.Games.DOCUMENT.find(".games-wrap").html(viewHtml)
      SRC.Games.DOCUMENT.find(".games-wrap").gs_loadingMini("end");
    }  
    });
    
  }
}
$(document).ready(function() {SRC.Games.initialize();});