import { useState, useCallback } from 'react';
import { Eye, EyeOff, Settings } from 'lucide-react';
import { ScheduleGrid } from './components/ScheduleGrid';
import { ExportButton } from './components/ExportButton';
import { SettingsDialog } from './components/SettingsDialog';
import { useLocalStorage, saveToLocalStorageImmediate } from './hooks/useLocalStorage';
import {
    WeekSchedule,
    SuggestionsData,
    createEmptySchedule,
    getCurrentWeekStart,
    DAY_NAMES,
} from './types';

const SCHEDULE_KEY = 'study-schedule-data';
const SUGGESTIONS_KEY = 'study-schedule-suggestions';

// Custom GitHub icon component (make it smaller)
const GitHubIcon = ({ className }: { className?: string }) => (
    <svg
        className={className}
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M12 0.297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
);

function App() {
    const [weekStartDate, setWeekStartDate] = useLocalStorage<string>(
        'study-schedule-week-start',
        getCurrentWeekStart()
    );
    const [schedule, setSchedule] = useLocalStorage<WeekSchedule>(
        SCHEDULE_KEY,
        createEmptySchedule()
    );
    const [suggestions, setSuggestions] = useLocalStorage<SuggestionsData>(
        SUGGESTIONS_KEY,
        { titles: [], presenters: [] }
    );

    const [isPreview, setIsPreview] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const extractCurrentSuggestions = useCallback(() => {
        const titles = new Set<string>();
        const presenters = new Set<string>();

        DAY_NAMES.forEach((day) => {
            const session = schedule[day];
            if (session?.title?.trim()) titles.add(session.title.trim());
            if (session?.presenter?.trim()) presenters.add(session.presenter.trim());
            if (session?.backupPresenter?.trim()) presenters.add(session.backupPresenter.trim());
        });

        return { titles: Array.from(titles), presenters: Array.from(presenters) };
    }, [schedule]);

    const handleBeforeExport = useCallback(() => {
        const current = extractCurrentSuggestions();
        const mergedTitles = [...new Set([...suggestions.titles, ...current.titles])];
        const mergedPresenters = [...new Set([...suggestions.presenters, ...current.presenters])];

        const newSuggestions = {
            titles: mergedTitles.slice(-50),
            presenters: mergedPresenters.slice(-50),
        };

        saveToLocalStorageImmediate(SUGGESTIONS_KEY, newSuggestions);
        setSuggestions(newSuggestions);
    }, [extractCurrentSuggestions, suggestions, setSuggestions]);

    const handleReset = () => {
        setSchedule(createEmptySchedule());
        setWeekStartDate(getCurrentWeekStart());
    };

    return (
        <div className="min-h-screen py-12 px-4 bg-slate-50 font-sans text-slate-900">
            <div className="max-w-5xl mx-auto relative">
                {/* GitHub Button */}
                <a
                    href="https://github.com/mostafa-elnahal/Weekly-Session-Schedule"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-0 right-0 inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-slate-800 transition-all active:scale-95"
                    aria-label="View on GitHub"
                >
                    <GitHubIcon className="w-5 h-5" />
                    <span className="hidden sm:inline">GitHub</span>
                </a>

                {/* Header */}
                <div className="text-center mb-10 mt-12 sm:mt-0">
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2">
                        Study Session Scheduler
                    </h1>
                    <p className="text-slate-500 font-medium">
                        Create and share your weekly study plan
                    </p>
                </div>

                {/* Actions */}
                <div className="relative flex items-center justify-center gap-3 mb-8 w-full max-w-4xl mx-auto">
                    <button
                        onClick={() => setIsPreview(!isPreview)}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 transition-all active:scale-95"
                    >
                        {isPreview ? (
                            <>
                                <EyeOff className="w-4 h-4" />
                                <span className="hidden sm:inline">Edit</span>
                            </>
                        ) : (
                            <>
                                <Eye className="w-4 h-4" />
                                <span className="hidden sm:inline">Preview</span>
                            </>
                        )}
                    </button>

                    <ExportButton
                        onBeforeExport={handleBeforeExport}
                        weekStartDate={weekStartDate}
                    />

                    <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="absolute right-0 top-1/2 -translate-y-1/2 inline-flex items-center justify-center p-2.5 rounded-lg bg-white text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 transition-all active:scale-95"
                        aria-label="Settings"
                    >
                        <Settings className="w-5 h-5" />
                    </button>
                </div>

                {/* Schedule */}
                <ScheduleGrid
                    weekStartDate={weekStartDate}
                    onWeekStartDateChange={setWeekStartDate}
                    schedule={schedule}
                    onScheduleChange={setSchedule}
                    isPreview={isPreview}
                    titleSuggestions={suggestions.titles}
                    presenterSuggestions={suggestions.presenters}
                />

                <SettingsDialog
                    isOpen={isSettingsOpen}
                    onClose={() => setIsSettingsOpen(false)}
                    onResetSchedule={handleReset}
                />
            </div>
        </div>
    );
}

export default App;
