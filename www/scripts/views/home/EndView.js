define (['jquery', 'underscore', 'Backbone', 'text!templates/home/EndView.html'],
	function ($, _, Backbone, EndViewTemplate) {
		var EndView = Backbone.View.extend ({

			events: {
				'click #btnBack': 'btnBack_clickHandler',
				'click #validation': 'validation'
			},
			initialize: function () {
			},
			render: function () {
				this.$el.html (_.template (EndViewTemplate));
				var mapOptions = {
					zoom: 13,
					center: new google.maps.LatLng (48.859928996014624, 2.341121196746826),
					mapTypeId: google.maps.MapTypeId.ROADMAP
				}
				var list;
				var map = new google.maps.Map (document.getElementById ("map_canvas"), mapOptions);
				var latlngParis = new google.maps.LatLng (48.859928996014624, 2.341121196746826);
				var options = {

					types: ['geocode'],
					componentRestrictions: {country: 'fr'},
					location: latlngParis,
					radius: '10000'
				};
				var request = {
					location: latlngParis,
					radius: '10000',
					types: ['subway_station']
				};
				service = new google.maps.places.PlacesService (map);
				service.nearbySearch (request, callback);
				function callback (results, status) {
					if (status == google.maps.places.PlacesServiceStatus.OK) {
						for (var i = 0; i < results.length; i++) {
							var place = results[i];
							list += "  <li  data-section='Widgets' data-filtertext=" + place.name + "><a href='#'>" + place.name + "</a></li>"
						}
						// $("#jqm-metro").html(  "<ul data-role='listview' data-inset='true' data-autodividers='true' id='listMetro' class='jqm-list'>"+ list +"</ul>")
					}
				}


				var head = $ (".ui-page-active [data-role='header']"),
					foot = $ (".ui-page-active [data-role='footer']"),
					headerheight = head.outerHeight ();
				$.mobile.window.on ("throttledresize", function () {
					$ ("#sorter").height ($.mobile.window.height () - headerheight - 20).css ("top", headerheight + 18);
				});
				$ ("#sorter").height ($.mobile.window.height () - headerheight - 20).css ("top", headerheight + 18);
				$.mobile.window.scroll (function (e) {
					var headTop = $ (window).scrollTop ();
					if (headTop < headerheight && headTop > 0) {
						$ ("#sorter").css ({
							"top": headerheight + 15 - headTop,
							"height": $.mobile.window.height () - headerheight - 20
						});
					} else if (headTop >= headerheight && headTop > 0 && parseInt (headTop + $.mobile.window.height ()) < parseInt (foot.offset ().top)) {
						$ ("#sorter").css ({
							"top": "15px",
							"height": $.mobile.window.height ()
						});
						$ ("#sorter li").height ("3.7%");
					} else if (parseInt (headTop + $.mobile.window.height ()) >= parseInt (foot.offset ().top) && parseInt (headTop + $.mobile.window.height ()) <= parseInt (foot.offset ().top) + foot.height ()) {
						$ ("#sorter").css ({
							"top": "15px",
							"height": $.mobile.window.height () - ( parseInt (headTop + $.mobile.window.height ()) - parseInt (foot.offset ().top) + 8 )
						});
					} else if (parseInt (headTop + $.mobile.window.height ()) >= parseInt (foot.offset ().top)) {
						$ ("#sorter").css ({
							"top": "15px"
						});
					} else {
						$ ("#sorter").css ("top", headerheight + 15);
					}
				});
				$ ("#sorter li").click (function () {
					console.log ("je click")
					var top,
						letter = $ (this).text (),
						divider = $ ("#sortedList").find ("li.ui-li-divider:contains(" + letter + ")");
					console.log (divider.length)
					if (divider.length > 0) {
						top = divider.offset ().top;
						console.log (top)
						$.mobile.silentScroll (top);
					} else {
						return false;
					}
				});
				console.log ("sorter")
				$ ("#sorter li").hover (function () {
					$ (this).addClass ("ui-btn-up-b").removeClass ("ui-btn-up-c");
				}, function () {
					$ (this).removeClass ("ui-btn-up-b").addClass ("ui-btn-up-c");
				});
				var autocomplete = new google.maps.places.Autocomplete (document.getElementById ('input_adresse_end'), options);
				$ ("input[name$='searchOption']").click (function () {
					var radio = $ (this).val ();
					if (radio == 'station') {
						$ ("#formMetro").show ();
						$ ("#formAdresse").hide ();
						$ ("#formHistorique").hide ();
					}
					else if (radio == 'adresse') {
						$ ("#formMetro").hide ();
						$ ("#formAdresse").show ();
						$ ("#formHistorique").hide ();
					}
					else if (radio == 'historique') {
						$ ("#formMetro").hide ();
						$ ("#formAdresse").hide ();
						$ ("#formHistorique").show ();
					}
				});
				google.maps.event.addListener (autocomplete, 'place_changed', function () {
					place = autocomplete.getPlace ();
					//var detail =  $.ajax("http://192.168.2.70:8080/MetroServer/trajet?lata=48.84327&lona=2.3324&latb=48.80234&lonb=2.51432432");
					//console.log(detail);
					var lat = place.geometry.location.lat ();
					var lng = place.geometry.location.lng ();
					$ ("#gogo").text ("1");
					//$("#start_alarm").css("background-color", "red");
					var requeteStation = $.ajax ("http://176.31.126.197:8080/metroserver/rest/ws/converting?lat1=" + lat + "&lon1=" + lng);
					requeteStation.done (function (msg) {
						var test = JSON.parse (msg);
						var trajet;
						var trajetLigne = [];
						var numStationStart;
						var numStationEnd;
						localStorage.removeItem ("endStation");
						localStorage.setItem ("endStation", msg);
						numStationStart = JSON.parse (localStorage.getItem ('startStation'));
						numStationEnd = JSON.parse (localStorage.getItem ('endStation'));
						console.log (test)
						//$('#Ends').attr('src','img/metro/M_'+ test.ligne +'.png');
						console.log ("numero de la station de debut: " + numStationStart);
						console.log ("numero de la station de fin: " + numStationEnd);
						 var trajet = $.ajax("http://176.31.126.197:8080/metroserver/rest/ws/routing?lat1="+ numStationStart.loc.lat +"&lon1="+ numStationStart.loc.lon+"&lat2=" + lat +"&lon2="+ lng)
						var requeteTrajet = $.ajax ("http://176.31.126.197:8080/metroserver/rest/ws/converting?lat1=" + lat + "&lon1=" + lng);
						requeteTrajet.success (function (msg) {
							//trajet = JSON.parse(msg)
							trajet = {
								"duration": 2580,
								"steps": [
									{
										"time": "00:29",
										"direction": "PARIS",
										"name": "GARE DE IVRY, ivry",
										"line": [
											"RER",
											"C"
										],
										"type": "departure"
									},
									{
										"time": "00:40",
										"name": "GARE DU NORD RER, Paris",
										"wait": 240,
										"type": "step",
										"walk": 180
									},
									{
										"time": "00:47",
										"direction": "HAUSSMANN ST LAZARE",
										"name": "MAGENTA, Paris",
										"line": [
											"RER",
											"E"
										],
										"type": "step"
									},
									{
										"time": "00:51",
										"name": "HAUSSMANN ST LAZARE, Paris",
										"wait": 180,
										"type": "step",
										"walk": 240
									},
									{
										"time": "00:58",
										"direction": "ST DENIS UNIVERSITE",
										"name": "Saint-Lazare, Paris",
										"line": [
											"Metro",
											"13"
										],
										"type": "step"
									},
									{
										"time": "01:08",
										"name": "Mairie de Saint-Ouen",
										"wait": null,
										"type": "step",
										"walk": 240
									},
									{
										"time": "01:12",
										"direction": null,
										"name": "College Jean Jaures, Saint-Ouen",
										"line": null,
										"type": "arrival"
									}
								],
								"type": "Trajet arrivée au plus tôt"
							}
							console.log (trajet)
							localStorage.setItem ("trajet", JSON.stringify (trajet));
							/***********************
							 Calcul du trajet en metro
							 ************************/
							if (trajet) {
								var steps = trajet.steps
								var realTime;
								for (var i = 0; i < steps.length; i++) {
									if (steps[i].type == "departure") {
										var timeDepart = (moment (steps[i].time, "HH:mm"))
										var timeDepartS = timeDepart.hours () * 3600 + timeDepart.minutes () * 60
										var timeNowS = ((moment ().hours ()) * 3600 + (moment ().minutes ()) * 60)
										if (timeNowS - timeDepartS > 0) {
											realTime = (24 * 3600) - timeNowS - timeDepartS
										} else
											realTime = timeDepartS - timeNowS;
										var secondes = "00"
										var minutes = (realTime / 60) % 60
										var heures = Math.floor (realTime / 3600)
										if (heures < 10)
											heures = "0" + heures
										console.log (realTime)
										console.log (heures + ":" + minutes + ":" + secondes)
										$ ('#counter').countdown ({
											stepTime: 60,
											format: 'hh:mm:ss',
											startTime: heures + ":" + minutes + ":" + secondes,
											digitImages: 6,
											digitWidth: 30,
											digitHeight: 64,
											image: "img/digits.png"
										});
									}
									if (steps[i].type == "arrival") {
										$ ("#nend").text (steps[i].name);
									}
									if (steps[i].line) {
										trajetLigne.push (steps[i])
									}
									console.log (steps[i].name + " " + steps[i].line + "");
								}
								/***********************
								 Calcul du trajet en metro
								 ************************/
								console.log (trajetLigne)
								localStorage.setItem ("startStation", JSON.stringify (trajetLigne[0].toString ()))
								localStorage.setItem ("endsStation", JSON.stringify (trajetLigne[trajetLigne.length - 1].toString ()))
								if (place.geometry.viewport) {
									map.fitBounds (place.geometry.viewport);
								} else {
									map.setCenter (place.geometry.location);
									var mark = new google.maps.Marker ({
										position: place.geometry.location,
										map: map,
										title: "depart",
										animation: google.maps.Animation.DROP
									});
									var infowindow = new google.maps.InfoWindow ();
									infowindow.setContent (place.name);
									infowindow.open (map, mark);
									var bounds = new google.maps.LatLngBounds ();
									bounds.extend (place.geometry.location);
									map.fitBounds (bounds);
								}
								$.mobile.jqmNavigator.popView ();
							}
						})
					});
					requeteStation.fail (function (jqXHR, textStatus) {
						alert ("Request failed: " + textStatus);
					});
				});
				console.log ("hello");
				/*var options = { maximumAge: 3000, enableHighAccuracy: true }
				 watchID = navigator.geolocation.watchPosition(onSuccess, onError, options);
				 function onSuccess(position) {
				 var element = document.getElementById('geolocation');

				 this.config = {
				 latitude  : position.coords.latitude,
				 longitude : position.coords.longitude,
				 location  : 'Paris, Ile de France, France'
				 };

				 var latlng = new google.maps.LatLng(this.config.latitude, this.config.longitude);
				 var mark = new google.maps.Marker({
				 position: latlng,
				 map:      map,
				 title:    this.config.location,
				 animation: google.maps.Animation.DROP
				 });
				 console.log("hello2");
				 google.maps.event.addListener(autocomplete, 'place_changed', function() {
				 place = autocomplete.getPlace();

				 //var detail =  $.ajax("http://192.168.2.70:8080/MetroServer/trajet?lata=48.84327&lona=2.3324&latb=48.80234&lonb=2.51432432");
				 //console.log(detail);
				 var lat = place.geometry.location.Ya;
				 var lng = place.geometry.location.Za;
				 $("#gogo").text("1");
				 $("#start_alarm").css("background-color", "red");
				 var station = $.ajax("http://192.168.2.70:8080/MetroServer/station?lat="+lat+"&lon="+lng );
				 station.done(function(msg) {
				 test = JSON.parse(msg);
				 var station1 = JSON.stringify(msg);

				 $('#Ends').attr('src','img/metro/M_'+ test.ligne +'.png');

				 localStorage.removeItem("endStation");
				 localStorage.setItem("endStation", station1);
				 console.log( station1);
				 console.log("$$$$$$$$$$$$$$$$$$$$$$$")
				 console.log(msg);
				 var numStationStart = JSON.parse(localStorage.getItem('startStation'));
				 console.log(numStationStart);
				 var numStationEnd = (localStorage.getItem('endStation'));
				 console.log(numStationEnd.ligne);
				 console.log("$$$$$$$$$$$$$$$$$$$$$$$")
				 var detail =  $.ajax("http://192.168.2.70:8080/MetroServer/trajet?lata=48.868797683&lona=2.3412326833&latb=48.77974803+&lonb=2.45914426746");
				 console.log(detail);
				 });
				 station.fail(function(jqXHR, textStatus) {
				 alert( "Request failed: " + textStatus );
				 });

				 $("#nend").text(place.name);
				 if (place.geometry.viewport) {
				 map.fitBounds(place.geometry.viewport);
				 } else {
				 map.setCenter(place.geometry.location);

				 var mark = new google.maps.Marker({
				 position: place.geometry.location,
				 map:      map,
				 title:    "depart",
				 animation: google.maps.Animation.DROP
				 });

				 var infowindow = new google.maps.InfoWindow();

				 infowindow.setContent(place.name);
				 infowindow.open(map, mark);

				 var bounds = new google.maps.LatLngBounds();

				 bounds.extend(place.geometry.location);
				 bounds.extend(latlng);
				 map.fitBounds(bounds);
				 $("#nend").text(place.name);

				 }
				 });


				 }

				 function onError(error) {
				 alert('code : '    + error.code    + '\n' +
				 'message : ' + error.message + '\n');
				 }*/
				return this;
			},
			btnBack_clickHandler: function (event) {
				$.mobile.jqmNavigator.popView ();
			},
			validation: function (event) {
				$.mobile.jqmNavigator.popView ();
			}


		});
		return EndView;
	});
