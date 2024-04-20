"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const dom_1 = require("@testing-library/dom");
const user_event_1 = require("@testing-library/user-event");
const inlinejs_1 = require("@benbraide/inlinejs");
const data_1 = require("../directive/data/data");
const text_1 = require("../directive/flow/text");
const on_1 = require("../directive/flow/on");
const watch_1 = require("../magic/reactive/watch");
const static_1 = require("../directive/reactive/static");
const component_1 = require("../directive/data/component");
const component_2 = require("../magic/data/component");
(0, mocha_1.describe)('$watch global magic property', () => {
    (0, mocha_1.it)('should be reactive', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div hx-data="{ foo: 'bar', bob: 'lob' }" hx-static="$watch('foo', value => { bob = value })">
                <h1 hx-text="foo"></h1>
                <h2 hx-text="bob"></h2>
                <button hx-on:click="foo = 'baz'"></button>
            </div>
        `;
        (0, inlinejs_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, static_1.StaticDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, on_1.OnDirectiveHandlerCompact)();
        (0, watch_1.WatchMagicHandlerCompact)();
        (0, inlinejs_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('h1').textContent).equal('bar');
        (0, chai_1.expect)(document.querySelector('h2').textContent).equal('lob');
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => {
            (0, chai_1.expect)(document.querySelector('h1').textContent).equal('baz');
            (0, chai_1.expect)(document.querySelector('h2').textContent).equal('baz');
        });
    }));
    (0, mocha_1.it)('should support nested properties', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div hx-data="{ foo: { bar: 'baz', bob: 'lob' } }" hx-static="$watch('foo.bar', value => { foo.bob = value })">
                <h1 hx-text="foo.bar"></h1>
                <h2 hx-text="foo.bob"></h2>
                <button hx-on:click="foo.bar = 'law'"></button>
            </div>
        `;
        (0, inlinejs_1.CreateGlobal)(undefined, 1002);
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, static_1.StaticDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, on_1.OnDirectiveHandlerCompact)();
        (0, watch_1.WatchMagicHandlerCompact)();
        (0, inlinejs_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('h1').textContent).equal('baz');
        (0, chai_1.expect)(document.querySelector('h2').textContent).equal('lob');
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => {
            (0, chai_1.expect)(document.querySelector('h1').textContent).equal('law');
            (0, chai_1.expect)(document.querySelector('h2').textContent).equal('law');
        });
    }));
    (0, mocha_1.it)('should be reactive with arrays', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div hx-data="{ $config: { reactiveState: 'unoptimized' }, foo: ['one'], bob: 'lob' }" hx-static="$watch('foo', value => { bob = value.map(item => item) })">
                <h1 hx-text="foo"></h1>
                <h2 hx-text="bob"></h2>
                <button id="push" hx-on:click="foo.push('two')"></button>
                <button id="pop" hx-on:click="foo.pop()"></button>
                <button id="unshift" hx-on:click="foo.unshift('zero')"></button>
                <button id="shift" hx-on:click="foo.shift()"></button>
                <button id="assign" hx-on:click="foo = [2,1,3]"></button>
                <button id="sort" hx-on:click="foo.sort()"></button>
                <button id="reverse" hx-on:click="foo.reverse()"></button>
            </div>
        `;
        (0, inlinejs_1.CreateGlobal)(undefined, 1004);
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, static_1.StaticDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, on_1.OnDirectiveHandlerCompact)();
        (0, watch_1.WatchMagicHandlerCompact)();
        (0, inlinejs_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('h1').textContent).equal('["one"]');
        (0, chai_1.expect)(document.querySelector('h2').textContent).equal('lob');
        user_event_1.default.click(document.querySelector('#push'));
        yield (0, dom_1.waitFor)(() => {
            (0, chai_1.expect)(document.querySelector('h1').textContent).equal('["one","two"]');
            (0, chai_1.expect)(document.querySelector('h2').textContent).equal('["one","two"]');
        });
        user_event_1.default.click(document.querySelector('#pop'));
        yield (0, dom_1.waitFor)(() => {
            (0, chai_1.expect)(document.querySelector('h1').textContent).equal('["one"]');
            (0, chai_1.expect)(document.querySelector('h2').textContent).equal('["one"]');
        });
        user_event_1.default.click(document.querySelector('#unshift'));
        yield (0, dom_1.waitFor)(() => {
            (0, chai_1.expect)(document.querySelector('h1').textContent).equal('["zero","one"]');
            (0, chai_1.expect)(document.querySelector('h2').textContent).equal('["zero","one"]');
        });
        user_event_1.default.click(document.querySelector('#shift'));
        yield (0, dom_1.waitFor)(() => {
            (0, chai_1.expect)(document.querySelector('h1').textContent).equal('["one"]');
            (0, chai_1.expect)(document.querySelector('h2').textContent).equal('["one"]');
        });
        user_event_1.default.click(document.querySelector('#assign'));
        yield (0, dom_1.waitFor)(() => {
            (0, chai_1.expect)(document.querySelector('h1').textContent).equal('[2,1,3]');
            (0, chai_1.expect)(document.querySelector('h2').textContent).equal('[2,1,3]');
        });
        user_event_1.default.click(document.querySelector('#sort'));
        yield (0, dom_1.waitFor)(() => {
            (0, chai_1.expect)(document.querySelector('h1').textContent).equal('[1,2,3]');
            (0, chai_1.expect)(document.querySelector('h2').textContent).equal('[1,2,3]');
        });
        user_event_1.default.click(document.querySelector('#reverse'));
        yield (0, dom_1.waitFor)(() => {
            (0, chai_1.expect)(document.querySelector('h1').textContent).equal('[3,2,1]');
            (0, chai_1.expect)(document.querySelector('h2').textContent).equal('[3,2,1]');
        });
    }));
    (0, mocha_1.it)('should support nested arrays', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div hx-data="{ $config: { reactiveState: 'unoptimized' }, foo: {baz: ['one']}, bob: 'lob' }" hx-static="$watch('foo.baz', value => { bob = value })">
                <h1 hx-text="foo.baz"></h1>
                <h2 hx-text="bob"></h2>
                <button id="push" hx-on:click="foo.baz.push('two')"></button>
            </div>
        `;
        (0, inlinejs_1.CreateGlobal)(undefined, 1006);
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, static_1.StaticDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, on_1.OnDirectiveHandlerCompact)();
        (0, watch_1.WatchMagicHandlerCompact)();
        (0, inlinejs_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('h1').textContent).equal('["one"]');
        (0, chai_1.expect)(document.querySelector('h2').textContent).equal('lob');
        user_event_1.default.click(document.querySelector('#push'));
        yield (0, dom_1.waitFor)(() => {
            (0, chai_1.expect)(document.querySelector('h1').textContent).equal('["one","two"]');
            (0, chai_1.expect)(document.querySelector('h2').textContent).equal('["one","two"]');
        });
    }));
    (0, mocha_1.it)('should support magic properties', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div hx-data="{ foo: 'bar', bob: 'car' }" hx-component="magic-prop" hx-static="$watch('$component(\\'magic-prop\\').foo', value => bob = value)">
                <span hx-text="bob"></span>
                <button hx-on:click="$component('magic-prop').foo = 'far'"></button>
            </div>
        `;
        (0, inlinejs_1.CreateGlobal)(undefined, 1008);
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, component_1.ComponentDirectiveHandlerCompact)();
        (0, static_1.StaticDirectiveHandlerCompact)();
        (0, text_1.TextDirectiveHandlerCompact)();
        (0, on_1.OnDirectiveHandlerCompact)();
        (0, component_2.ComponentMagicHandlerCompact)();
        (0, watch_1.WatchMagicHandlerCompact)();
        (0, inlinejs_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('span').textContent).equal('car');
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').textContent).equal('far'); });
    }));
});
