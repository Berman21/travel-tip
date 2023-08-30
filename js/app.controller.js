import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onDelete = onDelete
window.onGo = onGo

function onInit() {
    mapService.initMap()
        .then(() => {
            console.log('Map is ready')
        })
        .catch(() => console.log('Error: cannot init map'))
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos')
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddMarker(lat = 32.0749831, lng = 34.9120554) {
    console.log('Adding a marker')
    mapService.addMarker({ lat, lng })
}

function onGetLocs() {
    locService.getLocs()
        .then(locs => renderLocs(locs))
    // document.querySelector('.locs').innerText = JSON.stringify(locs, null, 2)
}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            onPanTo(pos.coords.latitude, pos.coords.longitude)
            onAddMarker(pos.coords.latitude, pos.coords.longitude)
            console.log('User position is:', pos.coords)
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
        })
        .catch(err => {
            console.log('err!!!', err)
        })
}
function onPanTo(lat = 35.6895, lng = 139.6917) {
    console.log('Panning the Map')
    mapService.panTo(lat, lng)
}

function renderLocs(locs) {
    console.log(locs)
    const strHTMLs = locs.map(loc => {
        // const id = makeId() // כדי למחוק צריך id ולא this
        return `
    <li>
        <span>${loc.name}</span>
        <button class="btn-delete" onclick="onDelete(this)">Delete</button>
        <button class="btn-go" onclick="onGo(this)">Go</button>
    </li>
    `
    })
    document.querySelector('.locations').innerHTML = strHTMLs.join('')
}

function onDelete(elDelete) {
    console.log(elDelete)
    console.log('Delete')
    // delete()
}

function onGo(elGo) {
    console.log(elGo)
    console.log('Go')
    // go()
}