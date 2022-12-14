/**
 * Author: Customized by Lincoln Mahmud
 * Project: lMCarousel
 * Version: 1.0.0
 **/
 var _timer;
(function (factory) {factory(jQuery); })(function($){
    $.fn.lMCarousel = function(options){
        var _defaults = {
            width : 970,                
            height: 90,          
            slides : [],                    
            slideLayout : 'fill',           
            perspective: 3000,                  
            animation: 'slide3D',           
            animationCurve: 'ease',         
            animationDuration: 1000, 
            animationInterval: 3000,     
            autoplay: true,                 
            controls: true,                 
            slideClass: 'slide',
            navigation: 'circles',          
            rotationDirection: 'rtl',
            onSlideShow: function(){}
        }
        
        var _settings = $.extend( true, {}, _defaults, options );
        var _container = this;
        var _width = _settings.width;
        var _height = _settings.height;
        var _aspectRatio = _settings.width/_settings.height;
        var _lMCarouselDiv = $( "<div class='lMCarousel' />" )
                                .css({ width: '100%', height: '100%', transition:'transform '+_settings.animationDuration+'ms '+_settings.animationCurve, 'transformStyle': 'preserve-3d' })
                                .appendTo(_container);
        var _currentSlideIndex = 0;
        var _animations = new Animations();
        var _timeOutTimer;
        var _videoSlide;
        var _baseAngle;
        var _rotationAngle = 0;
        var _translateZ;
        var _perspective;
        var _transform;
        var _noOfSlides = _settings.slides.length || _container.find('.'+_settings.slideClass).length;
        
        (function setup(){
            createlMCarousel();
            if(_settings.autoplay){ _playlMCarousel();}
            
            function createlMCarousel(){
                if(_settings.animation.indexOf('slide')!=-1){
                    _translateZ = (_width/2) / Math.tan(Math.PI/_noOfSlides);
                    _perspective = (_width/2) * Math.tan(2*Math.PI/_noOfSlides)+'px';
                }
                _baseAngle = 360 / _noOfSlides;

                _container.find('.'+_settings.slideClass).each(function(i){
                    var slide = $(this).attr('data-index', i);
                    if(_settings.animation.indexOf('slide')!=-1){
                        _transform = 'rotateY('+_baseAngle*i+'deg) translateZ('+_translateZ+'px)';
                    }
                    slide = slide.css({ transform: _transform }).detach();
                    _lMCarouselDiv.append(slide);
                });
                
                _lMCarouselDiv.find('.'+_settings.slideClass).css({position: 'absolute', left: 0, top:0, width:'100%', height:'100%', backfaceVisibility: 'hidden'})
                                .find('img').css({ width:'100%', height:'100%', objectFit:_settings.slideLayout });
                _perspective = _settings.perspective || _perspective;
                _container.css({ perspective: _perspective, width: _width+'px', height: _height+'px', position: "relative", overflow: 'visible'});
            }
            
        })();
        
        function _playlMCarousel(){
            _videoSlide = _getCurrentSlide()[0].querySelector('video');
            if(_videoSlide){            
                _videoSlide.currentTime=0;
                _videoSlide.play();
                _videoSlide.addEventListener('ended', _playlMCarousel);
            }
        }    
        function _getCurrentSlide(){
            return _lMCarouselDiv.find('.'+_settings.slideClass).eq(_currentSlideIndex % _noOfSlides);
        }
        function Animations(){ this.animations = {slide3D : _slide3D} }
        Animations.prototype.run = function run(animation, targetSlideIndex){
                this.animations[animation](targetSlideIndex);
        }
        function _slide3D(targetSlideIndex){
            _container.css({ perspective: _perspective, overflow: 'visible' });
            _rotationAngle = _baseAngle * targetSlideIndex;
            _lMCarouselDiv.css({ transform: 'translateZ('+-_translateZ+'px) rotateY('+-_rotationAngle+'deg)' });
        }
        function _slideCarouseld(){
            _currentSlideIndex = Math.round(_rotationAngle/_baseAngle);
        }
        return this;
    }
});