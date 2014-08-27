SRC.Grid = {
	DOCUMENT : $(document),
	TYPE : "internal",
	WINDOW:$(window),
	
	currentWeek:"",
	refreshRate: 300000,
	
	/******* VARIABLES **********/
	appId:'55',
	
	teams : {"1":{"name":"Cardinals","abbr":"ARI","city":"Arizona","teamId":"1"},"2":{"name":"Falcons","abbr":"ATL","city":"Atlanta","teamId":"2"},"3":{"name":"Ravens","abbr":"BAL","city":"Baltimore","teamId":"3"},"4":{"name":"Bills","abbr":"BUF","city":"Buffalo","teamId":"4"},"5":{"name":"Panthers","abbr":"CAR","city":"Carolina","teamId":"5"},"6":{"name":"Bears","abbr":"CHI","city":"Chicago","teamId":"6"},"7":{"name":"Bengals","abbr":"CIN","city":"Cincinati","teamId":"7"},"8":{"name":"Browns","abbr":"CLE","city":"Cleveland","teamId":"8"},"9":{"name":"Cowboys","abbr":"DAL","city":"Dallas","teamId":"9"},"10":{"name":"Broncos","abbr":"DEN","city":"Denver","teamId":"10"},"11":{"name":"Lions","abbr":"DET","city":"Detroit","teamId":"11"},"12":{"name":"Packers","abbr":"GB","city":"Green Bay","teamId":"12"},"13":{"name":"Texans","abbr":"HOU","city":"Houston","teamId":"13"},"14":{"name":"Colts","abbr":"IND","city":"Indianapolis","teamId":"14"},"15":{"name":"Jaguars","abbr":"JAC","city":"Jacksonville","teamId":"15"},"16":{"name":"Chiefs","abbr":"KC","city":"Kansas City","teamId":"16"},"17":{"name":"Dolphins","abbr":"MIA","city":"Miami","teamId":"17"},"18":{"name":"Vikings","abbr":"MIN","city":"Minnesota","teamId":"18"},"19":{"name":"Patriots","abbr":"NE","city":"New England","teamId":"19"},"20":{"name":"Saints","abbr":"NO","city":"New Orleans","teamId":"20"},"21":{"name":"Giants","abbr":"NYG","city":"New York","teamId":"21"},"22":{"name":"Jets","abbr":"NYJ","city":"New York","teamId":"22"},"23":{"name":"Raiders","abbr":"OAK","city":"Oakland","teamId":"23"},"24":{"name":"Eagles","abbr":"PHI","city":"Philadelphia","teamId":"24"},"25":{"name":"Steelers","abbr":"PIT","city":"Pittsburg","teamId":"25"},"26":{"name":"Chargers","abbr":"SD","city":"San Diego","teamId":"26"},"27":{"name":"49ers","abbr":"SF","city":"San Fransisco","teamId":"27"},"28":{"name":"Seahawks","abbr":"SEA","city":"Seattle","teamId":"28"},"29":{"name":"Rams","abbr":"STL","city":"St. Louis","teamId":"29"},"30":{"name":"Buccaneers","abbr":"TB","city":"Tampa Bay","teamId":"30"},"31":{"name":"Titans","abbr":"TEN","city":"Tennessee","teamId":"31"},"32":{"name":"Redskins","abbr":"WAS","city":"Washington","teamId":"32"}},
  
  initialize : function() {
    console.log("initialize");
    SRC.Loading.update({"type":"load","action":"end"});
    
     SRC.Grid.setRefresh();
    
  },
  
  setRefresh : function() {
    console.log("setting refresh for "+SRC.Grid.refreshRate+" miliseconds");
    setTimeout("SRC.Grid.updatePicks()",SRC.Grid.refreshRate);
  },
  menuChoice: function(choice){
			switch(choice){
			case "openApp":
				SRC.Navigation.openTab({name: 'Grid', src: SRC.BASE_URI +"view/grid/grid.html", title: 'Grid'});
				break;
			}
		},
  changeWeek : function(week) {
    SRC.Grid.DOCUMENT.find("body").gs_loadingMini("start", {text: "Loading Week "+week});
    SRC.Home.DOCUMENT.find("#frame-grid").attr("src",SRC.BASE_URI+"view/grid/grid.html?week="+week);
  }, 
  updatePicks : function() {
    
    // Make sure we are still on the current page
    if(SRC.Grid.currentWeek == SRC.Grid.selectedWeek) {
      
      // Run changeWeek to the current week to refresh
      SRC.Grid.changeWeek(SRC.Grid.currentWeek);
     
      // Set the refresh timer
      SRC.Grid.setRefresh();
    }
    
    
  }
}
$(document).ready(function() {SRC.Grid.initialize();});