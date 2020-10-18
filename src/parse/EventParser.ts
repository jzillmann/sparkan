import SqlExecution from './SqlExecution';
import JobExecution from './JobExecution';
import PlanNode from './PlanNode';

import Metric from './Metric';

type SqlExecutionHandle = (sqlExecution: SqlExecution) => void;

export default class EventParser {
    sqlExecutions: SqlExecution[] = [];

    parse(event: object) {
        const eventName = event['Event'];
        switch (eventName) {
            case 'org.apache.spark.sql.execution.ui.SparkListenerSQLExecutionStart': {
                const plan = event['sparkPlanInfo'];
                const planNodes = this.parseSqlPlan(plan);
                this.sqlExecutions.push(
                    new SqlExecution(event['executionId'], event['description'], event['time'], planNodes)
                );
                break;
            }
            case 'org.apache.spark.sql.execution.ui.SparkListenerSQLExecutionEnd': {
                const sqlId = event['executionId'];
                const stopTime = event['time'];
                this.doOnSqlExecution(sqlId, 'Set SQL end time', (sqlExecution) => (sqlExecution.stopTime = stopTime));
                break;
            }
            case 'org.apache.spark.sql.execution.ui.SparkListenerDriverAccumUpdates': {
                const executionId = event['executionId'];
                const accumUpdates = event['accumUpdates'] as number[][];
                this.doOnSqlExecution(executionId, 'Set Driver metrics updates', (sqlExecution) => {
                    accumUpdates.forEach((updatePair) => {
                        const [id, value] = updatePair;
                        sqlExecution.updateMetric(id, value);
                    });
                });
                break;
            }
            case 'SparkListenerJobStart': {
                const jobId = event['Job ID'];
                const submissionTime = event['Submission Time'];
                const sqlIdString = event['Properties']['spark.sql.execution.id'];
                if (sqlIdString) {
                    const sqlId = parseInt(sqlIdString);
                    const job = new JobExecution(jobId, submissionTime);
                    this.doOnSqlExecution(sqlId, `Add job ${jobId}`, (sqlExecution) => sqlExecution.addJob(job));
                } else {
                    console.log(`[WARN] Ignoring Job ${jobId} without sql execution association`);
                }
                break;
            }
            default:
                console.log('Ignoring event', eventName);
        }
    }

    private getSqlExecution(id: number): SqlExecution {
        return this.sqlExecutions.find((execution) => {
            console.log(id, execution.id, id === execution.id);

            return execution.id === id;
        });
    }

    private doOnSqlExecution(id: number, action: string, handle: SqlExecutionHandle) {
        const sqlExecution = this.getSqlExecution(id);
        console.log(id, sqlExecution, this.sqlExecutions);
        if (sqlExecution) {
            handle(sqlExecution);
        } else {
            console.log(`[WARN] Ignoring ${action} cause sql execution ${id} could not be found!`);
        }
    }

    private parseSqlPlan(planNode: object): PlanNode[] {
        const planNodes = [];
        this.extractPlanNodesWithMetrics(planNode, [], planNodes);
        return planNodes;
    }

    private extractPlanNodesWithMetrics(node: object, predecessorPath: string[], extractions: PlanNode[]) {
        const name = node['nodeName'];
        const nodePath = [...predecessorPath, name];
        const metrics = node['metrics'] as Array<object>;
        const simpleString = node['simpleString'];
        const children = node['children'] as Array<object>;
        if (metrics.length > 0) {
            const parsedMetrics = metrics.map(
                (rawMetric: object) =>
                    new Metric(rawMetric['name'], rawMetric['metricType'], rawMetric['accumulatorId'])
            );
            extractions.push(new PlanNode(name, nodePath, parsedMetrics, simpleString));
        }
        children.forEach((child) => this.extractPlanNodesWithMetrics(child, nodePath, extractions));
    }
}
