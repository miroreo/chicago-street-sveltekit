import { get } from 'svelte/store';
import { gameOptions, streetsLoading, streetsData, streetsDataCached, gameScore, gameStatistics, groupedStreetsData } from './store';
import * as turf from '@turf/turf';
const streetMatching = (street: string) => {
    
}

export const validateGuess = (street: string) => {
    console.log("Guess: " + street);
    if (checkGuessed(street)) return false;

    const streets = get(streetsData);
    const groupedStreets = get(groupedStreetsData);
    // let match = false;
    let newStreet = false;
    let newScore = {
        geo: turf.featureCollection<turf.Geometry, ChicagoStreetProps>([]),
        length: 0,
    }
    let match = groupedStreets[street.toUpperCase()];
    console.log(match);
    if(match) {
        newScore.length += turf.length(match, {units: 'miles'});
        newScore.geo.features.push(match);
    }
    // streets.features.forEach((streetFeature) => {
    //     if (streetFeature.properties.street_nam?.toUpperCase() == street.toUpperCase() && checkClass(streetFeature)) {
    //         match = true;
    //         let len = turf.length(streetFeature, {units: 'miles'});
    //         newScore.length += len;
    //         newScore.geo.features.push(streetFeature);
    //     }
    // })
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
    // const returnData = turf.featureCollection<turf.Geometry, ChicagoStreetProps>([]);
    // const returnData: {[key: string]: turf.Feature<turf.Geometry, ChicagoStreetProps>} = {};
    let res = await fetch('https://chidatarepo.tessa.ooo/groupedContinuousStreets.json');
    // let res = await fetch('http://localhost:3000/continuousStreets.geo.json', {
    //     mode: "cors"
    // });
    let data = await res.json();
    const returnData = data;
    // returnData.features = returnData.features.concat(data.features);

    groupedStreetsData.set(returnData);
    // streetsData.set(returnData);
    streetsLoading.set(false);

}

export const getTotalLength = () => {
    const groupedStreets = get(groupedStreetsData);
    // const streets = get(streetsData);
    // let length = 0;
    // streets.features.forEach((street) => {
    //     checkClass(street) && (length += turf.length(street, {units: 'miles'}));
    // })
    // return length;
    let len = 0;
    Object.values(groupedStreets).forEach(s => {
        checkClass(s) && (len += turf.length(s, {units: 'miles'}));
    })
    return len;
}

export const getTotalStreets = () => {
    // const streets = get(streetsData);
    // let streetNames: string[] = [];
    // streets.features.forEach((street) => {
    //     if(checkClass(street) && !streetNames.includes(street.properties.street_nam || "")) {
    //         streetNames.push(street.properties.street_nam || "");
    //     }
    // })
    // return streetNames.length;
    const groupedStreets = get(groupedStreetsData);
    let names: string[] = [];
    Object.keys(groupedStreets).forEach(name => {
        if(checkClass(groupedStreets[name]) && !names.includes(name)) names.push(name);
    })
    return names.length;
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