export const getCarsData = () => {
    return fetch('http://localhost:3000/cars')
        .then(response => response.json())
        .then(data => data)
}