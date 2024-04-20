import { expect } from 'chai'
import { describe, it } from 'mocha'

import { waitFor } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'

import { CreateGlobal, BootstrapAndAttach } from '@benbraide/inlinejs';

import { DataDirectiveHandlerCompact } from '../directive/data/data';
import { TextDirectiveHandlerCompact } from '../directive/flow/text';
import { OnDirectiveHandlerCompact } from '../directive/flow/on';

describe('hx-text directive', () => {
    it('should set text content on init', async () => {
        document.body.innerHTML = `
            <div hx-data="{ foo: 'bar', zoo: 'zar' }">
                <span hx-text="foo"></span>
                <span hx-text="zoo"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        await waitFor(() => { expect(document.querySelectorAll('span')[0].textContent).equal('bar') });
        await waitFor(() => { expect(document.querySelectorAll('span')[1].textContent).equal('zar') });
    });

    it('should be reactive', async () => {
        document.body.innerHTML = `
            <div hx-data="{ foo: 'bar' }">
                <button hx-on:click="foo = 'baz'"></button>
                <span hx-text="foo"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal('bar') });
    
        userEvent.click(document.querySelector('button')!);
    
        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal('baz') });
    });

    it('should work with async expressions', async () => {
        globalThis.asyncCall = () => {
            return new Promise<string>((resolve) => setTimeout(() => resolve('foo')));
        };
        
        document.body.innerHTML = `
            <div hx-data>
                <span hx-text="globalThis.asyncCall()"></span>
            </div>
        `;
    
        CreateGlobal({
            useGlobalWindow: true,
        });

        DataDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal('foo') });
    });
});
