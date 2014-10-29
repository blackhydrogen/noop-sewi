var sewi = sewi || {};

(function() {
    sewi.Configurator = function(options) {
        // Safeguard if function is called without `new` keyword
        if (!(this instanceof sewi.Configurator))
            return new sewi.Configurator(options);

        var defaults = {
            isBasicInfoMinimized: false,
            isResourceViewerHidden: true,
            title: 'Loading',
            subtitle: 'Please wait'
        };

        options = options || {};
        _.defaults(options, defaults);
        _.assign(this, _.pick(options, [
            'isBasicInfoMinimized',
            'isResourceViewerHidden',
            'titleView',
            'basicInfoView',
            'resViewerView',
            'resGalleryView',
            'alertsView'
        ]));

        validateArguments.call(this);
        initTitle.call(this, options);
        initBasicInfo.call(this);
        initResViewer.call(this);
        initResGallery.call(this);
        initResizeTracking.call(this);

        return this;
    }

    // Configurator private methods
    function validateArguments() {

        this.titleView = $(this.titleView);
        this.basicInfoView = $(this.basicInfoView);
        this.resViewerView = $(this.resViewerView);
        this.resGalleryView = $(this.resGalleryView);
        this.alertsView = $(this.alertsView);

        if (this.titleView.length != 1) {
            throw new Error('options: One titleView selector/element must be provided.')
        }
        if (this.basicInfoView.length != 1) {
            throw new Error('options: One basicInfoView selector/element must be provided.')
        }
        if (this.resViewerView.length != 1) {
            throw new Error('options: One resViewerView selector/element must be provided.')
        }
        if (this.resGalleryView.length != 1) {
            throw new Error('options: One resGalleryView selector/element must be provided.')
        }
        if (this.alertsView.length != 1) {
            throw new Error('options: One alertsView selector/element must be provided.')
        }
    }

    function initTitle(options) {

        this.titleDOM = $('<h1>');
        this.subtitleDOM = $('<small>');
        this.titleView.append(this.titleDOM);

        this.setTitle(options.title, options.subtitle);
    }

    function initBasicInfo() {

        if (_.isFunction(sewi.BasicEncounterInfoViewer)) {
            this.basicInfo = new sewi.BasicEncounterInfoViewer();
            var element = this.basicInfo.getDOM();

            element.on('BEILoaded', basicInfoLoaded.bind(this));
            element.on('Error', basicInfoCrashed.bind(this));

            this.basicInfoView.append(element);

            this.basicInfo.load();
        }

        var minimizeElement = $('<div class="minimize-button">&lt;&lt;</div>');
        this.basicInfoView.append(minimizeElement);
        minimizeElement.click(minimizeToggled.bind(this));
    }

    function initResViewer() {

        if (_.isFunction(sewi.TabContainer)) {
            this.tabs = new sewi.TabContainer();
            var element = this.tabs.getDOM();
            element.on("NoTabs", allTabsClosed.bind(this));
            element.on('Error', resViewerCrashed.bind(this));
            this.resViewerView.append(element);
        }
    }

    function initResGallery() {

        if (_.isFunction(sewi.ResourceGallery)) {
            this.resGallery = new sewi.ResourceGallery();
            var element = this.resGallery.getDOM();
            element.on('resourceClick', galleryOpenedResource.bind(this));
            element.on('Error', resGalleryCrashed.bind(this));

            this.resGalleryView.append(element);

            this.resGallery.load();
        }
    }

    function initResizeTracking() {
        var windowElement = $(window);

        this.basicInfoView.on('transitionend', this.basicInfo.resize.bind(this.basicInfo));
        this.resViewerView.on('transitionend', this.resViewer.resize.bind(this.resViewer));
        this.resGalleryView.on('transitionend', this.resGallery.resize.bind(this.resGallery));

        windowElement.on('resize', this.basicInfo.resize.bind(this.basicInfo));
        windowElement.on('resize', this.resViewer.resize.bind(this.resViewer));
        windowElement.on('resize', this.resGallery.resize.bind(this.resGallery));
    }

    function openResource(galleryElement) {

        this.isResourceViewerHidden = false;
        updateViewSizes.call(this);

        this.tabs.addObjectToNewTab(galleryElement);
    }

    function updateViewSizes() {

        var totalWidth = 12;
        var basicInfoWidth = 3;
        var minBasicInfoWidth = 1;
        var resGalleryWidth = 1;
        var resViewerWidth = 8;

        this.basicInfoView
            .add(this.resViewerView)
            .add(this.resGalleryView)
            .removeClass(function(index, cssClass) {
                return ( cssClass.match(/(^|\s)col-sm-\S+/g) || [] ).join(' ');
            });

        if (this.isBasicInfoMinimized) {
            resViewerWidth += basicInfoWidth - minBasicInfoWidth;
            this.basicInfoView
                   .addClass('col-sm-' + minBasicInfoWidth);
        } else {
            this.basicInfoView
                   .addClass('col-sm-' + basicInfoWidth);
        }
        if (this.isResourceViewerHidden) {
            resGalleryWidth += resViewerWidth;
            resViewerWidth = 0;
        }
        this.resViewerView
               .addClass('col-sm-' + resViewerWidth);
        this.resGalleryView
               .addClass('col-sm-' + resGalleryWidth);
    }

    function setEncounterTitle(id, name) {

        var title = name;
        var subtitle = "Encounter #" + id;
        this.setTitle(title, subtitle);
    }

    function createErrorScreen(errorMessage, reloadCallback) {

        var centralElement = $(sewi.constants.CONFIGURATOR_ERROR_SCREEN_RETRY_DOM);
        var messageElement = $(sewi.constants.CONFIGURATOR_ERROR_SCREEN_MESSAGE_DOM).text(errorMessage);
        var buttonElement = $(sewi.constants.CONFIGURATOR_ERROR_SCREEN_BUTTON_DOM);
        var backdropElement = $(sewi.constants.CONFIGURATOR_ERROR_SCREEN_BACKDROP_DOM).addClass(sewi.constants.ERROR_SCREEN_CLASS);

        backdropElement.append(centralElement);
        centralElement.append(messageElement).append(buttonElement);

        buttonElement.click({
            element: backdropElement,
            callback: reloadCallback
        }, refreshClicked.bind(this));

        return backdropElement;
    }

    function basicInfoLoaded(event, encounter) {

        setEncounterTitle.call(this, encounter.id, encounter.name);
    }

    function basicInfoCrashed() {
                // Destructive removal (including all events)
        this.basicInfoView.children().remove();

        this.basicInfoView.append(createErrorScreen('Basic Info has crashed!', initBasicInfo.bind(this)));
    }

    function resViewerCrashed() {
        // Hide all tooltips
        $('.tooltip').hide();

        // Destructive removal (including all events)
        this.resViewerView.children().remove();

        this.resViewerView.append(createErrorScreen('Resource viewer has crashed!', initResViewer.bind(this)));
    }

    function resGalleryCrashed() {
        // Destructive removal (including all events)
        this.resGalleryView.children().remove();

        this.resGalleryView.append(createErrorScreen('Resource gallery has crashed!', initResGallery.bind(this)));
    }

    function reportSeriousError() {

        if (this.alertsView.hasClass(sewi.constants.CONFIGURATOR_ACTIVE_ALERT_CLASS)) {
            return;
        }

        var reloadLink = $(sewi.constants.CONFIGURATOR_RELOAD_LINK_DOM);
        reloadLink.click(function() {
            window.location.reload(true);
        })
        this.alertsView.text(sewi.constants.CONFIGURATOR_ALERT_GENERAL_ERROR_MESSAGE)
                          .append(reloadLink)
                          .addClass(sewi.constants.CONFIGURATOR_ACTIVE_ALERT_CLASS);
    }

    function refreshClicked(event) {

        var element = event.data.element;
        var callback = event.data.callback;

        element.remove();
        callback.call(this);
    }

    function minimizeToggled() {

        this.isBasicInfoMinimized = !this.isBasicInfoMinimized;
        updateViewSizes.call(this);
    }

    function allTabsClosed() {

        this.isResourceViewerHidden = true;
        updateViewSizes.call(this);
    }

    function galleryOpenedResource(event, resourceDOM) {

        openResource.call(this, $(resourceDOM));
    }

    // Configurator public methods
    sewi.Configurator.prototype.setTitle = function(title, subtitle) {

        this.subtitleDOM.text(subtitle);
        this.titleDOM.text(title + ' ')
                        .append(this.subtitleDOM);
    }
})();
