import { get } from 'svelte/store';
import { gameOptions, streetsLoading, streetsData, streetsDataCached, gameScore, gameStatistics } from './store';
import * as turf from '@turf/turf';
const streetMatching = (street: string) => {
    
}

export const validateGuess = (street: string) => {
    if (checkGuessed(street)) return false;

    const streets = get(streetsData);
    let match = false;
    let newStreet = false;
    let newScore = {
        geo: turf.featureCollection<turf.Geometry, ChicagoStreetProps>([]),
        length: 0,
    }
    streets.features.forEach((streetFeature) => {
        if (streetFeature.properties.street_nam?.toUpperCase() == street.toUpperCase() && checkClass(streetFeature)) {
            match = true;
            let len = turf.length(streetFeature, {units: 'miles'});
            newScore.length += len;
            newScore.geo.features.push(streetFeature);
        }
    })
    if(match) {
        gameScore.update(sc => {
            sc.guessedStreets[street.toUpperCase()] = newScore;
            sc.guessedStreetCount++;
            sc.guessedStreetLength += newScore.length;
            return sc;
        })
        gameStatistics.update(stat => {
            stat.currentStreets += 1;
            stat.currentLength += newScore.length;
            return stat;
        })
    }
    return match;
}

export const loadStreets = async () => {
    console.log("loading streets")
    streetsLoading.set(true);
    const options = get(gameOptions).dataSet;
    const { unnamed, expressway, arterial, collector, local, namedAlley, tiered, ramp, extent, river, sidewalk, unclassified } = options;
    const returnData = turf.featureCollection<turf.Geometry, ChicagoStreetProps>([]);
    let res = await fetch('https://chidatarepo.tessa.ooo/continuousStreets.geo.json');
    // let res = await fetch('http://localhost:3000/continuousStreets.geo.json', {
    //     mode: "cors"
    // });
    let data = await res.json();
    returnData.features = returnData.features.concat(data.features);
    streetsData.set(returnData);
    streetsLoading.set(false);

}

export const getTotalLength = () => {
    const streets = get(streetsData);
    let length = 0;
    streets.features.forEach((street) => {
        checkClass(street) && (length += turf.length(street, {units: 'miles'}));
    })
    return length;
}

export const getTotalStreets = () => {
    const streets = get(streetsData);
    let streetNames: string[] = [];
    streets.features.forEach((street) => {
        if(checkClass(street) && !streetNames.includes(street.properties.street_nam || "")) {
            streetNames.push(street.properties.street_nam || "");
        }
    })
    return streetNames.length;
}
const checkGuessed = (streetName: string) => {
    const guessedStreets = get(gameScore).guessedStreets;
    return Object.keys(guessedStreets).includes(streetName.toUpperCase());
}

const checkClass = (street: turf.Feature<turf.Geometry, ChicagoStreetProps>) => {
    const dataSet = get(gameOptions).dataSet;
    if(!street.properties.street_nam) return dataSet.unnamed;
    switch(street.properties.street_typ) {
        case "EXPY":
            return dataSet.expressway;
        case "RL":
            return dataSet.expressway;
        default:
            break;
    }
    switch(street.properties.class) {
        case "1":
            return dataSet.expressway;
        case "2":
            return dataSet.arterial;
        case "3":
            return dataSet.collector;
        case "4":
            return dataSet.local;
        case "5":
            return dataSet.namedAlley;
        case "7":
            return dataSet.tiered;
        case "9":
            return dataSet.ramp;
        case "E":
            return dataSet.extent;
        case "RIV":
            return dataSet.river;
        case "S":
            return dataSet.sidewalk;
        case "99":
            return dataSet.unclassified;
        default:
            break;
    }

}