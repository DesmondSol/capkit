import React, { useState } from 'react';
import { SalesData, LaunchPhase, Activity, ActivityStatus, Language, TranslationKey } from '../../types';
import { Button } from '../common/Button';

interface GoToMarketArchitectProps {
  salesData: SalesData;
  onUpdateData: (data: SalesData) => void;
  t: (key: TranslationKey, defaultText?: string) => string;
  language: Language;
}

export const GoToMarketArchitect: React.FC<GoToMarketArchitectProps> = ({ salesData, onUpdateData, t }) => {
    const [editingPhaseId, setEditingPhaseId] = useState<string | null>(null);
    const [editingPhaseName, setEditingPhaseName] = useState('');
    const [newActivityInputs, setNewActivityInputs] = useState<Record<string, string>>({});

    const launchSequence = salesData.launchSequence || [];

    const handleAddPhase = () => {
        const newPhase: LaunchPhase = {
            id: `phase-${Date.now()}`,
            name: t('new_phase_default_name'),
            activities: [],
        };
        onUpdateData({ ...salesData, launchSequence: [...launchSequence, newPhase] });
    };

    const handleDeletePhase = (phaseId: string) => {
        if (window.confirm(t('delete_button') + '?')) {
            const updatedSequence = launchSequence.filter(p => p.id !== phaseId);
            onUpdateData({ ...salesData, launchSequence: updatedSequence });
        }
    };
    
    const handleStartEditingPhase = (phase: LaunchPhase) => {
        setEditingPhaseId(phase.id);
        setEditingPhaseName(phase.name);
    };

    const handleSavePhaseName = (phaseId: string) => {
        const updatedSequence = launchSequence.map(p =>
            p.id === phaseId ? { ...p, name: editingPhaseName.trim() } : p
        );
        onUpdateData({ ...salesData, launchSequence: updatedSequence });
        setEditingPhaseId(null);
    };

    const handleAddActivity = (phaseId: string) => {
        const activityName = newActivityInputs[phaseId]?.trim();
        if (!activityName) return;

        const newActivity: Activity = {
            id: `act-${Date.now()}`,
            name: activityName,
            status: 'todo',
        };

        const updatedSequence = launchSequence.map(phase => {
            if (phase.id === phaseId) {
                return { ...phase, activities: [...phase.activities, newActivity] };
            }
            return phase;
        });
        onUpdateData({ ...salesData, launchSequence: updatedSequence });
        setNewActivityInputs(prev => ({ ...prev, [phaseId]: '' }));
    };

    const handleUpdateActivityStatus = (phaseId: string, activityId: string, newStatus: ActivityStatus) => {
        const updatedSequence = launchSequence.map(phase => {
            if (phase.id === phaseId) {
                return { ...phase, activities: phase.activities.map(act =>
                    act.id === activityId ? { ...act, status: newStatus } : act
                )};
            }
            return phase;
        });
        onUpdateData({ ...salesData, launchSequence: updatedSequence });
    };

    const handleDeleteActivity = (phaseId: string, activityId: string) => {
        if (window.confirm(t('delete_button') + '?')) {
            const updatedSequence = launchSequence.map(phase => {
                if (phase.id === phaseId) {
                    return { ...phase, activities: phase.activities.filter(a => a.id !== activityId) };
                }
                return phase;
            });
            onUpdateData({ ...salesData, launchSequence: updatedSequence });
        }
    };

    const inputClasses = "w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-slate-200 focus:ring-2 focus:ring-blue-500";


    return (
        <div className="space-y-12">
            {/* Launch Sequence Builder */}
            <div className="p-4 md:p-6 bg-slate-800/50 rounded-xl shadow-xl border border-slate-700">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-semibold text-blue-400">{t('launch_sequence_builder_title')}</h3>
                    <Button onClick={handleAddPhase} variant="secondary" leftIcon={<PlusIcon className="h-5 w-5" />}>
                        {t('add_phase_button')}
                    </Button>
                </div>
                <div className="space-y-6">
                    {launchSequence.map(phase => (
                        <div key={phase.id} className="p-4 bg-slate-800 rounded-lg border border-slate-600">
                            <div className="flex justify-between items-center mb-4">
                                {editingPhaseId === phase.id ? (
                                    <input
                                        type="text"
                                        value={editingPhaseName}
                                        onChange={(e) => setEditingPhaseName(e.target.value)}
                                        onBlur={() => handleSavePhaseName(phase.id)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSavePhaseName(phase.id)}
                                        className="text-lg font-bold bg-slate-700 text-white p-1 rounded-md"
                                        autoFocus
                                    />
                                ) : (
                                    <h4 className="text-lg font-bold text-slate-100 cursor-pointer" onClick={() => handleStartEditingPhase(phase)}>{phase.name}</h4>
                                )}
                                <Button onClick={() => handleDeletePhase(phase.id)} variant="danger" size="sm" className="!p-2"><TrashIcon className="h-4 w-4" /></Button>
                            </div>
                            <div className="space-y-3 mb-4">
                                {phase.activities.map(activity => (
                                    <div key={activity.id} className="flex items-center justify-between p-2 bg-slate-700/50 rounded-md">
                                        <p className="text-slate-200 text-sm flex-grow">{activity.name}</p>
                                        <div className="flex items-center space-x-3 ml-4">
                                            <select value={activity.status} onChange={e => handleUpdateActivityStatus(phase.id, activity.id, e.target.value as ActivityStatus)} className="bg-slate-600 text-xs text-slate-300 rounded p-1 border border-slate-500 focus:ring-blue-500">
                                                <option value="todo">{t('activity_status_todo')}</option>
                                                <option value="in_progress">{t('activity_status_in_progress')}</option>
                                                <option value="done">{t('activity_status_done')}</option>
                                            </select>
                                            <Button onClick={() => handleDeleteActivity(phase.id, activity.id)} variant="danger" size="sm" className="!p-1.5"><TrashIcon className="h-3.5 w-3.5" /></Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={newActivityInputs[phase.id] || ''}
                                    onChange={(e) => setNewActivityInputs({...newActivityInputs, [phase.id]: e.target.value})}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddActivity(phase.id)}
                                    placeholder={t('new_activity_placeholder')}
                                    className={`${inputClasses} flex-grow`}
                                />
                                <Button onClick={() => handleAddActivity(phase.id)} variant="outline" size="sm" className="flex-shrink-0">{t('add_activity_button')}</Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- SVG Icons ---
const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
  </svg>
);
const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.58.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25-.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
  </svg>
);