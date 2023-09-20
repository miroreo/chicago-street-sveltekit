<script lang="ts">
    import type { Map, Layer } from "mapbox-gl";
    import MapboxDraw from '@mapbox/mapbox-gl-draw';
    // import type { Map } from "mapbox-gl";
    import MapboxMap from "./MapboxMap.svelte";
    import { onMount } from "svelte";
    import CHICAGO_BOUNDS from "$lib/chibounds.geo.json";
    import * as turf from '@turf/turf';
    import { gameScore, streetsLoading } from "./store";
    import { loadStreets } from "./streetValidation";
    import { get } from "svelte/store";

    const initialState = {
        lng: -87.6278269,
        lat: 41.8820096,
        zoom: 11
    };
    let map: Map
    
    const mapInit = (event: CustomEvent<{map: Map}>) => {
        let initedMap = event.detail.map;
        map = initedMap;
        initedMap.addControl(new MapboxDraw({
            displayControlsDefault: false,
            controls: {
                polygon: true,
                trash: true
            }
        }));

        initedMap.addSource('chicago-bounds', {
            type: 'geojson',
            // data: "https://chidatarepo.tessa.ooo/CHI-bounds-inverted.json"
            data: CHICAGO_BOUNDS as GeoJSON.Feature<GeoJSON.Geometry>,
            });
        let chicagoParts = [
            turf.polygon(CHICAGO_BOUNDS.geometry.coordinates[0]),
            turf.polygon(CHICAGO_BOUNDS.geometry.coordinates[1]),
        ]
        let chicago = turf.union(chicagoParts[0], chicagoParts[1]);
        let chicagoInvert = turf.mask(
            chicagoParts[0], 
            undefined);
        let chicagoInvert2 = turf.mask(
            chicagoParts[1], 
            chicagoInvert
        )
        initedMap.addSource('chicago-invert', {
            type: 'geojson',
            data: chicagoInvert as GeoJSON.Feature<GeoJSON.Geometry>,
        })
        initedMap.addLayer({ 
            id: 'chicago-bounds',
            type: 'fill',
            source: 'chicago-invert',
            layout: {
                
            },
            paint: {
                'fill-color': '#111',
                'fill-opacity': 1,
            },
        });
        loadStreets();
        let score = {
            guessedStreets: {}
        };
    }

    // watch for new streets within gameScore and add them to the map
    gameScore.subscribe(score => {
        if(!map) return;
        // console.log("Map sees gameScore change");
        // console.log(score);
        let newStreets = Object.keys(score.guessedStreets).filter(street => {
            return !score.guessedStreets[street].addedToMap;
        });
        // console.log(newStreets);
        newStreets.forEach(newStreet => {
            map.addLayer({
                id: "guessed-street-" + newStreet,
                type: "line",
                source: {
                    type: "geojson",
                    data: score.guessedStreets[newStreet].geo as GeoJSON.FeatureCollection<GeoJSON.Geometry>,
                },
                paint: {
                    "line-color": "#f00",
                    "line-width": 2,
                },
            });
            gameScore.update(val => {
                val.guessedStreets[newStreet].addedToMap = true
                return val;
            });
        })
    })
</script>
<main>
    <MapboxMap on:ready={mapInit}/>
</main>