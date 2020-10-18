<script lang="ts">
    import type PlanNode from '../parse/PlanNode';

    export let node: PlanNode;
    export let showAllMetrics: boolean;
</script>

<div class="px-2 py-1 mt-1 bg-gray-400 shadow">
    <div class="font-mono">{node.name}</div>
    {#each node.metrics.filter((metric) => showAllMetrics || metric.value > 0) as metric}
        <div class="flex ml-4">
            <div>{metric.name}: {metric.value}</div>
        </div>
    {/each}
</div>
