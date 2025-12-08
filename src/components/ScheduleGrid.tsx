import { DayCard } from './DayCard';
import { DAY_NAMES, DayName, WeekSchedule, DaySession, getDateForDay } from '../types';

interface ScheduleGridProps {
    weekStartDate: string;
    onWeekStartDateChange: (date: string) => void;
    schedule: WeekSchedule;
    onScheduleChange: (schedule: WeekSchedule) => void;
    isPreview: boolean;
    titleSuggestions: string[];
    presenterSuggestions: string[];
}

export const ScheduleGrid = ({
    weekStartDate,
    onWeekStartDateChange,
    schedule,
    onScheduleChange,
    isPreview,
    titleSuggestions,
    presenterSuggestions,
}: ScheduleGridProps) => {
    const handleDaySessionChange = (dayName: DayName, session: DaySession) => {
        onScheduleChange({
            ...schedule,
            [dayName]: session,
        });
    };

    const startDate = new Date(weekStartDate);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    const formatRange = () => {
        const startMonth = startDate.toLocaleDateString('en-US', { month: 'long' });
        const endMonth = endDate.toLocaleDateString('en-US', { month: 'long' });
        const year = startDate.getFullYear();

        if (startMonth === endMonth) {
            return `${startMonth} ${startDate.getDate()} - ${endDate.getDate()}, ${year}`;
        }
        return `${startMonth} ${startDate.getDate()} - ${endMonth} ${endDate.getDate()}, ${year}`;
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* Week Picker */}
            {!isPreview && (
                <div className="mb-6 flex items-center justify-center gap-3">
                    <label className="text-sm font-semibold text-slate-600">
                        Week Starting:
                    </label>
                    <input
                        type="date"
                        value={weekStartDate}
                        onChange={(e) => onWeekStartDateChange(e.target.value)}
                        className="rounded-md border-0 bg-white px-3 py-1.5 text-sm font-semibold text-slate-800 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                        style={{ width: 'auto' }}
                    />
                </div>
            )}

            {/* Export Container */}
            <div
                id="export-container"
                className="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-900/5"
                style={{ background: '#ffffff' }}
            >
                {/* Header */}
                <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-5 text-center">
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-1">Weekly Study Schedule</h1>
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">{formatRange()}</p>
                </div>

                {/* Days List */}
                <div className="flex flex-col gap-3 p-4 sm:p-6 bg-slate-50/30">
                    {DAY_NAMES.map((dayName, index) => (
                        <DayCard
                            key={dayName}
                            dayName={dayName}
                            date={getDateForDay(weekStartDate, index)}
                            session={schedule[dayName]}
                            onSessionChange={(session) => handleDaySessionChange(dayName, session)}
                            isPreview={isPreview}
                            titleSuggestions={titleSuggestions}
                            presenterSuggestions={presenterSuggestions}
                        />
                    ))}
                </div>

                {/* Footer */}
                <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 text-center">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                        Steady Readers Tech Study Club
                    </p>
                </div>
            </div>
        </div>
    );
};
