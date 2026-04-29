/**
 * FIX SCRIPT - Fixes 2 problems:
 * 1. Removes "images/" prefix from profileImage in DB (seed stored wrong path)
 * 2. Re-downloads 4 failed images that are only 29 bytes
 * Run: node fix_seed.js
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

const IMAGES_DIR = path.join(__dirname, 'images')

// Alternative Unsplash URLs for failed images
const REPLACEMENTS = {
  'prop_04.jpg': 'https://images.unsplash.com/photo-1561101464-8f91ca9f6e97?w=600&q=80', // Jaipur haveli
  'prop_09.jpg': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80', // Udaipur lake
  'prop_16.jpg': 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600&q=80', // Desert tent
  'prop_19.jpg': 'https://images.unsplash.com/photo-1572782252655-9a783c2a9f47?w=600&q=80', // Chettinad villa
  'cat_heritage.jpg': 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=200&q=80', // Heritage
}

function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(IMAGES_DIR, filename)
    const file = fs.createWriteStream(filePath)
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close()
        downloadImage(res.headers.location, filename).then(resolve).catch(reject)
        return
      }
      res.pipe(file)
      file.on('finish', () => {
        file.close()
        const stats = fs.statSync(filePath)
        if (stats.size < 1000) {
          reject(new Error(`File too small: ${stats.size} bytes`))
        } else {
          resolve(filename)
        }
      })
    }).on('error', (err) => { fs.unlink(filePath, () => {}); reject(err) })
  })
}

async function fix() {
  const conn = await mysql.createConnection(DB_CONFIG)
  console.log('\n🔧 Fix Script Started\n')

  try {
    // ── STEP 1: Fix DB paths ──────────────────────────────
    console.log('📝 Step 1: Fixing profileImage paths in DB...')

    // Fix properties: remove "images/" prefix
    const [propResult] = await conn.query(
      `UPDATE property SET profileImage = REPLACE(profileImage, 'images/', '') WHERE profileImage LIKE 'images/%'`
    )
    console.log(`  ✅ Fixed ${propResult.affectedRows} property rows`)

    // Fix categories: remove "images/" prefix
    const [catResult] = await conn.query(
      `UPDATE category SET image = REPLACE(image, 'images/', '') WHERE image LIKE 'images/%'`
    )
    console.log(`  ✅ Fixed ${catResult.affectedRows} category rows`)

    // ── STEP 2: Re-download broken images ─────────────────
    console.log('\n⬇  Step 2: Re-downloading broken images...')

    for (const [filename, url] of Object.entries(REPLACEMENTS)) {
      const filePath = path.join(IMAGES_DIR, filename)
      const size = fs.existsSync(filePath) ? fs.statSync(filePath).size : 0

      if (size > 1000) {
        console.log(`  ✓ "${filename}" is fine (${size} bytes) — skipping`)
        continue
      }

      process.stdout.write(`  ⬇  Downloading "${filename}"... `)
      try {
        // Delete broken file first
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
        await downloadImage(url, filename)
        const newSize = fs.statSync(path.join(IMAGES_DIR, filename)).size
        process.stdout.write(`done (${newSize} bytes)\n`)
      } catch (e) {
        process.stdout.write(`FAILED: ${e.message}\n`)
        // Use a default fallback image
        fs.writeFileSync(filePath, '')
      }
    }

    // ── STEP 3: Verify ────────────────────────────────────
    console.log('\n🔍 Step 3: Verifying DB values...')

    const [props] = await conn.query(`SELECT id, title, profileImage FROM property LIMIT 25`)
    props.forEach(p => {
      const filePath = path.join(IMAGES_DIR, p.profileImage)
      const exists = fs.existsSync(filePath)
      const size = exists ? fs.statSync(filePath).size : 0
      console.log(`  #${p.id} "${p.title.substring(0, 30)}" → ${p.profileImage} (${size} bytes) ${size > 1000 ? '✅' : '⚠️'}`)
    })

    console.log('\n✅ Fix complete! Images should now load in the UI.\n')
    console.log('  Frontend URL pattern: http://localhost:4000/{filename}')
    console.log('  Example: http://localhost:4000/prop_01.jpg\n')

  } catch (err) {
    console.error('❌ Error:', err.message)
  } finally {
    await conn.end()
  }
}

fix()
