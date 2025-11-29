import React, { useState, useEffect } from 'react';
import {
  CopywritingData,
  MarketingPost,
  Language,
  UserProfile,
  CanvasData,
  MarketResearchData,
  MarketingPostStatus,
  CanvasSection,
  TranslationKey
} from '../../types';
import { Button } from '../common/Button';
import { MarketingPostModal } from './MarketingPostModal';
import { AiMarketingModal } from './AiMarketingModal';
import { generateMarketingPlan } from '../../services/geminiService';
import { GENERIC_ERROR_MESSAGE } from '../../constants';
import { addUserProfileHeader, addPageFooter, addTextWithPageBreaks, MARGIN_MM, LINE_HEIGHT_NORMAL, TITLE_FONT_SIZE, LINE_HEIGHT_TITLE, SECTION_TITLE_FONT_SIZE, LINE_HEIGHT_SECTION_TITLE, TEXT_FONT_SIZE } from '../../utils/pdfUtils';


interface MarketingPlannerProps {
  copywritingData: CopywritingData;
  onUpdateData: (data: CopywritingData) => void;
  strategyData: Partial<CanvasData>;
  researchData: MarketResearchData;
  language: Language;
  t: (key: TranslationKey, defaultText?: string) => string;
  userProfile: UserProfile | null;
  openAiModalFlag: boolean;
  setOpenAiModalFlag: (isOpen: boolean) => void;
}

// ... (Keep existing Date Utility Functions: getWeekStartDate, getWeekDays, isSameDay, formatDateToDateTimeLocalInput)
const getWeekStartDate = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

const getWeekDays = (startDate: Date): Date[] => {
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const nextDay = new Date(startDate);
    nextDay.setDate(startDate.getDate() + i);
    days.push(nextDay);
  }
  return days;
};

const isSameDay = (date1: Date | string, date2: Date | string): boolean => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
};

const formatDateToDateTimeLocalInput = (date: Date | string): string => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = (`0${d.getMonth() + 1}`).slice(-2);
  const day = (`0${d.getDate()}`).slice(-2);
  let hours = (`0${d.getHours()}`).slice(-2);
  let minutes = (`0${d.getMinutes()}`).slice(-2);

  if (typeof date === 'string' && date.length === 10) {
    hours = '09'; // Default to 9 AM for new calendar entries
    minutes = '00';
  }

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};


export const MarketingPlanner: React.FC<MarketingPlannerProps> = ({
  copywritingData,
  onUpdateData,
  strategyData,
  researchData,
  language,
  t,
  userProfile,
  openAiModalFlag,
  setOpenAiModalFlag
}) => {
  // ... (Keep existing state and handlers: handleOpenPostModal, handleSavePost, handleDeletePost, togglePostStatus, handleAiGeneratePlan, changeWeek, getDayNameShort, getMonthName, getFullDayAndDate)
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<MarketingPost | null>(null);
  const [currentDisplayDate, setCurrentDisplayDate] = useState(new Date());
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const weekStartDate = getWeekStartDate(currentDisplayDate);
  const currentWeekDays = getWeekDays(weekStartDate);

  const handleOpenPostModal = (post: MarketingPost | null = null, dateForNewPost?: Date) => {
    if (post) {
      setEditingPost(post);
    } else if (dateForNewPost) {
      const prefilledPost: Partial<MarketingPost> = {
        scheduledDate: formatDateToDateTimeLocalInput(dateForNewPost.toISOString().split('T')[0] + 'T09:00'),
        status: 'todo',
        title: '', content: '', platform: '', visualRecommendation: '', notes: ''
      };
      setEditingPost(prefilledPost as MarketingPost);
    } else {
      setEditingPost({
        id: '',
        scheduledDate: formatDateToDateTimeLocalInput(new Date().toISOString()),
        status: 'todo',
        title: '', content: '', platform: '', visualRecommendation: '', notes: ''
      } as MarketingPost);
    }
    setIsPostModalOpen(true);
  };

  const handleSavePost = (postToSave: MarketingPost) => {
    let updatedPosts: MarketingPost[];
    if (editingPost && postToSave.id) {
      updatedPosts = copywritingData.marketingPosts.map(p => p.id === postToSave.id ? postToSave : p);
    } else {
      updatedPosts = [...copywritingData.marketingPosts, { ...postToSave, id: `mpost-${Date.now()}` }];
    }
    onUpdateData({ ...copywritingData, marketingPosts: updatedPosts });
    setIsPostModalOpen(false);
    setEditingPost(null);
  };

  const handleDeletePost = (postId: string) => {
    if (window.confirm(t('delete_button') + ` "${copywritingData.marketingPosts.find(p => p.id === postId)?.title || 'post'}"?`)) {
      const updatedPosts = copywritingData.marketingPosts.filter(p => p.id !== postId);
      onUpdateData({ ...copywritingData, marketingPosts: updatedPosts });
    }
  };

  const togglePostStatus = (postId: string) => {
    const updatedPosts = copywritingData.marketingPosts.map(p => {
      if (p.id === postId) {
        return { ...p, status: p.status === 'done' ? 'todo' : 'done' as MarketingPostStatus };
      }
      return p;
    });
    onUpdateData({ ...copywritingData, marketingPosts: updatedPosts });
  };

  const handleAiGeneratePlan = async (inputs: { campaignGoal: string; targetPlatforms: string[]; contentTone: string; duration: string }) => {
    if (!strategyData || Object.keys(strategyData).filter(k => strategyData[k as CanvasSection]?.trim()).length === 0) {
      setError(t('mra_questions_ai_requires_canvas_note'));
      return;
    }
    setIsLoadingAi(true);
    setError(null);
    try {
      const currentWeekStartDate = getWeekStartDate(currentDisplayDate);
      const referenceDateString = `${currentWeekStartDate.getFullYear()}-${('0' + (currentWeekStartDate.getMonth() + 1)).slice(-2)}-${('0' + currentWeekStartDate.getDate()).slice(-2)}`;

      const newPosts = await generateMarketingPlan(
        strategyData,
        researchData,
        { ...inputs, referenceWeekStartDate: referenceDateString },
        language
      );

      if (newPosts && newPosts.length > 0) {
        onUpdateData({ ...copywritingData, marketingPosts: [...copywritingData.marketingPosts, ...newPosts] });
        setOpenAiModalFlag(false);
      } else {
        setError(t('error_ai_failed_generic', "AI could not generate a marketing plan."));
      }
    } catch (e) {
      console.error(e);
      setError(t('error_ai_failed_generic'));
    } finally {
      setIsLoadingAi(false);
    }
  };

  const changeWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDisplayDate);
    newDate.setDate(newDate.getDate() + (direction === 'prev' ? -7 : 7));
    setCurrentDisplayDate(newDate);
  };

  const shortDayKeys: TranslationKey[] = ['day_mon_short', 'day_tue_short', 'day_wed_short', 'day_thu_short', 'day_fri_short', 'day_sat_short', 'day_sun_short'];
  const monthKeys: TranslationKey[] = ['month_jan', 'month_feb', 'month_mar', 'month_apr', 'month_may', 'month_jun', 'month_jul', 'month_aug', 'month_sep', 'month_oct', 'month_nov', 'month_dec'];

  const getDayNameShort = (date: Date, lang: Language, translator: Function): string => {
    let dayIndex = date.getDay();
    dayIndex = (dayIndex === 0) ? 6 : dayIndex - 1;
    return translator(shortDayKeys[dayIndex]);
  };

  const getMonthName = (date: Date, lang: Language, translator: Function): string => {
    const monthIndex = date.getMonth();
    return translator(monthKeys[monthIndex]);
  }

  const getFullDayAndDate = (date: Date, lang: Language): string => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
    return new Intl.DateTimeFormat(lang === 'am' ? 'am-ET' : 'en-US', options).format(date);
  };

  const handleExportCalendar = async () => {
    const { default: jsPDF } = await import('jspdf');
    const autoTableModule = await import('jspdf-autotable');
    const autoTable = autoTableModule.default;

    const doc = new jsPDF();
    const yRef = { value: MARGIN_MM };
    let totalPagesRef = { current: doc.getNumberOfPages() };

    addUserProfileHeader(doc, userProfile, yRef, totalPagesRef, t);

    doc.setFontSize(TITLE_FONT_SIZE);
    doc.setFont("helvetica", "bold");
    addTextWithPageBreaks(doc, t('pdf_marketing_plan_title'), MARGIN_MM, yRef, {}, LINE_HEIGHT_TITLE, totalPagesRef, t);
    yRef.value += LINE_HEIGHT_NORMAL;

    doc.setFontSize(TEXT_FONT_SIZE);
    doc.setFont("helvetica", "normal");

    const postsHead = [[t('pdf_marketing_post_title'), t('pdf_platform_label'), t('pdf_scheduled_date_label'), t('pdf_status_label')]];
    const postsBody = copywritingData.marketingPosts.map(post => [
      post.title,
      post.platform,
      new Date(post.scheduledDate).toLocaleDateString(language === 'am' ? 'am-ET' : 'en-US'),
      t(`marketing_post_status_${post.status}` as TranslationKey)
    ]);

    if (postsBody.length > 0) {
      autoTable(doc, {
        startY: yRef.value,
        head: postsHead,
        body: postsBody,
        theme: 'grid',
        headStyles: { fillColor: [17, 138, 178] },
        styles: { fontSize: 8 }
      });
    } else {
      addTextWithPageBreaks(doc, t('no_content_yet_placeholder_pdf'), MARGIN_MM + 2, yRef, {}, LINE_HEIGHT_NORMAL, totalPagesRef, t);
    }

    addPageFooter(doc, doc.getNumberOfPages(), totalPagesRef.current, t);
    doc.save(`${t('pdf_marketing_plan_title', 'marketing_plan').toLowerCase().replace(/\s/g, '_')}.pdf`);
  };

  return (
    <div className="space-y-8">
      <div className="p-6 bg-slate-800 rounded-xl shadow-xl border border-slate-700">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h3 className="text-xl font-semibold text-blue-400">{t('copywriting_marketing_title')}</h3>
          <div className="flex items-center space-x-3">
            <Button onClick={handleExportCalendar} variant="outline" size="sm" leftIcon={<DownloadIcon className="h-4 w-4" />}>{t('export_marketing_plan_button')}</Button>
            <div className="flex items-center space-x-2">
              <Button onClick={() => changeWeek('prev')} size="sm" variant="outline" aria-label={t('calendar_prev_week')}>&lt; {t('calendar_prev_week')}</Button>
              <span className="text-lg font-medium text-slate-200 whitespace-nowrap">
                {getMonthName(weekStartDate, language, t)} {weekStartDate.getFullYear()}
              </span>
              <Button onClick={() => changeWeek('next')} size="sm" variant="outline" aria-label={t('calendar_next_week')}>{t('calendar_next_week')} &gt;</Button>
            </div>
          </div>
        </div>

        {error && <p className="text-red-400 bg-red-900/30 p-3 rounded-lg mb-4 text-sm">{error}</p>}

        {/* ... (Rest of the Calendar Grid code remains same) ... */}
        <div className="hidden md:grid md:grid-cols-7 border-t border-l border-slate-700 bg-slate-900/50 text-center text-sm font-medium text-slate-400">
          {currentWeekDays.map(day => (
            <div key={`header-${day.toISOString()}`} className="py-3 border-r border-b border-slate-700">
              {getDayNameShort(day, language, t)}
            </div>
          ))}
        </div>

        <div className="md:grid md:grid-cols-7 md:border-l md:border-gray-700 flex flex-col">
          {currentWeekDays.map(day => (
            <div
              key={day.toISOString().split('T')[0]}
              className="md:border-r md:border-b border-slate-700 min-h-[180px] flex flex-col relative bg-slate-800 md:bg-transparent first:border-t-0 border-t"
            >
              <div className="flex justify-between items-center p-2 border-b border-slate-700 bg-slate-900/30 md:bg-transparent md:border-b-slate-700">
                <span className={`text-sm font-medium ${isSameDay(day, new Date()) ? 'text-blue-400 font-bold' : 'text-slate-300'}`}>
                  <span className="md:hidden">{getFullDayAndDate(day, language)}</span>
                  <span className="hidden md:inline">{day.getDate()}</span>
                </span>
                <Button
                  size="sm"
                  className="p-1.5 w-7 h-7 !rounded-full bg-slate-700 hover:bg-slate-600 text-slate-400 hover:text-slate-200 border border-slate-600 focus:ring-slate-500"
                  onClick={() => handleOpenPostModal(null, day)}
                  title={t('calendar_add_post_tooltip')}
                  aria-label={`${t('calendar_add_post_tooltip')} for ${getFullDayAndDate(day, language)}`}
                >
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>

              <div className="p-2 space-y-2 flex-grow overflow-y-auto max-h-[200px] sm:max-h-[280px]">
                {copywritingData.marketingPosts
                  .filter(post => isSameDay(new Date(post.scheduledDate), day))
                  .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
                  .map(post => (
                    <div
                      key={post.id}
                      className={`p-2 rounded-md text-xs cursor-pointer hover:shadow-lg transition-all duration-150 ease-in-out border
                            ${post.status === 'done'
                          ? 'bg-green-700/30 border-green-600/50 text-green-300 hover:bg-green-700/40'
                          : 'bg-blue-700/30 border-blue-600/50 text-blue-300 hover:bg-blue-700/40'
                        }`}
                      onClick={() => handleOpenPostModal(post)}
                      title={`${post.title} - ${new Date(post.scheduledDate).toLocaleTimeString(language === 'am' ? 'am-ET' : 'en-US', { hour: '2-digit', minute: '2-digit' })}`}
                    >
                      <p className="font-semibold truncate text-slate-100">{post.title}</p>
                      <p className="text-slate-400 text-[0.7rem] truncate">{post.platform}</p>
                      <div className="flex justify-end space-x-1.5 mt-1.5">
                        <button
                          onClick={(e) => { e.stopPropagation(); togglePostStatus(post.id); }}
                          title={post.status === 'done' ? t('mark_as_todo_button') : t('mark_as_done_button')}
                          className={`p-1 rounded-full ${post.status === 'done' ? 'hover:bg-yellow-600/30' : 'hover:bg-green-600/30'}`}
                        >
                          {post.status === 'done' ? <UndoIcon className="h-3.5 w-3.5 text-yellow-400" /> : <CheckCircleIcon className="h-3.5 w-3.5 text-green-400" />}
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeletePost(post.id); }}
                          title={t('delete_button')}
                          className="p-1 rounded-full hover:bg-red-600/30"
                        >
                          <TrashIcon className="h-3.5 w-3.5 text-red-400" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {isPostModalOpen && (
        <MarketingPostModal
          isOpen={isPostModalOpen}
          onClose={() => { setIsPostModalOpen(false); setEditingPost(null); }}
          onSave={handleSavePost}
          postData={editingPost}
          language={language}
          t={t}
        />
      )}

      {openAiModalFlag && (
        <AiMarketingModal
          isOpen={openAiModalFlag}
          onClose={() => setOpenAiModalFlag(false)}
          onGenerate={handleAiGeneratePlan}
          isLoading={isLoadingAi}
          language={language}
          t={t}
        />
      )}
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
const CheckCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
  </svg>
);
const UndoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M7.793 2.232a.75.75 0 011.06 0l3.5 3.5a.75.75 0 01-1.06 1.06L10 5.56v5.94a.75.75 0 01-1.5 0V5.56l-1.217 1.233a.75.75 0 01-1.061-1.06l3.5-3.5zM5.5 13.75a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM10 18a8 8 0 100-16 8 8 0 000 16z" clipRule="evenodd" />
  </svg>
);
const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);