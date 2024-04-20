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
const bind_1 = require("../directive/attr/bind");
const on_1 = require("../directive/flow/on");
(0, mocha_1.describe)('hx-bind directive', () => {
    (0, mocha_1.it)('should set corresponding value on initialization', () => {
        document.body.innerHTML = `
            <div hx-data="{ foo: 'bar' }">
                <span hx-bind:foo="foo"></span>
            </div>
        `;
        (0, inlinejs_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, bind_1.BindDirectiveHandlerCompact)();
        (0, inlinejs_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('span').getAttribute('foo')).equal('bar');
    });
    (0, mocha_1.it)('should be reactive', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div hx-data="{ foo: 'bar' }">
                <span hx-bind:foo="foo"></span>
                <button hx-on:click="foo = 'baz'"></button>
            </div>
        `;
        (0, inlinejs_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, bind_1.BindDirectiveHandlerCompact)();
        (0, on_1.OnDirectiveHandlerCompact)();
        (0, inlinejs_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('span').getAttribute('foo')).equal('bar');
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').getAttribute('foo')).equal('baz'); });
    }));
    (0, mocha_1.it)('should accept a key-value map', () => {
        document.body.innerHTML = `
            <div hx-data="{ map: { foo: 'bar', zoo: 'tiger' } }">
                <span hx-bind="map"></span>
            </div>
        `;
        (0, inlinejs_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, bind_1.BindDirectiveHandlerCompact)();
        (0, inlinejs_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('span').getAttribute('foo')).equal('bar');
        (0, chai_1.expect)(document.querySelector('span').getAttribute('zoo')).equal('tiger');
    });
    (0, mocha_1.it)('should have reactive key-value map', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div hx-data="{ map: { foo: 'bar', zoo: 'tiger' } }">
                <span hx-bind="map"></span>
                <button hx-on:click="map.zoo = 'leopard'"></button>
            </div>
        `;
        (0, inlinejs_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, bind_1.BindDirectiveHandlerCompact)();
        (0, on_1.OnDirectiveHandlerCompact)();
        (0, inlinejs_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('span').getAttribute('foo')).equal('bar');
        (0, chai_1.expect)(document.querySelector('span').getAttribute('zoo')).equal('tiger');
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').getAttribute('foo')).equal('bar'); });
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').getAttribute('zoo')).equal('leopard'); });
    }));
    (0, mocha_1.it)('should accept the short form and be reactive', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div hx-data="{ foo: 'bar' }">
                <span :foo="foo"></span>
                <button hx-on:click="foo = 'baz'"></button>
            </div>
        `;
        (0, inlinejs_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, bind_1.BindDirectiveHandlerCompact)();
        (0, on_1.OnDirectiveHandlerCompact)();
        (0, inlinejs_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('span').getAttribute('foo')).equal('bar');
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').getAttribute('foo')).equal('baz'); });
    }));
    (0, mocha_1.it)('should remove non-boolean attributes with null/undefined/false values', () => {
        document.body.innerHTML = `
            <div hx-data>
                <a href="#hello" hx-bind:href="null"></a>
                <a href="#hello" hx-bind:href="false"></a>
                <a href="#hello" hx-bind:href="undefined"></a>
                <span visible="true" hx-bind:visible="null"></span>
                <span visible="true" hx-bind:visible="false"></span>
                <span visible="true" hx-bind:visible="undefined"></span>
            </div>
        `;
        (0, inlinejs_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, bind_1.BindDirectiveHandlerCompact)();
        (0, inlinejs_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelectorAll('a')[0].getAttribute('href')).equal(null);
        (0, chai_1.expect)(document.querySelectorAll('a')[1].getAttribute('href')).equal(null);
        (0, chai_1.expect)(document.querySelectorAll('a')[2].getAttribute('href')).equal(null);
        (0, chai_1.expect)(document.querySelectorAll('span')[0].getAttribute('visible')).equal(null);
        (0, chai_1.expect)(document.querySelectorAll('span')[1].getAttribute('visible')).equal(null);
        (0, chai_1.expect)(document.querySelectorAll('span')[2].getAttribute('visible')).equal(null);
    });
    (0, mocha_1.it)('should not remove non-boolean attributes with empty string values', () => {
        document.body.innerHTML = `
            <div hx-data>
                <a href="#hello" hx-bind:href="''"></a>
            </div>
        `;
        (0, inlinejs_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, bind_1.BindDirectiveHandlerCompact)();
        (0, inlinejs_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelectorAll('a')[0].getAttribute('href')).equal('');
    });
    (0, mocha_1.it)('should set boolean attributes with truthy values to their attribute name', () => {
        document.body.innerHTML = `
            <div hx-data="{ isSet: true }">
                <input hx-bind:disabled="isSet"></input>
                <input hx-bind:checked="isSet"></input>
                <input hx-bind:required="isSet"></input>
                <input hx-bind:readonly="isSet"></input>
                <details hx-bind:open="isSet"></details>
                <select hx-bind:multiple="isSet">
                    <option hx-bind:selected="isSet"></option>
                </select>
                <dl hx-bind:itemscope="isSet"></dl>
                <form hx-bind:novalidate="isSet"></form>
                <iframe
                    hx-bind:allowfullscreen="isSet"
                    hx-bind:allowpaymentrequest="isSet"
                ></iframe>
                <button hx-bind:formnovalidate="isSet"></button>
                <audio
                    hx-bind:autoplay="isSet"
                    hx-bind:controls="isSet"
                    hx-bind:loop="isSet"
                    hx-bind:muted="isSet"
                ></audio>
                <video hx-bind:playsinline="isSet"></video>
                <track hx-bind:default="isSet" />
                <img hx-bind:ismap="isSet" />
                <ol hx-bind:reversed="isSet"></ol>
                <script
                    hx-bind:async="isSet"
                    hx-bind:defer="isSet"
                    hx-bind:nomodule="isSet"
                ></script>
            </div>
        `;
        (0, inlinejs_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, bind_1.BindDirectiveHandlerCompact)();
        (0, inlinejs_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelectorAll('input')[0].disabled).equal(true);
        (0, chai_1.expect)(document.querySelectorAll('input')[1].checked).equal(true);
        (0, chai_1.expect)(document.querySelectorAll('input')[2].required).equal(true);
        (0, chai_1.expect)(document.querySelectorAll('input')[3].readOnly).equal(true);
        (0, chai_1.expect)(document.querySelectorAll('details')[0].open).equal(true);
        (0, chai_1.expect)(document.querySelectorAll('option')[0].selected).equal(true);
        (0, chai_1.expect)(document.querySelectorAll('select')[0].multiple).equal(true);
        (0, chai_1.expect)(document.querySelectorAll('dl')[0].getAttribute('itemscope')).equal('itemscope');
        (0, chai_1.expect)(document.querySelectorAll('form')[0].getAttribute('novalidate')).equal('novalidate');
        (0, chai_1.expect)(document.querySelectorAll('iframe')[0].getAttribute('allowfullscreen')).equal('allowfullscreen');
        (0, chai_1.expect)(document.querySelectorAll('iframe')[0].getAttribute('allowpaymentrequest')).equal('allowpaymentrequest');
        (0, chai_1.expect)(document.querySelectorAll('button')[0].getAttribute('formnovalidate')).equal('formnovalidate');
        (0, chai_1.expect)(document.querySelectorAll('audio')[0].getAttribute('autoplay')).equal('autoplay');
        (0, chai_1.expect)(document.querySelectorAll('audio')[0].getAttribute('controls')).equal('controls');
        (0, chai_1.expect)(document.querySelectorAll('audio')[0].getAttribute('loop')).equal('loop');
        (0, chai_1.expect)(document.querySelectorAll('audio')[0].getAttribute('muted')).equal('muted');
        (0, chai_1.expect)(document.querySelectorAll('video')[0].getAttribute('playsinline')).equal('playsinline');
        (0, chai_1.expect)(document.querySelectorAll('track')[0].getAttribute('default')).equal('default');
        (0, chai_1.expect)(document.querySelectorAll('img')[0].getAttribute('ismap')).equal('ismap');
        (0, chai_1.expect)(document.querySelectorAll('ol')[0].getAttribute('reversed')).equal('reversed');
        (0, chai_1.expect)(document.querySelectorAll('script')[0].getAttribute('async')).equal('async');
        (0, chai_1.expect)(document.querySelectorAll('script')[0].getAttribute('defer')).equal('defer');
        (0, chai_1.expect)(document.querySelectorAll('script')[0].getAttribute('nomodule')).equal('nomodule');
    });
    (0, mocha_1.it)('should remove boolean attributes with falsy values', () => {
        document.body.innerHTML = `
            <div hx-data="{ isSet: false }">
                <input hx-bind:disabled="isSet"></input>
                <input hx-bind:checked="isSet"></input>
                <input hx-bind:required="isSet"></input>
                <input hx-bind:readonly="isSet"></input>
                <input hx-bind:hidden="isSet"></input>
                <details hx-bind:open="isSet"></details>
                <select hx-bind:multiple="isSet"></select>
                <option hx-bind:selected="isSet"></option>
                <textarea hx-bind:autofocus="isSet"></textarea>
                <dl hx-bind:itemscope="isSet"></dl>
                <form hx-bind:novalidate="isSet"></form>
                <iframe
                    hx-bind:allowfullscreen="isSet"
                    hx-bind:allowpaymentrequest="isSet"
                ></iframe>
                <button hx-bind:formnovalidate="isSet"></button>
                <audio
                    hx-bind:autoplay="isSet"
                    hx-bind:controls="isSet"
                    hx-bind:loop="isSet"
                    hx-bind:muted="isSet"
                ></audio>
                <video hx-bind:playsinline="isSet"></video>
                <track hx-bind:default="isSet" />
                <img hx-bind:ismap="isSet" />
                <ol hx-bind:reversed="isSet"></ol>
                <script
                    hx-bind:async="isSet"
                    hx-bind:defer="isSet"
                    hx-bind:nomodule="isSet"
                ></script>
            </div>
        `;
        (0, inlinejs_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, bind_1.BindDirectiveHandlerCompact)();
        (0, inlinejs_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelectorAll('input')[0].getAttribute('disabled')).equal(null);
        (0, chai_1.expect)(document.querySelectorAll('input')[1].getAttribute('checked')).equal(null);
        (0, chai_1.expect)(document.querySelectorAll('input')[2].getAttribute('required')).equal(null);
        (0, chai_1.expect)(document.querySelectorAll('input')[3].getAttribute('readOnly')).equal(null);
        (0, chai_1.expect)(document.querySelectorAll('input')[4].getAttribute('hidden')).equal(null);
        (0, chai_1.expect)(document.querySelectorAll('details')[0].getAttribute('open')).equal(null);
        (0, chai_1.expect)(document.querySelectorAll('option')[0].getAttribute('selected')).equal(null);
        (0, chai_1.expect)(document.querySelectorAll('select')[0].getAttribute('multiple')).equal(null);
        (0, chai_1.expect)(document.querySelectorAll('textarea')[0].getAttribute('autofocus')).equal(null);
        (0, chai_1.expect)(document.querySelectorAll('dl')[0].getAttribute('itemscope')).equal(null);
        (0, chai_1.expect)(document.querySelectorAll('form')[0].getAttribute('novalidate')).equal(null);
        (0, chai_1.expect)(document.querySelectorAll('iframe')[0].getAttribute('allowfullscreen')).equal(null);
        (0, chai_1.expect)(document.querySelectorAll('iframe')[0].getAttribute('allowpaymentrequest')).equal(null);
        (0, chai_1.expect)(document.querySelectorAll('button')[0].getAttribute('formnovalidate')).equal(null);
        (0, chai_1.expect)(document.querySelectorAll('audio')[0].getAttribute('autoplay')).equal(null);
        (0, chai_1.expect)(document.querySelectorAll('audio')[0].getAttribute('controls')).equal(null);
        (0, chai_1.expect)(document.querySelectorAll('audio')[0].getAttribute('loop')).equal(null);
        (0, chai_1.expect)(document.querySelectorAll('audio')[0].getAttribute('muted')).equal(null);
        (0, chai_1.expect)(document.querySelectorAll('video')[0].getAttribute('playsinline')).equal(null);
        (0, chai_1.expect)(document.querySelectorAll('track')[0].getAttribute('default')).equal(null);
        (0, chai_1.expect)(document.querySelectorAll('img')[0].getAttribute('ismap')).equal(null);
        (0, chai_1.expect)(document.querySelectorAll('ol')[0].getAttribute('reversed')).equal(null);
        (0, chai_1.expect)(document.querySelectorAll('script')[0].getAttribute('async')).equal(null);
        (0, chai_1.expect)(document.querySelectorAll('script')[0].getAttribute('defer')).equal(null);
        (0, chai_1.expect)(document.querySelectorAll('script')[0].getAttribute('nomodule')).equal(null);
    });
    (0, mocha_1.it)('\'.camel\' modifier correctly sets name of attribute', () => {
        document.body.innerHTML = `
            <div hx-data>
                <svg hx-bind:view-box.camel="'0 0 42 42'"></svg>
            </div>
        `;
        (0, inlinejs_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, bind_1.BindDirectiveHandlerCompact)();
        (0, inlinejs_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('svg').getAttribute('viewBox')).equal('0 0 42 42');
    });
    (0, mocha_1.it)('names can contain numbers', () => {
        document.body.innerHTML = `
            <svg hx-data>
                <line x1="1" y1="2" :x2="3" hx-bind:y2="4" />
            </svg>
        `;
        (0, inlinejs_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, bind_1.BindDirectiveHandlerCompact)();
        (0, inlinejs_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('line').getAttribute('x2')).equal('3');
        (0, chai_1.expect)(document.querySelector('line').getAttribute('y2')).equal('4');
    });
});
