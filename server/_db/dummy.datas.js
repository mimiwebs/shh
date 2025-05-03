const axios = require("axios");

function getRandomLatLng(centerLat, centerLng, radiusInKm) {
    const radiusInDeg = radiusInKm / 111; // 1 degree is approximately 111 km
    const u = Math.random();
    const v = Math.random();
    const w = radiusInDeg * Math.sqrt(u);
    const t = 2 * Math.PI * v;
    const x = w * Math.cos(t);
    const y = w * Math.sin(t);

    const newLat = centerLat + y;
    const newLng = centerLng + x / Math.cos(centerLat * (Math.PI / 180));

    return {
        latitude: newLat.toFixed(6),
        longitude: newLng.toFixed(6),
    };
}

const dbConfig = require("./db-config");
const knex = require("knex")(dbConfig.development);
const bcrypt = require("bcryptjs");

const centerLat = 51.5074;
const centerLng = -0.1278;
const radius = 10;

const users = [
    {username: "john_doe", email: "john.doe@example.com"},
    {username: "jane_smith", email: "jane.smith@example.com"},
    {username: "michael_johnson", email: "michael.j@example.com"},
    {username: "emily_davis", email: "emily.davis@example.com"},
    {username: "james_brown", email: "james.brown@example.com"},
    {username: "olivia_williams", email: "olivia.w@example.com"},
    {username: "daniel_miller", email: "daniel.m@example.com"},
    {username: "sophia_wilson", email: "sophia.wilson@example.com"},
    {username: "liam_moore", email: "liam.moore@example.com"},
    {username: "ava_taylor", email: "ava.taylor@example.com"},
];

const usersWithLatLng = users.map((user) => {
    const {latitude, longitude} = getRandomLatLng(centerLat, centerLng, radius);
    return {...user, latitude, longitude};
});

async function createDummyUser() {
    const hashedUsers = await Promise.all(
        usersWithLatLng.map(async (user) => {
            const hashedPassword = await bcrypt.hash("123456", 10);
            return {
                username: user.username,
                email: user.email,
                password: hashedPassword,
                latitude: user.latitude,
                longitude: user.longitude,
                is_active: true,
                last_login_date: new Date(),
                created_date: new Date(),
                modified_date: new Date(),
            };
        })
    );

    await knex("users").insert(hashedUsers);
}

const GOOGLE_MAPS_API_KEY = "AIzaSyAW_yyZi8izuGobGKfe5l5K58iPxWw92IY";

const getPlacesByType = async (latitude, longitude, placeType) => {
    const radius = 1500;
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${placeType}&key=${GOOGLE_MAPS_API_KEY}`;

    try {
        const response = await axios.get(url);
        return response.data.results;
    } catch (error) {
        console.error(`Error fetching ${placeType}:`, error);
        return [];
    }
};

const getPopularPlaces = async (latitude, longitude) => {
    const placeTypes = ["restaurant", "museum", "university", "cafe"];
    const allPlaces = await Promise.all(placeTypes.map((type) => getPlacesByType(latitude, longitude, type)));

    const combinedResults = [].concat(...allPlaces);
    return combinedResults;
};

const roundTo = (num, places) => +parseFloat(num).toFixed(places);

const areCoordinatesClose = (lat1, lng1, lat2, lng2, tolerance = 0.001) => {
    const latDifference = Math.abs(lat1 - lat2);
    const lngDifference = Math.abs(lng1 - lng2);
    return latDifference < tolerance && lngDifference < tolerance;
};

const normalizeName = (name) => name.toLowerCase().trim();

async function CreateCommunities(userLat, userLng) {
    const places = await getPopularPlaces(userLat, userLng);

    const locations = places.map((place) => {
        return {
            name: place.name,
            description: place.vicinity,
            latitude: place.geometry.location.lat,
            longitude: place.geometry.location.lng,
            address: place.vicinity,
            place_type: place.types[0],
            modified_date: new Date(),
            created_date: new Date(),
            is_deleted: false,
        };
    });

    locations.forEach(async (location) => {
        const roundedLatitude = roundTo(location.latitude, 6);
        const roundedLongitude = roundTo(location.longitude, 6);
        const normalizedLocationName = normalizeName(location.name);

        try {
            const existingLocation = await knex("communities")
                .where(knex.raw(`LOWER(name) = ?`, normalizedLocationName))
                .andWhere(function () {
                    this.whereBetween("latitude", [roundedLatitude - 0.001, roundedLatitude + 0.001]).andWhereBetween("longitude", [roundedLongitude - 0.001, roundedLongitude + 0.001]);
                })
                .first();

            if (existingLocation) {
                const isClose = areCoordinatesClose(roundedLatitude, roundedLongitude, existingLocation.latitude, existingLocation.longitude);

                if (isClose) {
                } else {
                    await knex("communities").insert({
                        ...location,
                        latitude: roundedLatitude,
                        longitude: roundedLongitude,
                    });
                }
            } else {
                await knex("communities").insert({
                    ...location,
                    latitude: roundedLatitude,
                    longitude: roundedLongitude,
                });
            }
        } catch (error) {}
    });
}

module.exports = {
    createDummyUser,
    CreateCommunities,
};
