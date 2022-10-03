import { ICodeConcept } from "../types";

export class CodeConcept implements ICodeConcept{
    private blocks_: Record<string, string> = {};
    
    public AddBlock(name: string, content: string){
        this.blocks_[name] = content;
    }

    public RemoveBlock(name: string){
        delete this.blocks_[name];
    }

    public FindBlock(name: string){
        return (this.blocks_.hasOwnProperty(name) ? this.blocks_[name] : '');
    }
}
