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
const on_1 = require("../directive/flow/on");
const html_1 = require("../directive/flow/html");
(0, mocha_1.describe)('hx-html directive', () => {
    (0, mocha_1.it)('should set text content on init', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div hx-data="{ foo: 'bar' }">
                <span hx-html="foo"></span>
            </div>
        `;
        (0, inlinejs_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, html_1.HtmlDirectiveHandlerCompact)();
        (0, inlinejs_1.BootstrapAndAttach)();
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').innerHTML).equal('bar'); });
    }));
    (0, mocha_1.it)('should be reactive', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div hx-data="{ foo: 'bar' }">
                <button hx-on:click="foo = 'baz'"></button>
                <span hx-html="foo"></span>
            </div>
        `;
        (0, inlinejs_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, html_1.HtmlDirectiveHandlerCompact)();
        (0, on_1.OnDirectiveHandlerCompact)();
        (0, inlinejs_1.BootstrapAndAttach)();
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').innerHTML).equal('bar'); });
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').innerHTML).equal('baz'); });
    }));
    (0, mocha_1.it)('should work with async expressions', () => __awaiter(void 0, void 0, void 0, function* () {
        globalThis.asyncCall = () => {
            return new Promise((resolve) => setTimeout(() => resolve('foo')));
        };
        document.body.innerHTML = `
            <div hx-data>
                <span hx-html="globalThis.asyncCall()"></span>
            </div>
        `;
        (0, inlinejs_1.CreateGlobal)({
            useGlobalWindow: true,
        });
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, html_1.HtmlDirectiveHandlerCompact)();
        (0, inlinejs_1.BootstrapAndAttach)();
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').innerHTML).equal('foo'); });
    }));
});
