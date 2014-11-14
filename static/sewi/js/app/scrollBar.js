// Created by: Le Beier
var sewi = sewi || {};
(function(){
    /**
     * This creates a scroll bar object.
     *
     * @constructor
     * @class  sewi.ScrollBar
     * @extends sewi.ConfiguratorElement
     */
    sewi.ScrollBar = function(){
        sewi.ConfiguratorElement.call(this);
        this.position = 0;
        this.widthScale = 0;
        this.minWidthScale = 0.1;
        this.container = $(sewi.constants.SCROLL_BAR_CONTAINER_DOM);
        this.bar = $(sewi.constants.SCROLL_BAR_BAR_DOM);
        this.container.append(this.bar);
        this.bar.draggable({ axis : 'x',
                        containment : 'parent',
                        scope : 'null',
                        drag : onDrag.bind(this)
                    });
    }
    
    /**
     * Fires when the scroll bar is moved
     * @event move
     * @memberOf  sewi.ScrollBar
     */

    sewi.inherits(sewi.ScrollBar, sewi.ConfiguratorElement);

    function onDrag(event, ui){
        if(this.container.width() !== this.bar.width()){
            this.position = this.bar.position().left / (this.container.width() - this.bar.width());
        }
        this.trigger('move');
    }

    /**
     * Sets the scale of scroll bar relative to the total length.
     * @param {float} percent This value has to be between 0.0 to 1.0.
     */
    sewi.ScrollBar.prototype.setWidthScale = function(percent){
        this.widthScale = percent;
        var width = (percent > this.minWidthScale ? percent : this.minWidthScale) * this.container.width();
        this.bar.width(width);
    }
   
    /**
     * Sets the relative position of the scroll bar.
     * @param {float} position This value has to be between 0.0 to 1.0.  
     */
    sewi.ScrollBar.prototype.setPosition = function(position){ 
        var pos = position * (this.container.width() - this.bar.width());
        var width = this.bar.width();
        this.position = position;
        this.bar.css({left : pos}); 
        
        if(this.bar.position().left + width > this.container.width()){
            this.bar.css({left : this.container.width() - width});
        }
    }

    /**
     * Returns the relative position of the scroll bar.
     * @return {float} The position returned is between 0.0 to 1.0
     */
    sewi.ScrollBar.prototype.getPosition = function(){
        return this.position;
    }

    // This function is inherited from the parent class
    sewi.ScrollBar.prototype.resize = function(){
        var pos = this.position * this.container.width();
        var width = this.widthScale * this.container.width();
        this.bar.css({left : pos,
                      width: width});
    }

    // This function is inherited from the parent class
    sewi.ScrollBar.prototype.getDOM = function(){
        return this.container;
    }
    
})();
