(function ($) {

    'use strict';

    var opts, render, validate, rules = {}, fields = [], trigger, watch, init,
        setKeys, saveFormRules, cache = {}, createKey, timeout, getRulesForInput,
        addTarget, removeTarget, plugin = {};

    // creates unique keys for hash table lookups
    createKey = function () {
        var s4 = function () {
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        };

        return (s4()+s4()+'-'+s4()+'-'+s4()+'-'+s4()+'-'+s4()+s4()+s4());
    };

    plugin.init = function (o) {
        var $form, opts = $.extend({
            render: render,
            inline: true
        }, o);

        return this.each(function () {
            $form = $(this);
            console.log(opts);
            setKeys(saveFormRules($form, opts));
            watch($form, opts);
        });
    };

    // save rules to shared cache and add key to form data
    saveFormRules = function ($form, opts) {
        var key = createKey();

        $.data($form[0], 'meanie-pepperland', key);
        cache[key] = opts;
        cache[key].$form = $form; // cache a reference to the form
        return key;
    };

    // add keys to form elements
    setKeys = function (formkey) {
        if (!cache[formkey].rules) return;
        var i = 0, rules = cache[formkey].rules, len = rules.length, $el, key;

        for (i; i<len; i++) {
            key = createKey();
            rules[i].key = key;
            $el = $(rules[i].qrysel);

            $el.each(function () { // add key to all elements in the selector
                $.data(this, 'meanie', key);
                $.data(this, 'meanie-pepperland', formkey);
            });
        }
    };

    // add event listeners
    watch = function ($form, opts) {
        var events = 'keyup.meanie-glove change.meanie-glove paste.meanie-glove'

        if (opts.inline) {
            $form.on(events, function (e) {
                var key = $.data(e.target, 'meanie'), formkey = $.data(e.target, 'meanie-pepperland'),
                    delay = e.type === 'keyup' ? 400 : 0;
                if (!key || !formkey) return;

                if (timeout) clearTimeout(timeout);
                if (e.type === 'change' && e.target.type === 'text') return; // do not validate on text input change
                timeout = setTimeout(function () {
                    validate({ key: key, formkey: formkey, target: e.target });
                }, delay);
            });
        } else {
            $form.on('submit.meanie-chief', function (e) {
                return;
            });
        }
    };

    // trigger an event to which developers can bind
    trigger = function (args) {
        args.$form.trigger('meanie.validate', [args.verdicts]);
    };

    // rules
    rules.required = function (target) {
        var $target = $(target), valid = $.trim($target.val()).length; // TODO: add checkbox and radio
        return valid ? true : false;
    };

    render = function () {

    };

    getRulesForInput = function (stack, key) {
        var i = 0, len = stack.length;

        for (i; i<len; i++) {
            if (stack[i].key === key)
                return stack[i].stack;
        }

        return false;
    };

    // validate target; validation is trigger by watch()
    validate = function (args) {
        var opts = cache[args.formkey], inputrules, i = 0, len = 0, valid = true, vstack = [];
        if (!opts) return;
        inputrules = getRulesForInput(opts.rules, args.key);
        if (!rules) return;

        len = inputrules.length;
        for (i; i<len; i++) {
            try {
                valid = rules[inputrules[i].name](args.target);
                vstack.push({
                    $target: $(args.target),
                    rule: inputrules[i].name,
                    valid: valid
                });
                // TODO: extend options; utility method used for all rules
                // TODO: add submit check all; push all errors to a stack for triggering all verditcs at once
                trigger({ verdicts: vstack, $form: opts.$form });
                if (!valid)
                    break;
            } catch (e) {
                console.log(e);
                throw 'BLUE MEANIE: Rule ' + inputrules.name + ' does not exist in pepperland. Please ask the chief to create the rule.'
            }
        }
    };

    // public: add a new target to be validated
    addTarget = function () {

    };

    // public: remove a target from pepperland
    removeTarget = function () {

    };

    $.fn.meanie = function (o) {
        if (plugin[o])
            return plugin[o].apply(this, Array.prototype.slice.call(arguments, 1));
        else if (typeof o === 'object' || !o)
            return plugin.init.apply(this, arguments);
        else
            throw 'BLUE MEANIE: Initialization failed or the method does not exist in pepperland'
    };

})(jQuery);