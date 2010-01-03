/*
---
description: a content slider using the mootools framework

license: 2-clause BSD (originally under MIT license)

authors:
 - Original code: luistar15
 - dauerbaustelle (bug fixes, docs, ...)

requires:
   core/1.2:
   - Fx.Tween

provides: [MooSlider]
...
*/

var MooSlider = new Class({
    mode: 'random',
    modes: ['top', 'right', 'bottom', 'left', 'alpha'],
    sizes: {w: null, h: null},
    fxOptions: {duration: 500},
    interval: 5000,
    stopped: true,
    buttons: null,

    initialize: function(items, options) {
        if(options) for(var o in options) this[o]=options[o];
        if(!this.sizes.w) this.sizes.w = items[0].getWidth();
        if(!this.sizes.h) this.sizes.h = items[0].getHeight();

        items[0].getParent().setStyles( {
            width: this.sizes.w,
            height: this.sizes.h
        });

        this.backgroundColor = findBackgroundColor(items[0]);

        if(this.buttons) {
            if(this.buttons.previous)
                this.buttons.previous.addEvent('click', this.previous.bind(this, [true]));
            if(this.buttons.next)
                this.buttons.next.addEvent('click', this.next.bind(this, [true]));
            if(this.buttons.playpause)
                this.buttons.playpause.addEvent('click', this.toggle.bind(this));
        }

        this.__current = 0;
        this.__previous = null;
        this.items = items.setStyle('display', 'none');
        this.items[this.__current].setStyle('display', 'block');
        this.disabled = false;
        this.attrs = {
            left: ['left', -this.sizes.w, 0, 'px'],
            top: ['top', -this.sizes.h, 0, 'px'],
            right: ['left', this.sizes.w, 0, 'px'],
            bottom: ['top', this.sizes.h, 0, 'px'],
            alpha: ['opacity', 0, 1, '']
        } ;

        this.rand = this.mode=='random';
        this.sequence = typeof(this.mode)=='object' ? this.mode : false;
        this.curseq = 0;
        this.timer = null;

        var classscope = this;
        items.each(function(item) {
            item.setStyles( {
                'width': classscope.sizes.w,
                'height': classscope.sizes.h,
                'background-color' : classscope.backgroundColor
            });
        });
    },

    walk: function(n, manual) {
        if(this.__current!==n && !this.disabled) {
            this.disabled = true;
            if(manual) {
                this.stop();
            }

            if(this.rand) {
                this.mode = this.modes.getRandom();
            } else if(this.sequence) {
                this.mode = this.sequence[this.curseq];
                this.curseq += this.curseq+1<this.sequence.length ? 1 : -this.curseq;
            }

            this.__previous = this.__current;
            this.__current = n;
            var a = this.attrs[this.mode].associate(['p', 'f', 't', 'u']);

            for(var i=0;i<this.items.length;i++) {
                if(this.__current===i) {
                    this.items[i].setStyles($extend( {
                        'display': 'block',
                        'z-index': '2'
                    }, JSON.decode(' {"'+a.p+'": "'+a.f+a.u+'"} ')));

                } else if(this.__previous===i) {
                    this.items[i].setStyles( {'z-index': '1'});

                } else {
                    this.items[i].setStyles( {'display': 'none', 'z-index': '0'});
                }
            }
            if(a.p != 'opacity') {
                this.items[this.__previous].set('tween',
                    $merge(this.fxOptions)).tween(a.p, a.t, -a.f);
            }
            this.items[n].set(
                'tween',
                $merge(this.fxOptions, {onComplete: this.onComplete.bind(this)})
           ).tween(a.p, a.f, a.t);
        }
    },

    play: function(wait, event) {
        if(event) event.stop();
        this.stop();
        this.stopped = false;
        if(!wait && wait !== undefined) {
            this.next();
        }
        this.timer = this.next.periodical(this.interval, this, [false]);
    },

    stop: function(event) {
        if(event) event.stop();
        this.stopped = true;
        $clear(this.timer);
    },

    toggle: function(event) {
        if(event) event.stop();
        if(this.stopped) this.play(false);
        else this.stop();
    },

    next: function(manual, event) {
        if(event) event.stop();
        this.walk(this.__current+1<this.items.length ? this.__current+1 : 0, manual);
    },

    previous: function(manual, event) {
        if(event) event.stop();
        var mode = this.mode;
        this.mode = this.mode == 'left' ? 'right' : 'left'
        this.walk(this.__current>0 ? this.__current-1 : this.items.length-1, manual);
        this.mode = mode;
    },

    onComplete: function() {
        this.disabled = false;
        this.items[this.__previous].setStyle('display', 'none');
        if(this.onWalk) this.onWalk(this.__current);
    },

    var findBackgroundColor = function(element) {
        while(1) {
            if(element.getStyle('background-color') != 'transparent') {
                return element.getStyle('background-color');
            } else {
                element = element.getParent();
                if(element === undefined) return null;
            }
        }
        return null;
    }
});
