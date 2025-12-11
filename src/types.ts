// Week starts with Sunday
export const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;

export type DayName = typeof DAY_NAMES[number];

export interface DaySession {
    title: string;
    presenter: string;
    backupPresenter: string;
    time: string;
}

export type WeekSchedule = Record<DayName, DaySession>;

export interface AppState {
    weekStartDate: string; // ISO date string (YYYY-MM-DD)
    schedule: WeekSchedule;
}

export interface SuggestionsData {
    titles: string[];
    presenters: string[];
}

export const DEFAULT_TIME = '9:00 PM';

export const createEmptySession = (): DaySession => ({
    title: '',
    presenter: '',
    backupPresenter: '',
    time: DEFAULT_TIME,
});

export const createEmptySchedule = (): WeekSchedule => ({
    Sunday: createEmptySession(),
    Monday: createEmptySession(),
    Tuesday: createEmptySession(),
    Wednesday: createEmptySession(),
    Thursday: createEmptySession(),
    Friday: createEmptySession(),
    Saturday: createEmptySession(),
});

// Helper to get the most recent Saturday (or today if it's Saturday)
export const getCurrentWeekStart = (): string => {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    // We want Saturday to be index 0 relative to our week.
    // If today is Saturday (6), diff is 0.
    // If today is Sunday (0), diff is 1.
    // If today is Friday (5), diff is 6.
    const diff = (day + 1) % 7;

    // Create new date to avoid mutating original
    const saturday = new Date(now);
    saturday.setDate(now.getDate() - diff);

    return saturday.toISOString().split('T')[0];
};

// Helper to snap any date to the previous Saturday
export const snapToSaturday = (dateString: string): string => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return getCurrentWeekStart();

    const day = date.getDay(); // 0 = Sunday, ..., 6 = Saturday
    const diff = (day + 1) % 7;

    date.setDate(date.getDate() - diff);
    return date.toISOString().split('T')[0];
};

export const formatDateShort = (date: Date): string => {
    return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(date);
};

export const getDateForDay = (weekStartDate: string, dayIndex: number): Date => {
    const startDate = new Date(weekStartDate);
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + dayIndex);
    return date;
};

export interface AppSettings {
    visibleDays: DayName[];
}

export const DEFAULT_SETTINGS: AppSettings = {
    visibleDays: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
};
