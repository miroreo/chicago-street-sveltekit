<script lang="ts">
    import "mapbox-gl/dist/mapbox-gl.css"
    import { Map } from 'mapbox-gl';
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';
    import { createEventDispatcher } from "svelte";
    let map: Map;    
    let mapContainer: HTMLElement;
    let lng: number, lat: number, zoom: number;

    lng = -87.6278269;
    lat = 41.8820096;
    zoom = 11;
    const dispatch = createEventDispatcher();
    
    onMount(() => {
        if(!browser) return;
        const initialState = { lng, lat, zoom };
        
        map = new Map({
            container: mapContainer,
            accessToken: "pk.eyJ1IjoibWlyb3JlbyIsImEiOiJjbG1nenN2dG0wZjBqM2xtZWV4bTR0dDBsIn0.E1tfVUp28fbC2WOWVSEyQg",
            style: "mapbox://styles/miroreo/clmgzyb1k03sm01qr03g35iud",
        });
        map.on('load', () => {
            dispatch("ready", {map});
        });
    });
</script>

<div class="map-wrap">
    <div class="map" bind:this={mapContainer} />
</div>
<style>
.map {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>