require('dotenv').config();
const axios = require('axios');

/**
 * RiotAPI class for interacting with Riot Games API endpoints.
 */
class RiotAPI {
    constructor() {
        this.apiKey = process.env.RIOT_API_KEY;
        if (!this.apiKey) throw new Error('RIOT_API_KEY is required in .env');
        this.region = process.env.REGION || 'euw1';
        this.client = axios.create({
            baseURL: `https://${this.region}.api.riotgames.com`,
            headers: { 'X-Riot-Token': this.apiKey },
        });
    }

    /**
     * Get summoner data by name.
     * @param {string} name - Summoner name.
     * @param {string} [region] - Region (defaults to constructor region).
     * @returns {Promise<object>} Summoner data.
     */
    async getSummonerByName(name, region = this.region) {
        try {
            const response = await this.client.get(`/lol/summoner/v4/summoners/by-name/${encodeURIComponent(name)}`, {
                baseURL: `https://${region}.api.riotgames.com`,
            });
            return response.data;
        } catch (error) {
            throw this._handleError(error);
        }
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
    }

    /**
     * Get all champion data.
     * @returns {Promise<object>} Champion data.
     */
    async getChampions() {
        try {
            const response = await axios.get(`${this.baseURL}/champion.json`);
            return response.data;
        } catch (error) {
            throw new Error(`DataDragon error: ${error.message}`);
        }
    }
}

module.exports = { RiotAPI, DataDragon };