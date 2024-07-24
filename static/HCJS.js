// Spoiler class
class Spoiler {
    constructor(container, options = {}) {
        this.container = container;
        this.options = Object.assign({
            open: false,
            linkSelector: '.accordion__item-title',
            spoilerSelector: '.accordion__item-content',
            duration: 400,
            eventOpen: 'spoiler:open',
            eventOpened: 'spoiler:opened',
            eventClose: 'spoiler:close',
            eventClosed: 'spoiler:closed'
        }, options);

        this.link = this.container.querySelector(this.options.linkSelector);
        this.spoiler = this.container.querySelector(this.options.spoilerSelector);

        this.isOpen = this.options.open;
        this.init();
    }

    init() {
        if (this.isOpen) {
            this.open(true);
        } else {
            this.close(true);
        }
        this.bindEvents();
    }

    bindEvents() {
        this.link.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggle();
        });
    }

    toggle() {
        this.isOpen ? this.close() : this.open();
    }

    open(withoutAnimation = true) {
        if (!this.isOpen) {
            this.isOpen = true;
            this.link.classList.add('accordion__item-title--active');
            this.spoiler.classList.add('is-active');
            this.container.dispatchEvent(new Event(this.options.eventOpen));

            if (withoutAnimation) {
                this.spoiler.style.display = 'block';
                this.spoiler.style.maxHeight = this.spoiler.scrollHeight + 'px';
                this.spoiler.style.overflow = 'visible';
                this.spoiler.style.paddingTop = '20px';
                this.spoiler.style.paddingBottom = '20px';
                this.container.dispatchEvent(new Event(this.options.eventOpened));
            } else {
                this.spoiler.style.display = 'block';
                this.spoiler.style.maxHeight = '0';
                this.spoiler.style.paddingTop = '0';
                this.spoiler.style.paddingBottom = '0';
                this.spoiler.style.overflow = 'hidden';

                requestAnimationFrame(() => {
                    this.spoiler.style.transition = `max-height ${this.options.duration}ms ease-in-out, padding ${this.options.duration}ms ease-in-out`;
                    this.spoiler.style.maxHeight = this.spoiler.scrollHeight + 'px';
                    this.spoiler.style.paddingTop = '20px';
                    this.spoiler.style.paddingBottom = '20px';
                });

                this.spoiler.addEventListener('transitionend', (event) => {
                    if (event.propertyName === 'max-height') {
                        this.spoiler.style.maxHeight = '';
                        this.spoiler.style.overflow = 'visible';
                        this.container.dispatchEvent(new Event(this.options.eventOpened));
                    }
                }, { once: true });
            }
        }
    }

    close(withoutAnimation = false) {
        if (this.isOpen) {
            this.isOpen = false;
            this.link.classList.remove('accordion__item-title--active');
            this.spoiler.classList.remove('is-active');
            this.container.dispatchEvent(new Event(this.options.eventClose));

            if (withoutAnimation) {
                this.spoiler.style.display = 'none';
                this.spoiler.style.maxHeight = '0';
                this.spoiler.style.overflow = 'hidden';
                this.spoiler.style.paddingTop = '0';
                this.spoiler.style.paddingBottom = '0';
                this.container.dispatchEvent(new Event(this.options.eventClosed));
            } else {
                this.spoiler.style.maxHeight = this.spoiler.scrollHeight + 'px';
                this.spoiler.style.overflow = 'hidden';

                requestAnimationFrame(() => {
                    this.spoiler.style.transition = `max-height ${this.options.duration}ms ease-in-out, padding ${this.options.duration}ms ease-in-out`;
                    this.spoiler.style.maxHeight = '0';
                    this.spoiler.style.paddingTop = '0';
                    this.spoiler.style.paddingBottom = '0';
                });

                this.spoiler.addEventListener('transitionend', (event) => {
                    if (event.propertyName === 'max-height') {
                        this.spoiler.style.display = 'none';
                        this.spoiler.style.maxHeight = '';
                        this.spoiler.style.paddingTop = '';
                        this.spoiler.style.paddingBottom = '';
                        this.container.dispatchEvent(new Event(this.options.eventClosed));
                    }
                }, { once: true });
            }
        }
    }
}

// Accordion class
class Accordion {
    constructor(container, options = {}) {
        this.container = container;
        this.options = Object.assign({
            activeIndex: -1,
            oneActive: false
        }, options);

        this.items = Array.from(this.container.querySelectorAll('.accordion__item')).map(
            (item) => new Spoiler(item, this.options)
        );
        this.init();
    }

    init() {
        if (this.options.activeIndex !== -1) {
            this.openItem(this.options.activeIndex, true);
        }
        this.bindEvents();
    }

    bindEvents() {
        if (this.options.oneActive) {
            this.items.forEach((spoiler, index) => {
                spoiler.container.addEventListener(spoiler.options.eventOpen, () => {
                    this.items.forEach((otherSpoiler, otherIndex) => {
                        if (index !== otherIndex) {
                            otherSpoiler.close();
                        }
                    });
                });
            });
        }
    }

    openItem(index, withoutAnimation = false) {
        this.items.forEach((spoiler, i) => {
            if (i === index) {
                spoiler.open(withoutAnimation);
            } else {
                spoiler.close(withoutAnimation);
            }
        });
    }
}

// Tabs class
class Tabs {
    constructor(container, options = {}) {
        this.container = container;
        this.options = Object.assign({
            activeIndex: 0,
            linksSelector: '.tabs-menu .tabs-link',
            tabSelector: '.tab',
            eventOpen: 'tabs:open',
            eventOpened: 'tabs:opened'
        }, options);

        this.links = this.container.querySelectorAll(this.options.linksSelector);
        this.tabs = this.container.querySelectorAll(this.options.tabSelector);

        this.init();
    }

    init() {
        this.bindEvents();
        this.toggle(this.options.activeIndex);
    }

    bindEvents() {
        this.links.forEach((link, index) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggle(index);
            });
        });
    }

    toggle(index) {
        const activeLink = this.container.querySelector(`${this.options.linksSelector}.is-active`);
        const activeTab = this.container.querySelector(`${this.options.tabSelector}:not(.is-hidden)`);

        if (activeLink) {
            activeLink.classList.remove('is-active');
        }
        if (activeTab) {
            activeTab.classList.add('is-hidden');
        }

        const newActiveLink = this.links[index];
        const newActiveTab = this.tabs[index];

        if (newActiveLink && newActiveTab) {
            newActiveLink.classList.add('is-active');
            newActiveTab.classList.remove('is-hidden');
            this.container.dispatchEvent(new Event(this.options.eventOpened));
        }
    }

    destroy() {
        this.links.forEach((link) => {
            link.removeEventListener('click', this.toggle);
        });
    }
}

// Helper function to initialize nested accordions
function initializeNestedAccordions(container) {
    const nestedContainers = container.querySelectorAll('.accordion');
    nestedContainers.forEach((nestedContainer) => {
        new Accordion(nestedContainer, {});
    });
}

// Initialize the accordion
function initializeAccordion(containerSelector, options) {
    const containers = document.querySelectorAll(containerSelector);
    containers.forEach((container) => {
        new Accordion(container, options);
    });
}

// Initialize the tabs
function initializeTabs(containerSelector, options) {
    const containers = document.querySelectorAll(containerSelector);
    containers.forEach((container) => {
        new Tabs(container, options);
    });
}