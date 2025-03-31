module.exports = (client, defaultRegion, regionMap) => ({
    /**
     * Get account info by Riot ID (gameName and tagLine).
     * @param {string} riotId - Riot ID (e.g., "Timmsy#BRUV" or "Timmsy", "BRUV").
     * @param {string} [tagLine] - Optional tagLine if not included in riotId.
     * @param {string} [region] - Short region (defaults to constructor region).
     * @returns {Promise<object>} Account data including puuid.
     */
    async getAccountByRiotId(riotId, tagLine = null, region = defaultRegion) {
        let gameName, tag;
        if (riotId.includes('#')) {
            [gameName, tag] = riotId.split('#');
        } else {
            gameName = riotId;
            tag = tagLine || '';
        }
        if (!tag) throw new Error('TagLine is required for getAccountByRiotId');
        const shard = regionMap[region].shard;
        try {
            const response = await client.get(`/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tag)}`, {
                baseURL: `https://${shard}`,
            });
            return response.data;
        } catch (error) {
            throw this._handleError(error);
        }
    },

    /**
     * Get summoner data by PUUID.
     * @param {string} puuid - Encrypted PUUID.
     * @param {string} [region] - Short region (defaults to constructor region).
     * @returns {Promise<object>} Summoner data.
     */
    async getSummonerByPuuid(puuid, region = defaultRegion) {
        const platform = regionMap[region].platform;
        try {
            const response = await client.get(`/lol/summoner/v4/summoners/by-puuid/${encodeURIComponent(puuid)}`, {
                baseURL: `https://${platform}`,
            });
            return response.data;
        } catch (error) {
            throw this._handleError(error);
        }
    },

    /**
     * Get match history by PUUID.
     * @param {string} puuid - Summoner's PUUID.
     * @param {object} [options] - Query options (e.g., start, count).
     * @param {string} [region] - Short region (defaults to constructor region).
     * @returns {Promise<string[]>} Array of match IDs.
     */
    async getMatchlistByPuuid(puuid, options = {}, region = defaultRegion) {
        const shard = regionMap[region].shard;
        try {
            const response = await client.get(`/lol/match/v5/matches/by-puuid/${encodeURIComponent(puuid)}/ids`, {
                baseURL: `https://${shard}`,
                params: options,
            });
            return response.data;
        } catch (error) {
            throw this._handleError(error);
        }
    },

    /**
     * Get match details by match ID.
     * @param {string} matchId - Match ID (e.g., "EUW1_1234567890").
     * @param {string} [region] - Short region (defaults to constructor region).
     * @returns {Promise<object>} Match data.
     */
    async getMatchById(matchId, region = defaultRegion) {
        const shard = regionMap[region].shard;
        try {
            const response = await client.get(`/lol/match/v5/matches/${matchId}`, {
                baseURL: `https://${shard}`,
            });
            return response.data;
        } catch (error) {
            throw this._handleError(error);
        }
    },
});