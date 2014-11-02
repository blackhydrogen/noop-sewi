var sewi = sewi || {};
(function(){
    sewi.ScrollBar = function(){
        sewi.ConfiguratorElement.call(this);
        this.position = 0;
        this.widthScale = 0;
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
        var barBoundingBox = this.bar[0].getBoundingClientRect();
        this.position = this.bar.position().left / (this.container.width() - this.bar.width());
        this.trigger('move');
    }

    sewi.ScrollBar.prototype.setWidthScale = function(percent){
        this.widthScale = percent;
        var width = percent * this.container.width();
        this.bar.width(width);
        if(this.bar.position().left + width > this.container.width()){
            this.bar.css({left : this.container.width() - width});
        }
    }
   
    sewi.ScrollBar.prototype.setPosition = function(position){ 
        var pos = position * this.container.width();
        var width = this.bar.width();
        this.position = position;

        this.bar.css({left : pos});

        if(this.bar.position().left + width > this.container.width()){
            this.bar.css({left : this.container.width() - width});
        }
    }

    sewi.ScrollBar.prototype.getPosition = function(){
        return this.position;
    }

    sewi.ScrollBar.prototype.resize = function(){
        var pos = this.position * this.container.width();
        var width = this.widthScale * this.container.width();
        this.bar.css({left : pos,
                      width: width});
    }

    sewi.ScrollBar.prototype.getDOM = function(){
        return this.container;
    }
})();
