class QuoteData {
  String structure;
  String cement;
  String steel;
  String bricks;
  String flooring;
  String doors;
  String windows;
  String elevation;

  // Client Details
  String clientName;
  String mobileNumber;
  String whatsAppNumber;
  String location;
  String plotSize;
  String approximateArea;
  String numberOfFloors;
  String preferredStartDate;
  String additionalNotes;

  QuoteData({
    this.structure = 'RCC Frame Structure (M25 Grade)',
    this.cement = 'UltraTech PPC (Premium)',
    this.steel = 'TATA Tiscon 550D (High Strength)',
    this.bricks = 'Red Bricks (Premium)',
    this.flooring = 'Vitrified Tiles (Premium)',
    this.doors = 'Teak Wood Doors (Premium)',
    this.windows = 'Aluminium Windows (Powder Coated)',
    this.elevation = 'Modern Elevation',
    this.clientName = '',
    this.mobileNumber = '',
    this.whatsAppNumber = '',
    this.location = '',
    this.plotSize = '',
    this.approximateArea = '',
    this.numberOfFloors = '',
    this.preferredStartDate = '',
    this.additionalNotes = '',
  });

  int get estimatedRateMin => 2300;
  int get estimatedRateMax => 2400;

  String get estimatedRateFormatted => '₹$estimatedRateMin - ₹$estimatedRateMax / sq.ft.';
}
