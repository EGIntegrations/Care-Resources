/**
 * EventsService - Manages dynamic event loading from various sources
 * Can be configured to pull from ag.org/Events RSS, API, or other sources
 */

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  type: 'webinar' | 'conference' | 'workshop' | 'meeting' | 'social';
  registrationUrl?: string;
  isVirtual: boolean;
  category: string;
  image?: string;
}

interface EventsResponse {
  events: Event[];
  lastUpdated: string;
  source: string;
}

class EventsService {
  private cache: EventsResponse | null = null;
  private cacheExpiry: number = 0;
  private readonly CACHE_DURATION = 1000 * 60 * 30; // 30 minutes

  /**
   * Get upcoming events from various sources
   */
  async getUpcomingEvents(): Promise<Event[]> {
    const now = Date.now();
    
    // Return cached data if still valid
    if (this.cache && now < this.cacheExpiry) {
      return this.cache.events;
    }

    try {
      // Try multiple sources in order of preference
      const events = await this.fetchFromMultipleSources();
      
      const eventsResponse: EventsResponse = {
        events,
        lastUpdated: new Date().toISOString(),
        source: 'mixed'
      };

      // Cache the result
      this.cache = eventsResponse;
      this.cacheExpiry = now + this.CACHE_DURATION;
      
      return events;
    } catch (error) {
      console.error('Error fetching events:', error);
      return []; // Return empty array instead of fallback events
    }
  }

  /**
   * Try to fetch events from multiple sources
   */
  private async fetchFromMultipleSources(): Promise<Event[]> {
    const allEvents: Event[] = [];

    try {
      // Source 1: AG.org RSS/API (when available)
      const agEvents = await this.fetchFromAGOrg();
      allEvents.push(...agEvents);
    } catch (error) {
      console.log('AG.org events not available:', error);
    }

    try {
      // Source 2: Care Resources internal events
      const internalEvents = await this.fetchInternalEvents();
      allEvents.push(...internalEvents);
    } catch (error) {
      console.log('Internal events not available:', error);
    }

    // Sort by date and return upcoming events only
    return this.filterAndSortEvents(allEvents);
  }

  /**
   * Fetch events from AG.org/Events page
   */
  private async fetchFromAGOrg(): Promise<Event[]> {
    // Disabled AG.org fetching to prevent placeholder events
    // When real AG.org integration is needed, this can be re-enabled
    return [];
  }

  /**
   * Fetch events from AWS API (DynamoDB via Lambda)
   */
  private async fetchInternalEvents(): Promise<Event[]> {
    try {
      // Try AWS API first (production)
      const apiUrl = 'https://3hggeubhb5.execute-api.us-east-1.amazonaws.com/prod/events';
      const response = await fetch(apiUrl);

      if (response.ok) {
        const data = await response.json();
        return data.events || [];
      }
    } catch (error) {
      console.log('AWS API not available:', error);
    }

    // Fallback to empty array - no placeholder events
    return [];
  }

  /**
   * Filter and sort events to show only upcoming ones
   */
  private filterAndSortEvents(events: Event[]): Event[] {
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    return events
      .filter(event => event.date >= today) // Only upcoming events
      .sort((a, b) => a.date.localeCompare(b.date)) // Sort by date
      .slice(0, 10); // Limit to 10 events
  }

  /**
   * Get fallback events when all sources fail
   * Returns empty array - no placeholder events during slow seasons
   */
  private getFallbackEvents(): Event[] {
    return []; // No placeholder events - truly dynamic
  }

  /**
   * Get events by category
   */
  async getEventsByCategory(category: string): Promise<Event[]> {
    const allEvents = await this.getUpcomingEvents();
    return allEvents.filter(event => 
      event.category.toLowerCase().includes(category.toLowerCase())
    );
  }

  /**
   * Get events for a specific region (based on user location)
   */
  async getRegionalEvents(countryCode?: string): Promise<Event[]> {
    const allEvents = await this.getUpcomingEvents();
    
    // For now, return all events as most are virtual
    // In the future, could filter by region based on countryCode
    return allEvents.filter(event => event.isVirtual || !countryCode);
  }

  /**
   * Register for an event (placeholder)
   */
  async registerForEvent(eventId: string): Promise<boolean> {
    try {
      // This would integrate with registration system
      console.log(`Registering for event: ${eventId}`);
      return true;
    } catch (error) {
      console.error('Error registering for event:', error);
      return false;
    }
  }

  /**
   * Parse AG.org HTML to extract event information
   */
  private parseAGEventsHTML(html: string): Event[] {
    const events: Event[] = [];
    
    try {
      // Look for event patterns in the HTML
      // This is a basic parser - may need refinement based on actual AG.org structure
      const eventMatches = html.match(/<div[^>]*class[^>]*event[^>]*>[\s\S]*?<\/div>/gi);
      
      if (eventMatches) {
        eventMatches.forEach((eventHtml, index) => {
          try {
            const titleMatch = eventHtml.match(/<h[1-6][^>]*>([^<]+)<\/h[1-6]>/i);
            const dateMatch = eventHtml.match(/\b\d{1,2}\/\d{1,2}\/\d{4}\b|\b\d{4}-\d{2}-\d{2}\b/);
            const timeMatch = eventHtml.match(/\b\d{1,2}:\d{2}\s*(AM|PM)\b/i);
            
            if (titleMatch) {
              events.push({
                id: `ag-${Date.now()}-${index}`,
                title: titleMatch[1].trim(),
                date: dateMatch ? this.parseDate(dateMatch[0]) : '2025-12-31',
                time: timeMatch ? timeMatch[0] : '12:00 PM',
                location: 'Check AG.org for details',
                description: 'Visit AG.org/Events for full details and registration',
                type: 'conference',
                isVirtual: false,
                category: 'AG Events',
                registrationUrl: 'https://ag.org/Events'
              });
            }
          } catch (parseError) {
            console.log('Error parsing individual event:', parseError);
          }
        });
      }
    } catch (error) {
      console.error('Error parsing AG.org HTML:', error);
    }
    
    return events.slice(0, 5); // Limit to 5 events from AG.org
  }

  /**
   * Parse various date formats
   */
  private parseDate(dateStr: string): string {
    try {
      // Try to parse MM/DD/YYYY format
      if (dateStr.includes('/')) {
        const [month, day, year] = dateStr.split('/');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
      
      // Already in YYYY-MM-DD format
      if (dateStr.includes('-')) {
        return dateStr;
      }
      
      return '2025-12-31'; // Fallback
    } catch {
      return '2025-12-31';
    }
  }

  /**
   * Clear cache to force refresh
   */
  clearCache(): void {
    this.cache = null;
    this.cacheExpiry = 0;
  }
}

export const eventsService = new EventsService();
export type { Event };