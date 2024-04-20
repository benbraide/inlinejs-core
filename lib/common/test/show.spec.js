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
const show_1 = require("../directive/show");
const on_1 = require("../directive/flow/on");
(0, mocha_1.describe)('hx-show directive', () => {
    (0, mocha_1.it)('should toggle display: none; with no other style attributes', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div hx-data="{ show: true }">
                <span hx-show="show"></span>
                <button hx-on:click="show = ! show"></button>
            </div>
        `;
        (0, inlinejs_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, show_1.ShowDirectiveHandlerCompact)();
        (0, on_1.OnDirectiveHandlerCompact)();
        (0, inlinejs_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('span').getAttribute('style')).equal(null);
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').getAttribute('style')).equal('display: none;'); });
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').getAttribute('style')).equal(null); });
    }));
    (0, mocha_1.it)('should toggle display: none; with other style attributes', () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
            <div hx-data="{ show: true }">
                <span hx-show="show" style="color: blue;"></span>
                <button hx-on:click="show = ! show"></button>
            </div>
        `;
        (0, inlinejs_1.CreateGlobal)();
        (0, data_1.DataDirectiveHandlerCompact)();
        (0, show_1.ShowDirectiveHandlerCompact)();
        (0, on_1.OnDirectiveHandlerCompact)();
        (0, inlinejs_1.BootstrapAndAttach)();
        (0, chai_1.expect)(document.querySelector('span').getAttribute('style')).equal('color: blue;');
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').getAttribute('style')).equal('color: blue; display: none;'); });
        user_event_1.default.click(document.querySelector('button'));
        yield (0, dom_1.waitFor)(() => { (0, chai_1.expect)(document.querySelector('span').getAttribute('style')).equal('color: blue;'); });
    }));
});
