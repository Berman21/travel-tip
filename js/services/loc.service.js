import { api } from "./secret.js"
import { storageService } from './async-storage.service.js'


export const locService = {
    getLocs,
    getLoc,
    getGeo,
    createLoc,
    deleteLoc
}

const KEY = 'locsDB'

// const locs = [
//     { name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
//     { name: 'Neveragain', lat: 32.047201, lng: 34.832581 }
// ]

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(storageService.query(KEY))
        }, 2000)
    })
}

function getGeo(value) {
    console.log('ajax for geocode');
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${value}&key=${api.GOOGLE_MAP_KEY}`)
        .then(res => res.data.results[0].geometry.location)  //{lng:34.4546 ; lat:23.4322}
        
}   

function save(loc) {
    if (loc.id) {
        return storageService.put(KEY, loc)
    } else {
        return storageService.post(KEY, loc)
    }
}

function createLoc(loc) {
    save(loc)
}

function deleteLoc(id) {
    storageService.remove(KEY, id)
}

function getLoc(id){
    return storageService.get(KEY,id)
}