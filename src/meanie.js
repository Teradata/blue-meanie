(function ($) {

    'use strict';

    var opts, render, validate, rules = {}, fields = [], trigger, watch, init,
        setKeys, saveFormRules, cache = {}, createKey, timeout, getTargetRules,
        api = {}, msg = {};

    // creates unique keys for hash table lookups
    createKey = function () {
        var s4 = function () {
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        };

        return (s4()+s4()+'-'+s4()+'-'+s4()+'-'+s4()+'-'+s4()+s4()+s4());
    };

    // public api
    api.init = function (o) {
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

    api.add = function (args) {

    };

    api.remove = function (args) {

    };

    api.destroy = function () {

    };

    api.validate = function (args) {

    };

    api.define = function (args) {

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
        var i = 0, rules = cache[formkey].rules, len = rules.length, $el, key,
            kstack;

        for (i; i<len; i++) {
            key = createKey();
            rules[i].key = key;
            $el = cache[formkey].$form.find(rules[i].qrysel); // TODO: restrict to form

            $el.each(function () { // add key to all elements in the selector
                kstack = $.data(this, 'meanie') || []; // target can have more than one rules stack assigned to it
                kstack.push(key);
                $.data(this, 'meanie', kstack);
                $.data(this, 'meanie-pepperland', formkey);
            });
        }
    };

    // add event listeners
    watch = function ($form, opts) {
        var events = 'keyup.meanie-glove change.meanie-glove paste.meanie-glove'

        if (opts.inline) {
            $form.on(events, function (e) {
                var keys = $.data(e.target, 'meanie'), formkey = $.data(e.target, 'meanie-pepperland'),
                    delay = e.type === 'keyup' ? 400 : 0;
                if (!keys || !formkey) return;

                if (timeout) clearTimeout(timeout);
                if (e.type === 'change' && e.target.type === 'text') return; // do not validate on text input change
                timeout = setTimeout(function () {
                    validate({ keys: keys, formkey: formkey, target: e.target });
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

    // rules and messages
    msg.required = 'Required';
    rules.required = function (target) {
        var $target = $(target), valid = $.trim($target.val()).length; // TODO: add checkbox and radio
        return valid ? true : false;
    };

    render = function () {

    };

    // get the rules for a target
    getTargetRules = function (stack, key) {
        var i = 0, len = stack.length;

        for (i; i<len; i++) {
            if (stack[i].key === key)
                return stack[i].stack;
        }

        return false;
    };

    // validate target; validation is trigger by watch()
    validate = function (args) {
        var opts = cache[args.formkey], inputrules, i = 0, len = 0, valid = true, vstack = [], k = 0, klen = 0;
        if (!opts) return;
        inputrules = getTargetRules(opts.rules, args.keys);

        klen = args.keys.length;
        for (k; k<klen; k++) { // loop through keys
            inputrules = getTargetRules(opts.rules, args.keys[k]);
            if (inputrules) {
                len = inputrules.length;
                for (i; i<len; i++) { // loop through rules for key
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
                        if (render && typeof render === 'function') render({ verdicts: vstack, $form: opts.$form });
                        if (!valid) break;
                    } catch (e) {
                        console.log(e);
                        throw 'BLUE MEANIE: Rule ' + inputrules.name + ' does not exist in pepperland. Please ask the chief to create the rule.'
                    }
                }
            }
        }
    };

    $.fn.meanie = function (o) {
        if (api[o])
            return api[o].apply(this, Array.prototype.slice.call(arguments, 1));
        else if (typeof o === 'object' || !o)
            return api.init.apply(this, arguments);
        else
            throw 'BLUE MEANIE: Initialization failed or the method does not exist in pepperland'
    };

})(jQuery);