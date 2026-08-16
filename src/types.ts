export type PosterFormat = 'portrait' | 'story' | 'banner' | 'square';

export type LanguageMode = 'bilingual' | 'ar-focus' | 'fr-focus';

export type ColorTheme = 'mauritania-classic' | 'assaba-gold' | 'royal-emerald' | 'festive-sahara';

export type DisplayMode = 'night' | 'day';

export interface WeatherData {
  temp: number;
  tempMin: number;
  tempMax: number;
  conditionFr: string;
  conditionAr: string;
  humidity: number;
  windSpeed: number;
  isForecast?: boolean;
}

export interface FestivalActivity {
  id: string;
  titleFr: string;
  titleAr: string;
  categoryFr: string;
  categoryAr: string;
  descFr: string;
  descAr: string;
  iconName: string;
  badgeFr: string;
  badgeAr: string;
  scheduleDay: string;
  scheduleDayAr: string;
  targetGroupFr: string;
  targetGroupAr: string;
}

export interface DayProgram {
  dateFr: string;
  dateAr: string;
  dayNumber: number;
  highlightFr: string;
  highlightAr: string;
  events: {
    time: string;
    titleFr: string;
    titleAr: string;
    locationFr: string;
    locationAr: string;
    type: 'culture' | 'sport' | 'traditional' | 'social' | 'youth' | 'eco';
  }[];
}

export interface Committee {
  id: string;
  nameFr: string;
  nameAr: string;
  roleFr: string;
  roleAr: string;
  iconName: string;
}

export type InvitationCategory = 'vip' | 'guest' | 'resident' | 'volunteer' | 'youth' | 'partner';

export interface InvitationCardData {
  id: string;
  recipientName: string;
  recipientNameFr?: string;
  recipientNameAr?: string;
  recipientHonorificFr: string;
  recipientHonorificAr: string;
  whatsappPhone: string;
  category: InvitationCategory;
  seatZone?: string;
  notes?: string;
  createdAt: string;
  invitationCode: string;
  checkedIn?: boolean;
  checkedInAt?: string;
  checkedInBy?: string;
}
