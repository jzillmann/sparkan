<script lang="ts">
    import type SqlExecution from '../parse/SqlExecution';
    import type PlanNode from '../parse/PlanNode';
    import NodeCard from './NodeCard.svelte';

    export let sqlExecution: SqlExecution;
    let showAllMetrics = false;
</script>

<div class="flex items-baseline">
    <div class="text-lg font-bold">Plan</div>
    <div class="ml-1">(</div>
    <!-- svelte-ignore a11y-invalid-attribute -->
    <a href="" on:click|preventDefault={() => (showAllMetrics = !showAllMetrics)}>{showAllMetrics ? 'all metrics' : 'min metrics'}</a>
    <div>)</div>
</div>
<div class="flex flex-wrap">
    {#each sqlExecution.planNodes.filter((node) => showAllMetrics || node.metricsWithValues().length > 0) as planNode}
        <div class="ml-2">
            <NodeCard node={planNode} {showAllMetrics} />
        </div>
    {/each}
</div>

<div class="text-lg font-bold mt-1">Jobs</div>
{#each sqlExecution.jobs as job}
    <div class="flex">
        <div>Job {job.jobId}</div>
    </div>
{/each}
