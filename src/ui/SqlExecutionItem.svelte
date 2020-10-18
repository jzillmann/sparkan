<script lang="ts">
    import type SqlExecution from '../parse/SqlExecution';
    import humanizeDuration from 'humanize-duration';

    export let sqlExecution: SqlExecution;
    const duration = sqlExecution.stopTime
        ? humanizeDuration(sqlExecution.stopTime - sqlExecution.startTime, { units: ['h', 'm', 's'], round: true })
        : 'Not yet finished';
</script>

<div class="gridcell">{sqlExecution.id}</div>
<div class="gridcell">{sqlExecution.description}</div>
<div class="gridcell">{sqlExecution.jobs.length}</div>
<div class="gridcell">{sqlExecution.numberOfTasks()}</div>
<div class="gridcell">{duration}</div>

<style>
    .gridcell {
        @apply pl-1;
        border-left: 1px solid #e3e4e4;
    }
</style>
