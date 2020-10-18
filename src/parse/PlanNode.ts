import type Metric from './Metric';

export default class PlanNode {
    name: string;
    path: string[];
    metrics: Metric[];
    simpleString: string;

    constructor(name: string, path: string[], metrics: Metric[], simpleString: string) {
        this.name = name;
        this.path = path;
        this.metrics = metrics;
        this.simpleString = simpleString;
    }

    metricsWithValues(): Metric[] {
        return this.metrics.filter((metric) => metric.value > 0);
    }
}
