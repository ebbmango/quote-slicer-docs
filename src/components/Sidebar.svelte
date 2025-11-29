<script lang="ts">
   const sections = Array.from({ length: 10 }, (_, i) => `section ${(i + 1)}`)
</script>

<div class="flex flex-col ms-10 gap-8 min-w-70 h-dvh border-0 border-r border-gray-200">
    {#each sections as section}
        <p>{section}</p>
    {/each}
</div>
