let placeType = "cafe"

function loadMap()
{
    // These constants must start at 0
    // These constants must match the data layout in the 'locations' array below
    let TITLE = 0,
        CONTENT = 1,
        LATITUDE = 2,
        LONGITUDE = 3
    
    let stadiumContent = `
        <div id=stadium-content>
            <h1>Stade de France</h1>
            <div id=content>
                <img src = https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDyPQtZDMKgXxTfWRwgjZYKVK-U1RafPObReiJQ65PIg&s>
                <p>The Stade de France is the main area for the Paris 2024 Summer Olympics.</p>
                <p>It is a track and field stadium that can fit up to 80,698 people, making it France's largest stadium.</p>
                <p>For more information, <a href=https://olympics.com/en/paris-2024/venues/stade-de-france>check out the venue here.</a></p>
            </div>
        </div>
    `

    let bmxContent = `
        <div id=stadium-content>
            <h1>Saint-Quentin-en-Yvelines BMX Stadium</h1>
            <div id=content>
                <img src = https://img.olympics.com/images/image/private/t_s_16_9_g_auto/t_s_w730/f_auto/primary/ioso0xkk0v6j8biry0av>
                <p>This is the Saint-Quentin-en-Yvelines BMX Stadium.</p>
                <p>Let's see how fast you are at cycling.</p>
                <p>For more information, <a href=https://olympics.com/en/paris-2024/venues/saint-quentin-en-yvelines-bmx-stadium>check out the venue here.</a></p>
            </div>
        </div>
    `

    let laDefense = `
        <div id=stadium-content>
            <h1>La Defense Arena</h1>
            <div id=content>
                <img src = https://img.olympics.com/images/image/private/t_s_16_9_g_auto/t_s_w730/f_auto/primary/v6t0hesg2db1d5gzqb3i>
                <p>This is the La Defense Arena.</p>
                <p>Another multi-purpose arena in Paris.</p>
                <p>For more information, <a href=https://olympics.com/en/paris-2024/venues/paris-la-defense-arena>check out the venue here.</a></p>
            </div>
        </div>
    `

    let parcDesPrinces = `
        <div id=stadium-content>
            <h1>Parc des Princes</h1>
            <div id=content>
                <img src = https://img.olympics.com/images/image/private/t_s_16_9_g_auto/t_s_w730/f_auto/primary/p3mkcxoekiq5qm86eukz>
                <p>This is the Parc des Princes.</p>
                <p>A 2-tier football stadium for football and concerts.</p>
                <p>For more information, <a href=https://olympics.com/en/paris-2024/venues/parc-des-princes>check out the venue here.</a></p>
            </div>
        </div>
    `

    let northParisArena = `
        <div id=stadium-content>
            <h1>Villepinte Exhibition Centre</h1>
            <div id=content>
                <img src = https://img.olympics.com/images/image/private/t_s_16_9_g_auto/t_s_w730/f_auto/primary/ueupjchxueao6ta0a8jn>
                <p>This is the Villepinte Exhibition Centre.</p>
                <p>Now nicknamed the "North Paris Arena" for the Olympics this year.</p>
                <p>For more information, <a href=https://olympics.com/en/paris-2024/venues/north-paris-arena>check out the venue here.</a></p>
            </div>
        </div>
    `

    let eiffelTower = `
        <div id=stadium-content>
            <h1>Eiffel Tower</h1>
            <div id=content>
                <img src = https://lh5.googleusercontent.com/p/AF1QipPTxHG0_dJooayYKzCB004tccRM5MhxYp6KWa53=w408-h544-k-no>
                <p>THIS, everyone, is the pinnacle of Paris, and by extension, France.</p>
                <p>One of the TWO landmarks that define what makes Paris beautiful.</p>
                <p>No, you won't find Ladybug or Cat Noir here, trust me. :)</p>
            </div>
        </div>
    `

    let arcDeTriomphe = `
        <div id=stadium-content>
            <h1>Arc de Triomphe</h1>
            <div id=content>
                <img src = https://lh5.googleusercontent.com/p/AF1QipMXST5GB5FJEaWKGQ2d_oBsOZhWLmXjYWhaK4M8=w408-h544-k-no>
                <p>The second most important landmark in Paris, and all of France.</p>
                <p>It's another landmark that defines what makes Paris beautiful.</p>
            </div>
        </div>
    `

    let parisCDG = `
        <div id=stadium-content>
            <h1>Charles de Gaulle Airport</h1>
            <div id=content>
                <img src = https://www.besix.com/-/media/images/projects/charles-de-gaulle-airport---terminal/cdg-2e-139.jpg?mh=400&h=400&w=602&la=en&hash=13A9496319E533DAD6EC009FAB9F38FA>
                <p>The biggest and busiest airport in France.</p>
                <p>Second busiest in Europe, and then there's London-Heathrow.</p>
                <p>The airport is the hub for Air France, France's flag carrier airline.</p>
            </div>
        </div>
    `

    let locations = [
        ["Stade de France", stadiumContent, 48.9244786, 2.3575695],
        ["Saint-Quentin-en-Yvelines BMX Stadium", bmxContent, 48.7862197, 2.0315889],
        ["La Defense Arena", laDefense, 48.8956693, 2.2270564],
        ["Parc des Princes", parcDesPrinces, 48.8417438, 2.2510819],
        ["Villepinte Exhibition Centre", northParisArena, 48.9709555, 2.5181571],
        ["Eiffel Tower", eiffelTower, 48.858321, 2.2934741],
        ["Arc de Triomphe", arcDeTriomphe, 48.8737952, 2.2924579],
        ["Paris-Charles de Gaulle Airport", parisCDG, 49.0078632, 2.5481912]
    ]

    let map = new google.maps.Map(document.getElementById("map"), {
        mapId: "MY_MAP_ID",
        zoom: 10,
        center: new google.maps.LatLng(48.8588388, 2.0180912),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControlOptions: {
            mapTypeIds: ["roadmap", "hide_poi", "satellite"]
        }
    })

    // Auto complete
    new google.maps.places.Autocomplete(start)
    new google.maps.places.Autocomplete(end)
    new google.maps.places.Autocomplete(waypoint)

    hidePointsOfInterest(map)

    let service = new google.maps.places.PlacesService(map)

    let infoWindow = null

    locations.forEach(location =>
    {
        let marker = new google.maps.marker.AdvancedMarkerElement({title: location[TITLE],
            position: new google.maps.LatLng(location[LATITUDE], location[LONGITUDE]), 
            map: map
        })

        marker.content.style.animation = "drop 0.7s linear"
        
        if(infoWindow === null)
        {
            infoWindow = new google.maps.InfoWindow()
        }					

        google.maps.event.addListener(marker, "click", () =>
        {
            infoWindow.setContent(location[CONTENT])
            infoWindow.open(map, marker)
        })
    })

    directionsRenderer = new google.maps.DirectionsRenderer({draggable: true})
    directionsRenderer.setMap(map)
    directionsRenderer.setPanel(document.getElementById("directions")) // generates the directions of your journey
    
    calculateRoute("DRIVING") // calculates the route that you set it to

    service.nearbySearch({
        location: latLng, // centre of the search
        radius: 1000, // radius (in metres) of the search
        type: placeType
    }, getNearbyServicesMarkers)
}

let markers = []
function getNearbyServicesMarkers(results, status)
{
    markers.forEach(marker => marker.map = null)
    markers = []
    if (status === google.maps.places.PlacesServiceStatus.OK)
    {
        results.forEach(result =>
        {
            createMarker(result)
        })                   
    }
}

function createMarker(place)
{
    let icon = document.createElement("img")
    icon.src = place.icon  
    icon.style.width = "20px"
    icon.style.height = "20px"
    
    let marker = new google.maps.marker.AdvancedMarkerElement({
        map: map,
        content: icon,
        position: place.geometry.location
    })

    markers.push(marker)
    
    if(infoWindow === null)
    {
        infoWindow = new google.maps.InfoWindow()
    }
    
    google.maps.event.addListener(marker, "click", () =>
    {
        infoWindow.setContent(place.name)
        infoWindow.open(map, marker)
    })
}

function hidePointsOfInterest(map) // exactly what it says on the tin. hides points of interest (irrelevant stuff)
{
    let styles = [
        {
            "featureType": "poi",
            "stylers": [{"visibility": "off"}]
        }
    ]

    let styledMapType = new google.maps.StyledMapType(styles, {name: "Hide POI", alt: "Hide Points of Interest"})
    map.mapTypes.set("hide_poi", styledMapType)
    
    map.setMapTypeId("hide_poi")
}

function calculateRoute(travelMode = "DRIVING") { // exactly what it says on the tin, calculates the route.
    document.getElementById("transport-mode").innerHTML = travelMode
    let start = document.getElementById("start").value // pins the start of the route on the map
    let end = document.getElementById("end").value // pins the end of the route on the map
    let waypoint = document.getElementById("waypoint").value // pins the waypoint of the route on the map

    let request = {origin: start,
        destination: end,
        travelMode: travelMode} // pulls the request and assumes you're driving (by default)

    console.log(request)

    directionsService = new google.maps.DirectionsService() // calculates the route from start to end of journey
    directionsService.route(request, (route, status) => {
        if (status === google.maps.DirectionsStatus.OK)
        {
            directionsRenderer.setDirections(route)
        }
    })

    console.log(directionsService)
}

function googleTranslateElement() { // translates the whole page. for example, french
    new google.translate.TranslateElement(
        {pageLanguage: 'fr'},
        "translation_element"
    );
}

function getCurrencies(){ // grabs the currencies from frankfurter
    dropdown1 = document.getElementById('initialCurrency')
    dropdown2 = document.getElementById('targetCurrency')

    let currencies = []
    fetch('https://api.frankfurter.app/currencies') // fetches currency from frankfurter api
    .then(response => response.json()) // converts to json format
    .then(data => {
     currencies = Object.keys(data) // extract the code from the data
     currencies.forEach(currency => {
        var option = document.createElement('option'); // new option element
        option.value = currency; // set the value for option
        option.text =currency // set the text for option
        dropdown1.add(option); // adds the option
     }
    )
    currencies.forEach(currency => {
        var option = document.createElement('option');
        option.value = currency;
        option.text =currency
        dropdown2.add(option);
     }
    )
  })
  .catch(error => {
    console.error('Error:', error);
  });
}
function calculateExchange(){ // calculates the exchange rate of the currency you previously set
    let value = document.getElementById('initialValue').value // input
    let text = document.getElementById('targetValue') // target
    let targetCurrency = document.getElementById('targetCurrency').value // get the target currency
    let initialCurrency = document.getElementById('initialCurrency').value // get the initial currency
    const host = 'api.frankfurter.app'; // frankfurter is the api host
    fetch(`https://${host}/latest?amount=${value}&from=${initialCurrency}&to=${targetCurrency}`) // fetches the exchange rate from the api
    .then(resp => resp.json())
    .then((data) => {
        text.innerHTML = data.rates[targetCurrency] // sets the element to the calculated exchange rate
    });
}