import React, { useState } from 'react';
import { MindsetData, Language, GoalTimeframe, GoalDetail, UserProfile } from '../../types';
import { TranslationKey } from '../../types';
import { Button } from '../common/Button';
import { addUserProfileHeader, addPageFooter, addTextWithPageBreaks, MARGIN_MM, LINE_HEIGHT_NORMAL, TITLE_FONT_SIZE, LINE_HEIGHT_TITLE, SECTION_TITLE_FONT_SIZE, LINE_HEIGHT_SECTION_TITLE, TEXT_FONT_SIZE } from '../../utils/pdfUtils'; // Import PDF utils

interface GoalSettingProps {
  mindsetData: MindsetData;
  onUpdateMindsetData: (data: MindsetData) => void;
  language: Language;
  t: (key: TranslationKey, defaultText?: string) => string;
  userProfile: UserProfile | null; // Pass userProfile for export
}

const GoalCard: React.FC<{
  timeframe: GoalTimeframe;
  titleKey: TranslationKey;
  goals: GoalDetail;
  onGoalChange: (timeframe: GoalTimeframe, field: keyof GoalDetail, value: string) => void;
  language: Language;
  t: (key: TranslationKey, defaultText?: string) => string;
}> = ({ timeframe, titleKey, goals, onGoalChange, language, t }) => {
  
  const currentGoals = goals; // Directly use the passed goals for the specific timeframe

  return (
    <div className="p-6 bg-slate-800 rounded-xl shadow-lg border border-slate-700">
      <h4 className="text-xl font-semibold text-blue-400 mb-4">{t(titleKey)}</h4>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">{t('mindset_goal_setting_self_label')}</label>
          <textarea 
            value={currentGoals.self}
            onChange={(e) => onGoalChange(timeframe, 'self', e.target.value)}
            rows={3}
            className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-slate-200 focus:ring-blue-500 focus:border-blue-500"
            placeholder={t('mindset_goal_setting_self_placeholder')} 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">{t('mindset_goal_setting_family_label')}</label>
          <textarea 
            value={currentGoals.family}
            onChange={(e) => onGoalChange(timeframe, 'family', e.target.value)}
            rows={3}
            className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-slate-200 focus:ring-blue-500 focus:border-blue-500"
            placeholder={t('mindset_goal_setting_family_placeholder')}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">{t('mindset_goal_setting_world_label')}</label>
          <textarea 
            value={currentGoals.world}
            onChange={(e) => onGoalChange(timeframe, 'world', e.target.value)}
            rows={3}
            className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-slate-200 focus:ring-blue-500 focus:border-blue-500"
            placeholder={t('mindset_goal_setting_world_placeholder')}
          />
        </div>
      </div>
    </div>
  );
};


const GoalSetting: React.FC<GoalSettingProps> = ({ mindsetData, onUpdateMindsetData, language, t, userProfile }) => {

  const handleGoalChange = (timeframe: GoalTimeframe, field: keyof GoalDetail, value: string) => {
    const updatedMindsetData: MindsetData = {
      ...mindsetData,
      goals: {
        ...mindsetData.goals,
        [timeframe]: {
          ...mindsetData.goals[timeframe],
          [field]: value,
        }
      },
      // Set the date only if it hasn't been set before
      goalsFirstSetDate: mindsetData.goalsFirstSetDate || new Date().toISOString(),
    };
    onUpdateMindsetData(updatedMindsetData);
  };

  const goalTimeframes: { timeframe: GoalTimeframe, titleKey: TranslationKey }[] = [
    { timeframe: '6-month', titleKey: 'mindset_goal_setting_6_month_title' },
    { timeframe: '2-year', titleKey: 'mindset_goal_setting_2_year_title' },
    { timeframe: '5-year', titleKey: 'mindset_goal_setting_5_year_title' },
    { timeframe: '10-year', titleKey: 'mindset_goal_setting_10_year_title' },
  ];

  const handleExportGoals = async () => {
    const { default: jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    const yRef = { value: MARGIN_MM };
    const totalPagesRef = { current: doc.getNumberOfPages() };

    addUserProfileHeader(doc, userProfile, yRef, totalPagesRef, t);

    doc.setFontSize(TITLE_FONT_SIZE);
    doc.setFont('helvetica', 'bold');
    addTextWithPageBreaks(doc, t('pdf_goals_title'), MARGIN_MM, yRef, {}, LINE_HEIGHT_TITLE, totalPagesRef, t);

    doc.setFontSize(TEXT_FONT_SIZE - 2);
    doc.setFont('helvetica', 'normal');
    addTextWithPageBreaks(doc, `${t('exported_on_label')}: ${new Date().toLocaleString()}`, MARGIN_MM, yRef, {}, LINE_HEIGHT_NORMAL, totalPagesRef, t);
    yRef.value += LINE_HEIGHT_NORMAL;

    goalTimeframes.forEach(item => {
        const goalData = mindsetData.goals[item.timeframe];
        doc.setFontSize(SECTION_TITLE_FONT_SIZE);
        doc.setFont('helvetica', 'bold');
        addTextWithPageBreaks(doc, t(item.titleKey), MARGIN_MM, yRef, {}, LINE_HEIGHT_SECTION_TITLE, totalPagesRef, t);
        
        doc.setFontSize(TEXT_FONT_SIZE);
        doc.setFont('helvetica', 'normal');
        
        addTextWithPageBreaks(doc, `${t('mindset_goal_setting_self_label')} ${goalData.self || '-'}`, MARGIN_MM + 2, yRef, {}, LINE_HEIGHT_NORMAL, totalPagesRef, t);
        addTextWithPageBreaks(doc, `${t('mindset_goal_setting_family_label')} ${goalData.family || '-'}`, MARGIN_MM + 2, yRef, {}, LINE_HEIGHT_NORMAL, totalPagesRef, t);
        addTextWithPageBreaks(doc, `${t('mindset_goal_setting_world_label')} ${goalData.world || '-'}`, MARGIN_MM + 2, yRef, {}, LINE_HEIGHT_NORMAL, totalPagesRef, t);
        yRef.value += LINE_HEIGHT_NORMAL;
    });

    if (mindsetData.goalsFirstSetDate) {
        yRef.value += LINE_HEIGHT_NORMAL;
        doc.setFontSize(TEXT_FONT_SIZE);
        doc.setFont('helvetica', 'bold');
        const promiseDate = new Date(mindsetData.goalsFirstSetDate).toLocaleDateString(language === 'am' ? 'am-ET' : 'en-US', {
            year: 'numeric', month: 'long', day: 'numeric',
        });
        addTextWithPageBreaks(doc, `${t('goal_promise_cast_on')}: ${promiseDate}`, MARGIN_MM, yRef, {}, LINE_HEIGHT_NORMAL, totalPagesRef, t);
    }
    
    // Finalize footers
    for (let i = 1; i <= totalPagesRef.current; i++) {
        doc.setPage(i);
        addPageFooter(doc, i, totalPagesRef.current, t);
    }
    doc.save(t('pdf_goals_title', 'my_goals').toLowerCase().replace(/\s/g, '_') + '.pdf');
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-6 p-1">
        <h3 className="text-2xl font-semibold text-blue-400">{t('mindset_goal_setting_title')}</h3>
        <Button onClick={handleExportGoals} variant="outline">{t('export_goals_button')}</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goalTimeframes.map(item => (
          <GoalCard
            key={item.timeframe}
            timeframe={item.timeframe}
            titleKey={item.titleKey}
            goals={mindsetData.goals[item.timeframe]}
            onGoalChange={handleGoalChange}
            language={language}
            t={t}
          />
        ))}
      </div>
      
      {mindsetData.goalsFirstSetDate && (
        <div className="mt-12 text-center">
            <p className="text-slate-400 text-sm font-medium">{t('goal_promise_cast_on')}:</p>
            <p className="text-slate-300 text-base">{new Date(mindsetData.goalsFirstSetDate).toLocaleDateString(language === 'am' ? 'am-ET' : 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            })}</p>
        </div>
      )}
    </div>
  );
};

export default GoalSetting;