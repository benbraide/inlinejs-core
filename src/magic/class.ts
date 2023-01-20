import { FindComponentById, AddMagicHandler, CreateMagicHandlerCallback, CreateReadonlyProxy, InitJITProxy } from "@benbraide/inlinejs";

export const ClassMagicHandler = CreateMagicHandlerCallback('class', ({ componentId, component, contextElement }) => {
    let [elementKey, proxy, scope] = InitJITProxy('class', (component || FindComponentById(componentId)), contextElement);
    if (proxy){//Invalid context element OR proxy already exists
        return proxy;
    }

    let methods = {
        add(...values: string[]){
            contextElement.classList.add(...values);
            return this;
        },
        remove(...values: string[]){
            contextElement.classList.remove(...values.filter(value => contextElement.classList.contains(value)));
            return this;
        },
        toggle(...values: string[]){
            values.map(value => contextElement.classList.toggle(value));
            return this;
        },
        toggleOn(state: boolean, ...values: string[]){
            return (state ? this.add(...values) : this.remove(...values));
        },
        set(...values: string[]){
            contextElement.className = values.join(' ');
            return this;
        },
        get value(){
            return contextElement.className;
        },
        contains: (...values: string[]) => (values.findIndex(value => !contextElement.classList.contains(value)) == -1),
    };
    
    return (elementKey ? (scope![elementKey] = CreateReadonlyProxy(methods)) : CreateReadonlyProxy(methods));
});

export function ClassMagicHandlerCompact(){
    AddMagicHandler(ClassMagicHandler);
}
