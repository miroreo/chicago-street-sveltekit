<script lang="ts">
    import MapGame from '$lib/MapGame.svelte';
    import GameMenu from '$lib/GameMenu.svelte';
    import { validateGuess } from "$lib/streetValidation";
    import { streetsLoading } from '$lib/store';

    const handleGuess = (event: CustomEvent<string>) => {
        let guess = event.detail;
        let result = validateGuess(guess);
        // console.log(result);
    }
</script>

<main class="flex sm:flex-row flex-col">
    <GameMenu on:guess={handleGuess} />
    <MapGame />
    <!-- <MapGame /> -->
</main>