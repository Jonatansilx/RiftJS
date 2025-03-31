require('dotenv').config();
const axios = require('axios');
const riotEndpoints = require('./endpoints/riot');
const dataDragonEndpoints = require('./endpoints/datadragon');

// Region mapping: short region to shard
const regionMap = {
    // Platform Routing (short regions)
    BR1: { platform: 'br1.api.riotgames.com', shard: 'americas.api.riotgames.com' },
    EUN1: { platform: 'eun1.api.riotgames.com', shard: 'europe.api.riotgames.com' },
    EUW1: { platform: 'euw1.api.riotgames.com', shard: 'europe.api.riotgames.com' },
    JP1: { platform: 'jp1.api.riotgames.com', shard: 'asia.api.riotgames.com' },
    KR: { platform: 'kr.api.riotgames.com', shard: 'asia.api.riotgames.com' },
    LA1: { platform: 'la1.api.riotgames.com', shard: 'americas.api.riotgames.com' },
    LA2: { platform: 'la2.api.riotgames.com', shard: 'americas.api.riotgames.com' },
    NA1: { platform: 'na1.api.riotgames.com', shard: 'americas.api.riotgames.com' },
    OC1: { platform: 'oc1.api.riotgames.com', shard: 'sea.api.riotgames.com' },
    TR1: { platform: 'tr1.api.riotgames.com', shard: 'europe.api.riotgames.com' },
    RU: { platform: 'ru.api.riotgames.com', shard: 'europe.api.riotgames.com' },
    PH2: { platform: 'ph2.api.riotgames.com', shard: 'sea.api.riotgames.com' },
    SG2: { platform: 'sg2.api.riotgames.com', shard: 'sea.api.riotgames.com' },
    TH2: { platform: 'th2.api.riotgames.com', shard: 'sea.api.riotgames.com' },
    TW2: { platform: 'tw2.api.riotgames.com', shard: 'sea.api.riotgames.com' },
    VN2: { platform: 'vn2.api.riotgames.com', shard: 'sea.api.riotgames.com' },
};

/**
 * RiotAPI class for interacting with Riot Games API endpoints.
 */
class RiotAPI {
    constructor() {
        this.apiKey = process.env.RIOT_API_KEY;
        if (!this.apiKey) throw new Error('RIOT_API_KEY is required in .env');
        this.region = (process.env.REGION || 'EUW1').toUpperCase();
        if (!regionMap[this.region]) throw new Error(`Invalid region: ${this.region}`);
        this.client = axios.create({
            headers: { 'X-Riot-Token': this.apiKey },
        });
        // Attach RiotAPI endpoints with region map
        Object.assign(this, riotEndpoints(this.client, this.region, regionMap));
    }

    /**
     * Handle axios errors and provide meaningful messages.
     * @private
     */
    _handleError(error) {
        if (error.response) {
            const { status, data } = error.response;
            return new Error(`API error ${status}: ${data.status?.message || 'Unknown error'}`);
        } else if (error.request) {
            return new Error('No response received from the server');
        }
        return new Error(`Request error: ${error.message}`);
    }
}

/**
 * DataDragon class for accessing static game data.
 */
class DataDragon {
    constructor(version = '14.19.1', locale = 'en_US') {
        this.version = version;
        this.locale = locale;
        this.baseURL = `https://ddragon.leagueoflegends.com/cdn/${this.version}/data/${this.locale}`;
        // Attach DataDragon endpoints
        Object.assign(this, dataDragonEndpoints(this.baseURL));
    }
}

module.exports = { RiotAPI, DataDragon };