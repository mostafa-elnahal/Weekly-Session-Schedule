import { useState, useCallback } from 'react';
import { Eye, EyeOff, RotateCcw } from 'lucide-react';
import { ScheduleGrid } from './components/ScheduleGrid';
import { ExportButton } from './components/ExportButton';
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
        if (confirm('Clear the schedule?')) {
            setSchedule(createEmptySchedule());
            setWeekStartDate(getCurrentWeekStart());
        }
    };

    return (
        <div className="min-h-screen py-12 px-4 bg-slate-50 font-sans text-slate-900">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2">
                        Study Session Scheduler
                    </h1>
                    <p className="text-slate-500 font-medium">
                        Create and share your weekly study plan
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    <button
                        onClick={() => setIsPreview(!isPreview)}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 transition-all active:scale-95"
                    >
                        {isPreview ? (
                            <>
                                <EyeOff className="w-4 h-4" />
                                Edit
                            </>
                        ) : (
                            <>
                                <Eye className="w-4 h-4" />
                                Preview
                            </>
                        )}
                    </button>

                    <button
                        onClick={handleReset}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 shadow-sm ring-1 ring-inset ring-red-200 hover:bg-red-100 transition-all active:scale-95"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Reset
                    </button>

                    <ExportButton
                        onBeforeExport={handleBeforeExport}
                        weekStartDate={weekStartDate}
                    />
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
            </div>
        </div>
    );
}

export default App;
