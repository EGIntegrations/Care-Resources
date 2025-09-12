/**
 * LocationService - Provides location-based emergency and local information
 * Uses IP geolocation to determine user's current country and provide relevant local resources
 */

interface LocationInfo {
  country: string;
  countryCode: string;
  city: string;
  region: string;
  timezone: string;
  emergencyNumbers: {
    police: string;
    fire: string;
    ambulance: string;
    general: string;
  };
  localResources: {
    embassy?: string;
    consulate?: string;
    localHospitals: string[];
  };
}

interface IPLocationResponse {
  country: string;
  country_code: string;
  city: string;
  region: string;
  timezone: string;
}

class LocationService {
  private cache: LocationInfo | null = null;
  private cacheExpiry: number = 0;
  private readonly CACHE_DURATION = 1000 * 60 * 60; // 1 hour

  /**
   * Get user's current location info based on IP address
   */
  async getCurrentLocation(): Promise<LocationInfo> {
    const now = Date.now();
    
    // Return cached data if still valid
    if (this.cache && now < this.cacheExpiry) {
      return this.cache;
    }

    try {
      // Use ipapi.co for free IP geolocation
      const response = await fetch('https://ipapi.co/json/');
      const data: IPLocationResponse = await response.json();
      
      const locationInfo: LocationInfo = {
        country: data.country,
        countryCode: data.country_code.toUpperCase(),
        city: data.city,
        region: data.region,
        timezone: data.timezone,
        emergencyNumbers: this.getEmergencyNumbers(data.country_code.toUpperCase()),
        localResources: this.getLocalResources(data.country_code.toUpperCase(), data.city)
      };

      // Cache the result
      this.cache = locationInfo;
      this.cacheExpiry = now + this.CACHE_DURATION;
      
      return locationInfo;
    } catch (error) {
      console.error('Error getting location:', error);
      
      // Return default/fallback location info
      return this.getDefaultLocation();
    }
  }

  /**
   * Get emergency numbers for a specific country
   */
  private getEmergencyNumbers(countryCode: string) {
    const emergencyNumbers: Record<string, any> = {
      // Major countries with missionary presence
      US: { police: '911', fire: '911', ambulance: '911', general: '911' },
      CA: { police: '911', fire: '911', ambulance: '911', general: '911' },
      GB: { police: '999', fire: '999', ambulance: '999', general: '112' },
      DE: { police: '110', fire: '112', ambulance: '112', general: '112' },
      FR: { police: '17', fire: '18', ambulance: '15', general: '112' },
      IT: { police: '113', fire: '115', ambulance: '118', general: '112' },
      ES: { police: '091', fire: '080', ambulance: '061', general: '112' },
      AU: { police: '000', fire: '000', ambulance: '000', general: '000' },
      NZ: { police: '111', fire: '111', ambulance: '111', general: '111' },
      JP: { police: '110', fire: '119', ambulance: '119', general: '110' },
      KR: { police: '112', fire: '119', ambulance: '119', general: '112' },
      CN: { police: '110', fire: '119', ambulance: '120', general: '110' },
      IN: { police: '100', fire: '101', ambulance: '102', general: '112' },
      BR: { police: '190', fire: '193', ambulance: '192', general: '190' },
      MX: { police: '911', fire: '911', ambulance: '911', general: '911' },
      PH: { police: '117', fire: '116', ambulance: '143', general: '911' },
      TH: { police: '191', fire: '199', ambulance: '1669', general: '191' },
      SG: { police: '999', fire: '995', ambulance: '995', general: '999' },
      MY: { police: '999', fire: '994', ambulance: '999', general: '999' },
      ID: { police: '110', fire: '113', ambulance: '118', general: '110' },
      ZA: { police: '10111', fire: '10177', ambulance: '10177', general: '112' },
      KE: { police: '999', fire: '999', ambulance: '999', general: '112' },
      NG: { police: '199', fire: '199', ambulance: '199', general: '112' },
      EG: { police: '122', fire: '180', ambulance: '123', general: '122' },
      // Add more countries as needed
    };

    return emergencyNumbers[countryCode] || { 
      police: '112', 
      fire: '112', 
      ambulance: '112', 
      general: '112' 
    };
  }

  /**
   * Get local resources like embassies and hospitals
   */
  private getLocalResources(countryCode: string, city: string) {
    // This would typically connect to a database or API
    // For now, return basic structure
    return {
      embassy: this.getUSEmbassyInfo(countryCode),
      consulate: `US Consulate in ${city}`,
      localHospitals: [
        `${city} General Hospital`,
        `${city} International Hospital`,
        `${city} Medical Center`
      ]
    };
  }

  /**
   * Get US Embassy information for major countries
   */
  private getUSEmbassyInfo(countryCode: string): string {
    const embassies: Record<string, string> = {
      GB: 'US Embassy London: +44 20 7499-9000',
      DE: 'US Embassy Berlin: +49 30 8305-0',
      FR: 'US Embassy Paris: +33 1 43-12-22-22',
      JP: 'US Embassy Tokyo: +81 3-3224-5000',
      KR: 'US Embassy Seoul: +82 2-397-4114',
      CN: 'US Embassy Beijing: +86 10 8531-3000',
      IN: 'US Embassy New Delhi: +91 11 2419-8000',
      BR: 'US Embassy Brasilia: +55 61 3312-7000',
      AU: 'US Embassy Canberra: +61 2 6214-5600',
      PH: 'US Embassy Manila: +63 2 5301-2000',
      TH: 'US Embassy Bangkok: +66 2 205-4000',
      SG: 'US Embassy Singapore: +65 6476-9100',
      ZA: 'US Embassy Pretoria: +27 12 431-4000',
      // Add more embassies as needed
    };

    return embassies[countryCode] || 'Contact nearest US Embassy or Consulate';
  }

  /**
   * Get default location info for fallback
   */
  private getDefaultLocation(): LocationInfo {
    return {
      country: 'United States',
      countryCode: 'US',
      city: 'Unknown',
      region: 'Unknown',
      timezone: 'America/New_York',
      emergencyNumbers: {
        police: '911',
        fire: '911',
        ambulance: '911',
        general: '911'
      },
      localResources: {
        embassy: 'Contact Care Resources for local embassy information',
        consulate: 'Contact Care Resources for consulate information',
        localHospitals: ['Contact Care Resources for local hospital recommendations']
      }
    };
  }

  /**
   * Get emergency contact card for current location
   */
  async getEmergencyContactCard() {
    const location = await this.getCurrentLocation();
    
    return {
      title: `Emergency Numbers - ${location.country}`,
      location: `${location.city}, ${location.region}`,
      numbers: [
        { label: 'Police', number: location.emergencyNumbers.police, urgent: true },
        { label: 'Fire Department', number: location.emergencyNumbers.fire, urgent: true },
        { label: 'Ambulance', number: location.emergencyNumbers.ambulance, urgent: true },
        { label: 'General Emergency', number: location.emergencyNumbers.general, urgent: true },
      ],
      resources: location.localResources
    };
  }
}

export const locationService = new LocationService();
export type { LocationInfo };