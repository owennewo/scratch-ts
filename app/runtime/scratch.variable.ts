// Variable.as
// John Maloney, February 2010
//
// A variable is a name-value pair.
export class ScratchVariable {

    public name: string;
    public value: any;
    public watcher: any;
    public isPersistent: boolean;

    constructor(vName: string, initialValue: any) {
        this.name = vName;
        this.value = initialValue;
    }

    public writeJSON(json: any): void {
        json.writeKeyValue("name", this.name);
        json.writeKeyValue("value", this.value);
        json.writeKeyValue("isPersistent", this.isPersistent);
    }

}
