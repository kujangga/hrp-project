import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding database...')

    // Clear existing data
    await prisma.portfolio.deleteMany()
    await prisma.bookingItem.deleteMany()
    await prisma.booking.deleteMany()
    await prisma.availability.deleteMany()
    await prisma.vendor.deleteMany()
    await prisma.photographer.deleteMany()
    await prisma.videographer.deleteMany()
    await prisma.equipment.deleteMany()
    await prisma.transport.deleteMany()
    await prisma.user.deleteMany()
    await prisma.location.deleteMany()

    // ==========================================
    // Create Locations
    // ==========================================
    console.log('📍 Creating locations...')

    const indonesia = await prisma.location.create({
        data: { name: 'Indonesia', type: 'country' }
    })

    const cities = await Promise.all([
        prisma.location.create({ data: { name: 'Jakarta', type: 'city', parentId: indonesia.id } }),
        prisma.location.create({ data: { name: 'Bali', type: 'city', parentId: indonesia.id } }),
        prisma.location.create({ data: { name: 'Bandung', type: 'city', parentId: indonesia.id } }),
        prisma.location.create({ data: { name: 'Surabaya', type: 'city', parentId: indonesia.id } }),
        prisma.location.create({ data: { name: 'Yogyakarta', type: 'city', parentId: indonesia.id } }),
        prisma.location.create({ data: { name: 'Semarang', type: 'city', parentId: indonesia.id } }),
    ])

    const [jakarta, bali, bandung, surabaya, yogyakarta, semarang] = cities

    // ==========================================
    // Create Photographers
    // ==========================================
    console.log('📸 Creating photographers...')

    const photographerData = [
        // Grade A
        { name: 'Andi Rahman', bio: 'Award-winning wedding & portrait photographer with 15+ years experience. Specialized in cinematic storytelling.', grade: 'A', hourlyRate: 2500000, dailyRate: 15000000, locationId: jakarta.id, instagram: '@andirahman', profileImage: 'https://randomuser.me/api/portraits/men/1.jpg' },
        { name: 'Maya Sari', bio: 'Fashion and editorial photographer. Featured in Vogue Indonesia and Harper\'s Bazaar.', grade: 'A', hourlyRate: 2800000, dailyRate: 18000000, locationId: bali.id, instagram: '@mayasari', profileImage: 'https://randomuser.me/api/portraits/women/1.jpg' },
        { name: 'Budi Santoso', bio: 'Celebrity photographer and commercial specialist. Worked with major brands globally.', grade: 'A', hourlyRate: 3000000, dailyRate: 20000000, locationId: jakarta.id, instagram: '@budisantoso', profileImage: 'https://randomuser.me/api/portraits/men/2.jpg' },

        // Grade B
        { name: 'Dewi Putri', bio: 'Pre-wedding and destination wedding specialist. Creating magical moments in beautiful locations.', grade: 'B', hourlyRate: 1800000, dailyRate: 10000000, locationId: bali.id, instagram: '@dewiputri', profileImage: 'https://randomuser.me/api/portraits/women/2.jpg' },
        { name: 'Reza Firmansyah', bio: 'Corporate events and product photographer. Clean, professional aesthetic.', grade: 'B', hourlyRate: 1500000, dailyRate: 8500000, locationId: bandung.id, instagram: '@rezafirmansyah', profileImage: 'https://randomuser.me/api/portraits/men/3.jpg' },
        { name: 'Siti Nurhaliza', bio: 'Portrait and family photographer. Warm, natural style with authentic emotions.', grade: 'B', hourlyRate: 1600000, dailyRate: 9000000, locationId: surabaya.id, instagram: '@sitinurhaliza', profileImage: 'https://randomuser.me/api/portraits/women/3.jpg' },
        { name: 'Ahmad Hidayat', bio: 'Landscape and architectural photographer. Capturing Indonesia\'s stunning beauty.', grade: 'B', hourlyRate: 1700000, dailyRate: 9500000, locationId: yogyakarta.id, instagram: '@ahmadhidayat', profileImage: 'https://randomuser.me/api/portraits/men/4.jpg' },

        // Grade C
        { name: 'Putri Ayu', bio: 'Wedding and engagement photographer. 5 years experience in romantic storytelling.', grade: 'C', hourlyRate: 1000000, dailyRate: 5500000, locationId: jakarta.id, instagram: '@putriayu', profileImage: 'https://randomuser.me/api/portraits/women/4.jpg' },
        { name: 'Dimas Prasetyo', bio: 'Event and concert photographer. High-energy shots that capture the moment.', grade: 'C', hourlyRate: 900000, dailyRate: 5000000, locationId: bandung.id, instagram: '@dimasprasetyo', profileImage: 'https://randomuser.me/api/portraits/men/5.jpg' },
        { name: 'Ratna Dewi', bio: 'Food and lifestyle photographer. Making everyday moments look extraordinary.', grade: 'C', hourlyRate: 950000, dailyRate: 5200000, locationId: bali.id, instagram: '@ratnadewi', profileImage: 'https://randomuser.me/api/portraits/women/5.jpg' },
        { name: 'Fajar Nugroho', bio: 'Sports and action photographer. Fast-paced, dynamic shots.', grade: 'C', hourlyRate: 1100000, dailyRate: 6000000, locationId: surabaya.id, instagram: '@fajarnugroho', profileImage: 'https://randomuser.me/api/portraits/men/6.jpg' },
        { name: 'Linda Kusuma', bio: 'Maternity and newborn photographer. Gentle, beautiful moments preserved forever.', grade: 'C', hourlyRate: 850000, dailyRate: 4800000, locationId: semarang.id, instagram: '@lindakusuma', profileImage: 'https://randomuser.me/api/portraits/women/6.jpg' },

        // Grade D
        { name: 'Yoga Pratama', bio: 'Growing photographer specializing in portraits and events. Passionate about capturing stories.', grade: 'D', hourlyRate: 600000, dailyRate: 3500000, locationId: jakarta.id, instagram: '@yogapratama', profileImage: 'https://randomuser.me/api/portraits/men/7.jpg' },
        { name: 'Anisa Rahma', bio: 'Fashion and beauty photographer. Fresh perspective on style and elegance.', grade: 'D', hourlyRate: 650000, dailyRate: 3800000, locationId: bandung.id, instagram: '@anisarahma', profileImage: 'https://randomuser.me/api/portraits/women/7.jpg' },
        { name: 'Hendra Wijaya', bio: 'Commercial and product photographer. Clean, modern aesthetic for brands.', grade: 'D', hourlyRate: 700000, dailyRate: 4000000, locationId: yogyakarta.id, instagram: '@hendrawijaya', profileImage: 'https://randomuser.me/api/portraits/men/8.jpg' },
        { name: 'Rina Safitri', bio: 'Candid wedding photographer. Real moments, real emotions.', grade: 'D', hourlyRate: 550000, dailyRate: 3200000, locationId: bali.id, instagram: '@rinasafitri', profileImage: 'https://randomuser.me/api/portraits/women/8.jpg' },

        // Grade E
        { name: 'Bagus Setiawan', bio: 'Enthusiastic new photographer. Learning and growing with every shoot.', grade: 'E', hourlyRate: 350000, dailyRate: 2000000, locationId: jakarta.id, instagram: '@bagussetiawan', profileImage: 'https://randomuser.me/api/portraits/men/9.jpg' },
        { name: 'Fitri Handayani', bio: 'Portrait and event photographer. Bringing creativity to every project.', grade: 'E', hourlyRate: 400000, dailyRate: 2200000, locationId: surabaya.id, instagram: '@fitrihandayani', profileImage: 'https://randomuser.me/api/portraits/women/9.jpg' },
        { name: 'Irfan Maulana', bio: 'Street and documentary photographer. Capturing life as it happens.', grade: 'E', hourlyRate: 380000, dailyRate: 2100000, locationId: bandung.id, instagram: '@irfanmaulana', profileImage: 'https://randomuser.me/api/portraits/men/10.jpg' },
        { name: 'Nurul Aini', bio: 'Creative photographer with passion for unique angles and compositions.', grade: 'E', hourlyRate: 350000, dailyRate: 1900000, locationId: semarang.id, instagram: '@nurulaini', profileImage: 'https://randomuser.me/api/portraits/women/10.jpg' },
    ]

    for (const data of photographerData) {
        await prisma.photographer.create({ data })
    }

    // ==========================================
    // Create Videographers
    // ==========================================
    console.log('🎬 Creating videographers...')

    const videographerData = [
        // Grade A
        { name: 'Kevin Hartanto', bio: 'Cinematic filmmaker with international awards. Specializes in wedding films and commercials.', grade: 'A', hourlyRate: 3500000, dailyRate: 22000000, locationId: jakarta.id, instagram: '@kevinhartanto', profileImage: 'https://randomuser.me/api/portraits/men/11.jpg' },
        { name: 'Diana Lestari', bio: 'Documentary and corporate video specialist. Netflix featured director.', grade: 'A', hourlyRate: 3800000, dailyRate: 25000000, locationId: bali.id, instagram: '@dianalestari', profileImage: 'https://randomuser.me/api/portraits/women/11.jpg' },

        // Grade B
        { name: 'Rizky Ramadhan', bio: 'Wedding cinematographer. Creating timeless love stories through film.', grade: 'B', hourlyRate: 2200000, dailyRate: 13000000, locationId: bandung.id, instagram: '@rizkyramadhan', profileImage: 'https://randomuser.me/api/portraits/men/12.jpg' },
        { name: 'Wulan Sari', bio: 'Music video and short film director. Bold, creative visual storytelling.', grade: 'B', hourlyRate: 2400000, dailyRate: 14000000, locationId: yogyakarta.id, instagram: '@wulansari', profileImage: 'https://randomuser.me/api/portraits/women/12.jpg' },
        { name: 'Denny Kurniawan', bio: 'Event and corporate videographer. Professional quality for business needs.', grade: 'B', hourlyRate: 2000000, dailyRate: 11000000, locationId: surabaya.id, instagram: '@dennykurniawan', profileImage: 'https://randomuser.me/api/portraits/men/13.jpg' },

        // Grade C
        { name: 'Mega Pertiwi', bio: 'Social media and promotional video creator. Engaging content for brands.', grade: 'C', hourlyRate: 1200000, dailyRate: 7000000, locationId: jakarta.id, instagram: '@megapertiwi', profileImage: 'https://randomuser.me/api/portraits/women/13.jpg' },
        { name: 'Agus Priyanto', bio: 'Wedding and pre-wedding videographer. Romantic, emotional films.', grade: 'C', hourlyRate: 1100000, dailyRate: 6500000, locationId: bali.id, instagram: '@aguspriyanto', profileImage: 'https://randomuser.me/api/portraits/men/14.jpg' },
        { name: 'Lina Marlina', bio: 'Lifestyle and travel videographer. Capturing adventures beautifully.', grade: 'C', hourlyRate: 1300000, dailyRate: 7500000, locationId: bandung.id, instagram: '@linamarlina', profileImage: 'https://randomuser.me/api/portraits/women/14.jpg' },

        // Grade D
        { name: 'Eko Widodo', bio: 'Event videographer with growing portfolio. Dedicated to quality work.', grade: 'D', hourlyRate: 750000, dailyRate: 4200000, locationId: semarang.id, instagram: '@ekowidodo', profileImage: 'https://randomuser.me/api/portraits/men/15.jpg' },
        { name: 'Yuni Astuti', bio: 'Content creator and videographer. Fresh ideas for modern brands.', grade: 'D', hourlyRate: 800000, dailyRate: 4500000, locationId: yogyakarta.id, instagram: '@yuniastuti', profileImage: 'https://randomuser.me/api/portraits/women/15.jpg' },

        // Grade E
        { name: 'Arief Budiman', bio: 'New videographer passionate about storytelling through video.', grade: 'E', hourlyRate: 450000, dailyRate: 2500000, locationId: jakarta.id, instagram: '@ariefbudiman', profileImage: 'https://randomuser.me/api/portraits/men/16.jpg' },
        { name: 'Tika Rahayu', bio: 'Creative videographer learning the craft. Eager to create amazing content.', grade: 'E', hourlyRate: 400000, dailyRate: 2300000, locationId: surabaya.id, instagram: '@tikarahayu', profileImage: 'https://randomuser.me/api/portraits/women/16.jpg' },
    ]

    for (const data of videographerData) {
        await prisma.videographer.create({ data })
    }

    // ==========================================
    // Create Portfolio Items
    // ==========================================
    console.log('🖼️ Creating portfolios...')

    // Get all photographers and videographers for portfolio seeding
    const photographers = await prisma.photographer.findMany()
    const videographers = await prisma.videographer.findMany()

    // Sample portfolio images for photographers (Unsplash)
    const photographerPortfolioImages = [
        'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80', // Wedding
        'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&q=80', // Portrait
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80', // Wedding ceremony
        'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&q=80', // Couple
        'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80', // Fashion
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80', // Portrait 2
        'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&q=80', // Model
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80', // Portrait 3
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80', // Fashion 2
        'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=800&q=80', // Lifestyle
    ]

    // Create portfolio for each photographer (5 images each)
    for (const photographer of photographers) {
        const shuffled = [...photographerPortfolioImages].sort(() => 0.5 - Math.random())
        const selectedImages = shuffled.slice(0, 5)

        for (let i = 0; i < selectedImages.length; i++) {
            await prisma.portfolio.create({
                data: {
                    photographerId: photographer.id,
                    imageUrl: selectedImages[i],
                    caption: `Portfolio ${i + 1}`,
                    order: i,
                }
            })
        }
    }

    // Sample video thumbnails and links for videographers
    const videographerPortfolios = [
        { imageUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', caption: 'Wedding Highlights' },
        { imageUrl: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&q=80', videoUrl: 'https://vimeo.com/123456789', caption: 'Commercial Reel' },
        { imageUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80', videoUrl: 'https://www.youtube.com/watch?v=example1', caption: 'Event Coverage' },
        { imageUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80', videoUrl: 'https://www.youtube.com/watch?v=example2', caption: 'Documentary Film' },
        { imageUrl: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=800&q=80', videoUrl: 'https://vimeo.com/987654321', caption: 'Music Video' },
    ]

    // Create portfolio for each videographer (3-5 videos each)
    for (const videographer of videographers) {
        const shuffled = [...videographerPortfolios].sort(() => 0.5 - Math.random())
        const count = 3 + Math.floor(Math.random() * 3) // 3-5 items
        const selected = shuffled.slice(0, count)

        for (let i = 0; i < selected.length; i++) {
            await prisma.portfolio.create({
                data: {
                    videographerId: videographer.id,
                    imageUrl: selected[i].imageUrl,
                    videoUrl: selected[i].videoUrl,
                    caption: selected[i].caption,
                    order: i,
                }
            })
        }
    }

    // ==========================================
    // Create Equipment
    // ==========================================
    console.log('📷 Creating equipment...')

    const equipmentData = [
        // Cameras
        { name: 'Sony A7 IV', description: 'Full-frame mirrorless camera with 33MP sensor, 4K video, and exceptional autofocus.', category: 'camera', brand: 'Sony', dailyRate: 750000, quantity: 5, availableQty: 5, locationId: jakarta.id, features: JSON.stringify(['33MP Full-Frame', '4K 60fps', '10fps Burst', '5-Axis IBIS']) },
        { name: 'Canon EOS R5', description: 'Professional mirrorless with 45MP resolution and 8K video recording.', category: 'camera', brand: 'Canon', dailyRate: 900000, quantity: 3, availableQty: 3, locationId: jakarta.id, features: JSON.stringify(['45MP Full-Frame', '8K Video', '20fps Burst', 'Dual Pixel AF']) },
        { name: 'Nikon Z8', description: 'High-end mirrorless camera with 45.7MP sensor and professional video capabilities.', category: 'camera', brand: 'Nikon', dailyRate: 850000, quantity: 3, availableQty: 3, locationId: bali.id, features: JSON.stringify(['45.7MP Full-Frame', '8K Video', '120fps 4K', 'Subject Detection AF']) },
        { name: 'Sony FX3', description: 'Cinema-style camera optimized for filmmakers with S-Cinetone color science.', category: 'camera', brand: 'Sony', dailyRate: 1200000, quantity: 2, availableQty: 2, locationId: jakarta.id, features: JSON.stringify(['4K 120fps', 'S-Cinetone', '15+ Stops DR', 'Active Cooling']) },
        { name: 'Blackmagic Pocket 6K', description: 'Professional cinema camera with Super 35 sensor and BRAW recording.', category: 'camera', brand: 'Blackmagic', dailyRate: 600000, quantity: 4, availableQty: 4, locationId: bandung.id, features: JSON.stringify(['6K Resolution', 'BRAW Recording', '13 Stops DR', 'EF Mount']) },

        // Lenses
        { name: 'Sony 24-70mm f/2.8 GM II', description: 'Professional zoom lens with exceptional sharpness and fast autofocus.', category: 'lens', brand: 'Sony', dailyRate: 350000, quantity: 6, availableQty: 6, locationId: jakarta.id, features: JSON.stringify(['f/2.8 Aperture', 'XD Linear Motors', 'Weather Sealed', '695g Weight']) },
        { name: 'Canon RF 70-200mm f/2.8L', description: 'Telephoto zoom with L-series quality for portraits and events.', category: 'lens', brand: 'Canon', dailyRate: 400000, quantity: 4, availableQty: 4, locationId: jakarta.id, features: JSON.stringify(['f/2.8 Aperture', 'IS System', 'Nano USM', 'Dust/Weather Sealed']) },
        { name: 'Sony 85mm f/1.4 GM', description: 'The ultimate portrait lens with creamy bokeh and stunning sharpness.', category: 'lens', brand: 'Sony', dailyRate: 300000, quantity: 5, availableQty: 5, locationId: bali.id, features: JSON.stringify(['f/1.4 Aperture', '11-Blade Aperture', 'XA Element', 'Nano AR Coating']) },
        { name: 'Sigma 35mm f/1.4 Art', description: 'Wide-angle prime with Art-series quality for versatile shooting.', category: 'lens', brand: 'Sigma', dailyRate: 200000, quantity: 6, availableQty: 6, locationId: bandung.id, features: JSON.stringify(['f/1.4 Aperture', 'Art Series', 'HSM AF', 'FLD/SLD Glass']) },
        { name: 'Canon RF 15-35mm f/2.8L', description: 'Ultra-wide zoom for landscapes, architecture, and creative shots.', category: 'lens', brand: 'Canon', dailyRate: 380000, quantity: 3, availableQty: 3, locationId: surabaya.id, features: JSON.stringify(['f/2.8 Aperture', 'Ultra-Wide', 'Nano USM', 'UD/ASC Elements']) },

        // Lighting
        { name: 'Godox AD600 Pro', description: 'Powerful outdoor strobe with TTL and HSS capabilities.', category: 'lighting', brand: 'Godox', dailyRate: 250000, quantity: 8, availableQty: 8, locationId: jakarta.id, features: JSON.stringify(['600Ws Power', 'TTL/HSS', '0.01-1s Recycle', 'Color Stable']) },
        { name: 'Aputure 600d Pro', description: 'Daylight COB LED with incredible output for video production.', category: 'lighting', brand: 'Aputure', dailyRate: 400000, quantity: 4, availableQty: 4, locationId: jakarta.id, features: JSON.stringify(['600W Output', 'Daylight 5600K', 'Bowens Mount', 'App Control']) },
        { name: 'Aputure MC Pro', description: 'Compact RGB LED panel for creative lighting effects.', category: 'lighting', brand: 'Aputure', dailyRate: 150000, quantity: 10, availableQty: 10, locationId: bali.id, features: JSON.stringify(['RGB Full Color', 'Compact Size', 'Magnetic Mount', 'App Control']) },
        { name: 'Profoto B10 Plus', description: 'Premium portable flash for location photography.', category: 'lighting', brand: 'Profoto', dailyRate: 500000, quantity: 4, availableQty: 4, locationId: bandung.id, features: JSON.stringify(['500Ws Power', 'AirTTL', '10 Stops Range', 'LED Modeling']) },
        { name: 'Nanlite Forza 500 II', description: 'Powerful daylight LED for film and photography.', category: 'lighting', brand: 'Nanlite', dailyRate: 350000, quantity: 5, availableQty: 5, locationId: yogyakarta.id, features: JSON.stringify(['500W Output', 'Bowens Mount', 'DMX Control', 'Quiet Fan']) },

        // Drones
        { name: 'DJI Mavic 3 Pro', description: 'Professional drone with triple camera system for stunning aerial footage.', category: 'drone', brand: 'DJI', dailyRate: 800000, quantity: 3, availableQty: 3, locationId: bali.id, features: JSON.stringify(['Hasselblad Camera', '5.1K Video', '43-Min Flight', 'Omnidirectional Sensing']) },
        { name: 'DJI Inspire 3', description: 'Cinema-grade aerial platform with 8K Full-Frame camera.', category: 'drone', brand: 'DJI', dailyRate: 2500000, quantity: 2, availableQty: 2, locationId: jakarta.id, features: JSON.stringify(['8K Full-Frame', 'X9-8K Gimbal', 'RTK Positioning', 'Night Vision']) },
        { name: 'DJI Mini 4 Pro', description: 'Compact drone under 249g with professional features.', category: 'drone', brand: 'DJI', dailyRate: 400000, quantity: 5, availableQty: 5, locationId: bandung.id, features: JSON.stringify(['4K 100fps', '48MP Photos', 'Under 249g', 'Omnidirectional Sensing']) },

        // Accessories
        { name: 'DJI RS 3 Pro', description: 'Professional gimbal stabilizer for cinema cameras.', category: 'accessory', brand: 'DJI', dailyRate: 350000, quantity: 5, availableQty: 5, locationId: jakarta.id, features: JSON.stringify(['4.5kg Payload', 'LiDAR Focus', 'OLED Touchscreen', 'Automated Axis Locks']) },
        { name: 'DJI Ronin 4D', description: 'Full-frame cinema camera with built-in 4-axis stabilization.', category: 'accessory', brand: 'DJI', dailyRate: 1800000, quantity: 2, availableQty: 2, locationId: jakarta.id, features: JSON.stringify(['6K Full-Frame', '4-Axis Gimbal', 'LiDAR Focus', 'Wireless Video']) },
        { name: 'Rode Wireless GO II', description: 'Compact dual-channel wireless microphone system.', category: 'accessory', brand: 'Rode', dailyRate: 150000, quantity: 8, availableQty: 8, locationId: bali.id, features: JSON.stringify(['Dual Channel', '200m Range', 'On-Board Recording', 'USB-C']) },
        { name: 'Atomos Ninja V+', description: '5" HDR monitor-recorder with ProRes RAW support.', category: 'accessory', brand: 'Atomos', dailyRate: 300000, quantity: 4, availableQty: 4, locationId: bandung.id, features: JSON.stringify(['8K ProRes RAW', '1000nit HDR', 'AtomOS', 'Multi-Format']) },
    ]

    for (const data of equipmentData) {
        await prisma.equipment.create({ data })
    }

    // ==========================================
    // Create Transport
    // ==========================================
    console.log('🚐 Creating transport options...')

    const transportData = [
        { name: 'Toyota HiAce Premium', description: 'Spacious van perfect for crew and equipment. Air-conditioned with comfortable seating.', vehicleType: 'van', capacity: 12, dailyRate: 1500000, locationId: jakarta.id, features: JSON.stringify(['AC', '12 Seats', 'Luggage Space', 'Driver Included', 'Fuel Included']) },
        { name: 'Toyota Alphard Executive', description: 'Luxury MPV for VIP transport. Premium comfort for talent and clients.', vehicleType: 'van', capacity: 6, dailyRate: 2500000, locationId: jakarta.id, features: JSON.stringify(['Luxury Interior', '6 Seats', 'Leather Seats', 'Premium Sound', 'Driver Included']) },
        { name: 'Mercedes Sprinter Crew', description: 'Large capacity van for big production crews with ample equipment storage.', vehicleType: 'van', capacity: 15, dailyRate: 2000000, locationId: bali.id, features: JSON.stringify(['15 Seats', 'Large Cargo', 'AC', 'USB Charging', 'Driver Included']) },
        { name: 'Toyota Fortuner 4x4', description: 'Rugged SUV for location shoots. Perfect for off-road and remote locations.', vehicleType: 'suv', capacity: 7, dailyRate: 1200000, locationId: bandung.id, features: JSON.stringify(['4x4 Capable', '7 Seats', 'All Terrain', 'Roof Rack', 'Driver Included']) },
        { name: 'Mitsubishi Pajero Sport', description: 'Comfortable SUV with excellent off-road capability for adventure shoots.', vehicleType: 'suv', capacity: 7, dailyRate: 1100000, locationId: yogyakarta.id, features: JSON.stringify(['4x4 Capable', '7 Seats', 'Diesel Engine', 'AC', 'Driver Included']) },
        { name: 'Isuzu Elf Minibus', description: 'Mid-size bus for larger crews. Economical for group transport.', vehicleType: 'minibus', capacity: 20, dailyRate: 1800000, locationId: surabaya.id, features: JSON.stringify(['20 Seats', 'AC', 'Luggage Space', 'PA System', 'Driver Included']) },
        { name: 'Toyota Innova Reborn', description: 'Reliable MPV for small team transport. Comfortable and efficient.', vehicleType: 'car', capacity: 7, dailyRate: 800000, locationId: jakarta.id, features: JSON.stringify(['7 Seats', 'AC', 'Fuel Efficient', 'Comfortable', 'Driver Included']) },
        { name: 'Hino Bus Executive', description: 'Full-size bus for large production crews and events.', vehicleType: 'bus', capacity: 40, dailyRate: 3500000, locationId: jakarta.id, features: JSON.stringify(['40 Seats', 'AC', 'Toilet', 'Reclining Seats', 'Driver Included']) },
        { name: 'Equipment Truck', description: 'Dedicated truck for heavy equipment transport. Covered cargo area.', vehicleType: 'truck', capacity: 3, dailyRate: 1000000, locationId: bali.id, features: JSON.stringify(['Covered Cargo', 'Heavy Duty', 'Lift Gate', 'Drive Included', 'Tie-Downs']) },
        { name: 'Toyota Avanza Standard', description: 'Budget-friendly MPV for small crews and light equipment.', vehicleType: 'car', capacity: 7, dailyRate: 500000, locationId: semarang.id, features: JSON.stringify(['7 Seats', 'AC', 'Budget Option', 'Fuel Efficient', 'Driver Included']) },
    ]

    for (const data of transportData) {
        await prisma.transport.create({ data })
    }

    // ==========================================
    // Create Test Users (All Roles)
    // ==========================================
    console.log('👤 Creating test users...')

    // Hash password dynamically to ensure compatibility with current bcryptjs version
    const hashedPassword = await bcrypt.hash("password123", 10)

    // Admin account
    await prisma.user.create({
        data: {
            email: 'admin@hrp.com',
            password: hashedPassword,
            name: 'HRP Admin',
            role: 'ADMIN'
        }
    })

    // Talent account (linked to first photographer)
    const andiPhotographer = await prisma.photographer.findFirst({ where: { name: 'Andi Rahman' } })
    await prisma.user.create({
        data: {
            email: 'talent@hrp.com',
            password: hashedPassword,
            name: 'Andi Rahman',
            role: 'TALENT',
            ...(andiPhotographer ? { photographer: { connect: { id: andiPhotographer.id } } } : {})
        }
    })

    // Vendor account
    const vendorUser = await prisma.user.create({
        data: {
            email: 'vendor@hrp.com',
            password: hashedPassword,
            name: 'Demo Vendor',
            role: 'VENDOR',
        }
    })
    await prisma.vendor.create({
        data: {
            userId: vendorUser.id,
            companyName: 'PT Demo Vendor',
            contactPerson: 'Demo User',
            phone: '081234567890',
            businessType: 'wedding_organizer',
            city: 'Jakarta',
        }
    })

    console.log('✅ Seeding completed!')

    // Print summary
    const counts = {
        locations: await prisma.location.count(),
        photographers: await prisma.photographer.count(),
        videographers: await prisma.videographer.count(),
        equipment: await prisma.equipment.count(),
        transport: await prisma.transport.count(),
        users: await prisma.user.count(),
    }

    console.log('\n📊 Database Summary:')
    console.log(`   📍 Locations: ${counts.locations}`)
    console.log(`   📸 Photographers: ${counts.photographers}`)
    console.log(`   🎬 Videographers: ${counts.videographers}`)
    console.log(`   📷 Equipment: ${counts.equipment}`)
    console.log(`   🚐 Transport: ${counts.transport}`)
    console.log(`   👤 Users: ${counts.users}`)
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
