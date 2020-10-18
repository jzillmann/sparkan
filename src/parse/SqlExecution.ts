import type JobExecution from './JobExecution';
import type PlanNode from './PlanNode';

export default class SqlExecution {
    id: number;
    description: string;
    startTime: number;
    stopTime: number;
    planNodes: PlanNode[];
    jobs = new Array<JobExecution>();

    constructor(id: number, description: string, startTime: number, planNodes: PlanNode[]) {
        this.id = id;
        this.description = description;
        this.startTime = startTime;
        this.planNodes = planNodes;
    }

    numberOfTasks(): number {
        return 0;
    }

    addJob(job: JobExecution) {
        this.jobs.push(job);
    }

    updateMetric(id: number, value: number) {
        let foundMetric = false;
        this.planNodes.forEach((node) =>
            node.metrics.forEach((metric) => {
                if (metric.accumulatorId === id) {
                    metric.value += value;
                    foundMetric = true;
                }
            })
        );
        if (!foundMetric) {
            console.log(`[ERROR] Did not found metric with ID ${id}`);
        }
    }
}
