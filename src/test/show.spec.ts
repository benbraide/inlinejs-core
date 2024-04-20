import { expect } from 'chai'
import { describe, it } from 'mocha'

import { waitFor } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'

import { CreateGlobal, BootstrapAndAttach } from '@benbraide/inlinejs';

import { DataDirectiveHandlerCompact } from '../directive/data/data';
import { ShowDirectiveHandlerCompact } from '../directive/show';
import { OnDirectiveHandlerCompact } from '../directive/flow/on';

describe('hx-show directive', () => {
    it('should toggle display: none; with no other style attributes', async () => {
        document.body.innerHTML = `
            <div hx-data="{ show: true }">
                <span hx-show="show"></span>
                <button hx-on:click="show = ! show"></button>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        ShowDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('span')!.getAttribute('style')).equal(null);
    
        userEvent.click(document.querySelector('button')!);
    
        await waitFor(() => { expect(document.querySelector('span')!.getAttribute('style')).equal('display: none;') });

        userEvent.click(document.querySelector('button')!);
    
        await waitFor(() => { expect(document.querySelector('span')!.getAttribute('style')).equal(null) });
    });

    it('should toggle display: none; with other style attributes', async () => {
        document.body.innerHTML = `
            <div hx-data="{ show: true }">
                <span hx-show="show" style="color: blue;"></span>
                <button hx-on:click="show = ! show"></button>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        ShowDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('span')!.getAttribute('style')).equal('color: blue;');
    
        userEvent.click(document.querySelector('button')!);
    
        await waitFor(() => { expect(document.querySelector('span')!.getAttribute('style')).equal('color: blue; display: none;') });

        userEvent.click(document.querySelector('button')!);
    
        await waitFor(() => { expect(document.querySelector('span')!.getAttribute('style')).equal('color: blue;') });
    });
});
