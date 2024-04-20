import { expect } from 'chai'
import { describe, it } from 'mocha'

import { waitFor } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'

import { CreateGlobal, BootstrapAndAttach } from '@benbraide/inlinejs';

import { DataDirectiveHandlerCompact } from '../directive/data/data';
import { StyleDirectiveHandlerCompact } from '../directive/attr/style';
import { OnDirectiveHandlerCompact } from '../directive/flow/on';

describe('hx-style directive', () => {
    it('should set corresponding value on initialization', () => {
        document.body.innerHTML = `
            <div hx-data="{ foo: 'block' }">
                <span hx-style:display="foo"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        StyleDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('span')!.style.display).equal('block');
    });

    it('should be reactive', async () => {
        document.body.innerHTML = `
            <div hx-data="{ foo: 'block' }">
                <span hx-style:display="foo"></span>
                <button hx-on:click="foo = 'flex'"></button>
            </div>
        `;
    
        CreateGlobal(undefined, 999);

        DataDirectiveHandlerCompact();
        StyleDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('span')!.style.display).equal('block');
        
        userEvent.click(document.querySelector('button')!);

        await waitFor(() => { expect(document.querySelector('span')!.style.display).equal('flex') });
    });

    it('should accept a key-value map', () => {
        document.body.innerHTML = `
            <div hx-data="{ map: { display: 'block', width: '180px' } }">
                <span hx-style="map"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        StyleDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('span')!.style.display).equal('block');
        expect(document.querySelector('span')!.style.width).equal('180px');
    });

    it('should have reactive key-value map', async () => {
        document.body.innerHTML = `
            <div hx-data="{ map: { display: 'block', width: '180px' } }">
                <span hx-style="map"></span>
                <button hx-on:click="map.width = '270px'"></button>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        StyleDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('span')!.style.display).equal('block');
        expect(document.querySelector('span')!.style.width).equal('180px');

        userEvent.click(document.querySelector('button')!);

        await waitFor(() => { expect(document.querySelector('span')!.style.display).equal('block') });
        await waitFor(() => { expect(document.querySelector('span')!.style.width).equal('270px') });
    });

    it('should format keys to camel casing', () => {
        document.body.innerHTML = `
            <div hx-data="{ foo: '99' }">
                <span hx-style:z-index="foo"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        StyleDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('span')!.style.zIndex).equal('99');
    });
});
