import { type Writable, writable, get } from 'svelte/store';
import { persist, createLocalStorage } from "@macfja/svelte-persistent-store"
import * as turf from '@turf/turf';
import { getTotalLength, getTotalStreets, loadStreets } from "$lib/streetValidation";

export const gameOptions = persist(writable({
    dataSet: {
        unnamed: false,
        expressway: true,
        arterial: true,
        collector: true,
        local: true,
        namedAlley: true,
        tiered: true,
        ramp: false,
        extent: true,
        river: false,
        sidewalk: false,
        unclassified: false
    },
}), createLocalStorage(), "gameOptions");

export const gameStatistics = persist(writable({
    totalStreets: 0,
    totalLength: 0,
    currentStreets: 0,
    currentLength: 0,
}), createLocalStorage(), "gameStatistics");

export const gameScore: Writable<{
    guessedStreets: {
        [key: string]: {
            length: number,
            geo: turf.FeatureCollection<turf.Geometry, ChicagoStreetProps>,
            addedToMap?: boolean,
        }
    },
    guessedStreetCount: number,
    guessedStreetLength: number,
}> = persist(writable({
    guessedStreets: {},
    guessedStreetCount: 0,
    guessedStreetLength: 0,
}), createLocalStorage(), "gameScore");

export const streetsData = writable(turf.featureCollection<turf.Geometry, ChicagoStreetProps>([]));
export const streetsDataCached: Writable<{[key:string]: turf.FeatureCollection}> = writable({
    unnamedStreets: turf.featureCollection([]),
    expressways: turf.featureCollection([]),
    arterials: turf.featureCollection([]),
    collectors: turf.featureCollection([]),
    locals: turf.featureCollection([]),
    namedAlleys: turf.featureCollection([]),
    tiereds: turf.featureCollection([]),
    ramps: turf.featureCollection([]),
    extents: turf.featureCollection([]),
    rivers: turf.featureCollection([]),
    sidewalks: turf.featureCollection([]),
    unclassifieds: turf.featureCollection([]),
});

export const showOptions = writable(false);
export const streetsLoading = writable(false);

let dataSetPrev = get(gameOptions).dataSet;
gameOptions.subscribe((val) => {
    // console.log(val);
    if (Object.values(val.dataSet) != Object.values(dataSetPrev)) {
        dataSetPrev = val.dataSet;
        // console.log("dataSet changed");
        gameStatistics.update(stat => {
            stat.totalLength = getTotalLength();
            stat.totalStreets = getTotalStreets();
            return stat;
        })
    }
})
streetsData.subscribe((val) => {
    gameStatistics.update(stat => {
        stat.totalLength = getTotalLength();
        stat.totalStreets = getTotalStreets();
        return stat;
    });
})