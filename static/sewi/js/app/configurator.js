var sewi = sewi || {};

(function() {
    sewi.Configurator = function(options) {
        // Safeguard if function is called without `new` keyword
        if (!(this instanceof sewi.Configurator))
            return new sewi.Configurator(options);

        var selfRef = this;
        var defaults = {
            animated: true,
            isBasicInfoMinimized: false,
            isResourceViewerHidden: true,
            title: 'Loading',
            subtitle: 'Please wait'
        };

        options = options || {};
        _.defaults(options, defaults);
        _.assign(selfRef, _.pick(options, [
            'animated',
            'isBasicInfoMinimized',
            'isResourceViewerHidden',
            'titleView',
            'basicInfoView',
            'resViewerView',
            'resGalleryView'
        ]));

        validateArguments.call(selfRef);
        initTitle.call(selfRef, options);
        initBasicInfo.call(selfRef);
        initResViewer.call(selfRef);
        initResGallery.call(selfRef);

        return this;
    }

    // Configurator private methods
    function validateArguments() {
        var selfRef = this;

        selfRef.titleView = $(selfRef.titleView);
        selfRef.basicInfoView = $(selfRef.basicInfoView);
        selfRef.resViewerView = $(selfRef.resViewerView);
        selfRef.resGalleryView = $(selfRef.resGalleryView);

        if (selfRef.titleView.length != 1) {
            throw new Error('options: One titleView selector/element must be provided.')
        }
        if (selfRef.basicInfoView.length != 1) {
            throw new Error('options: One basicInfoView selector/element must be provided.')
        }
        if (selfRef.resViewerView.length != 1) {
            throw new Error('options: One resViewerView selector/element must be provided.')
        }
        if (selfRef.resGalleryView.length != 1) {
            throw new Error('options: One resGalleryView selector/element must be provided.')
        }
    }

    function initTitle(options) {
        var selfRef = this;

        selfRef.titleDOM = $('<h1>');
        selfRef.subtitleDOM = $('<small>');
        selfRef.titleView.append(selfRef.titleDOM);

        selfRef.setTitle(options.title, options.subtitle);
    }

    function initBasicInfo() {
        var selfRef = this;

        if (_.isFunction(sewi.BasicEncounterInfoViewer)) {
            selfRef.basicInfo = new sewi.BasicEncounterInfoViewer();
            var element = selfRef.basicInfo.getDOM();

            selfRef.basicInfoView.append(element);
        }

        var minimizeElement = $('<div class="minimize-button">&lt;&lt;</div>');
        selfRef.basicInfoView.append(minimizeElement);
        minimizeElement.click(function() {
            selfRef.isBasicInfoMinimized = !selfRef.isBasicInfoMinimized;
            updateViewSizes.call(selfRef);
        });
    }

    function initResViewer() {
        var selfRef = this;

        if (_.isFunction(sewi.TabContainer)) {
            selfRef.tabs = new sewi.TabContainer();
            var element = selfRef.tabs.getDOM();
            element.on("NoTabs", function() {
                selfRef.isResourceViewerHidden = true;
                updateViewSizes.call(selfRef);
            });
            selfRef.resViewerView.append(element);
        }
    }

    function initResGallery() {
        var selfRef = this;

        if (_.isFunction(sewi.ResourceGallery)) {
            selfRef.resGallery = new sewi.ResourceGallery();
            var element = selfRef.resGallery.getDOM();

            selfRef.resGalleryView.append(element);
        }
    }

    function openResource(galleryElement) {
        var selfRef = this;

        // TODO: Pass entire gallery element to tabs as jQuery object
    }

    function updateViewSizes() {
        var selfRef = this;

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

    function setEncounterTitle(id, name) {
        var selfRef = this;

        var title = name;
        var subtitle = "Encounter #" + id;
        selfRef.setTitle(title, subtitle);
    }

    // Configurator public methods
    sewi.Configurator.prototype.setTitle = function(title, subtitle) {
        var selfRef = this;

        selfRef.subtitleDOM.text(subtitle);
        selfRef.titleDOM.text(title + ' ')
                        .append(selfRef.subtitleDOM);
    }
})();
