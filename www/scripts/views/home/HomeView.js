define (['jquery', 'underscore', 'Backbone', 'views/map/MapView', 'views/home/StartView', 'views/home/EndView', 'moment', 'text!templates/home/HomeView.html', 'jqmDialog'],
	function ($, _, Backbone, MapView, StartView, EndView, moment, HomeViewTemplate) {
		console.log(localStorage.getItem("metroCoord"));
		var HomeView = Backbone.View.extend ({

			events: {
				'click #btnMapView': 'btnMapView_clickHandler',
				'click #nstart': 'start',
				'click #nend': 'end',
				'click #start_alarm': 'start_alarm'

			},
			render: function () {
				this.$el.html (_.template (HomeViewTemplate));
				var that = this;
				var options = {

					types: ['geocode'],
					componentRestrictions: {country: 'fr'}
				};
				watchID = navigator.geolocation.watchPosition (onSuccess, onError, options);
				function onSuccess (position) {
					var element = document.getElementById ('geolocation');
					that.config = {
						latitude: position.coords.latitude,
						longitude: position.coords.longitude,
						location: 'Paris, Ile de France, France'
					};//http://188.165.214.181:8080/metroServer/
					var station = $.ajax ("http://176.31.126.197:8080/metroserver/rest/ws/converting?lat1=" + that.config.latitude + "&lon1=" + that.config.longitude);
					station.success (function (msg) {
						;
						localStorage.removeItem ("startStation");
						localStorage.setItem ("startStation", msg)
						msg = JSON.parse (msg);
						$ ("#nstart").text (msg.name);
						$ ('.iStart').attr ('src', 'img/metro/M_' + msg.ligne + '.png');
						var endsStation = localStorage.getItem("endsStation")
						console.log(endsStation)
						if (endsStation) {
							console.log ("on à une station" + endsStation)
						} else {
							$ ('<div>').simpledialog2 ({
								mode: 'button',
								headerText: 'Bienvenue',
								headerClose: true,
								buttons: {
									'OK': {
										click: function () {
											that.end ();
										}
									}
								},
								buttonPrompt: "<p style='padding:14px'>Hey, maintenant vous ne raterez plus aucun metro, pour ça indiquez l'addresse d'arrivé de votre dernier metro et nous vous indiquerons l'heure du dernier metro et le parcours à prendre</p>"
							})
						}
						// 0h51 = 3060 sec - 13h12 = 720 + 468800 = 44 460 sec
						var trajet = localStorage.getItem('trajet');


						if (trajet) {
							var realTrajet = JSON.parse (trajet)
							var realTrajet = {
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

							var steps = realTrajet.steps

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
								console.log (steps[i].name + " " + steps[i].line + "");
							}

						}
					});
					station.done (function (jqXHR, textStatus) {
						console.log ("Request failed: " + textStatus);
					});
				}

				function onError (error) {
					alert ('code : ' + error.code + '\n' +
						'message : ' + error.message + '\n');
				}

				if (window.localStorage.getItem ('start')) {
					var p = window.localStorage.getItem ('start');
					var depart = JSON.parse (p);
					console.log (depart);
					var q = window.localStorage.getItem ('end');
					var arriver = JSON.parse (q);
					console.log (q);
					var numStationStart = JSON.parse (window.localStorage.getItem ('startStation'));
					var numStationEnd = JSON.parse (window.localStorage.getItem ('endStation'));
					if (depart && arriver) {
						$ ("#nstart").text (depart.name);
						$ ("#nend").text (arriver.name);
						$ ('.iStart').attr ('src', 'img/metro/M_' + numStationStart.ligne + '.png');
						if (numStationEnd)
							$ ('#Ends').attr ('src', 'img/metro/M_' + numStationEnd.ligne + '.png');
					}
				}
				return this;
			},
			btnMapView_clickHandler: function (event) {
				$.mobile.jqmNavigator.pushView (new MapView ());
			},
			start: function (event) {
				$.mobile.jqmNavigator.pushView (new StartView ());
			},
			end: function () {
				$.mobile.jqmNavigator.pushView (new EndView ());
			},
			start_alarm: function (event) {
				$ ('#counter').empty ();
				$ ('#counter').countdown ({
					stepTime: 1,
					format: 'mm:ss',
					startTime: "00:50",
					digitImages: 6,
					digitWidth: 53,
					digitHeight: 77,
					image: "img/digits.png"
				});
			}

		});
		formDialog = Backbone.View.extend ({
			events: {
				"click #completedbtn": "complete",
				"click #updatebtn": "update",
				"click #savebtn": "save",
				"click #closebtn": "close"
			},
			render: function () {
				var formString = this.template (this.model.toJSON ());
				$ (formString).dialog ({
					autoOpen: true,
					height: 460,
					width: 350,
					title: "Tasks",
					modal: true
				})
				this.el = $ (".dialogForm");
				this.delegateEvents (this.events)
				return this;
			},
			initialize: function () {
				_.bindAll (this, "render")
				this.template = _.template ($ ("#task_form_tpl").html ());
				this.render ().el;
			},
			complete: function () {
				console.log ("test")
			},
			update: function () {
				console.log ("test")
			},
			save: function () {
				console.log ("test")
			},
			close: function () {
				console.log ("test")
			}
		});
		return HomeView;
	});