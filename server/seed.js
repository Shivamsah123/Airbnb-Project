/**
 * SEED SCRIPT - Airbnb Property Seed Data
 * Run: node seed.js
 * Seeds: 5 categories + 20 realistic Indian properties with Unsplash images
 */

const mysql = require('mysql2/promise')
const https = require('https')
const fs = require('fs')
const path = require('path')

const DB_CONFIG = {
  host: 'localhost',
  user: 'root',
  password: 'manager',
  database: 'airbnb_db',
}

// ── IMAGES DIRECTORY ──────────────────────────────────────
const IMAGES_DIR = path.join(__dirname, 'images')
if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true })

// ── DOWNLOAD HELPER ───────────────────────────────────────
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(IMAGES_DIR, filename)
    if (fs.existsSync(filePath)) { resolve(filename); return }
    const file = fs.createWriteStream(filePath)
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close()
        fs.unlinkSync(filePath)
        downloadImage(res.headers.location, filename).then(resolve).catch(reject)
        return
      }
      res.pipe(file)
      file.on('finish', () => { file.close(); resolve(filename) })
    }).on('error', (err) => {
      fs.unlink(filePath, () => {})
      reject(err)
    })
  })
}

// ── CATEGORY DATA ─────────────────────────────────────────
const categories = [
  {
    title: 'Beachfront',
    details: 'Properties with stunning ocean and sea views',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&q=80',
    imageFile: 'cat_beachfront.jpg',
  },
  {
    title: 'Mountain',
    details: 'Properties nestled in scenic mountain ranges',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200&q=80',
    imageFile: 'cat_mountain.jpg',
  },
  {
    title: 'City',
    details: 'Urban apartments and city center stays',
    imageUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=200&q=80',
    imageFile: 'cat_city.jpg',
  },
  {
    title: 'Villa',
    details: 'Luxury villas with private pools and gardens',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=200&q=80',
    imageFile: 'cat_villa.jpg',
  },
  {
    title: 'Heritage',
    details: 'Historic havelis and palace stays',
    imageUrl: 'https://images.unsplash.com/photo-1598977964573-c3a9f0e9fa87?w=200&q=80',
    imageFile: 'cat_heritage.jpg',
  },
]

// ── PROPERTY DATA ─────────────────────────────────────────
// categoryIndex: 0=Beachfront, 1=Mountain, 2=City, 3=Villa, 4=Heritage
const properties = [
  {
    categoryIndex: 3,
    title: 'Luxury Sea-View Villa, Goa',
    details: 'A stunning private villa with infinity pool, 3 bedrooms, and direct beach access. Perfect for a tropical getaway.',
    address: 'Calangute Beach Road, North Goa, Goa - 403516',
    contactNo: '9812345601',
    ownerName: 'Rajan Patel',
    isLakeView: 0, isTV: 1, isAC: 1, isWifi: 1, isMiniBar: 1, isBreakfast: 1, isParking: 1,
    guests: 6, bedrooms: 3, beds: 4, bathrooms: 3, rent: 12500,
    imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80',
    imageFile: 'prop_01.jpg',
  },
  {
    categoryIndex: 1,
    title: 'Cozy Mountain Cottage, Manali',
    details: 'A charming wooden cottage with breathtaking Himalayan views, fireplace, and snow-covered surroundings.',
    address: 'Old Manali Road, Manali, Himachal Pradesh - 175131',
    contactNo: '9823456702',
    ownerName: 'Suresh Thakur',
    isLakeView: 0, isTV: 1, isAC: 0, isWifi: 1, isMiniBar: 0, isBreakfast: 1, isParking: 1,
    guests: 4, bedrooms: 2, beds: 2, bathrooms: 1, rent: 4200,
    imageUrl: 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=600&q=80',
    imageFile: 'prop_02.jpg',
  },
  {
    categoryIndex: 2,
    title: 'Modern Studio, Bandra Mumbai',
    details: 'Sleek, fully furnished studio apartment in the heart of Bandra. Walking distance to cafes, malls, and sea link.',
    address: 'Linking Road, Bandra West, Mumbai - 400050',
    contactNo: '9834567803',
    ownerName: 'Priya Mehta',
    isLakeView: 0, isTV: 1, isAC: 1, isWifi: 1, isMiniBar: 1, isBreakfast: 0, isParking: 0,
    guests: 2, bedrooms: 1, beds: 1, bathrooms: 1, rent: 5500,
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80',
    imageFile: 'prop_03.jpg',
  },
  {
    categoryIndex: 4,
    title: 'Royal Haveli Stay, Jaipur',
    details: 'Experience royalty in this 200-year-old restored haveli with traditional Rajasthani decor, courtyard and rooftop dining.',
    address: 'Hawa Mahal Road, Old City, Jaipur, Rajasthan - 302002',
    contactNo: '9845678904',
    ownerName: 'Vikram Singh Rathore',
    isLakeView: 0, isTV: 1, isAC: 1, isWifi: 1, isMiniBar: 1, isBreakfast: 1, isParking: 1,
    guests: 8, bedrooms: 4, beds: 5, bathrooms: 4, rent: 9800,
    imageUrl: 'https://images.unsplash.com/photo-1598977964573-c3a9f0e9fa87?w=600&q=80',
    imageFile: 'prop_04.jpg',
  },
  {
    categoryIndex: 0,
    title: 'Beachside Cottage, Pondicherry',
    details: 'A quaint French-colonial beachside cottage, steps from the shore. Ideal for couples seeking a peaceful retreat.',
    address: 'Rue de la Marine, White Town, Puducherry - 605001',
    contactNo: '9856789005',
    ownerName: 'Anita Krishnan',
    isLakeView: 0, isTV: 1, isAC: 1, isWifi: 1, isMiniBar: 0, isBreakfast: 1, isParking: 1,
    guests: 3, bedrooms: 1, beds: 2, bathrooms: 1, rent: 3800,
    imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80',
    imageFile: 'prop_05.jpg',
  },
  {
    categoryIndex: 3,
    title: 'Premium Farmhouse, Lonavala',
    details: 'Expansive private farmhouse with private pool, lush gardens, and stunning valley views. Great for family getaways.',
    address: 'Bushi Dam Road, Lonavala, Maharashtra - 410401',
    contactNo: '9867890106',
    ownerName: 'Ketan Desai',
    isLakeView: 1, isTV: 1, isAC: 1, isWifi: 1, isMiniBar: 1, isBreakfast: 1, isParking: 1,
    guests: 10, bedrooms: 4, beds: 6, bathrooms: 4, rent: 18000,
    imageUrl: 'https://images.unsplash.com/photo-1504652517000-ae1068478c59?w=600&q=80',
    imageFile: 'prop_06.jpg',
  },
  {
    categoryIndex: 2,
    title: 'Heritage Apartment, Old Delhi',
    details: 'A beautifully restored apartment in the heart of Old Delhi, minutes from Chandni Chowk and Red Fort.',
    address: 'Chandni Chowk, Old Delhi, New Delhi - 110006',
    contactNo: '9878901207',
    ownerName: 'Mohit Sharma',
    isLakeView: 0, isTV: 1, isAC: 1, isWifi: 1, isMiniBar: 0, isBreakfast: 1, isParking: 0,
    guests: 4, bedrooms: 2, beds: 2, bathrooms: 1, rent: 4500,
    imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=80',
    imageFile: 'prop_07.jpg',
  },
  {
    categoryIndex: 1,
    title: 'Scenic Treehouse, Coorg',
    details: 'Unique treehouse experience in the lush coffee plantations of Coorg with forest views and birdsong.',
    address: 'Madikeri-Kushalnagar Road, Coorg, Karnataka - 571201',
    contactNo: '9889012308',
    ownerName: 'Gopal Nair',
    isLakeView: 1, isTV: 0, isAC: 0, isWifi: 1, isMiniBar: 0, isBreakfast: 1, isParking: 1,
    guests: 2, bedrooms: 1, beds: 1, bathrooms: 1, rent: 6500,
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80',
    imageFile: 'prop_08.jpg',
  },
  {
    categoryIndex: 3,
    title: 'Lake-View Villa, Udaipur',
    details: 'Majestic villa overlooking the serene Fateh Sagar Lake with private terrace, pool and Rajasthani hospitality.',
    address: 'Fateh Sagar Lake Rd, Udaipur, Rajasthan - 313001',
    contactNo: '9890123409',
    ownerName: 'Deepika Sisodiya',
    isLakeView: 1, isTV: 1, isAC: 1, isWifi: 1, isMiniBar: 1, isBreakfast: 1, isParking: 1,
    guests: 6, bedrooms: 3, beds: 4, bathrooms: 3, rent: 15000,
    imageUrl: 'https://images.unsplash.com/photo-1614977645540-7abd88ba8e32?w=600&q=80',
    imageFile: 'prop_09.jpg',
  },
  {
    categoryIndex: 0,
    title: 'Cliff-Top Suite, Varkala',
    details: 'Dramatic cliff-top suite with panoramic Arabian Sea views, private balcony and fresh Kerala cuisine.',
    address: 'North Cliff, Varkala, Kerala - 695141',
    contactNo: '9801234510',
    ownerName: 'Thomas Mathew',
    isLakeView: 0, isTV: 1, isAC: 1, isWifi: 1, isMiniBar: 1, isBreakfast: 1, isParking: 1,
    guests: 2, bedrooms: 1, beds: 1, bathrooms: 1, rent: 7200,
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
    imageFile: 'prop_10.jpg',
  },
  {
    categoryIndex: 2,
    title: '3BHK Penthouse, Bangalore',
    details: 'Stunning penthouse in Indiranagar with rooftop garden, modern kitchen and city skyline views.',
    address: '100 Feet Road, Indiranagar, Bangalore - 560038',
    contactNo: '9812345611',
    ownerName: 'Arjun Reddy',
    isLakeView: 0, isTV: 1, isAC: 1, isWifi: 1, isMiniBar: 1, isBreakfast: 0, isParking: 1,
    guests: 6, bedrooms: 3, beds: 3, bathrooms: 3, rent: 11000,
    imageUrl: 'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=600&q=80',
    imageFile: 'prop_11.jpg',
  },
  {
    categoryIndex: 4,
    title: 'Palace Hotel Room, Mysore',
    details: 'A regal room inside a restored Indo-Saracenic palace near Mysore Zoo. Opulent decor and fine dining included.',
    address: 'Palace Road, Mysore, Karnataka - 570001',
    contactNo: '9823456712',
    ownerName: 'Nalini Wadiyar',
    isLakeView: 0, isTV: 1, isAC: 1, isWifi: 1, isMiniBar: 1, isBreakfast: 1, isParking: 1,
    guests: 2, bedrooms: 1, beds: 2, bathrooms: 2, rent: 8500,
    imageUrl: 'https://images.unsplash.com/photo-1549294413-26f195200c16?w=600&q=80',
    imageFile: 'prop_12.jpg',
  },
  {
    categoryIndex: 1,
    title: 'Forest Retreat, Munnar',
    details: 'A luxury retreat hidden in the tea gardens of Munnar with misty valleys, spice gardens and spa services.',
    address: 'Top Station Road, Munnar, Kerala - 685612',
    contactNo: '9834567813',
    ownerName: 'Binoy George',
    isLakeView: 0, isTV: 1, isAC: 0, isWifi: 1, isMiniBar: 0, isBreakfast: 1, isParking: 1,
    guests: 4, bedrooms: 2, beds: 2, bathrooms: 2, rent: 7800,
    imageUrl: 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=600&q=80',
    imageFile: 'prop_13.jpg',
  },
  {
    categoryIndex: 0,
    title: 'Beach Hut, Havelock Island',
    details: 'Authentic bamboo beach hut on pristine Havelock Island beach. Ideal for snorkeling, diving and stargazing.',
    address: 'Radhanagar Beach, Havelock Island, Andaman - 744211',
    contactNo: '9845678914',
    ownerName: 'Sanjay Das',
    isLakeView: 0, isTV: 0, isAC: 0, isWifi: 1, isMiniBar: 0, isBreakfast: 1, isParking: 0,
    guests: 2, bedrooms: 1, beds: 1, bathrooms: 1, rent: 5000,
    imageUrl: 'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=600&q=80',
    imageFile: 'prop_14.jpg',
  },
  {
    categoryIndex: 2,
    title: 'Corporate Suite, Hyderabad HITEC',
    details: 'Premium business-class apartment in HITEC City, equipped with high-speed internet, work desk and gym access.',
    address: 'Madhapur, HITEC City, Hyderabad - 500081',
    contactNo: '9856789015',
    ownerName: 'Kavitha Rao',
    isLakeView: 0, isTV: 1, isAC: 1, isWifi: 1, isMiniBar: 1, isBreakfast: 0, isParking: 1,
    guests: 2, bedrooms: 1, beds: 1, bathrooms: 1, rent: 6000,
    imageUrl: 'https://images.unsplash.com/photo-1561501878-aabd62634533?w=600&q=80',
    imageFile: 'prop_15.jpg',
  },
  {
    categoryIndex: 3,
    title: 'Desert Camp Tent, Jaisalmer',
    details: 'Glamorous desert camping under the stars with luxury Swiss tents, camel rides and folk performances.',
    address: 'Sam Sand Dunes, Jaisalmer, Rajasthan - 345001',
    contactNo: '9867890116',
    ownerName: 'Manvendra Bhati',
    isLakeView: 0, isTV: 0, isAC: 0, isWifi: 1, isMiniBar: 1, isBreakfast: 1, isParking: 1,
    guests: 4, bedrooms: 1, beds: 2, bathrooms: 1, rent: 4800,
    imageUrl: 'https://images.unsplash.com/photo-1541442213874-6e0b2bbd3ff0?w=600&q=80',
    imageFile: 'prop_16.jpg',
  },
  {
    categoryIndex: 2,
    title: 'Sea-View Condo, Chennai ECR',
    details: 'Modern sea-facing apartment on East Coast Road with stunning Bay of Bengal views from every room.',
    address: 'East Coast Road, Neelankarai, Chennai - 600041',
    contactNo: '9878901217',
    ownerName: 'Sridhar Venkat',
    isLakeView: 0, isTV: 1, isAC: 1, isWifi: 1, isMiniBar: 0, isBreakfast: 0, isParking: 1,
    guests: 4, bedrooms: 2, beds: 2, bathrooms: 2, rent: 5800,
    imageUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80',
    imageFile: 'prop_17.jpg',
  },
  {
    categoryIndex: 1,
    title: 'Himalayan Homestay, Rishikesh',
    details: 'Peaceful yoga and meditation homestay beside the Ganges. Includes daily yoga sessions and Ayurvedic meals.',
    address: 'Laxman Jhula, Rishikesh, Uttarakhand - 249302',
    contactNo: '9889012318',
    ownerName: 'Swami Ramesh Giri',
    isLakeView: 1, isTV: 0, isAC: 0, isWifi: 1, isMiniBar: 0, isBreakfast: 1, isParking: 1,
    guests: 4, bedrooms: 2, beds: 2, bathrooms: 2, rent: 2800,
    imageUrl: 'https://images.unsplash.com/photo-1466442929976-97f336a657be?w=600&q=80',
    imageFile: 'prop_18.jpg',
  },
  {
    categoryIndex: 4,
    title: 'Chettinad Heritage Villa, Tamil Nadu',
    details: 'Magnificent Chettinad mansion with antique furniture, tiled courtyards, and authentic regional cuisine.',
    address: 'Karaikudi, Chettinad, Tamil Nadu - 630001',
    contactNo: '9890123419',
    ownerName: 'Annamalai Chettiar',
    isLakeView: 0, isTV: 1, isAC: 1, isWifi: 1, isMiniBar: 0, isBreakfast: 1, isParking: 1,
    guests: 8, bedrooms: 4, beds: 5, bathrooms: 4, rent: 13000,
    imageUrl: 'https://images.unsplash.com/photo-1572782252655-9a783c2a9f47?w=600&q=80',
    imageFile: 'prop_19.jpg',
  },
  {
    categoryIndex: 0,
    title: 'Luxury Houseboat, Alleppey',
    details: 'Cruise through Kerala backwaters on a private houseboat with en-suite bedroom, chef, and sunset views.',
    address: 'Finishing Point, Alleppey, Kerala - 688001',
    contactNo: '9801234520',
    ownerName: 'Jose Kuriakose',
    isLakeView: 1, isTV: 1, isAC: 1, isWifi: 1, isMiniBar: 1, isBreakfast: 1, isParking: 0,
    guests: 4, bedrooms: 2, beds: 2, bathrooms: 2, rent: 11500,
    imageUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=600&q=80',
    imageFile: 'prop_20.jpg',
  },
]

// ── MAIN SEED FUNCTION ────────────────────────────────────
async function seed() {
  const conn = await mysql.createConnection(DB_CONFIG)
  console.log('\n🌱 Airbnb Seed Script Started\n')

  try {
    // 1. Get admin user id (or first user in db)
    const [users] = await conn.query(`SELECT id FROM user WHERE role='admin' LIMIT 1`)
    const adminUserId = users.length ? users[0].id : 1
    console.log(`👤 Using userId: ${adminUserId}`)

    // 2. Seed Categories
    console.log('\n📁 Seeding Categories...')
    const categoryIds = []
    for (const cat of categories) {
      // Check if already exists
      const [existing] = await conn.query(`SELECT id FROM category WHERE title=?`, [cat.title])
      if (existing.length) {
        console.log(`  ✓ Category "${cat.title}" already exists (id:${existing[0].id})`)
        categoryIds.push(existing[0].id)
        continue
      }

      // Download icon image
      process.stdout.write(`  ⬇  Downloading "${cat.imageFile}"... `)
      try {
        await downloadImage(cat.imageUrl, cat.imageFile)
        process.stdout.write('done\n')
      } catch (e) {
        process.stdout.write(`FAILED (${e.message}) — using placeholder\n`)
        cat.imageFile = 'placeholder.jpg'
      }

      const [result] = await conn.query(
        `INSERT INTO category (title, details, image) VALUES (?, ?, ?)`,
        [cat.title, cat.details, `images/${cat.imageFile}`]
      )
      categoryIds.push(result.insertId)
      console.log(`  ✅ Inserted category "${cat.title}" (id:${result.insertId})`)
    }

    // 3. Seed Properties
    console.log('\n🏠 Seeding Properties...')
    let inserted = 0, skipped = 0

    for (const prop of properties) {
      // Check if already exists
      const [existing] = await conn.query(`SELECT id FROM property WHERE title=?`, [prop.title])
      if (existing.length) {
        console.log(`  ⏩ Skipping "${prop.title}" (already exists)`)
        skipped++
        continue
      }

      // Download property image
      process.stdout.write(`  ⬇  Downloading "${prop.imageFile}"... `)
      try {
        await downloadImage(prop.imageUrl, prop.imageFile)
        process.stdout.write('done\n')
      } catch (e) {
        process.stdout.write(`FAILED — using placeholder\n`)
        prop.imageFile = 'placeholder.jpg'
      }

      const catId = categoryIds[prop.categoryIndex]

      await conn.query(
        `INSERT INTO property 
          (userId, categoryId, title, details, address, contactNo, ownerName,
           isLakeView, isTV, isAC, isWifi, isMiniBar, isBreakfast, isParking,
           guests, bedrooms, beds, bathrooms, rent, profileImage)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          adminUserId, catId, prop.title, prop.details, prop.address,
          prop.contactNo, prop.ownerName,
          prop.isLakeView, prop.isTV, prop.isAC, prop.isWifi,
          prop.isMiniBar, prop.isBreakfast, prop.isParking,
          prop.guests, prop.bedrooms, prop.beds, prop.bathrooms,
          prop.rent, `images/${prop.imageFile}`,
        ]
      )
      console.log(`  ✅ "${prop.title}" — ₹${prop.rent}/night`)
      inserted++
    }

    console.log(`\n✅ Seeding complete!`)
    console.log(`   Categories : ${categoryIds.length} total`)
    console.log(`   Properties : ${inserted} inserted, ${skipped} skipped (already existed)\n`)

  } catch (err) {
    console.error('\n❌ Seed error:', err.message)
  } finally {
    await conn.end()
  }
}

seed()
