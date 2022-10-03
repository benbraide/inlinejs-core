export interface ICodeConcept{
    AddBlock(name: string, content: string): void;
    RemoveBlock(name: string): void;
    FindBlock(name: string): string;
}
