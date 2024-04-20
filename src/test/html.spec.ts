import { expect } from 'chai'
import { describe, it } from 'mocha'

import { waitFor } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'

import { CreateGlobal, BootstrapAndAttach } from '@benbraide/inlinejs';

import { DataDirectiveHandlerCompact } from '../directive/data/data';
import { OnDirectiveHandlerCompact } from '../directive/flow/on';
import { HtmlDirectiveHandlerCompact } from '../directive/flow/html';

describe('hx-html directive', () => {
    it('should set text content on init', async () => {
        document.body.innerHTML = `
            <div hx-data="{ foo: 'bar' }">
                <span hx-html="foo"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        HtmlDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        await waitFor(() => { expect(document.querySelector('span')!.innerHTML).equal('bar') });
    });

    it('should be reactive', async () => {
        document.body.innerHTML = `
            <div hx-data="{ foo: 'bar' }">
                <button hx-on:click="foo = 'baz'"></button>
                <span hx-html="foo"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        HtmlDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        await waitFor(() => { expect(document.querySelector('span')!.innerHTML).equal('bar') });
    
        userEvent.click(document.querySelector('button')!);
    
        await waitFor(() => { expect(document.querySelector('span')!.innerHTML).equal('baz') });
    });

    it('should work with async expressions', async () => {
        globalThis.asyncCall = () => {
            return new Promise<string>((resolve) => setTimeout(() => resolve('foo')));
        };
        
        document.body.innerHTML = `
            <div hx-data>
                <span hx-html="globalThis.asyncCall()"></span>
            </div>
        `;
    
        CreateGlobal({
            useGlobalWindow: true,
        });

        DataDirectiveHandlerCompact();
        HtmlDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        await waitFor(() => { expect(document.querySelector('span')!.innerHTML).equal('foo') });
    });
});
