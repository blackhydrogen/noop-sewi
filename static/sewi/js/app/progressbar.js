var sewi = sewi || {};

// Progress Bar
sewi.ProgressBar = function(){
    var selfRef = this;
    selfRef.dom = $('<div class="progress"><div class="progress-bar" role="progressbar"></div><div class="progress-bar-text"></div></div>');
}

sewi.ProgressBar.prototype.update = function(percent){
    var selfRef = this;
    var methodName = 'sewi.ProgressBar.prototype.update';
    if(_.isNumber(percent) == false){
        console.error(methodName + ': parameter is not a number');
    } else if(percent > 100 || percent < 0){
        console.error(methodName + ': parameter is out of range');
    } else {
        selfRef.dom.children('.progress-bar').css('width', percent+'%');
    }  
}

sewi.ProgressBar.prototype.setText = function(string){
    var selfRef = this;
    selfRef.dom.children('.progress-bar-text').text(string);
}

sewi.ProgressBar.prototype.getDOM = function(){
    var selfRef = this;
    return selfRef.dom;
}
