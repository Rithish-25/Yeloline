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
    this.cement = 'UltraTech PPC',
    this.steel = 'TATA Tiscon 550D',
    this.bricks = 'Red Bricks',
    this.flooring = 'Vitrified Tiles',
    this.doors = 'Teak Wood Doors',
    this.windows = 'Aluminium Windows',
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
