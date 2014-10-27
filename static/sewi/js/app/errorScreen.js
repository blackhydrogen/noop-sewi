var sewi = sewi || {};
(function(){
    sewi.ErrorScreen = function(){
        if(!(this instanceof sewi.ErrorScreen))
            return new sewi.ErrorScreen();

        var selfRef = this;
        selfRef.dom = $('<div class="error-screen"><div class="error-text"></div></div>');
    }

    sewi.ErrorScreen.prototype.setText = function(string){
        var selfRef = this;
        selfRef.dom.children('.error-text').text(string);
    }

    sewi.ErrorScreen.prototype.getDOM = function(){
        var selfRef = this;
        return selfRef.dom;
    }

})();
