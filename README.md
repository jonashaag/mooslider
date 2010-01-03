MooSlider
=========

MooSlider is a lightweight, easy-to-use content (e.g. images, text, ...)
scroller using the mootools framework.


How to use
----------

In your HTML source:

    <div id="MooSlider_1">
        <div class="MooSlider_Item">
            Content #1
        </div>
        <div class="MooSlider_Item">
            Content #2
        </div>
        <div class="MooSlider_Item">
            Content #2
        </div>
        ...
        <div class="MooSlider_Item">
            Content #N
        </div>
    </div>

In your Javascript source:

    window.addEvent('domready', function() {
        // ... your other code here
        var yourmooslider = new MooSlider($$('#MooSlider_1 .MooSlider_Item'), {
            mode: 'alpha'
        });
        yourmooslider.play();
    });

You can see that the ``MooSlider`` class is instantiated like any other
MooTools class, using the generic

    new MooSlider(Array_of_element_to_slide, options)

To use the auto-slide thing, now use the

    .play(initial_delay)

method, where ``initial_delay`` specifies the time in milliseconds to wait
before the first sliding (optional, defaults to 0).

For possible ``options``, see next section.


MooSlider options
-----------------
You can pass several ``options`` to the MooSlider constructor. Every of the
options has a default value, hence is optional and can be left out.

* ``mode`` (string or array): Specifies the animation type. One or an array of:
  - ``left``:       Slides out the content element to the left, slides in the next one from the right
  - ``right``:      Like ``left``, but the other way round
  - ``top``:        Slides out the content element to the top, slides in the next one from the bottom
  - ``bottom``:     Like ``top``, but the other way round
  - ``alpha``:      Uses fade-in and fade-out instead of sliding
  - ``random``:     (default) Randomly choses a transition mode out of the ``modes`` array on every transition
  - Array of these: Uses all the given transitions at once (e.g. slide-out to the left and fade-out at the same time)


* ``modes`` (array): (Only applies if ``mode`` is set to ``random``) An array of all modes from which one shall be chosen randomly every transition (default: all available modes)

* ``interval`` (int): Time to wait between slidings (in milliseconds, only applies if you use the ``.play()`` auto-slide function)

* ``fxOptions``: Options passed to ``Fx.Tween`` used for transitions (defaults to ``{duration: 500}``)

* ``sizes`` (object): A hashtable containing the keys ``w`` (Slider container width) and ``h`` (Slider container height), both of type ``int``. (default: empty, so height and width are gained from the first item in the slide elements array)

* ``buttons`` (object): A hashtable containing one or more of the keys ``next``, ``previous`` and ``playpause``, all of type ``Element``. To each of the given elements, a ``click`` event is added. Then if one clicks a button, the according action ("slide to next element", "slide one element back", "play/pause the auto-slide") is executed.


### Example usage with options

    window.addEvent('domready', function() {
        var slider = new MooSlider($$('#MooSlider_1 .MooSlider_Item'), {
            mode: 'right',
            interval: 3000,
            sizes: {w: 300, h: 300},
            buttons: {
                next: $('MooSlider_1_Button_Next'),
                previous: $('MooSlider_1_Button_Previous'),
                playpause: $('MooSlider_1_Button_PlayPause')
            }
        });
        slider.play(2000);
    });
