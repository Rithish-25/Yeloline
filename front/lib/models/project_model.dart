class Project {
  final String id;
  final String title;
  final String location;
  final String category; // 'Completed', 'Ongoing'
  final String type; // e.g. '4 BHK Villa'
  final String area; // e.g. '5,896 sq.ft.'
  final String status; // 'Completed', 'Ongoing'
  final String heroImageUrl;
  final List<String> galleryImages;
  final String description;
  final List<String> highlights;
  final List<String> features;
  final List<String> materials;

  const Project({
    required this.id,
    required this.title,
    required this.location,
    required this.category,
    required this.type,
    required this.area,
    required this.status,
    required this.heroImageUrl,
    required this.galleryImages,
    required this.description,
    required this.highlights,
    required this.features,
    required this.materials,
  });

  static List<Project> sampleProjects = [
    const Project(
      id: '1',
      title: 'Skyline Residency',
      location: 'Erode, Tamil Nadu',
      category: 'Completed',
      type: '4 BHK Villa',
      area: '3,800 sq.ft.',
      status: 'Completed in 2023',
      heroImageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
      galleryImages: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=800&auto=format&fit=crop',
      ],
      description:
          'Skyline Residency is a premium 4 BHK independent house crafted for a family of five in Erode. Designed with a modern architectural style, this home blends aesthetics with functionality to deliver spacious, well-ventilated, and Vastu-compliant living spaces.',
      highlights: [
        '4 BHK Bedrooms',
        '2 Spacious Living Areas',
        'Modular Kitchen',
        '2 Covered Car Parkings',
      ],
      features: [
        'Modern Elevation & Design',
        'Vastu Compliant Planning',
        'Spacious & Well Ventilated',
        'On-time Delivery',
        'High Construction Quality',
      ],
      materials: [
        'RCC Frame Structure (M25 Grade)',
        'Vitrified Tiles - Premium Quality',
        'UPVC Windows & Teak Wood Doors',
        'Branded CP & Sanitary Fittings',
        'Anti-termite & Waterproofing Treatment',
      ],
    ),
    const Project(
      id: '2',
      title: 'Green View Bungalows',
      location: 'Vadodara, Gujarat',
      category: 'Completed',
      type: '4 BHK Villa',
      area: '4,800 sq.ft.',
      status: 'Completed in 2024',
      heroImageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop',
      galleryImages: [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
      ],
      description:
          'A luxury eco-friendly bungalow designed with contemporary finishes, solar integrations, and wide glass facade openings.',
      highlights: [
        '4 BHK Villa',
        'Private Garden',
        'Home Theater',
        'Solar Roof Panels',
      ],
      features: [
        'Eco-friendly Architecture',
        'Landscaped Courtyard',
        'Smart Automation Ready',
      ],
      materials: [
        'RCC Frame Structure (M30 Grade)',
        'Italian Marble Flooring',
        'TATA Tiscon 550D Steel',
      ],
    ),
    const Project(
      id: '3',
      title: 'Palm Springs Villa',
      location: 'Surat, Gujarat',
      category: 'Ongoing',
      type: '5 BHK Villa',
      area: '6,100 sq.ft.',
      status: 'Ongoing',
      heroImageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&auto=format&fit=crop',
      galleryImages: [
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&auto=format&fit=crop',
      ],
      description:
          'Ultra-modern 5 BHK villa featuring double-height ceiling living room, infinity splash pool, and Italian marble detailing.',
      highlights: [
        '5 BHK Bedrooms',
        'Private Swimming Pool',
        'Terrace Deck',
        '3 Car Spaces',
      ],
      features: [
        'Double-height Living Room',
        'Custom Interior Layouts',
        'High Security Access',
      ],
      materials: [
        'UltraTech PPC Cement',
        'Italian Imported Marble',
        'Teak Wood Finishes',
      ],
    ),
    const Project(
      id: '4',
      title: 'Triveni Bungalows',
      location: 'Erode, Tamil Nadu',
      category: 'Ongoing',
      type: '3 BHK Villa',
      area: '3,500 sq.ft.',
      status: 'Ongoing',
      heroImageUrl: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=800&auto=format&fit=crop',
      galleryImages: [
        'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=800&auto=format&fit=crop',
      ],
      description:
          'Elegantly planned 3 BHK independent bungalow built for cozy family living with modern open layouts and high durability.',
      highlights: [
        '3 BHK Bedrooms',
        'Veranda & Balcony',
        'Open Kitchen',
      ],
      features: [
        'Optimized Natural Air Flow',
        'Vastu Planning',
        'Low Maintenance Finish',
      ],
      materials: [
        'Red Bricks (Premium)',
        'Vitrified Tile Flooring',
        'UPVC Sliding Windows',
      ],
    ),
    const Project(
      id: '5',
      title: 'Emerald Heights',
      location: 'Salem, Tamil Nadu',
      category: 'Ongoing',
      type: '4 BHK Luxury Villa',
      area: '4,500 sq.ft.',
      status: 'Ongoing',
      heroImageUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=800&auto=format&fit=crop',
      galleryImages: [
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=800&auto=format&fit=crop',
      ],
      description:
          'State of the art 4 BHK luxury villa currently under construction with contemporary elevation and smart features.',
      highlights: [
        '4 BHK Bedrooms',
        'Landscaped Terrace',
        'Smart Automation',
      ],
      features: [
        'Modern Facade Design',
        'Energy Efficient Lighting',
        'Vastu Compliant',
      ],
      materials: [
        'M25 Grade Concrete',
        'Imported Tiles',
        'Teak Woodwork',
      ],
    ),
    const Project(
      id: '6',
      title: 'Royal Oak Mansion',
      location: 'Coimbatore, Tamil Nadu',
      category: 'Completed',
      type: '5 BHK Luxury Estate',
      area: '6,400 sq.ft.',
      status: 'Completed in 2023',
      heroImageUrl: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=800&auto=format&fit=crop',
      galleryImages: [
        'https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=800&auto=format&fit=crop',
      ],
      description:
          'A majestic 5 BHK luxury mansion designed with traditional Chettinad wooden woodwork combined with ultra-modern architectural geometry and swimming pool.',
      highlights: [
        '5 BHK Master Suites',
        'Private Infinity Pool',
        'Chettinad Teak Woodwork',
        '3 Car Covered Garage',
      ],
      features: [
        'Grand Double Height Entrance',
        'Integrated Smart Lighting',
        '100% Solar Powered Grid',
        'Landscaped Private Courtyard',
      ],
      materials: [
        'M30 Reinforced Structural Frame',
        'First Quality Burma Teak Wood',
        'Italian Statuario Marble',
        'Kajaria Glazed Vitrified Tiles',
      ],
    ),
    const Project(
      id: '7',
      title: 'Grand Horizon Villa',
      location: 'Madurai, Tamil Nadu',
      category: 'Completed',
      type: '4 BHK Contemporary Villa',
      area: '4,200 sq.ft.',
      status: 'Completed in 2024',
      heroImageUrl: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=800&auto=format&fit=crop',
      galleryImages: [
        'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=800&auto=format&fit=crop',
      ],
      description:
          'Stunning modern 4 BHK residence featuring warm wooden louvers, expansive floor-to-ceiling glass windows, and a open-plan interior floor plan.',
      highlights: [
        '4 Ensuite Bedrooms',
        'Open Sky Central Atrium',
        'Acoustic Home Cinema',
        'Designer Modular Kitchen',
      ],
      features: [
        'Vastu Compliant Orientations',
        'Cross Ventilation Cooling',
        'Custom Ambient Lighting',
        'Rainwater Harvesting System',
      ],
      materials: [
        'Grade A Red Brick Masonry',
        'TATA Tiscon 550D Rebars',
        'Jaquar Premium Sanitaryware',
        'UPVC Toughened Glass Windows',
      ],
    ),
    const Project(
      id: '8',
      title: 'Sri Lakshmi Nivas',
      location: 'Erode, Tamil Nadu',
      category: 'Completed',
      type: '3 BHK Modern Home',
      area: '3,200 sq.ft.',
      status: 'Completed in 2024',
      heroImageUrl: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=800&auto=format&fit=crop',
      galleryImages: [
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=800&auto=format&fit=crop',
      ],
      description:
          'A cozy, elegantly styled 3 BHK family bungalow crafted in Erode with top-grade materials, lush front garden elevation, and open terrace party space.',
      highlights: [
        '3 Spacious Bedrooms',
        'Front Elevation Garden',
        'Terrace Pergola & Barbecue',
        'Spacious Family Room',
      ],
      features: [
        'Optimum Energy Efficiency',
        'Low-Maintenance Granite Exterior',
        'Vastu Compliant Entrance',
        'Covered Parking Bay',
      ],
      materials: [
        'UltraTech Super Cement',
        'Black Galaxy Granite',
        'Asian Paints Ultima Exterior',
        'Modular Teak Finish Cabinetry',
      ],
    ),
    const Project(
      id: '9',
      title: 'Kaveri Crest Enclave',
      location: 'Tiruchirappalli, Tamil Nadu',
      category: 'Completed',
      type: '4 BHK Riverside Villa',
      area: '5,100 sq.ft.',
      status: 'Completed in 2023',
      heroImageUrl: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=800&auto=format&fit=crop',
      galleryImages: [
        'https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=800&auto=format&fit=crop',
      ],
      description:
          'Exquisite 4 BHK waterfront villa featuring panoramic terrace views, natural stone facade detailing, and private gym suite.',
      highlights: [
        '4 BHK Deluxe Suites',
        'Panoramic Terrace Deck',
        'In-house Fitness Gym',
        'Dual Kitchen Layout',
      ],
      features: [
        'Water-Front Orientation',
        'Smart Security & Locks',
        'Vastu Harmonized Architecture',
        'Multi-car Driveway',
      ],
      materials: [
        'Jindal Panther TMT Steel',
        'Natural Slate Wall Cladding',
        'Somany Double Charged Tiles',
        'Schneider Automation Modules',
      ],
    ),
  ];
}
