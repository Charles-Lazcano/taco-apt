const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function importEnhancedData() {
  try {
    console.log('Starting import of enhanced Taco Bell data...');
    
    // Read the enhanced CSV file
    const csvPath = path.join(__dirname, '../data/taco_bell_california_full.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    
    // Parse CSV (simple parsing for this example)
    const lines = csvContent.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',');
    const data = lines.slice(1).map(line => {
      const values = line.split(',');
      const row = {};
      headers.forEach((header, index) => {
        row[header.trim()] = values[index]?.trim() || null;
      });
      return row;
    });

    console.log(`Found ${data.length} Taco Bell locations to import`);

    // Import each location
    for (const row of data) {
      if (!row.latitude || !row.longitude) continue;

      try {
        // Check if location already exists
        const existing = await prisma.tacoBell.findFirst({
          where: {
            lat: parseFloat(row.latitude),
            lon: parseFloat(row.longitude),
          }
        });

        if (existing) {
          // Update existing record with new fields
          await prisma.tacoBell.update({
            where: { id: existing.id },
            data: {
              name: row.name || existing.name,
              street: row.address || existing.street,
              city: row.city || existing.city,
              state: row.state || existing.state,
              postcode: row.zip || existing.postcode,
              phone: row.phone || existing.phone,
              drive_thru: row.drive_thru || existing.drive_thru,
              open_late: row.open_late || existing.open_late,
              delivery: row.delivery || existing.delivery,
              breakfast: row.breakfast || existing.breakfast,
            }
          });
          console.log(`Updated existing Taco Bell: ${row.name || 'Unknown'} in ${row.city}`);
        } else {
          // Create new record
          await prisma.tacoBell.create({
            data: {
              osmId: `tb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              name: row.name,
              brand: 'Taco Bell',
              street: row.address,
              city: row.city,
              state: row.state,
              postcode: row.zip,
              phone: row.phone,
              lat: parseFloat(row.latitude),
              lon: parseFloat(row.longitude),
              drive_thru: row.drive_thru,
              open_late: row.open_late,
              delivery: row.delivery,
              breakfast: row.breakfast,
            }
          });
          console.log(`Created new Taco Bell: ${row.name || 'Unknown'} in ${row.city}`);
        }
      } catch (error) {
        console.error(`Error processing ${row.name} in ${row.city}:`, error.message);
      }
    }

    console.log('Import completed successfully!');
  } catch (error) {
    console.error('Import failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

importEnhancedData();
