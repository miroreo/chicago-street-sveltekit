<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { gameOptions, gameScore, gameStatistics, showOptions, streetsLoading } from "./store";
    import type { ChangeEventHandler } from "svelte/elements";
    import { get } from "svelte/store";

    const dispatcher = createEventDispatcher();

    let currentStreetName = "";
    const handleSubmit = (event: SubmitEvent) => {
        event.preventDefault();
        dispatcher("guess", currentStreetName);
        currentStreetName = "";
    }
    type keyOptions = "unnamed"|"arterial"|"collector"|"expressway"|"extent"|"local"|"namedAlley"|"ramp"|"river"|"sidewalk"|"tiered"|"unclassified";
    const getDataSetUpdater = (key: keyOptions) => {
        return () => {
            gameOptions.update((opts) => {
                opts.dataSet[key] = !opts.dataSet[key];
                return opts;
            })
        }
    }
    
    let disableFilters = false;
    gameScore.subscribe(sc => {
        if(sc.guessedStreetCount > 0) disableFilters = true;
    })
    const guessNumberedStreets = () => {
        for(let i = 0; i <= 138; i++) {
            let toGuess = "";
            let j = i % 10;
            let k = i % 100;

            if (j == 1 && k != 11) {
                toGuess = i + "st";
            }
            else if (j == 2 && k != 12) {
                toGuess = i + "nd";
            }
            else if (j == 3 && k != 13) {
                toGuess = i + "rd";
            }
            else toGuess = i + "th";
            dispatcher("guess", toGuess);
        }
    }
</script>
<main class="h-screen overflow-y-scroll bg-gray-900 text-white p-5 flex flex-col">
    <h1 class="text-xl font-extrabold my-2"><span class="text-blue-300">CHI</span> Streets Game</h1>
    {#if $streetsLoading}
    <p class="">Loading...</p>
    {:else}
    <form on:submit={handleSubmit}>
        <p class="py-2">Enter a street name below. Omit the direction and "street" part of it.</p>
        <input type="text" placeholder="" bind:value={currentStreetName} class="px-3 py-2 rounded-lg bg-gray-700"/>
        <button type="submit">Guess</button><br />
        <!-- <input type="checkbox" on:change={updateValue("gameOptions.showOptions")} class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" /> -->
        <button on:click={() => showOptions.update(val => !val)}>Show Options</button>
        {#if $showOptions == true}
        <ul>
            <li>
                <input name="unnamed" type="checkbox" disabled={disableFilters} bind:checked={$gameOptions.dataSet.unnamed}/>
                <label for="unnamed">Unnamed</label>
            </li>
            <li>
                <input name="arterial" type="checkbox" disabled={disableFilters} bind:checked={$gameOptions.dataSet.arterial} />
                <label for="arterial">Arterial</label>
            </li>
            <li>
                <input name="collector" type="checkbox" disabled={disableFilters} bind:checked={$gameOptions.dataSet.collector} />
                <label for="collector">Collector</label>
            </li>
            <li>
                <input name="expressway" type="checkbox" disabled={disableFilters} bind:value={$gameOptions.dataSet.expressway} />
                <label for="expressway">Expressway</label>
            </li>
            <li>
                <input name="extent" type="checkbox" disabled={disableFilters} bind:checked={$gameOptions.dataSet.extent} />
                <label for="extent">Extent</label>
            </li>
            <li>
                <input name="local" type="checkbox" disabled={disableFilters} bind:checked={$gameOptions.dataSet.local} />
                <label for="local">Local</label>
            </li>
            <li>
                <input name="namedAlley" type="checkbox" disabled={disableFilters} bind:checked={$gameOptions.dataSet.namedAlley} />
                <label for="namedAlley">Named Alley</label>
            </li>
            <li>
                <input name="ramp" type="checkbox" disabled={disableFilters} bind:checked={$gameOptions.dataSet.ramp} />
                <label for="ramp">Ramp</label>
            </li>
            <li>
                <input name="river" type="checkbox" disabled={disableFilters} bind:checked={$gameOptions.dataSet.river} />
                <label for="river">River</label>
            </li>
            <li>
                <input name="sidewalk" type="checkbox" disabled={disableFilters} bind:checked={$gameOptions.dataSet.sidewalk} />
                <label for="sidewalk">Sidewalk</label>
            </li>
            <li>
                <input name="tiered" type="checkbox" disabled={disableFilters} bind:checked={$gameOptions.dataSet.tiered} />
                <label for="tiered">Tiered</label>
            </li>
            <li>
                <input name="unclassified" type="checkbox" disabled={disableFilters} bind:checked={$gameOptions.dataSet.unclassified} />
                <label for="unclassified">Unclassified</label>
            </li>
        </ul>
        {/if}
    </form>
    {/if}
    <progress class="h-3 bg-gray-700 in-range:bg-green-500 rounded-full" id="progressbar" max={$gameStatistics.totalLength} value={$gameStatistics.currentLength+100}></progress>
    <label for="progressbar">{$gameScore.guessedStreetLength.toFixed(3)} of {$gameStatistics.totalLength.toFixed(3)} mi guessed</label>
    <div class="overflow-y-scroll w-full h-full">
        <ul>
        {#each Object.keys($gameScore.guessedStreets) as streetName}
            <li><span class="font-bold">{streetName}</span>: {$gameScore.guessedStreets[streetName].length.toFixed(3)} mi</li>
        {/each}
        </ul>
    </div>
    <div class="bottom-0 my-2 flex flex-row gap-x-2">
        <button class="bg-gray-700 p-2 rounded-full" on:click={() => gameScore.update(val => ({guessedStreets: {}, guessedStreetCount: 0, guessedStreetLength: 0}))}>Reset</button>
        <button class="bg-gray-700 p-2 rounded-full" on:click={guessNumberedStreets}>Numbered Streets</button>
    </div>
</main>