import { ICodeConcept } from "../types";
export declare class CodeConcept implements ICodeConcept {
    private blocks_;
    AddBlock(name: string, content: string): void;
    RemoveBlock(name: string): void;
    FindBlock(name: string): string;
}
