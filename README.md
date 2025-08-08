# 🌮 Taco Apt

A simple web application that maps Taco Bell locations near apartment complexes in California.

## Features

- **Interactive Map**: Full-screen map using Leaflet.js with OpenStreetMap tiles
- **Smart Filtering**: Adjust radius (100m-2000m) and minimum apartment count (0-10)
- **Visual Indicators**: 
  - Green markers show Taco Bells with nearby apartments
  - Red markers show Taco Bells without nearby apartments
  - Numbers on markers indicate apartment count
  - Radius circles show the search area
- **Detailed Popups**: Click markers to see Taco Bell info and nearby apartments
- **CSV Export**: Download filtered data as CSV file
- **Responsive Design**: Works on desktop and mobile devices
- **Real Data Support**: Load data from CSV files

## Data Format

The application loads data from `data/california-tacobells.csv`. The CSV should have these columns:

```csv
taco_id,taco_name,taco_lat,taco_lon,taco_street,taco_city,taco_state,taco_postcode,apartment_id,apartment_name,apartment_lat,apartment_lon,distance_m
1,Taco Bell,37.7749,-122.4194,123 Main St,San Francisco,CA,94102,1,Sunset Apartments,37.7750,-122.4195,150
```

### CSV Structure:
- **taco_id**: Unique identifier for each Taco Bell
- **taco_name**: Name of the Taco Bell location
- **taco_lat/taco_lon**: Latitude and longitude coordinates
- **taco_street/city/state/postcode**: Address information
- **apartment_id**: Unique identifier for each apartment
- **apartment_name**: Name of the apartment complex
- **apartment_lat/apartment_lon**: Apartment coordinates
- **distance_m**: Distance in meters from Taco Bell to apartment

## How to Add Your Own Data

### Option 1: Replace the CSV File
1. Create your own CSV file with the format above
2. Replace `data/california-tacobells.csv` with your file
3. Make sure to include all required columns

### Option 2: Add More Locations
1. Open `data/california-tacobells.csv`
2. Add new rows following the same format
3. Each Taco Bell can have multiple nearby apartments
4. Use the same `taco_id` for multiple apartments near the same Taco Bell

### Option 3: Use Real Data Sources
You can get real Taco Bell locations from:
- **OpenStreetMap Overpass API**: Query for `brand="Taco Bell"`
- **Google Places API**: Search for Taco Bell locations
- **Yelp API**: Find Taco Bell restaurants
- **Government Data**: Some cities provide business location data

## Demo Data

The current version includes sample data for:
- San Francisco (2 locations)
- Los Angeles (2 locations) 
- San Diego (1 location)
- Sacramento (1 location)
- Fresno (1 location)
- Anaheim (1 location)
- San Jose (1 location)
- Las Vegas (1 location)

## How to Use

1. **Open the website**: Simply open `index.html` in any modern web browser
2. **Adjust filters**:
   - Use the radius slider to change search distance (100m-2000m)
   - Use the minimum apartments slider to filter results
   - Check "Show non-matching" to see Taco Bells without nearby apartments
3. **Explore the map**:
   - Click markers to see detailed information
   - Zoom and pan to explore different areas
   - Green circles show the search radius around Taco Bells with apartments
4. **Export data**: Click "Export CSV" to download filtered results

## File Structure

```
taco-apt/
├── index.html          # Main HTML page
├── styles.css          # CSS styling
├── script.js           # JavaScript functionality
├── data/
│   └── california-tacobells.csv  # Location data
├── README.md           # This file
└── DEPLOYMENT.md       # Deployment instructions
```

## Technical Details

- **No server required**: Pure HTML/CSS/JavaScript
- **Leaflet.js**: For interactive mapping
- **OpenStreetMap**: Free map tiles
- **CSV parsing**: Client-side CSV loading
- **Responsive design**: Works on all screen sizes
- **Modern CSS**: Uses flexbox, gradients, and animations

## Future Enhancements

To make this a full application, you could:

1. **Add real data**: Connect to OpenStreetMap Overpass API to fetch actual Taco Bell and apartment locations
2. **Backend integration**: Add a server to handle data processing and storage
3. **Database**: Store location data in SQLite or PostgreSQL
4. **Real-time updates**: Add automatic data refresh functionality
5. **User accounts**: Allow users to save favorite locations
6. **Advanced filters**: Add more filtering options (price, amenities, etc.)
7. **Data import tools**: Create a web interface for uploading CSV files

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## License

This project is open source and available under the MIT License.
