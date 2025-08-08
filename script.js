// Taco Apt - Interactive Map Application
class TacoAptApp {
    constructor() {
        this.map = null;
        this.markers = [];
        this.circles = [];
        this.data = [];
        this.isLoading = false;
        
        this.init();
    }
    
    init() {
        this.setupMap();
        this.setupControls();
        this.loadData();
    }
    
    setupMap() {
        // Initialize map centered on California
        this.map = L.map('map').setView([36.7783, -119.4179], 6);
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);
        
        // Fix default marker icons
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
            iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });
    }
    
    setupControls() {
        const radiusSlider = document.getElementById('radius');
        const radiusValue = document.getElementById('radiusValue');
        const minApartmentsSlider = document.getElementById('minApartments');
        const minApartmentsValue = document.getElementById('minApartmentsValue');
        const showNonMatchingCheckbox = document.getElementById('showNonMatching');
        const exportBtn = document.getElementById('exportBtn');
        const refreshBtn = document.getElementById('refreshBtn');
        
        // Update display values when sliders change
        radiusSlider.addEventListener('input', (e) => {
            radiusValue.textContent = e.target.value;
            this.updateMap();
        });
        
        minApartmentsSlider.addEventListener('input', (e) => {
            minApartmentsValue.textContent = e.target.value;
            this.updateMap();
        });
        
        showNonMatchingCheckbox.addEventListener('change', () => {
            this.updateMap();
        });
        
        exportBtn.addEventListener('click', () => {
            this.exportCSV();
        });
        
        refreshBtn.addEventListener('click', () => {
            this.loadData();
        });
    }
    
    async loadData() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.updateStats('Loading data...');
        
        try {
            // For demo purposes, we'll use mock data
            // In a real app, this would fetch from your API
            this.data = this.getMockData();
            this.updateMap();
            this.updateStats(`Loaded ${this.data.length} Taco Bell locations`);
        } catch (error) {
            console.error('Error loading data:', error);
            this.updateStats('Error loading data');
        } finally {
            this.isLoading = false;
        }
    }
    
    getMockData() {
        // Mock data for demonstration
        return [
            {
                taco: {
                    id: 1,
                    name: "Taco Bell",
                    lat: 37.7749,
                    lon: -122.4194,
                    street: "123 Main St",
                    city: "San Francisco",
                    state: "CA",
                    postcode: "94102"
                },
                apartments: [
                    {
                        id: 1,
                        name: "Sunset Apartments",
                        lat: 37.7750,
                        lon: -122.4195,
                        distanceM: 150,
                        street: "456 Oak Ave",
                        city: "San Francisco",
                        state: "CA",
                        postcode: "94102"
                    },
                    {
                        id: 2,
                        name: "Golden Gate Residences",
                        lat: 37.7755,
                        lon: -122.4200,
                        distanceM: 450,
                        street: "789 Pine St",
                        city: "San Francisco",
                        state: "CA",
                        postcode: "94102"
                    }
                ]
            },
            {
                taco: {
                    id: 2,
                    name: "Taco Bell",
                    lat: 34.0522,
                    lon: -118.2437,
                    street: "456 Broadway",
                    city: "Los Angeles",
                    state: "CA",
                    postcode: "90012"
                },
                apartments: [
                    {
                        id: 3,
                        name: "Downtown Lofts",
                        lat: 34.0525,
                        lon: -118.2440,
                        distanceM: 200,
                        street: "123 Spring St",
                        city: "Los Angeles",
                        state: "CA",
                        postcode: "90012"
                    }
                ]
            },
            {
                taco: {
                    id: 3,
                    name: "Taco Bell",
                    lat: 32.7157,
                    lon: -117.1611,
                    street: "789 Harbor Dr",
                    city: "San Diego",
                    state: "CA",
                    postcode: "92101"
                },
                apartments: []
            }
        ];
    }
    
    updateMap() {
        this.clearMap();
        
        const radius = parseInt(document.getElementById('radius').value);
        const minApartments = parseInt(document.getElementById('minApartments').value);
        const showNonMatching = document.getElementById('showNonMatching').checked;
        
        let matchingCount = 0;
        let totalCount = 0;
        
        this.data.forEach(item => {
            const hasEnoughApartments = item.apartments.length >= minApartments;
            const shouldShow = showNonMatching || hasEnoughApartments;
            
            if (shouldShow) {
                totalCount++;
                if (hasEnoughApartments) matchingCount++;
                
                this.addMarker(item, radius);
            }
        });
        
        this.updateStats(`${matchingCount} matching / ${totalCount} total Taco Bells`);
    }
    
    addMarker(item, radius) {
        const { taco, apartments } = item;
        
        // Create custom icon based on apartment count
        const iconColor = apartments.length > 0 ? '#48bb78' : '#e53e3e';
        const icon = L.divIcon({
            className: 'custom-marker',
            html: `<div style="
                background-color: ${iconColor};
                width: 20px;
                height: 20px;
                border-radius: 50%;
                border: 3px solid white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                font-size: 12px;
            ">${apartments.length}</div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });
        
        const marker = L.marker([taco.lat, taco.lon], { icon }).addTo(this.map);
        
        // Create popup content
        const popupContent = this.createPopupContent(taco, apartments, radius);
        marker.bindPopup(popupContent);
        
        // Add radius circle if there are apartments
        if (apartments.length > 0) {
            const circle = L.circle([taco.lat, taco.lon], {
                radius: radius,
                color: '#48bb78',
                fillColor: '#48bb78',
                fillOpacity: 0.1,
                weight: 2
            }).addTo(this.map);
            this.circles.push(circle);
        }
        
        this.markers.push(marker);
    }
    
    createPopupContent(taco, apartments, radius) {
        const address = [taco.street, taco.city, taco.state, taco.postcode]
            .filter(Boolean)
            .join(', ');
        
        let html = `
            <div class="popup-title">${taco.name}</div>
            <div class="popup-address">${address}</div>
            <div class="popup-stats">${apartments.length} apartments within ${radius}m</div>
        `;
        
        if (apartments.length > 0) {
            html += '<div class="popup-apartments"><ul>';
            apartments.forEach(apt => {
                const aptAddress = [apt.street, apt.city, apt.state, apt.postcode]
                    .filter(Boolean)
                    .join(', ');
                html += `<li><strong>${apt.name}</strong> - ${apt.distanceM}m<br><small>${aptAddress}</small></li>`;
            });
            html += '</ul></div>';
        }
        
        return html;
    }
    
    clearMap() {
        this.markers.forEach(marker => this.map.removeLayer(marker));
        this.circles.forEach(circle => this.map.removeLayer(circle));
        this.markers = [];
        this.circles = [];
    }
    
    updateStats(text) {
        document.getElementById('stats').textContent = text;
    }
    
    exportCSV() {
        const radius = document.getElementById('radius').value;
        const minApartments = document.getElementById('minApartments').value;
        
        // Filter data based on current settings
        const filteredData = this.data.filter(item => 
            item.apartments.length >= parseInt(minApartments)
        );
        
        // Create CSV content
        const headers = [
            'taco_id', 'taco_name', 'taco_lat', 'taco_lon', 'taco_street', 
            'taco_city', 'taco_state', 'taco_postcode', 'apartment_id', 
            'apartment_name', 'apartment_lat', 'apartment_lon', 'distance_m'
        ].join(',');
        
        const rows = [headers];
        
        filteredData.forEach(item => {
            const { taco, apartments } = item;
            
            if (apartments.length === 0) {
                rows.push([
                    taco.id, taco.name, taco.lat, taco.lon, taco.street || '',
                    taco.city || '', taco.state || '', taco.postcode || '',
                    '', '', '', '', ''
                ].join(','));
            } else {
                apartments.forEach(apt => {
                    rows.push([
                        taco.id, taco.name, taco.lat, taco.lon, taco.street || '',
                        taco.city || '', taco.state || '', taco.postcode || '',
                        apt.id, apt.name || '', apt.lat, apt.lon, apt.distanceM
                    ].join(','));
                });
            }
        });
        
        const csv = rows.join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tacobell_apartments_${radius}m_${minApartments}min.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TacoAptApp();
});
