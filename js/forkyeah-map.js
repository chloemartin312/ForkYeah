import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';

export class ForkYeahMap extends LitElement {
  static get tag() {
    return "forkyeah-map";
  }

  constructor() {
    super();
    this.markers = [];
    this.map = null;
    this.clusterGroup = null;

    // NYC bounds
    this.nycBounds = [
      [40.4774, -74.2591], // SW
      [40.9176, -73.7004]  // NE
    ];
  }

  static get styles() {
    return css`
      #map {
        width: 100%;
        height: 500px;
        border-radius: 12px;
      }
    `;
  }

  firstUpdated() {
    this.loadLeaflet();
  }

  loadLeaflet() {
    // Leaflet CSS
    const leafletCSS = document.createElement("link");
    leafletCSS.rel = "stylesheet";
    leafletCSS.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(leafletCSS);

    // Cluster CSS
    const clusterCSS = document.createElement("link");
    clusterCSS.rel = "stylesheet";
    clusterCSS.href = "https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css";
    document.head.appendChild(clusterCSS);

    // Leaflet JS
    const leafletScript = document.createElement("script");
    leafletScript.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";

    leafletScript.onload = () => {
      // Cluster JS
      const clusterScript = document.createElement("script");
      clusterScript.src = "https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js";

      clusterScript.onload = () => {
        this.initMap();
      };

      document.body.appendChild(clusterScript);
    };

    document.body.appendChild(leafletScript);
  }

  initMap() {
    this.map = L.map(this.renderRoot.querySelector("#map"), {
      maxBounds: this.nycBounds,
      maxBoundsViscosity: 1.0,
      minZoom: 11,
      maxZoom: 18
    }).setView([40.7128, -74.0060], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.clusterGroup = L.markerClusterGroup();

    this.loadRestaurants();
  }

  async loadRestaurants() {
    try {
      const res = await fetch(
        "https://data.cityofnewyork.us/resource/43nn-pn8j.json?$limit=200"
      );
      const data = await res.json();

      // Filter + map NYC data
      this.markers = data
        .filter(r =>
          r.latitude &&
          r.longitude &&
          parseFloat(r.latitude) >= this.nycBounds[0][0] &&
          parseFloat(r.latitude) <= this.nycBounds[1][0] &&
          parseFloat(r.longitude) >= this.nycBounds[0][1] &&
          parseFloat(r.longitude) <= this.nycBounds[1][1]
        )
        .map(r => ({
          name: r.dba || "Unknown Restaurant",
          lat: parseFloat(r.latitude),
          lng: parseFloat(r.longitude)
        }));

      this.renderMarkers();

      // Auto-fit map to markers
      if (this.markers.length > 0) {
        const bounds = L.latLngBounds(
          this.markers.map(m => [m.lat, m.lng])
        );
        this.map.fitBounds(bounds);
      }

    } catch (err) {
      console.error("Error loading restaurants:", err);
    }
  }

  renderMarkers() {
    this.clusterGroup.clearLayers();

    this.markers.forEach(r => {
      const marker = L.marker([r.lat, r.lng])
        .bindPopup(`<b>${r.name}</b>`);

      this.clusterGroup.addLayer(marker);
    });

    this.map.addLayer(this.clusterGroup);
  }

  render() {
    return html`
      <div id="map"></div>
    `;
  }
}

customElements.define(ForkYeahMap.tag, ForkYeahMap);