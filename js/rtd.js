const CodeHighlight = require('./code_highlight')
const Search = require('./search')


class RTD {

    constructor() {
        this.$ = {}

        this.$.main = $('#main')
        this.$.nav = $('nav')
        this.$.resizer = $('#resizer')
        this.$.scroll = $('.scroll')

        this.$.apiTab = $('#api-tab')
        this.$.manualsTab = $('#manuals-tab')

        // Determine which category tab must be active.
        if (location.hash === '#api') {
            this.showApiTab()
        } else if (location.hash === '#manuals' || isManual) {
            this.showManualsTab()
        } else {
            this.showApiTab()
        }


        // Targets the current page in the navigation.
        this.selectHref()

        this.codehighlight = new CodeHighlight()
        this.search = new Search()

        this.events()
    }


    events() {
        this.$.apiTab.on('click', this.showApiTab.bind(this))
        this.$.manualsTab.on('click', this.showManualsTab.bind(this))

        this.$.nav.find('.nav-api').each(function() {
            $(this).find('.toggle-subnav')
                .filter(function() {
                    // Keeps subnavs without items invisible.
                    return $(this).next().next(':empty').length === 0;
                }).each(function() {
                    $(this).removeClass('invisible').on('click', function(e) {
                        $(e.currentTarget).next().next().toggleClass('hidden')
                        $(e.currentTarget).toggleClass('fa-plus fa-minus')
                    })
                })
        })

        function resize(event) {
            var clientX = event.clientX
            clientX = Math.max(200, clientX)
            clientX = Math.min(500, clientX)
            this.$.nav.css('width', clientX)
            this.$.resizer.css('left', clientX)
            this.$.main.css('left', clientX + this.$.resizer.width())
        }

        function detachResize() {
            $(window).off({mousemove: resize, mouseup: detachResize})
        }

        this.$.resizer.on('mousedown', function() {
            $(window).on({mousemove: resize, mouseup: detachResize})
        })

        window.addEventListener('hashchange', this.selectHref.bind(this), false)
    }

    /**
     * The manual tab.
     */
    showManualsTab() {
        this.$.apiTab.removeClass('selected')
        this.$.manualsTab.addClass('selected')
        $('.nav-api').addClass('hidden')
        $('.nav-manuals').removeClass('hidden')
    }

    /**
     * The API tab.
     */
    showApiTab() {
        this.$.manualsTab.removeClass('selected')
        this.$.apiTab.addClass('selected')
        $('.nav-api').removeClass('hidden')
        $('.nav-manuals').addClass('hidden')
    }


    /**
     * Add a selected class to a link with a matching href.
     */
    selectHref() {
        $('.sub-nav-item a').removeClass('selected')
        let item = document.querySelector(`a[href$="${location.pathname.substr(1)}${location.hash}"]`)
        $(item).addClass('selected')
    }
}

$(() => {
    window.rtd = new RTD()
})
