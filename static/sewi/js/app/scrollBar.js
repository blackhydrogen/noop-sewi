var sewi = sewi || {};
(function(){
    sewi.ScrollBar = function(){
        sewi.ConfiguratorElement.call(this);
        this.container = $('<div class="slider-container"></div>');
        this.bar = $('<div class="slider-bar"></div>');
        this.container.append(this.bar);
        this.bar.draggable({ axis : 'x',
                        containment : 'parent',
                        scope : 'null',
                        drag : onDrag.bind(this)
                    });
    }
    
    sewi.inherits(sewi.ScrollBar, sewi.ConfiguratorElement);

    function onDrag(event, ui){
        var boundingBox = this.bar[0].getBoundingClientRect();
        this.trigger('drag');
    }

    sewi.ScrollBar.prototype.setWidthScale = function(percent){
        var width = percent * this.container.width();
        var barBoundingBox = this.bar[0].getBoundingClientRect();
        this.bar.width(width);
        if(barBoundingBox.left + width > this.container.width()){
            this.bar.css({left : this.container.width() - width});
        }
    }
   
    sewi.ScrollBar.prototype.setLeft = function(position){ 
        var barBoundingBox = this.bar[0].getBoundingClientRect();
        var pos = position * this.container.width();
        this.bar.css({left : pos});

        if(barBoundingBox.left + this.bar.width() > this.container.width()){
            this.bar.css({left : this.container.width() - width});
        }
    }

    sewi.ScrollBar.prototype.getDOM = function(){
        return this.container;
    }
})();
