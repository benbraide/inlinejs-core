import { expect } from 'chai'
import { describe, it } from 'mocha'

import { waitFor } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'

import { CreateGlobal, BootstrapAndAttach } from '@benbraide/inlinejs';

import { DataDirectiveHandlerCompact } from '../directive/data/data';
import { TextDirectiveHandlerCompact } from '../directive/flow/text';
import { UninitDirectiveHandlerCompact } from '../directive/lifecycle/uninit';
import { PostDirectiveHandlerCompact } from '../directive/lifecycle/post';
import { OnDirectiveHandlerCompact } from '../directive/flow/on';
import { StaticDirectiveHandlerCompact } from '../directive/reactive/static';

describe('lifecycle', () => {
    it('should execute \'hx-uninit\' on element removal', async () => {
        const runObservers = new Array<(changes: Array<any>) => void>();

        (global.MutationObserver as unknown) = class {
            constructor(callback: (changes: Array<any>) => void) {
                runObservers.push(callback);
            }

            observe() {}
        };
        
        document.body.innerHTML = `
            <div hx-data="{ foo: 'bar' }">
                <span hx-text="foo"></span>
                <span hx-uninit="foo = 'baz'"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        UninitDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelectorAll('span')[0].textContent).equal('bar');

        let span = document.querySelectorAll('span')[1];
        span.remove();
        
        runObservers.forEach(cb => cb([
            {
                target: document.body.firstElementChild,
                type: 'childList',
                addedNodes: [],
                removedNodes: [ span ],
            },
        ]));
        
        await waitFor(() => { expect(document.querySelectorAll('span')[0].textContent).equal('baz') });
    });

    it('should execute \'hx-post\' after all other directives and offspring directives are evaluated', async () => {
        document.body.innerHTML = `
            <div hx-data="{ foo: 'bar' }" hx-post="foo = 'post'">
                <span hx-text="foo" hx-static="foo = 'bar'"></span>
            </div>
        `;

        CreateGlobal();

        DataDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        PostDirectiveHandlerCompact();
        StaticDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal('post') });
    });

    it('should execute \'hx-post\' after offspring hx-post directives are evaluated', async () => {
        document.body.innerHTML = `
            <div hx-data="{ foo: 'bar' }" hx-post="foo = 'post'">
                <span hx-text="foo" hx-post="foo = 'bar'"></span>
            </div>
        `;

        CreateGlobal();

        DataDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        PostDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal('post') });
    });

    it('should bind elements added to the DOM after initial attachment', async () => {
        const runObservers = new Array<(changes: Array<any>) => void>();

        (global.MutationObserver as unknown) = class {
            constructor(callback: (changes: Array<any>) => void) {
                runObservers.push(callback);
            }

            observe() {}
        };
        
        document.body.innerHTML = `
            <div hx-data="{ foo: 'bar' }">
                <span hx-text="foo"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        StaticDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelectorAll('span')[0].textContent).equal('bar');

        let tmpl = document.createElement('template');
        tmpl.innerHTML = `
            <span hx-static="foo = 'baz'"></span>
            <button hx-on:click="foo = 'clicked'"></button>
        `;

        let newEls = Array.from(tmpl.content.children).map(child => child.cloneNode(true));
        newEls.forEach(el => document.body.firstElementChild!.appendChild(el));
        
        runObservers.forEach(cb => cb([
            {
                target: document.body.firstElementChild,
                type: 'childList',
                addedNodes: newEls,
                removedNodes: [],
            }
        ]));
        
        await waitFor(() => { expect(document.querySelectorAll('span')[0].textContent).equal('baz') });

        userEvent.click(document.querySelector('button')!);
        
        await waitFor(() => { expect(document.querySelectorAll('span')[0].textContent).equal('clicked') });
    });
});
