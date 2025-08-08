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

## Demo Data

The current version uses mock data for demonstration:
- 3 Taco Bell locations in California (San Francisco, Los Angeles, San Diego)
- Sample apartment complexes with distances
- Realistic coordinates and addresses

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
└── README.md           # This file
```

## Technical Details

- **No server required**: Pure HTML/CSS/JavaScript
- **Leaflet.js**: For interactive mapping
- **OpenStreetMap**: Free map tiles
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

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## License

This project is open source and available under the MIT License.
