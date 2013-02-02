 $( '#howitworks' ).live( 'pageshow',function(event){
			    $('.flexslider').flexslider({
				    animationLoop: false,
				    directionNav: true, 
				    slideshow: false,
				    animation: "slide"
			    });
			    
			    if($('.sliderNext').hasClass('sliderNext')){
				    $('.flexslider').flexslider(0)
			    }else{
				    $('.flex-control-nav').after('<div style="text-align:center;"><a class="sliderNext"></a></div>');
			    }
			    
			    $('.sliderNext').click(function(){
			    	$('.flexslider').flexslider("next"); //Go to next slide
			    })

})
			//$('#slider').flexslider("prev") //Go to previous slide
