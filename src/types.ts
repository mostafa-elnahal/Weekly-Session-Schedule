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

// Get the Sunday of the current week
export const getCurrentWeekStart = (): string => {
    const today = new Date();
    const day = today.getDay(); // 0 = Sunday
    const diff = today.getDate() - day; // Go back to Sunday
    const sunday = new Date(today.setDate(diff));
    return sunday.toISOString().split('T')[0];
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
