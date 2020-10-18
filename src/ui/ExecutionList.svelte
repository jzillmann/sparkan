<script lang="ts">
    import { slide as expandTransition } from 'svelte/transition';
    import SqlExecutionItem from './SqlExecutionItem.svelte';
    import ExecutionDetails from './ExecutionDetails.svelte';
    import { sqlExecutions } from '../stores';

    const headers = ['ID', 'Description', 'Jobs', 'Tasks', 'Duration'];
    let expandedRow = -1;

    function expand(index: number) {
        if (expandedRow == index) {
            expandedRow = -1;
        } else if (expandedRow == -1) {
            expandedRow = index;
        } else {
            expandedRow = -1;
            setTimeout(() => (expandedRow = index), 100);
        }
    }
</script>

<div class="my-1">{$sqlExecutions.length} SQL queries</div>
<div class="grid" style="grid-template-columns:repeat({headers.length}, auto)">
    {#each headers as header}
        <div class="header">{header}</div>
    {/each}
    {#each $sqlExecutions as sqlExecution, i}
        <div class="contents row" class:expanded={expandedRow == i} on:click={() => expand(i)}>
            <SqlExecutionItem {sqlExecution} />
        </div>
    {/each}
    {#if expandedRow >= 0}
        <div
            transition:expandTransition={{ duration: 180 }}
            class="p-2 mb-1 details bg-gray-200"
            style="grid-column-start: span {headers.length}; grid-row-start: {expandedRow + 3};">
            <ExecutionDetails sqlExecution={$sqlExecutions[expandedRow]} />
        </div>
    {/if}
</div>

<style>
    .grid {
        width: 100%;
        height: 100vh;
        display: grid;
        grid-auto-rows: min-content;
        overflow-y: auto;
        border: 1px solid #e3e4e4;
        border-left: none;
    }

    /* .grid > div {
        border-left: 1px solid #e3e4e4;
    } */

    .header {
        @apply bg-gray-300;
        /* background-color: #f9f9fa; */
        position: sticky;
        top: 0;
        padding: 5px;
        border-bottom: 1px solid #e3e4e4;
    }

    .row {
        @apply cursor-pointer;
    }

    :global(:not(.expanded).row:hover > div) {
        @apply bg-gray-200;
    }

    :global(.expanded > div) {
        border-top: 1px solid #e3e4e4;
        @apply bg-gray-400;
        @apply shadow;
    }

    .details {
        @apply shadow;
        /* border-top: 1px solid #e3e4e4; */
        border-left: 1px solid #e3e4e4;
    }
</style>
