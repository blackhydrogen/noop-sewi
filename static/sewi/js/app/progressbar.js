var sewi = sewi || {};

// Progress Bar
sewi.ProgressBar = function(animated){
    var selfRef = this;
    var progressBar = $('<div class="progress-bar" role="progressbar"></div>');
    var text = ('<div class="progress-bar-text"></div>');

    if(animated){
        progressBar.addClass('progress-bar-striped');
        progressBar.addClass('active');
    }
    selfRef.dom = $('<div class="progress"></div>');
    selfRef.dom.append(progressBar);
    selfRef.dom.append(text);
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
