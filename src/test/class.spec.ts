import { expect } from 'chai'
import { describe, it } from 'mocha'

import { waitFor } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'

import { CreateGlobal, BootstrapAndAttach } from '@benbraide/inlinejs';

import { DataDirectiveHandlerCompact } from '../directive/data/data';
import { ClassDirectiveHandlerCompact } from '../directive/attr/class';
import { OnDirectiveHandlerCompact } from '../directive/flow/on';

describe('hx-class directive', () => {
    it('should remove class when attribute value is falsy', () => {
        document.body.innerHTML = `
            <div hx-data="{ foo: false }">
                <span class="foo" hx-class:foo="foo"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        ClassDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('span')!.classList.contains('foo')).equal(false);
    });

    it('should add class when attribute value is truthy', () => {
        document.body.innerHTML = `
            <div hx-data="{ foo: true }">
                <span hx-class:foo="foo"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        ClassDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('span')!.classList.contains('foo')).equal(true);
    });

    it('should be reactive', async () => {
        document.body.innerHTML = `
            <div hx-data="{ foo: true }">
                <span hx-class:foo="foo"></span>
                <button hx-on:click="foo = false"></button>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        ClassDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('span')!.classList.contains('foo')).equal(true);
        
        userEvent.click(document.querySelector('button')!);

        await waitFor(() => { expect(document.querySelector('span')!.classList.contains('foo')).equal(false) });
    });

    it('should accept a key-value map', () => {
        document.body.innerHTML = `
            <div hx-data="{ map: { foo: true, zoo: false } }">
                <span hx-class="map"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        ClassDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('span')!.classList.contains('foo')).equal(true);
        expect(document.querySelector('span')!.classList.contains('zoo')).equal(false);
    });

    it('should have reactive key-value map', async () => {
        document.body.innerHTML = `
            <div hx-data="{ map: { foo: true, zoo: false } }">
                <span hx-class="map"></span>
                <button hx-on:click="map.foo = !(map.zoo = true)"></button>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        ClassDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('span')!.classList.contains('foo')).equal(true);
        expect(document.querySelector('span')!.classList.contains('zoo')).equal(false);

        userEvent.click(document.querySelector('button')!);

        await waitFor(() => { expect(document.querySelector('span')!.classList.contains('foo')).equal(false) });
        await waitFor(() => { expect(document.querySelector('span')!.classList.contains('zoo')).equal(true) });
    });

    it('should accept the short form and be reactive', async () => {
        document.body.innerHTML = `
            <div hx-data="{ foo: true }">
                <span .foo="foo"></span>
                <button hx-on:click="foo = false"></button>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        ClassDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('span')!.classList.contains('foo')).equal(true);
        
        userEvent.click(document.querySelector('button')!);

        await waitFor(() => { expect(document.querySelector('span')!.classList.contains('foo')).equal(false) });
    });

    it('should be merged by string syntax', async () => {
        document.body.innerHTML = `
            <div hx-data="{ isOn: false }">
                <span class="foo" hx-class="isOn ? 'bar': ''"></span>
                <button hx-on:click="isOn = ! isOn"></button>
            </div>
        `;
        
        CreateGlobal();

        DataDirectiveHandlerCompact();
        ClassDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('span')!.classList.contains('foo')).equal(true);
        expect(document.querySelector('span')!.classList.contains('bar')).equal(false);
    
        userEvent.click(document.querySelector('button')!);
    
        await waitFor(() => {
            expect(document.querySelector('span')!.classList.contains('foo')).equal(true);
            expect(document.querySelector('span')!.classList.contains('bar')).equal(true);
        });
    
        document.querySelector('button')!.click();
    
        await waitFor(() => {
            expect(document.querySelector('span')!.classList.contains('foo')).equal(true);
            expect(document.querySelector('span')!.classList.contains('bar')).equal(false);
        });
    });

    it('should be merged by array syntax', async () => {
        document.body.innerHTML = `
            <div hx-data="{ isOn: false }">
                <span class="foo" hx-class="isOn ? ['bar', 'baz'] : ['bar']"></span>
                <button hx-on:click="isOn = ! isOn"></button>
            </div>
        `;
        
        CreateGlobal();

        DataDirectiveHandlerCompact();
        ClassDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('span')!.classList.contains('foo')).equal(true);
        expect(document.querySelector('span')!.classList.contains('bar')).equal(true);
        expect(document.querySelector('span')!.classList.contains('baz')).equal(false);
    
        document.querySelector('button')!.click();
    
        await waitFor(() => {
            expect(document.querySelector('span')!.classList.contains('foo')).equal(true);
            expect(document.querySelector('span')!.classList.contains('bar')).equal(true);
            expect(document.querySelector('span')!.classList.contains('baz')).equal(true);
        });
    
        document.querySelector('button')!.click();
    
        await waitFor(() => {
            expect(document.querySelector('span')!.classList.contains('foo')).equal(true);
            expect(document.querySelector('span')!.classList.contains('bar')).equal(true);
            expect(document.querySelector('span')!.classList.contains('baz')).equal(false);
        });
    });

    it('should remove multiple classes by object syntax', () => {
        document.body.innerHTML = `
            <div hx-data="{ isOn: false }">
                <span class="foo bar" hx-class="{ 'foo bar': isOn }"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        ClassDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('span')!.classList.contains('foo')).equal(false);
        expect(document.querySelector('span')!.classList.contains('bar')).equal(false);
    });

    it('should add multiple classes by object syntax', () => {
        document.body.innerHTML = `
            <div hx-data="{ isOn: true }">
                <span hx-class="{ 'foo bar': isOn }"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        ClassDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('span')!.classList.contains('foo')).equal(true);
        expect(document.querySelector('span')!.classList.contains('bar')).equal(true);
    });

    it('should be added by array syntax', () => {
        document.body.innerHTML = `
            <div hx-data>
                <span class="" hx-class="['foo', 'bar']"></span>
            </div>
        `;
        
        CreateGlobal();

        DataDirectiveHandlerCompact();
        ClassDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('span')!.classList.contains('foo')).equal(true);
        expect(document.querySelector('span')!.classList.contains('bar')).equal(true);
    });

    it('should be synced by string syntax', () => {
        document.body.innerHTML = `
            <div hx-data="{foo: 'bar baz'}">
                <span class="" hx-class="foo"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        ClassDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('span')!.classList.contains('bar')).equal(true);
        expect(document.querySelector('span')!.classList.contains('baz')).equal(true);
    });

    it('should ignore extra whitespace in object syntax', async () => {
        document.body.innerHTML = `
            <div hx-data>
                <span hx-class="{ '  foo  bar  ': true }"></span>
            </div>
        `;

        CreateGlobal();

        DataDirectiveHandlerCompact();
        ClassDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('span')!.classList.contains('foo')).equal(true);
        expect(document.querySelector('span')!.classList.contains('bar')).equal(true);
    });
    
    it('should ignore extra whitespace in string syntax', () => {
        document.body.innerHTML = `
            <div hx-data>
                <span hx-class="'  foo  bar  '"></span>
            </div>
        `;

        CreateGlobal();

        DataDirectiveHandlerCompact();
        ClassDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('span')!.classList.contains('foo')).equal(true);
        expect(document.querySelector('span')!.classList.contains('bar')).equal(true);
    });
});
