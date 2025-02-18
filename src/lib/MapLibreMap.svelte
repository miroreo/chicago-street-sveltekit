<script lang="ts">
    // import "maplibre-gl/dist/mapbox-gl.css"
    import "maplibre-gl/dist/maplibre-gl.css";
    import { default as maplibregl, Map } from 'maplibre-gl';
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';
    import { createEventDispatcher } from "svelte";
    // mapboxgl.baseApiUrl = "http://localhost:8080/"
    // maplibregl
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
        
        map = new maplibregl.Map({
            container: mapContainer,
            center: initialState,
            zoom: initialState.zoom,
            // accessToken: "pk.eyJ1IjoibWlyb3JlbyIsImEiOiJjbTZyeXJ6MTQwMmx4Mmxwb200YzY5MnVtIn0.Avp-i2twEyUfJPoVnztkYQ",
            // style: "mapbox://styles/miroreo/clmgzyb1k03sm01qr03g35iud",
            style: {
                'version': 8,
                'sources': {
                    'raster-tiles': {
                        'type': 'raster',
                        'tiles': [
                            'https://a.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png',
                            'https://b.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png',
                            'https://c.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png',
                            'https://d.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png'],
                        'tileSize': 256,
                        'attribution': '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',                    }
                },
                'layers': [
                    {
                        'id': 'simple-tiles',
                        'type': 'raster',
                        'source': 'raster-tiles',
                        'minzoom': 0,
                        'maxzoom': 22,
                    }
                ]
            }
            // spriteFormat: "raster"
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