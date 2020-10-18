<script lang="ts">
    import TailwindCss from './TailwindCss.svelte';
    import ExecutionList from './ui/ExecutionList.svelte';
</script>

<TailwindCss />

<main>
    <div class="bg-green-500 pl-1 text-lg">Sparkan</div>
    <ExecutionList />
</main>

<style>
    @media (min-width: 640px) {
        main {
            max-width: none;
        }
    }
</style>
