import { expect } from 'chai'
import { describe, it } from 'mocha'

import { waitFor } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'

import { CreateGlobal, BootstrapAndAttach } from '@benbraide/inlinejs';

import { DataDirectiveHandlerCompact } from '../directive/data/data';
import { TextDirectiveHandlerCompact } from '../directive/flow/text';
import { OnDirectiveHandlerCompact } from '../directive/flow/on';
import { ClassDirectiveHandlerCompact } from '../directive/attr/class';

describe('hx-on directive', () => {
    it('should reflect modified data in event listener to attribute bindings', async () => {
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
    
        expect(document.querySelector('span')!.textContent).equal('bar');
    
        userEvent.click(document.querySelector('button')!);
    
        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal('baz') });
    });

    it('should reflect modified nested data in event listener to attribute bindings', async () => {
        document.body.innerHTML = `
            <div hx-data="{ nested: { foo: 'bar' }}">
                <button hx-on:click="nested.foo = 'baz'"></button>
                <span hx-text="nested.foo"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('span')!.textContent).equal('bar');
    
        userEvent.click(document.querySelector('button')!);
    
        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal('baz') });
    });

    it('should stop propagation with the \'.stop\' modifier', async () => {
        document.body.innerHTML = `
            <div hx-data="{ foo: 'bar' }" hx-on:click="foo = 'bubbled'">
                <button hx-on:click="foo = 'baz'"></button>
                <button hx-on:click.stop="foo = 'baz'"></button>
                <span hx-text="foo"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('span')!.textContent).equal('bar');
    
        userEvent.click(document.querySelectorAll('button')[0]);
    
        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal('bubbled') });

        userEvent.click(document.querySelectorAll('button')[1]);
    
        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal('baz') });
    });

    it('should prevent default with the \'.prevent\' modifier', async () => {
        document.body.innerHTML = `
            <div hx-data="{}">
                <input type="checkbox" hx-on:click>
                <input type="checkbox" hx-on:click.prevent>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelectorAll('input')[0].checked).equal(false);
        expect(document.querySelectorAll('input')[1].checked).equal(false);
    
        userEvent.click(document.querySelectorAll('input')[0]);
    
        await waitFor(() => { expect(document.querySelectorAll('input')[0].checked).equal(true) });

        userEvent.click(document.querySelectorAll('input')[1]);
    
        await waitFor(() => { expect(document.querySelectorAll('input')[1].checked).equal(false) });
    });

    it('should only trigger when event target is element with the \'.self\' modifier', async () => {
        document.body.innerHTML = `
            <div hx-data="{ foo: 'bar' }">
                <div hx-on:click.self="foo = 'baz'" id="selfTarget">
                    <button></button>
                </div>
                <span hx-text="foo"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('span')!.textContent).equal('bar')
    
        userEvent.click(document.querySelector('button')!);
    
        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal('bar') });
    
        userEvent.click(document.querySelector('#selfTarget')!);
    
        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal('baz') });
    });

    it('should bind event on the window object with the \'.window\' modifier', async () => {
        document.body.innerHTML = `
            <div hx-data="{ foo: 'bar' }">
                <div hx-on:click.window="foo = 'baz'"></div>
                <span hx-text="foo"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('span')!.textContent).equal('bar');
    
        userEvent.click(document.body);
    
        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal('baz') });
    });

    it('should bind event on the document object with the \'.document\' modifier', async () => {
        document.body.innerHTML = `
            <div hx-data="{ foo: 'bar' }">
                <div hx-on:click.document="foo = 'baz'"></div>
                <span hx-text="foo"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('span')!.textContent).equal('bar');
    
        userEvent.click(document.body);
    
        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal('baz') });
    });

    it('should only trigger when target is not element or contained inside element with the \'.outside\' modifier', async () => {
        document.body.innerHTML = `
            <div hx-data="{ isOpen: true }">
                <ul hx-class:hidden="! isOpen" hx-on:click.outside="isOpen = false">
                    <li hx-on:click="isOpen = true">...</li>
                </ul>
                <button></button>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        ClassDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('ul')!.classList.contains('hidden')).equal(false);
    
        userEvent.click(document.querySelector('li')!);
    
        await waitFor(() => { expect(document.querySelector('ul')!.classList.contains('hidden')).equal(false) });
    
        userEvent.click(document.querySelector('ul')!);
    
        await waitFor(() => { expect(document.querySelector('ul')!.classList.contains('hidden')).equal(false) });
    
        userEvent.click(document.querySelector('button')!);
    
        await waitFor(() => { expect(document.querySelector('ul')!.classList.contains('hidden')).equal(true) });
    
        userEvent.click(document.querySelector('li')!);
    
        await waitFor(() => { expect(document.querySelector('ul')!.classList.contains('hidden')).equal(false) });
    });

    it('should trigger only once with the \'.once\' modifier', async () => {
        document.body.innerHTML = `
            <div hx-data="{ count: 0 }">
                <button hx-on:click.once="++count"></button>
                <span hx-text="count"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('span')!.textContent).equal('0');
    
        userEvent.click(document.querySelector('button')!);
    
        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal('1') });
    
        userEvent.click(document.querySelector('button')!);
    
        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal('1') });
    });

    it('should handle keydown events with modifiers', async () => {
        document.body.innerHTML = `
            <div hx-data="{ count: 0 }">
                <input type="text" hx-on:keydown="count++" hx-on:keydown.state.enter="count++" hx-on:keydown.state.space="count++">
                <span hx-text="count"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('span')!.textContent).equal('0');
    
        userEvent.type(document.querySelector('input')!, '{enter}');
    
        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal('2') });
    
        userEvent.type(document.querySelector('input')!, ' ');
    
        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal('5') });
    
        userEvent.type(document.querySelector('input')!, '{space}');
    
        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal('8') });
    
        userEvent.type(document.querySelector('input')!, '{esc}');
    
        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal('11') });
    });

    it('should handle keydown events with exclusive modifiers', async () => {
        document.body.innerHTML = `
            <div hx-data="{ count: 0 }">
                <input type="text" hx-on:keydown="count++" hx-on:keydown.state.enter.space="count++">
                <span hx-text="count"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('span')!.textContent).equal('0');
    
        userEvent.type(document.querySelector('input')!, '{enter}');
    
        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal('2') });
    
        userEvent.type(document.querySelector('input')!, ' ');
    
        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal('4') });
    
        userEvent.type(document.querySelector('input')!, '{space}');
    
        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal('6') });
    
        userEvent.type(document.querySelector('input')!, '{esc}');
    
        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal('8') });
    });

    it('should handle keydown events with combo modifiers', async () => {
        document.body.innerHTML = `
            <div hx-data="{ count: 0 }">
                <input type="text" hx-on:keydown.ctrl.enter="count++">
                <span hx-text="count"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('span')!.textContent).equal('0');
    
        userEvent.type(document.querySelector('input')!, '{enter}');
    
        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal('0') });
    
        userEvent.type(document.querySelector('input')!, '{ctrl}{enter}');
    
        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal('1') });
    });

    it('should only stop propagation for keydown with specified key and the \'.stop\' modifier', async () => {
        document.body.innerHTML = `
            <div hx-data="{ count: 0 }">
                <article hx-on:keydown="count++">
                    <input type="text" hx-on:keydown.enter.stop>
                </article>
                <span hx-text="count"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('span')!.textContent).equal('0');
    
        userEvent.type(document.querySelector('input')!, '{esc}');
    
        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal('1') });
    
        userEvent.type(document.querySelector('input')!, '{enter}');
    
        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal('1') });
    });

    it('should support short syntax', async () => {
        document.body.innerHTML = `
            <div hx-data="{ foo: 'bar' }">
                <button @click="foo = 'baz'"></button>
                <span hx-text="foo"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('span')!.textContent).equal('bar');
    
        userEvent.click(document.querySelector('button')!);
    
        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal('baz') });
    });

    it('should support event with colon', async () => {
        document.body.innerHTML = `
            <div hx-data="{ foo: 'bar' }">
                <div hx-on:my:event.document="foo = 'baz'"></div>
                <span hx-text="foo"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('span')!.textContent).equal('bar');
    
        document.dispatchEvent(new CustomEvent('my:event'));
    
        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal('baz') });
    });

    it('should bind to the proper event with the \'.join\' modifier', async () => {
        document.body.innerHTML = `
            <div hx-data="{ foo: 'bar' }">
                <div hx-on:my-event.join.document="foo = 'baz'"></div>
                <span hx-text="foo"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('span')!.textContent).equal('bar');
    
        document.dispatchEvent(new CustomEvent('my.event'));
    
        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal('baz') });
    });

    it('should bind to the proper event with the \'.camel\' modifier', async () => {
        document.body.innerHTML = `
            <div hx-data="{ foo: 'bar' }">
                <div hx-on:my-event.camel.document="foo = 'baz'"></div>
                <span hx-text="foo"></span>
            </div>
        `;
    
        CreateGlobal();

        DataDirectiveHandlerCompact();
        TextDirectiveHandlerCompact();
        OnDirectiveHandlerCompact();

        BootstrapAndAttach();
    
        expect(document.querySelector('span')!.textContent).equal('bar');
    
        document.dispatchEvent(new CustomEvent('myEvent'));
    
        await waitFor(() => { expect(document.querySelector('span')!.textContent).equal('baz') });
    });
});
