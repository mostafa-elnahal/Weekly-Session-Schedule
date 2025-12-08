import { DaySession, formatDateShort } from '../types';

interface DayCardProps {
    dayName: string;
    date: Date;
    session: DaySession;
    onSessionChange: (session: DaySession) => void;
    isPreview: boolean;
    titleSuggestions: string[];
    presenterSuggestions: string[];
}

const dayColorMap: Record<string, string> = {
    Sunday: 'bg-gradient-to-br from-amber-100 to-amber-200 border-amber-200',
    Monday: 'bg-gradient-to-br from-blue-100 to-blue-200 border-blue-200',
    Tuesday: 'bg-gradient-to-br from-emerald-100 to-emerald-200 border-emerald-200',
    Wednesday: 'bg-gradient-to-br from-pink-100 to-pink-200 border-pink-200',
    Thursday: 'bg-gradient-to-br from-indigo-100 to-indigo-200 border-indigo-200',
    Friday: 'bg-gradient-to-br from-orange-100 to-orange-200 border-orange-200',
    Saturday: 'bg-gradient-to-br from-teal-100 to-teal-200 border-teal-200',
};

export const DayCard = ({
    dayName,
    date,
    session,
    onSessionChange,
    isPreview,
}: DayCardProps) => {
    const handleChange = (field: keyof DaySession, value: string) => {
        onSessionChange({ ...session, [field]: value });
    };

    const colorClass = dayColorMap[dayName] || dayColorMap['Sunday'];
    const dayNumber = date.getDate();
    const monthName = formatDateShort(date).split(' ')[0];

    return (
        <div className="flex flex-row overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md min-h-[80px]">
            {/* Day Label */}
            <div className={`flex w-24 flex-col items-center justify-center border-r p-2 text-center ${colorClass}`}>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600/80">{dayName}</span>
                <span className="text-2xl font-black leading-none text-slate-800/90 my-0.5">{dayNumber}</span>
                <span className="text-[0.65rem] font-bold uppercase text-slate-500/80">{monthName}</span>
            </div>

            {/* Content */}
            <div className="grid flex-1 grid-cols-1 gap-3 p-3 sm:grid-cols-[2fr_1fr_1fr_auto] sm:gap-4 items-start">
                {/* Topic */}
                <div className="flex flex-col gap-1">
                    <label className="text-[0.65rem] font-bold uppercase tracking-wider text-slate-500">Topic</label>
                    {isPreview ? (
                        <div className="text-sm font-bold text-slate-800 whitespace-pre-wrap break-words leading-snug">
                            {session.title || <span className="text-slate-300">—</span>}
                        </div>
                    ) : (
                        <textarea
                            value={session.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            placeholder="Session topic..."
                            className="w-full rounded-md border-0 bg-slate-50 px-2.5 py-1.5 text-sm font-semibold text-slate-800 placeholder-slate-400 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 resize-none"
                            rows={2}
                        />
                    )}
                </div>

                {/* Presenter */}
                <div className="flex flex-col gap-1">
                    <label className="text-[0.65rem] font-bold uppercase tracking-wider text-slate-500">Presenter</label>
                    {isPreview ? (
                        <div className="text-sm font-semibold text-slate-700 whitespace-pre-wrap break-words">
                            {session.presenter || <span className="text-slate-300">—</span>}
                        </div>
                    ) : (
                        <textarea
                            value={session.presenter}
                            onChange={(e) => handleChange('presenter', e.target.value)}
                            placeholder="Name"
                            className="w-full rounded-md border-0 bg-slate-50 px-2.5 py-1.5 text-sm font-medium text-slate-800 placeholder-slate-400 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 resize-none"
                            rows={2}
                        />
                    )}
                </div>

                {/* Backup */}
                <div className="flex flex-col gap-1">
                    <label className="text-[0.65rem] font-bold uppercase tracking-wider text-slate-500">Backup</label>
                    {isPreview ? (
                        <div className="text-sm font-medium text-slate-600 whitespace-pre-wrap break-words">
                            {session.backupPresenter || <span className="text-slate-300">—</span>}
                        </div>
                    ) : (
                        <textarea
                            value={session.backupPresenter || ''}
                            onChange={(e) => handleChange('backupPresenter', e.target.value)}
                            placeholder="Backup"
                            className="w-full rounded-md border-0 bg-slate-50 px-2.5 py-1.5 text-sm font-medium text-slate-800 placeholder-slate-400 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 resize-none"
                            rows={2}
                        />
                    )}
                </div>

                {/* Time */}
                <div className="flex flex-col gap-1 min-w-[80px]">
                    <label className="text-[0.65rem] font-bold uppercase tracking-wider text-slate-500 text-center">Time</label>
                    {isPreview ? (
                        <div className="text-sm font-semibold text-slate-700 text-center">
                            {session.time || <span className="text-slate-300">—</span>}
                        </div>
                    ) : (
                        <input
                            type="text"
                            value={session.time}
                            onChange={(e) => handleChange('time', e.target.value)}
                            placeholder="9:00 PM"
                            className="w-full rounded-md border-0 bg-slate-50 px-2 py-1.5 text-sm font-medium text-slate-800 placeholder-slate-400 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-center"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
