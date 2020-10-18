export default class Metric {
    name: string;
    type: string;
    accumulatorId: number;
    value = 0;

    constructor(name: string, type: string, accumulatorId: number) {
        this.name = name;
        this.type = type;
        this.accumulatorId = accumulatorId;
    }
}
