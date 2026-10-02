/**
 * EcoClean Modul Peta & Direktori Penukaran Minyak Jelantah di Buleleng
 * Menggunakan Google Maps JavaScript API Resmi
 */

class LocationManager {
  constructor() {
    this.locations = EXCHANGE_LOCATIONS || [];
    this.filteredLocations = [...this.locations];
    this.map = null;
    this.markers = [];
    this.activeInfoWindow = null;
    this.currentFilter = 'all';
    this.searchQuery = '';
    this.userMarker = null;

    this.searchInput = document.getElementById('locationSearchInput');
    this.filterPills = document.querySelectorAll('.filter-pill');
    this.locationsList = document.getElementById('locationsList');
    this.userLocationBtn = document.getElementById('btnUserLocation');

    this.init();
  }

  init() {
    this.initMap();
    this.renderLocationCards();
    this.bindEvents();
  }

  initMap() {
    const mapElement = document.getElementById('googleMap') || document.getElementById('leafletMap');
    if (!mapElement) return;

    if (typeof google === 'undefined' || !google.maps) {
      console.warn("Google Maps library belum termuat, menunggu callback...");
      return;
    }

    try {
      // Koordinat Pusat: Singaraja / Buleleng, Bali
      const bulelengCenter = { lat: -8.1250, lng: 115.0500 };

      // Opsi kustom Google Map
      this.map = new google.maps.Map(mapElement, {
        center: bulelengCenter,
        zoom: 11,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: true,
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          position: google.maps.ControlPosition.TOP_RIGHT
        },
        zoomControl: true,
        streetViewControl: false,
        fullscreenControl: true,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#c9ecf7" }]
          }
        ]
      });

      this.activeInfoWindow = new google.maps.InfoWindow();
      this.updateMapMarkers();
    } catch (err) {
      console.error("Gagal menginisialisasi Google Maps:", err);
    }
  }

  getEcoMarkerIcon() {
    // Custom SVG Pin Berwarna Hijau Eco dengan Ikon Jeriken Minyak
    const svgIcon = `
      <svg xmlns="http://www.w3.org/2000/svg" width="38" height="48" viewBox="0 0 38 48">
        <defs>
          <filter id="shadow" x="-20%" y="-10%" width="140%" height="130%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" flood-opacity="0.35"/>
          </filter>
        </defs>
        <path d="M19 0C8.5 0 0 8.5 0 19c0 14 19 29 19 29s19-15 19-29C38 8.5 29.5 0 19 0z" fill="#10B981" filter="url(#shadow)" stroke="#ffffff" stroke-width="2"/>
        <circle cx="19" cy="18" r="11" fill="#ffffff"/>
        <text x="19" y="23" font-size="14" text-anchor="middle">🛢️</text>
      </svg>
    `;

    return {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svgIcon),
      scaledSize: new google.maps.Size(38, 48),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(19, 48)
    };
  }

  updateMapMarkers() {
    if (!this.map || typeof google === 'undefined' || !google.maps) return;

    // Bersihkan marker lama
    this.markers.forEach(item => item.marker.setMap(null));
    this.markers = [];

    const bounds = new google.maps.LatLngBounds();
    const icon = this.getEcoMarkerIcon();

    this.filteredLocations.forEach(loc => {
      const position = { lat: loc.lat, lng: loc.lng };

      const marker = new google.maps.Marker({
        position: position,
        map: this.map,
        title: loc.name,
        icon: icon,
        animation: google.maps.Animation.DROP
      });

      const infoContent = `
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 6px; max-width: 250px; line-height: 1.4;">
          <h4 style="margin: 0 0 4px 0; font-family: 'Outfit', sans-serif; color: #0f172a; font-size: 1.05rem; font-weight: 700;">${loc.name}</h4>
          <p style="margin: 0 0 6px 0; color: #64748b; font-size: 0.82rem;">${loc.address}, Kec. ${loc.district}</p>
          <div style="margin-bottom: 8px;">
            <span style="background: rgba(16, 185, 129, 0.15); color: #059669; font-weight: 700; font-size: 0.8rem; padding: 3px 8px; border-radius: 4px; display: inline-block;">
              💰 ${loc.rewardRate}
            </span>
          </div>
          <div style="font-size: 0.78rem; color: #475569; margin-bottom: 8px;">
            🕒 <strong>Jam:</strong> ${loc.openHours}
          </div>
          <a href="https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}" target="_blank" rel="noopener noreferrer" style="color: #10b981; font-weight: 700; text-decoration: none; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 4px;">
            Buka Petunjuk Arah &rarr;
          </a>
        </div>
      `;

      marker.addListener('click', () => {
        if (this.activeInfoWindow) {
          this.activeInfoWindow.setContent(infoContent);
          this.activeInfoWindow.open(this.map, marker);
        }
      });

      this.markers.push({ locId: loc.id, marker: marker, infoContent: infoContent });
      bounds.extend(position);
    });

    if (this.filteredLocations.length > 0 && this.map) {
      if (this.filteredLocations.length === 1) {
        this.map.setCenter({ lat: this.filteredLocations[0].lat, lng: this.filteredLocations[0].lng });
        this.map.setZoom(14);
      } else {
        this.map.fitBounds(bounds);
      }
    }
  }

  renderLocationCards() {
    if (!this.locationsList) return;

    if (this.filteredLocations.length === 0) {
      this.locationsList.innerHTML = `
        <div style="text-align: center; padding: 40px; color: var(--text-muted);">
          <div style="font-size: 2rem; margin-bottom: 8px;">🔍</div>
          <h4>Tidak ada titik tukar yang cocok</h4>
          <p style="font-size: 0.9rem;">Coba pilih kategori lain atau hapus kata kunci pencarian Anda.</p>
        </div>
      `;
      return;
    }

    this.locationsList.innerHTML = this.filteredLocations.map(loc => `
      <div class="location-item-card" data-id="${loc.id}" data-lat="${loc.lat}" data-lng="${loc.lng}">
        <div class="loc-card-header">
          <h4 class="loc-card-title">${loc.name}</h4>
          <span class="badge-reward">${loc.rewardType}</span>
        </div>
        <div class="loc-card-address">
          <span>📍</span> ${loc.address}, Kec. ${loc.district}
        </div>
        <div class="loc-meta-grid">
          <div class="loc-meta-item">🕒 <strong>Jam:</strong> ${loc.openHours}</div>
          <div class="loc-meta-item">💰 <strong>Imbalan:</strong> ${loc.rewardRate}</div>
          <div class="loc-meta-item">📦 <strong>Minimal:</strong> ${loc.minVolume}</div>
          <div class="loc-meta-item">📞 <strong>Kontak:</strong> ${loc.phone}</div>
        </div>
        <div style="margin-top: 8px; font-size: 0.8rem; color: var(--text-dim);">
          🧴 <strong>Kemasan:</strong> ${loc.packagingRequirement}
        </div>
        <div class="loc-card-actions">
          <a href="https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" style="flex: 1;">
            Petunjuk Arah ↗
          </a>
          <button class="btn btn-primary btn-sm view-on-map-btn" data-lat="${loc.lat}" data-lng="${loc.lng}" data-id="${loc.id}">
            Lihat di Peta 🎯
          </button>
        </div>
      </div>
    `).join('');

    // Event listener tombol Lihat di Peta
    this.locationsList.querySelectorAll('.view-on-map-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const lat = parseFloat(btn.getAttribute('data-lat'));
        const lng = parseFloat(btn.getAttribute('data-lng'));
        const id = btn.getAttribute('data-id');
        this.focusLocation(lat, lng, id);
      });
    });

    this.locationsList.querySelectorAll('.location-item-card').forEach(card => {
      card.addEventListener('click', () => {
        const lat = parseFloat(card.getAttribute('data-lat'));
        const lng = parseFloat(card.getAttribute('data-lng'));
        const id = card.getAttribute('data-id');
        this.focusLocation(lat, lng, id);
      });
    });
  }

  focusLocation(lat, lng, id) {
    if (!this.map) return;
    const targetPos = { lat: lat, lng: lng };
    this.map.panTo(targetPos);
    this.map.setZoom(15);

    const targetItem = this.markers.find(m => m.locId === id);
    if (targetItem && this.activeInfoWindow) {
      this.activeInfoWindow.setContent(targetItem.infoContent);
      this.activeInfoWindow.open(this.map, targetItem.marker);
    }
  }

  bindEvents() {
    // Pencarian
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.applyFilters();
      });
    }

    // Filter Kategori
    this.filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        this.filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.currentFilter = pill.getAttribute('data-filter');
        this.applyFilters();
      });
    });

    // Lokasi Saya via Geolocation
    if (this.userLocationBtn) {
      this.userLocationBtn.addEventListener('click', () => {
        if (!navigator.geolocation) {
          alert("Geolokasi tidak didukung oleh browser Anda.");
          return;
        }
        this.userLocationBtn.textContent = "Mencari...";
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            this.userLocationBtn.textContent = "📍 Lokasi Saya";
            const userPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            if (this.map) {
              this.map.panTo(userPos);
              this.map.setZoom(14);

              if (this.userMarker) {
                this.userMarker.setMap(null);
              }

              this.userMarker = new google.maps.Marker({
                position: userPos,
                map: this.map,
                title: "Lokasi Anda Saat Ini",
                icon: {
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: 8,
                  fillColor: "#06b6d4",
                  fillOpacity: 1,
                  strokeColor: "#ffffff",
                  strokeWeight: 2
                }
              });

              if (this.activeInfoWindow) {
                this.activeInfoWindow.setContent("<strong>📍 Lokasi Anda Saat Ini</strong>");
                this.activeInfoWindow.open(this.map, this.userMarker);
              }
            }
          },
          (err) => {
            this.userLocationBtn.textContent = "📍 Lokasi Saya";
            if (window.showToast) {
              window.showToast("Tidak dapat mengakses GPS. Menampilkan peta Buleleng.");
            }
          }
        );
      });
    }
  }

  applyFilters() {
    this.filteredLocations = this.locations.filter(loc => {
      const matchesSearch = !this.searchQuery || 
        loc.name.toLowerCase().includes(this.searchQuery) ||
        loc.city.toLowerCase().includes(this.searchQuery) ||
        loc.address.toLowerCase().includes(this.searchQuery) ||
        loc.district.toLowerCase().includes(this.searchQuery);

      const matchesFilter = this.currentFilter === 'all' || 
        loc.rewardType.toLowerCase().includes(this.currentFilter.toLowerCase());

      return matchesSearch && matchesFilter;
    });

    this.renderLocationCards();
    this.updateMapMarkers();
  }
}

// Global Callback resmi Google Maps
window.initGoogleMap = function() {
  window.locationManager = new LocationManager();
};

// Fallback jika API sudah siap sebelum event listener
document.addEventListener('DOMContentLoaded', () => {
  if (typeof google !== 'undefined' && google.maps && !window.locationManager) {
    window.locationManager = new LocationManager();
  }
});
