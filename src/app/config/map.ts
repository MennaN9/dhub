import * as Leaflet from 'leaflet';
export const options = {
    layers: [
        Leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 30 })
    ],
    zoom: 5,
    center: Leaflet.latLng(29.378586, 47.990341)
};

export const drawOptions = {
    position: 'topright',
    draw: {
        polygon: {
            shapeOptions: {
                color: 'blue'
            },
        },
        circle: false,
        rectangle: false,
        polyline: false,
        marker: false,
        circlemarker: false,
    },
};
