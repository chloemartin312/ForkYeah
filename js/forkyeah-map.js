import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';

// ─── Constants ────────────────────────────────────────────────────────────────
const NYC_BOUNDS  = [[40.4774, -74.2591], [40.9176, -73.7004]];
const NYC_CENTER  = [40.7128, -74.0060];
const MIN_ZOOM    = 13;
const DEBOUNCE_MS = 300;
const API_BASE    = 'https://data.cityofnewyork.us/resource/43nn-pn8j.json';

// camis = unique NYC DOH restaurant ID — used to deduplicate across pan/zoom
const API_SELECT  = 'camis,latitude,longitude,dba,building,street,cuisine_description';

const SHADOW_CSS_HREFS = [
  'https://unpkg.com/leaflet/dist/leaflet.css',
];

// ─── Component ────────────────────────────────────────────────────────────────
export class ForkYeahMap extends LitElement {
  static get tag() { return 'forkyeah-map'; }

  static get styles() {
    return css`
      /*
       * Width/height are driven by CSS custom properties so the parent
       * can control sizing without touching this file:
       *
       *   forkyeah-map { --map-width: 100%; --map-height: 300px; }
       */
      :host {
        display: block;
        width:  var(--map-width,  100%);
        height: var(--map-height, 400px);
      }

      #map {
        width: 100%;
        height: 100%;
      }
    `;
  }

  constructor() {
    super();
    this._map           = null;
    this._markerLayer   = null;   // plain LayerGroup — no clustering
    this._loadedIds     = new Set(); // camis IDs already rendered
    this._fetchedBounds = [];     // L.LatLngBounds objects already fetched
    this._debounceTimer = null;
    this._abortCtrl     = null;
  }

  // ─── Lifecycle ──────────────────────────────────────────────────────────────

  firstUpdated() {
    this._injectShadowCSS().then(() => this._initMap());
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearTimeout(this._debounceTimer);
    this._abortCtrl?.abort();
    this._map?.remove();
  }

  // ─── Asset Loading ──────────────────────────────────────────────────────────

  /**
   * Leaflet's CSS must be inside the shadow root to style the map correctly.
   * <link> tags in <head> cannot pierce the shadow DOM boundary.
   */
  _injectShadowCSS() {
    const promises = SHADOW_CSS_HREFS.map(href => {
      if (this.renderRoot.querySelector(`link[href="${href}"]`)) return Promise.resolve();
      return new Promise(resolve => {
        const link = Object.assign(document.createElement('link'), { rel: 'stylesheet', href });
        link.addEventListener('load',  resolve, { once: true });
        link.addEventListener('error', resolve, { once: true }); // don't block on CDN errors
        this.renderRoot.appendChild(link);
      });
    });
    return Promise.all(promises);
  }

  // ─── Map Initialisation ─────────────────────────────────────────────────────

  _initMap() {
    this._map = L.map(this.renderRoot.querySelector('#map'), {
      maxBounds: NYC_BOUNDS,
      maxBoundsViscosity: 1.0,
      minZoom: 11,
      maxZoom: 18,
    }).setView(NYC_CENTER, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      updateWhenIdle: true,
      keepBuffer: 2,
    }).addTo(this._map);

    // Plain layer group — every restaurant gets its own individual pin
    this._markerLayer = L.layerGroup().addTo(this._map);

    // Ensure Leaflet measures the container after the host has painted
    requestAnimationFrame(() => this._map.invalidateSize());

    this._loadRestaurantsInView();

    this._map.on('moveend', () => {
      clearTimeout(this._debounceTimer);
      this._debounceTimer = setTimeout(() => this._loadRestaurantsInView(), DEBOUNCE_MS);
    });
  }

  // ─── Data Fetching ──────────────────────────────────────────────────────────

  /**
   * Returns true if any previously fetched bounds fully contains the current view.
   * Prevents redundant API calls when panning back to an already-loaded area.
   */
  _alreadyFetched(bounds) {
    return this._fetchedBounds.some(b => b.contains(bounds));
  }

  async _loadRestaurantsInView() {
    const zoom = this._map.getZoom();

    // Below zoom threshold — clear everything and reset so zooming back in
    // starts fresh without stale state from a different zoom level.
    if (zoom < MIN_ZOOM) {
      this._markerLayer.clearLayers();
      this._loadedIds.clear();
      this._fetchedBounds = [];
      return;
    }

    const bounds = this._map.getBounds();
    if (this._alreadyFetched(bounds)) return;

    // Cancel any previous in-flight request — stale data must never overwrite fresh data
    this._abortCtrl?.abort();
    this._abortCtrl = new AbortController();

    const url = new URL(API_BASE);
    url.searchParams.set('$select', API_SELECT); // only the 7 fields we actually use
    url.searchParams.set('$where',
      `latitude>${bounds.getSouth()} AND latitude<${bounds.getNorth()} AND longitude>${bounds.getWest()} AND longitude<${bounds.getEast()}`
    );
    url.searchParams.set('$limit', '300');

    try {
      const res  = await fetch(url, { signal: this._abortCtrl.signal });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();

      this._fetchedBounds.push(bounds);
      this._addNewMarkers(data);
    } catch (err) {
      if (err.name !== 'AbortError') console.error('Failed to load restaurants:', err);
    }
  }

  // ─── Rendering ──────────────────────────────────────────────────────────────

  _addNewMarkers(data) {
    data.forEach(r => {
      if (!r.latitude || !r.longitude || !r.camis) return;
      if (this._loadedIds.has(r.camis)) return;

      const address = [r.building, r.street].filter(Boolean).join(' ');

      L.marker([parseFloat(r.latitude), parseFloat(r.longitude)])
        .bindPopup(
          `<b>${r.dba ?? 'Unknown'}</b><br>${address}<br>🍽️ ${r.cuisine_description ?? 'Various'}`,
          { maxWidth: 220 }
        )
        .addTo(this._markerLayer);

      this._loadedIds.add(r.camis);
    });
  }

  render() {
    return html`<div id="map"></div>`;
  }
}

customElements.define(ForkYeahMap.tag, ForkYeahMap);