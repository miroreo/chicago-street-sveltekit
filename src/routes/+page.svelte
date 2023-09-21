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
    let currentView = 1;

    const setView = (view: 1 | 2) => {
        return () => {
            currentView = view;
        }
    }
</script>

<main class="flex md:flex-row flex-col">
    <GameMenu on:guess={handleGuess} isVisible={currentView == 1}/>
    <MapGame isVisible={currentView == 2}/>
    <!-- <div class="md:invisible w-screen bottom-0 h-10 z-10">
        <button on:click={setView(1)}>Game</button>
        <button on:click={setView(2)}>Map</button>
    </div> -->
    <!-- <MapGame /> -->
</main>