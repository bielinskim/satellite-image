import { arrayBufferToBase64 } from './image'

const api_key = 'z24hlIFdZufntm2fy5DmPmv38UWXdc5Ie2xRZ4TO';

export function loadOptions(val) {
    return fetch(`https://nominatim.openstreetmap.org/search.php?city=${val}&format=jsonv2`)
        .then(response => response.json())
        .then(data => {
            return data.map(item => ({ value: { lat: item.lat, lon: item.lon }, label: item.display_name }))
        })
}

export async function fetchImage(lat, lon) {
    const res = await fetch(`https://api.nasa.gov/planetary/earth/imagery?lat=${lat}&lon=${lon}&date=2018-01-01&dim=0.15&api_key=${api_key}`)
    if (!res.ok) {
        throw new Error(`Http error: ${res.status}`);
    }
    const buffer = await res.arrayBuffer()

    const base64Flag = 'data:image/jpeg;base64,';
    const imageStr = arrayBufferToBase64(buffer);
    console.log(base64Flag + imageStr);
    return base64Flag + imageStr;

}