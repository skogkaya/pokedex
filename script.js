let url = "https://pokeapi.co/api/v2/pokemon";
let completeUrl = "https://pokeapi.co/api/v2/pokemon?limit=100&offset=0";
let offset = 0;
const limit = 20;
const maxPokemon = 100;
let allPokemons = [];

let typeColors = {
    normal: '#A8A77A',
    fire: '#EE8130',
    water: '#6390F0',
    electric: '#F7D02C',
    grass: '#7AC74C',
    ice: '#96D9D6',
    fighting: '#C22E28',
    poison: '#A33EA1',
    ground: '#E2BF65',
    flying: '#A98FF3',
    psychic: '#F95587',
    bug: '#A6B91A',
    rock: '#B6A136',
    ghost: '#735797',
    dragon: '#6F35FC',
    dark: '#705746',
    steel: '#B7B7CE',
    fairy: '#D685AD'
};

let transparentColors = {
    normal: 'rgba(168, 167, 122, 0.5)',
    fire: 'rgba(238, 129, 48, 0.6)',
    water: 'rgba(99, 144, 240, 0.6)',
    electric: 'rgba(247, 208, 44, 0.4)',
    grass: 'rgba(122, 199, 76, 0.6)',
    ice: 'rgba(150, 217, 214, 0.6)',
    fighting: 'rgba(194, 46, 40, 0.6)',
    poison: 'rgba(163, 62, 161, 0.4)',
    ground: 'rgba(226, 191, 101, 0.6)',
    flying: 'rgba(169, 143, 243, 0.6)',
    psychic: 'rgba(249, 85, 135, 0.6)',
    bug: 'rgba(166, 185, 26, 0.6)',
    rock: 'rgba(182, 161, 54, 0.6)',
    ghost: 'rgba(115, 87, 151, 0.6)',
    dragon: 'rgba(111, 53, 252, 0.6)',
    dark: 'rgba(112, 87, 70, 0.6)',
    steel: 'rgba(183, 183, 206, 0.6)',
    fairy: 'rgba(214, 133, 173, 0.6)'
};

async function getData(){
    let response = await fetch(`${url}?limit=${limit}&offset=${offset}`);
    let currentPoke = await response.json();
    console.log(currentPoke);

    for(let i = 0; i < currentPoke.results.length; i++) {
        let id = offset + i + 1;
        let details = await getDetails(id);
        allPokemons.push({ name: currentPoke.results[i].name, details, id });
        renderPoke(currentPoke.results[i], details, id);
    }

    offset += limit;
    if (offset >= maxPokemon) {
        document.getElementById('loadMoreButton').style.display = 'none';
    }
}


async function getDetails(id){
    let getDetailsUrl = `https://pokeapi.co/api/v2/pokemon/${id}/`;
    let response = await fetch(getDetailsUrl);
    let currentPokeDetail = await response.json();
    return currentPokeDetail;
}


function getColorForType(type) {
    return typeColors[type] || '#000000';
}


function getTransparentColorForType(type) {
    return transparentColors[type] || 'rgba(0, 0, 0, 0.6)'; 
}


function renderPoke(poke, details, id) {
    let contentContainer = document.getElementById('contentPoke');
    let imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`;

    let types = "";
    for (let j = 0; j < details.types.length; j++) {
        let type = details.types[j].type.name;
        let color = getColorForType(type);
        types += `<div class="type" style="background-color: ${color};">${type}</div>`;
    }

    let firstType = details.types[0].type.name;
    let firstTypeColor = getTransparentColorForType(firstType);

    contentContainer.innerHTML += generatePokeHtml(firstTypeColor, id, poke, imgUrl, types);
}


function generatePokeHtml(firstTypeColor, id, poke, imgUrl, types){
    return `
    <div class="singlePoke" style="background-color: ${firstTypeColor};" onclick="renderSinglePoke(${id})">
        <div class="idPoke"><b>#${id}</b></div>
        <div class="pokeName"><b>${poke.name}</b></div>
        <img src="${imgUrl}" alt="Pokemon Pics">
        <div class="types"> ${types}</div>
    </div>
    `;
}


async function renderSinglePoke(id){
    let contentSinglePoke = document.getElementById('singlePokeView');
    let singlePokeContent = document.getElementById('singlePokeContent');
    let details = await getDetails(id);
    let imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`;

    let types = "";
    for (let j = 0; j < details.types.length; j++) {
        let type = details.types[j].type.name;
        let color = getColorForType(type);
        types += `<div class="type" style="background-color: ${color};">${type}</div>`;
    }

    let firstType = details.types[0].type.name;
    let firstTypeColor = getTransparentColorForType(firstType);

    singlePokeContent.innerHTML = generateDetailedHtml(firstTypeColor,id,details,imgUrl,types);

    contentSinglePoke.style.display = 'flex';
}


function generateDetailedHtml(firstTypeColor,id,details,imgUrl,types){
    let hp = details.stats[0].base_stat;
    let attack = details.stats[1].base_stat;
    let defense = details.stats[2].base_stat;
    let weight = details.weight;
    let height = details.height;

    return `
    <div class="singlePokeContent" style="background-color: ${firstTypeColor};">
        <div class="idPoke"><b>#${id}</b></div>
        <div class="pokeName"><b>${details.name}</b></div>
        <div class="poke-details">
            <div class="poke-leftside">
                <div>Height: <b>${height}</b></div>
                <div>Weight: <b>${weight}</b></div>
                <br>
                <div>HP: <b>${hp}</b></div>
                <div>Attack: <b>${attack}</b></div>
                <div>Defense: <b>${defense}</b></div>
            </div>
            <div class="poke-rightside">
                <img src="${imgUrl}" alt="Pokemon Pics">
            </div>
        </div>
        <div class="types"> ${types}</div>
        <button class="navButton" onclick="navigatePoke(${id - 1})">←</button>
        <button class="closeButton" onclick="closeSinglePoke()">X</button>
        <button class="navButton" onclick="navigatePoke(${id + 1})">→</button>
    </div>
    `;
}


function closeSinglePoke(){
    let contentSinglePoke = document.getElementById('singlePokeView');
    contentSinglePoke.style.display = 'none';
}


async function navigatePoke(id) {
    if (id < 1){id = 100;} 
    if (id > 100){ id = 1;}
    await renderSinglePoke(id);
}


function loadMore() {
    getData();
}


function handleSearchInput() {
    let searchInput = document.getElementById('user-input').value.toLowerCase();
    if (searchInput.length < 3) {
        document.getElementById('contentPoke').innerHTML = '';
        allPokemons = [];
        offset = 0;
        getData();
    } else {
        filterPoke(searchInput);
    }
}

async function filterPoke(searchInput) {
    // Filter Pokémon by name
    let filteredPokemons = allPokemons.filter(pokemon => pokemon.name.toLowerCase().includes(searchInput));
    
    // Clear the current content
    document.getElementById('contentPoke').innerHTML = '';

    // Render filtered Pokémon
    filteredPokemons.forEach(poke => {
        renderPoke({ name: poke.name }, poke.details, poke.id);
    });
}
