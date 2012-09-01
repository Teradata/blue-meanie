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
        if ((o.render && o.render === 'bootstrap') || typeof o.render === 'undefined')
            o.render = render;
        else
            render = false;

        var $form, opts = $.extend({
            inline: true
        }, o);

        return this.each(function () {
            $form = $(this);
            setKeys(saveFormRules($form, opts));
            watch($form, opts);
        });
    };

    api.add = function (args) { // add target

    };

    api.remove = function (args) { // remove target

    };

    api.destroy = function () { // remove data, handlers, cache

    };

    api.validate = function (args) { // validate target or form

    };

    api.define = function (args) { // define new rule for selector; push new key to stack

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
        var events = 'keyup.meanie-glove change.meanie-glove paste.meanie-glove';

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
        if (render && typeof render === 'function') render({ verdicts: args.verdicts, $form: args.$form });
    };

    // rules and messages
    msg.required = 'Required';
    rules.required = function (target) {
        var $target = $(target), valid = $.trim($target.val()).length; // TODO: add checkbox and radio
        return valid ? true : false;
    };

    // rules and messages
    msg.foobar = 'Foobar';
    rules.foobar = function (target) {
        return true;
    };

    // default rendering is twitter boostrap tooltip
    render = function (args) {
        console.log('RENDER');
        console.log(arguments);
        if (!$.fn.tooltip) throw 'Twitter Boostrap tooltip plugin is not defined.'

        var verdicts = args.verdicts, i = 0, len = verdicts.length, $target,
            $cgroup;

        for (i; i<len; i++) {
            $target = verdicts[i].$target;
            $cgroup = $target.closest('.control-group', args.$form);
            $target.tooltip({ trigger: 'manual' });
            if (!verdicts[i].valid) {
                console.log('ERROR');
                $target.attr('data-original-title', verdicts[i].msg);
                $target.tooltip('show');
            } else {
                console.log('VALID');
                // $target.attr('data-original-title', ''); don't really need this
                $target.tooltip('hide');
            }

            if ($cgroup.length)
                $cgroup[(verdicts[i].valid ? 'removeClass' : 'addClass')]('error');
        }
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
        var opts = cache[args.formkey], inputrules, i = 0, len = 0, valid = true, vstack = [], k = 0, klen = 0,
            verdict = { $target: $(args.target), rules: [], msg: undefined, valid: true };
        if (!opts) return;

        klen = args.keys.length;
        for (k; k<klen; k++) { // loop through keys
            inputrules = getTargetRules(opts.rules, args.keys[k]);
            if (inputrules) {
                len = inputrules.length;
                for (i=0; i<len; i++) { // loop through rules for key
                    try {
                        valid = rules[inputrules[i].name](args.target);
                        verdict.rules.push(inputrules[i].name);
                        verdict.valid = valid;
                        if (!valid) {
                            verdict.rules = verdict.rules.slice(verdict.rules.length - 1);
                            verdict.msg = inputrules[i].options && inputrules[i].options.msg ? inputrules[i].options.msg : msg[inputrules[i].name];
                            break; // break the inner loop that iterates over the rule stack
                        }
                    } catch (e) {
                        console.log(e);
                        throw 'BLUE MEANIE: Rule ' + inputrules.name + ' does not exist in pepperland. Please ask the chief to create the rule.';
                    }
                }
            }

            if (!valid) break;
        }

        if (opts.inline) trigger({ verdicts: [verdict], $form: opts.$form });
        return verdict;
    };

    $.fn.meanie = function (o) {
        if (api[o])
            return api[o].apply(this, Array.prototype.slice.call(arguments, 1));
        else if (typeof o === 'object' || !o)
            return api.init.apply(this, arguments);
        else
            throw 'BLUE MEANIE: Initialization failed or the method does not exist in pepperland';
    };

})(jQuery);