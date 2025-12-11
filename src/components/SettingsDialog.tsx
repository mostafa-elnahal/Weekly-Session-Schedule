import { X, Trash2 } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { AppSettings, DAY_NAMES, DayName } from '../types';

interface SettingsDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onResetSchedule: () => void;
    settings: AppSettings;
    onSettingsChange: (settings: AppSettings) => void;
}

export function SettingsDialog({
    isOpen,
    onClose,
    onResetSchedule,
    settings,
    onSettingsChange,
}: SettingsDialogProps) {
    const dialogRef = useRef<HTMLDivElement>(null);

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    // Close on click outside
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleDayToggle = (day: DayName) => {
        const newVisibleDays = settings.visibleDays.includes(day)
            ? settings.visibleDays.filter((d) => d !== day)
            : [...settings.visibleDays, day];

        // Ensure at least one day is visible
        if (newVisibleDays.length === 0) return;

        onSettingsChange({
            ...settings,
            visibleDays: newVisibleDays,
        });
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50"
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
        >
            <div
                ref={dialogRef}
                className="w-full max-w-md bg-white rounded-xl shadow-2xl ring-1 ring-slate-900/5 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
                    <h2 className="text-lg font-semibold text-slate-900">Settings</h2>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors"
                        aria-label="Close settings"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto">
                    <div className="space-y-6">
                        {/* Appearance Section */}
                        <div>
                            {/* Visible Days */}
                            <div>
                                <label className="block text-sm text-slate-700 mb-2">Visible Days</label>
                                <div className="flex flex-wrap gap-2">
                                    {['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => {
                                        const isSelected = settings.visibleDays.includes(day as DayName);
                                        return (
                                            <label
                                                key={day}
                                                className={`
                                                    cursor-pointer px-3 py-2 rounded-lg text-sm font-medium border transition-all select-none
                                                    ${isSelected
                                                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                                                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                                    }
                                                `}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => handleDayToggle(day as DayName)}
                                                    className="sr-only"
                                                />
                                                {day.slice(0, 3)}
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <hr className="border-slate-100" />

                        {/* Reset Section */}
                        <button
                            onClick={() => {
                                if (confirm('Are you sure you want to completely reset the schedule? All current data will be lost.')) {
                                    onResetSchedule();
                                    onClose();
                                }
                            }}
                            className="w-full flex items-center justify-between p-3 text-left bg-white border border-red-200 rounded-lg group hover:border-red-300 hover:bg-red-50 transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-50 text-red-600 rounded-md group-hover:bg-red-100 transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-red-700">Reset Schedule</div>
                                    <div className="text-xs text-red-500">Clear all current sessions</div>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 text-center flex-shrink-0">
                    <p className="text-xs text-slate-400">
                        Weekly Session Schedule v1.0
                    </p>
                </div>
            </div>
        </div>
    );
}
