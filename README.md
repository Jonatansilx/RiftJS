# RiftJS

A lightweight Node.js wrapper for the Riot Games API, providing easy access to League of Legends game data.

[![npm version](https://badge.fury.io/js/@timmsy%2Friftjs.svg)](https://www.npmjs.com/package/@timmsy/riftjs)
![GitHub license](https://img.shields.io/github/license/timmsy1998/RiftJS)

## Overview

RiftJS simplifies interaction with the Riot Games API and DataDragon static data. It supports fetching account details, summoner info, match history, and game data using a modular endpoint structure. Built with `axios` and `dotenv`, it’s designed for developers building League of Legends tools or applications.

## Features

- **RiotAPI**: Fetch account data by Riot ID, summoner data by PUUID, match history, and match details.
- **DataDragon**: Access static game data like champions and items.
- **Region Support**: Handles platform (e.g., `EUW1`) and shard (e.g., `europe`) routing.
- **Modular Design**: Endpoints are organized in an `/endpoints/` directory for easy extension.

## Installation

Install RiftJS via npm:

```
npm install @timmsy/riftjs
```

You’ll also need a Riot Games API key from [developer.riotgames.com](https://developer.riotgames.com/).

## Setup

1. **Install Dependencies**:
   Ensure you have Node.js installed, then run the install command above.

2. **Configure Environment**:
   Create a `.env` file in your project root with your API key and region:
   ```
   RIOT_API_KEY=RGAPI-your-api-key-here
   REGION=EUW1
   ```
   - Replace `RGAPI-your-api-key-here` with your API key.
   - Use a short region code (e.g., `EUW1`, `NA1`). See [Region Mapping](#region-mapping) for details.

## Usage

Here’s a basic example to get started:

```
const { RiotAPI, DataDragon } = require('@timmsy/riftjs');

// Initialize RiotAPI
const riot = new RiotAPI();

// Fetch account, summoner, and match data
async function fetchPlayerData() {
  try {
    const account = await riot.getAccountByRiotId('Timmsy#BRUV');
    console.log('Account:', account);

    const summoner = await riot.getSummonerByPuuid(account.puuid);
    console.log('Summoner:', summoner);

    const matchlist = await riot.getMatchlistByPuuid(account.puuid, { start: 0, count: 5 });
    console.log('Matchlist:', matchlist);

    const match = await riot.getMatchById(matchlist[0]);
    console.log('Match:', match);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Initialize DataDragon
const dd = new DataDragon();

async function fetchStaticData() {
  try {
    const champions = await dd.getChampions();
    console.log('Champions:', champions.data);

    const items = await dd.getItems();
    console.log('Items:', items.data);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the examples
fetchPlayerData();
fetchStaticData();
```

## API Reference

### RiotAPI
- `getAccountByRiotId(riotId, [tagLine], [region])`: Fetch account by Riot ID (e.g., `Timmsy#BRUV`).
- `getSummonerByPuuid(puuid, [region])`: Get summoner data by PUUID.
- `getMatchlistByPuuid(puuid, [options], [region])`: Get match history (options: `{ start, count }`).
- `getMatchById(matchId, [region])`: Get match details.

### DataDragon
- `getChampions()`: Fetch all champion data.
- `getItems()`: Fetch all item data.

## Region Mapping

RiftJS uses a region map to route requests correctly:
- **Platform Routing** (e.g., Summoner V4):
  - `EUW1` → `euw1.api.riotgames.com`
  - `NA1` → `na1.api.riotgames.com`
- **Shard Routing** (e.g., Account V1, Match V5):
  - `EUW1` → `europe.api.riotgames.com`
  - `NA1` → `americas.api.riotgames.com`

Supported regions: `BR1`, `EUN1`, `EUW1`, `JP1`, `KR`, `LA1`, `LA2`, `NA1`, `OC1`, `TR1`, `RU`, `PH2`, `SG2`, `TH2`, `TW2`, `VN2`.

## Development

To contribute or run locally:
1. Clone the repo:
   ```
   git clone https://github.com/timmsy1998/RiftJS.git
   cd RiftJS
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file (see [Setup](#setup)).
4. Test with `node test.js` (requires a valid API key).

## License

MIT License © 2025 James Timms. See [LICENSE](LICENSE) for details.

## Links

- **npm Registry**: [https://www.npmjs.com/package/@timmsy/riftjs](https://www.npmjs.com/package/@timmsy/riftjs)
- **GitHub Repository**: [https://github.com/timmsy1998/RiftJS](https://github.com/timmsy1998/RiftJS)
- **Riot Developer Portal**: [https://developer.riotgames.com/](https://developer.riotgames.com/)