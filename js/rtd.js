const CodeHighlight = require('./code_highlight')
const Search = require('./search')


class RTD {

    constructor() {
        this.$ = {}

        this.$.main = $('#main')
        this.$.nav = $('nav')
        this.$.resizer = $('#resizer')
        this.$.scroll = $('.nav-scroll-container')

        this.$.apiTab = $('#api-tab')
        this.$.manualsTab = $('#manuals-tab')

        // Determine which category tab must be active.
        if (window.isManual || (!location.pathname.includes('.html') && !location.hash.includes('#api'))) {
            this.showManualsTab()
        } else {
            this.showApiTab()
        }

        // Targets the current page in the navigation.
        if (window.isApi) {
            let longnameSelector = window.doc.longname.replace(/[~|:|.]/g, '_')
            this.$.selectedApiSubItem = $(`#${longnameSelector}_sub`)
            this.$.selectedApiSubItem.removeClass('hidden')
            let selectedApiItem = this.$.selectedApiSubItem.prev()
            selectedApiItem.addClass('selected')
            // Try to position selectedApiItem at the top of the scroll container.
            let navScrollTop = this.$.scroll.get(0)
            if (navScrollTop) navScrollTop = navScrollTop.getBoundingClientRect().top
            let navItemTop = selectedApiItem.get(0)
            if (navItemTop) navItemTop = navItemTop.getBoundingClientRect().top

            this.$.scroll.scrollTop(navItemTop - navScrollTop + 1)
            // Height of the item from the top of the scroll container.
            this.$.selectedApiSubItem.parent().find('.fa').removeClass('fa-plus').addClass('fa-minus')
        }

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
        // Remove selected from all
        $('.sub-nav-item a').removeClass('selected')
        let hrefMatch = location.pathname.split('/').pop()
        if (hrefMatch.includes('tutorial')) {
            hrefMatch = `.nav-item.${hrefMatch.replace('.html', '').split('-').pop()}`
        } else if (hrefMatch !== '') {
            hrefMatch = `a[href="${hrefMatch}${location.hash}"]`
        }

        if (hrefMatch) {
            const node = document.querySelector(hrefMatch)
            if (node) node.classList.add('selected')
        }

    }
}

$(() => {
    window.rtd = new RTD()
})
