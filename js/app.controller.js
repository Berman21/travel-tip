import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onDelete = onDelete
window.onGo = onGo
window.onSearch = onSearch

function onInit() {
    // renderFilterByQueryParams()
    mapService.initMap()
        .then(() => {
            console.log('Map is ready')
            renderFilterByQueryParams()
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
        return `
    <li>
        <span>${loc.name}</span>
        <button class="btn-delete" onclick="onDelete('${loc.id}')">Delete</button>
        <button class="btn-go" onclick="onGo('${loc.id}')">Go</button>
    </li>
    `
    })
    document.querySelector('.locations').innerHTML = strHTMLs.join('')
}

function onDelete(elDelete) {
    locService.deleteLoc(elDelete)
    onGetLocs()
}

function onGo(elGo) {
    locService.getLoc(elGo)
        .then(loc => {
            onPanTo(loc.lat, loc.lng)
            setQueryParams(loc)
        })
}

function onSearch() {
    const searchInput = document.getElementById('search-input')
    const searchText = searchInput.value

    locService.getGeo(searchText)
        .then(pos => {
            console.log(pos);
            locService.createLoc({ name: searchText, lat: pos.lat, lng: pos.lng })
            onPanTo(pos.lat, pos.lng)
            onAddMarker(pos.lat, pos.lng)
            setQueryParams(pos)
        })
}

function setQueryParams(loc) {
    const queryParams = `?lat=${loc.lat || ''}&lng=${loc.lng || ''}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryParams
    window.history.pushState({ path: newUrl }, '', newUrl)

}

function renderFilterByQueryParams() {
    const newQueryParams = new URLSearchParams(window.location.search)
    const loc = {
        lat: +newQueryParams.get('lat') || '',
        lng: +newQueryParams.get('lng') || ''
    }
    if(loc.lat === '' || loc.lng === '') return
    onPanTo(loc.lat,loc.lng)
}