import { FindComponentById, AddMagicHandler, CreateMagicHandlerCallback, BuildGetterProxyOptions, CreateInplaceProxy, IMagicHandlerParams } from "@benbraide/inlinejs";

const props = {
    root: ({ componentId }: IMagicHandlerParams) => FindComponentById(componentId)?.GetRoot(),
    form: ({ componentId, contextElement }: IMagicHandlerParams) => FindComponentById(componentId)?.FindElement(contextElement, el => (el instanceof HTMLFormElement)),
    ancestor: ({ componentId, contextElement }: IMagicHandlerParams) => (index?: number) => FindComponentById(componentId)?.FindAncestor(contextElement, (index || 0)),
    parent: ({ componentId, contextElement }: IMagicHandlerParams) => FindComponentById(componentId)?.FindAncestor(contextElement, 0),
    window: () => globalThis,
    document: () => globalThis.document,
    console: () => globalThis.console,
    log: () => ((...args: any[]) => globalThis.console.log(...args)),
    alert: () => ((...args: any[]) => globalThis.alert(...args)),
};

export const DomMagicHandler = CreateMagicHandlerCallback('dom', ({ contextElement, componentId, component, ...rest }) => {
    return CreateInplaceProxy(BuildGetterProxyOptions({
        getter: (prop) => {
            if (prop && props.hasOwnProperty(prop)){
                return props[prop]({ contextElement, componentId, component, ...rest });
            }

            if (prop === 'siblings'){
                if (!contextElement.parentElement || contextElement === (component || FindComponentById(componentId))?.GetRoot()){
                    return () => null;
                }
                
                return (index?: number | string) => {
                    const children = [...(contextElement.parentElement?.children || [])];
                    if (index === 'prev' || index === 'previous'){
                        const index = children.findIndex(child => (child === contextElement));
                        return ((index > 0) ? (children.at(index - 1) || null) : null);
                    }

                    if (index === 'next'){
                        const index = children.findIndex(child => (child === contextElement));
                        return ((index >= 0 && index < (children.length - 1)) ? (children.at(index + 1) || null) : null);
                    }
                    
                    if (typeof index === 'number'){
                        return (children.filter(child => (child !== contextElement)).at(index) || null);
                    }

                    if (index === 'first'){
                        return (children.filter(child => (child !== contextElement)).at(0) || null);
                    }

                    if (index === 'last'){
                        return (children.filter(child => (child !== contextElement)).at(-1) || null);
                    }

                    return children.filter(child => (child !== contextElement));
                }
            }
        },
        lookup: [...Object.keys(props), 'siblings'],
    }));
});

export function DomMagicHandlerCompact(){
    AddMagicHandler(DomMagicHandler);
}
