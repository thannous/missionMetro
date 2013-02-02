
define(['jquery','underscore', 'Backbone', 'text!templates/home/EndView.html'],
    function ($, _, Backbone, EndViewTemplate) {

        var EndView = Backbone.View.extend({

            events:{
                'click #btnBack':'btnBack_clickHandler'
            },
            initialize: function(){


            },
            render:function () {
                this.$el.html(_.template(EndViewTemplate));

                return this;

            },


            btnBack_clickHandler:function (event) {
                $.mobile.jqmNavigator.popView();
            }

        });

        return EndView;
    });
