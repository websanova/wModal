# wModal.js

A jQuery modal plugin that allows you to easily setup modals using html templates.  You can easily attach events to buttons in your modals and it comes with a lot of cool effects out of the box.

* [View the wModal demo](http://wmodal.websanova.com)
* [Download the lastest version of wModal](https://github.com/websanova/wModal/tags)


## Related Plugins

* [wModal](http://wmodal.websanova.com) - Clean looking and easy to use modals.
* [wHumanMsg](http://whumanmsg.websanova.com) - Simple user prompting.


## Settings

Available options with notes, the values here are the defaults.

```
$('#_wModal_yesNo').wModal({
    position    : 'cm',     // position of modal (lt, ct, rt, rm, rb, cb, lb, lm, cm)
    offset      : '10',     // offset of modal from edges if not in "m" or "c" position
    fxShow      : 'none',   // show effects (fade, slideUp, slideDown, slideLeft, slideRight, rotateUp, rotateDown, rotateLeft, rotateRight)
    fxHide      : 'none',   // hide effects (fade, slideUp, slideDown, slideLeft, slideRight, rotateUp, rotateDown, rotateLeft, rotateRight)
    btns        : {},       // button callbacks
    msg         : null      // optional message to set if "_wModal_msg" class is set
});
```


## Examples

Include plugin files:

```js
<script type="text/javascript" src="./wModal.js"></script>
<link rel="Stylesheet" type="text/css" href="./wModal.css" />
```

### create

Modals can be any piece of html and you can create your own or build one using something like Twitter Boostrap.  You can stylize to your hearts content or use some of the defaults provided in wModal.

```html
<script type="text/template" id="wModal_yesNo">
    <div class="_wModal _wModal_yesNo">
        <div class="_wModal_header">
            Websanova
            <div class="_wModal_close _wModal_btn_cancel">x</div>
        </div>

        <div class="_wModal_msg">Are you sure you want to do that?</div>
        
        <div class="_wModal_btns_right">
            <div class="_wModal_btn _wModal_btn_grey _wModal_btn_no">No</div>
            <div class="_wModal_btn _wModal_btn_blue _wModal_btn_yes">Yes</div>
        </div>
    </div>
</script>
```

We can then initialize any modal like so:

```js
$('#wModal_yesNo').wModal({
    position:'lt',
    btns:{
        yes: function()
        {
            console.log('yes left top');
            this.hide();
        }
    }
});
```

display

```js
$('#wModal_yesNo').wModal('show');
```

Any of the inital values can be overwritten temporarily for any other call:

```js
$('#wModal_yesNo').wModal('show', {
    offset:'50',
    fxShow:'slideUp',
    fxHide:'slideDown',
    btns:{
        yes: function()
        {
            console.log('this is temporary');
            this.hide();
        }
    }
});
```

Calling the original modal without options will again display the modal with the initial settings:

```js
$('#wModal_yesNo').wModal('show');
```


### messages

There is an optional key class that can be set named `_wModal_msg`, which if set will allow you to set messages on the fly. Using the example above we could then set the `msg` setting to any string and it will appear in the target `wModal_msg` area.

```
$('#wModal_yesNo').wModal('show', {msg:"This is a temporary message."});
```

Note that if the class `_wModal_msg` is not set then the `msg` option will not do anything and you will need to code your own messages into your prompts.


### adding modals

The plugin can work off any piece of `html`, with the only requirement being that the modal should have some set width.  You can then use any of the show/hide effects available to the plugin.

Chances are, however that you will want to add some handlers to your button prompts.  You can this by following the [Adding Buttons](https://github.com/websanova/wModal#addingbuttons) section below.

I would recommend using a separate templates file to keep all your prompts nicely organized in, making it easier to modify existing ones and add new ones to the mix.


### adding buttons

You can set as many buttons as you like using the `btns` option.

```
$('#wModal_yesNo').wModal('show', {
    btns:{
        yes: function(){
            // code
            this.hide();
        },
        no: function(){
            //code
            this.hide();
        },
        cancel: function(){
            //code
            this.hide
        }
        // etc...
    }
});
```

Button handlers are attached based on a naming convention in order to give you flexibility and reusability.  The `wModal` plugin will look for any class names matching `_wModal_btn_<button name>` where  button name is the object key set in the `buttons` parameter.

In the case above `wModal` would look for any elements with class names: `_wModal_btn_yes`, `_wModal_btn_no`, and `_wModal_btn_cancel`.


### adding effects

The plugin comes packaged with many effects (check options for a full list), however it's easy to add your own.  The effects are called on two key words, `fxShow` and `fxHide`, take a look at the fade effects:

```
fxShowFade: function()
{
    var _this = this;
    this.bg.fadeIn(100, function(){ _this.modal.fadeIn(300); });
},

fxHideFade: function()
{
    var _this = this;
    this.modal.fadeOut(300, function(){ _this.bg.fadeOut(100); });
}
```

We can then set the `fxShow` and `fxHide` options to `fade`.  You can add as many of your own effects as you like just make sure to show the `bg` and `modal` elements, then hide the `modal` and `bg` elements in those orders for best aesthetic visuals.


## Resources

* [More jQuery plugins by Websanova](http://websanova.com/plugins)
* [jQuery Plugin Development Boilerplate](http://www.websanova.com/tutorials/jquery/jquery-plugin-development-boilerplate)
* [The Ultimate Guide to Writing jQuery Plugins](http://www.websanova.com/tutorials/jquery/the-ultimate-guide-to-writing-jquery-plugins)


## License

MIT licensed

Copyright (C) 2011-2012 Websanova http://www.websanova.com