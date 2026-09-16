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
  ];
}
