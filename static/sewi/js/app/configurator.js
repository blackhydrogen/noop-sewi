var sewi = sewi || {};
sewi.Configurator = function(options) {
    // Safeguard if function is called without `new` keyword
    if (!(this instanceof sewi.Configurator))
        return new sewi.Configurator(options);

    var selfRef = this;
    var defaults = {
        animated: true,
        isBasicInfoMinimized: false,
        isResourceViewerHidden: true
    };

    options = options || {};
    _.assign(selfRef, defaults, options);

    validateArguments();
    initBasicInfo();
    initResViewer();
    initResGallery();

    return this;

    function validateArguments() {
        selfRef.basicInfoView = $(selfRef.basicInfoView);
        selfRef.resViewerView = $(selfRef.resViewerView);
        selfRef.resGalleryView = $(selfRef.resGalleryView);

        if (selfRef.basicInfoView.length != 1) {
            throw new Error('options: One beiView selector/element must be provided.')
        }
        if (selfRef.resViewerView.length != 1) {
            throw new Error('options: One mainView selector/element must be provided.')
        }
        if (selfRef.resGalleryView.length != 1) {
            throw new Error('options: One resView selector/element must be provided.')
        }
    }

    function initBasicInfo() {
        // TODO
    }

    function initResViewer() {
        selfRef.tabs = new sewi.TabContainer();
        var element = selfRef.tabs.getDOM();
        element.on("NoTabs", function() {
            selfRef.isResourceViewerHidden = true;
            updateViewSizes();
        });
        selfRef.resViewerView.append(element);
    }

    function initResGallery() {
        // TODO
    }

    function openResource(galleryElement) {
        // TODO: Pass entire gallery element to tabs as jQuery object
    }

    function updateViewSizes() {
        var totalWidth = 12;
        var basicInfoWidth = 3;
        var minBasicInfoWidth = 1;
        var resGalleryWidth = 1;
        var resViewerWidth = 8;

        selfRef.basicInfoView
            .add(selfRef.resViewerView)
            .add(selfRef.resGalleryView)
            .removeClass(function(index, cssClass) {
                return ( cssClass.match(/(^|\s)col-sm-\S+/g) || [] ).join(' ');
            });

        if (selfRef.isBasicInfoMinimized) {
            resViewerWidth += basicInfoWidth - minBasicInfoWidth;
            selfRef.basicInfoView
                   .addClass('col-sm-' + minBasicInfoWidth);
        } else {
            selfRef.basicInfoView
                   .addClass('col-sm-' + basicInfoWidth);
        }
        if (selfRef.isResourceViewerHidden) {
            resGalleryWidth += resViewerWidth;
            resViewerWidth = 0;
        }
        selfRef.resViewerView
               .addClass('col-sm-' + resViewerWidth);
        selfRef.resGalleryView
               .addClass('col-sm-' + resGalleryWidth);
    }

}
