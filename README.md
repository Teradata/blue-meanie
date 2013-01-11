Blue Meanie
-----------
No form is safe in Pepperland.

What is Blue Meanie?
--------------------
Blue Meanie is a simple form validation engine. It accepts rules, validates form elements (event based), and triggers events.
It does not care how you render error messages or maintain state. It is a jQuery plugin, of course.

Disclaimer
----------
As of publishing, 01/10/2013, Blue Meanie has some rough edges and needs some improvement. Blue Meanie is currently being used in a limited case.
Blue Meanie will be refined as/if the scope of usage increases. Blue Meanie is being used as part of larger validation library that contains state
management and rendering modules. The modules are then tied together through a common API. Documentation and examples will be added as time permits.

How Does it Work?
-----------------
It listens for certain DOM events and validates when the events occur.

First thing you will need are some rules. Rules can be loaded like so:
```javascript
$.fn.meanie('addRule', { // this will add the rule to the plugin itself not an instance of the plugin, so that rules can be shared with all instances
    name: 'required',
    msg: 'This field is required.',
    test: function (target, options) {
        // target is the input being validated
        // an options argument can be defined when a rule set is created (see example later on)
        return true; // this should return a boolean value
    }
});
```

Now that we have a rule lets validate a form:
```javascript
$('form').meanie({
    rulesets: [ // there can be an infinite number of rule sets that contain an infinite number of rules
        {
            qrysel: 'input[type="text"]', // THIS IS COOL: apply this rule to all elements that match this query selector
            rules: [
                {
                    // use the required rule we defined above; options is an optional argument;
                    // options will be passed as an argument to validation function (see addRule example above)
                    { name: 'required', options: {} },
                    { name: 'number' } // pretend this rule has already been defined
                }
            ]
        }
    ]
});
```

Lets listen for validation events:
```javascript
$('form').on('meanie.validate', function (event, verdicts) {
    // when an input is validated an event is triggered
    // an array of verditc objects is returned; each object cotains the following properties
    // $target, msg, options, rules, valid
});
```

Validate this element:
```javascript
// returns an array of verdict objects
$('form').meanie('validate', target, silent); // target is a DOM element; silent is a bool indicating whether an event should be triggered
```

Let me see all the rules:
```javascript
$('form').meanie('rules');
```

No longer validate this element:
```javascript
$('form').meanie('remove', target); // target is a DOM element
```

We are done validating. Lets remove the validation:
```javascript
$('form').meanie('destroy');
```

<pre>
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
::::::::::::::::::::::::::::::::::::::''``      ``''::::::::::::::::::::::
::::::::::::::::::::::::::::::::::''                 `':::::::::::::::::::
::::::::::::::::::::::::::::::::'                      `':::::::::::::::::
::::::::::::::::::::::::::::::'                          :::::::::::::::::
:::::::::::::::::::::::::::::'                            ::::::::::::::::
:::::::::::::::::::::::::::::                             `:::::::::::::::
:::::::::::::::::::::::::::::                              :::::::::::::::
::::::::::::::::::::::::::::                               `````''::::::::
::::::::::::::::::::::::::::                                        `'::::
::::::::::::::::::::::::::::                                           `::
::::::::::::::::::::::::::::                                            `:
::::::::::::::::::::::::::::.
:::::::::::::::::::::::::::::.
::::::::::::::::::::::::::::::::
::::::::::::::::::::::::::::''``?.
'`.,.`':::::::::::::::::''       "h
,d$$$h.`'::::::::::::::'   ,-.    `h
$$$$$$$h. `:::::::::::'   (   )    F                                     :
$$$$$$$$$$cc,_````_,,cc    `-'     ""==,,_                              ::
`?$$$$$$$$$$$$$$$$$$$$$.        ,ccc,.    ""==-,_                     .:::
: "?$$$$$$$$$$$$$$$$$$$$$cccccd$$$$P"  $hcc,.   `:::.              .::::::
:::. "?$$$$$$$$$$$$$$$$$$$$$$$$$$" /`",$$$$$$P .::::::::........::::::::::
::::::..""?$$$$$$$$$$$$$$$$$$$P".-",= $$$$$$" ::::::::::::::::::::::::::::
:::::::::.. ""??$$$$$$$$$???"".',d". d$$$$$F :::::::::::::::::::::::::::::
:::::::::::::::.;;, .,,,ccc==",dP', z$$$$$" ::::::::::::::::::::::::::::::
:::::::::::::::::::.`""""_,nmPP  ,",$$$$$' :::::::::::::::::::::::::::::::
:::::::::::::::::::: "PPPP""   ,d",$$$$$$ ::::::::::::::::::::::::::::::::
::::::::::::::::::::::::     ,d" ,$$$$$$F ::::::::::::::::::::::::::::::::
::::::::::::::::::::'`` ::',dP   $$$$$$$F :'':::::::::::::::::::::::::::::
:::::::::::::::::'`.mbu;;_dP", ,d$$$$$$P      `''````````'::::::::::::::::
::::::::::::::'' -c,.""""_,=",c$$$$$$$??                  `````'':::::::::
::::::::::::' ,chc,.""???".,d$$$$$???                             `'''`'::
::::::::::: ,d$$$$$$$$ccd$$$$$$P""                                      `:
::::::::::: $$$$$$$$$$$$$$$$???
::::::::::. $$$$$$$$$$$$$P"
::::::::::: `?$$$$$$$$$$"
::::::::::::.,`"??""""??
:::::::::::::
:::::::'``':'
::::::'
::'`
</pre>