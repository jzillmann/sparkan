export default class JobExecution {
    jobId: number;
    submissionTime: number;
    constructor(jobId: number, submissionTime: number) {
        this.jobId = jobId;
        this.submissionTime = submissionTime;
    }
}
