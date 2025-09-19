import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { MindsetData, Language, AssessmentQuestion, AssessmentCategory } from '../../types';
import { TranslationKey } from '../../types';
import { PERSONALITY_QUESTIONS, BUSINESS_ACUMEN_QUESTIONS, STARTUP_KNOWLEDGE_QUESTIONS } from '../../constants';


interface AssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessmentType: AssessmentCategory;
  mindsetData: MindsetData;
  onUpdateMindsetData: (data: MindsetData) => void;
  language: Language;
  t: (key: TranslationKey, defaultText?: string) => string;
}

const scaleLabelMap: Record<string, TranslationKey[]> = {
    p1: [
        'q_p1_opt_very_uncomfortable', 'q_p1_opt_uncomfortable', 'q_p1_opt_neutral',
        'q_p1_opt_comfortable', 'q_p1_opt_very_comfortable'
    ],
    p4: [
        'q_p4_opt_not_at_all', 'q_p4_opt_slightly', 'q_p4_opt_moderately',
        'q_p4_opt_very', 'q_p4_opt_extremely'
    ],
    ba3: [
        'q_ba3_opt_very_uncomfortable', 'q_ba3_opt_uncomfortable', 'q_ba3_opt_neutral',
        'q_ba3_opt_comfortable', 'q_ba3_opt_very_comfortable'
    ],
    sk2: [
        'q_sk2_opt_not_at_all', 'q_sk2_opt_slightly', 'q_sk2_opt_moderately',
        'q_sk2_opt_very', 'q_sk2_opt_expert'
    ],
};

const AssessmentModal: React.FC<AssessmentModalProps> = ({
  isOpen,
  onClose,
  assessmentType,
  mindsetData,
  onUpdateMindsetData,
  language,
  t,
}) => {
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});

  useEffect(() => {
    if (isOpen) {
      let fetchedQuestions: AssessmentQuestion[] = [];
      if (assessmentType === 'personality') {
        fetchedQuestions = PERSONALITY_QUESTIONS;
      } else if (assessmentType === 'businessAcumen') {
        fetchedQuestions = BUSINESS_ACUMEN_QUESTIONS;
      } else if (assessmentType === 'startupKnowledge') {
        fetchedQuestions = STARTUP_KNOWLEDGE_QUESTIONS;
      }
      setQuestions(fetchedQuestions.slice(0, 10)); // Ensure max 10 questions
      setCurrentQuestionIndex(0);
      // Load existing answers for this assessment type or initialize empty
      setAnswers(mindsetData.assessmentAnswers[assessmentType] || {});
    }
  }, [isOpen, assessmentType, mindsetData.assessmentAnswers]);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  const handleAnswerChange = (questionId: string, answer: string | number) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    const updatedAnswers = { ...mindsetData.assessmentAnswers, [assessmentType]: answers };
    const updatedStatus = { ...mindsetData.assessmentStatus, [assessmentType]: 'completed' as const };
    onUpdateMindsetData({ ...mindsetData, assessmentAnswers: updatedAnswers, assessmentStatus: updatedStatus });
    onClose();
  };
  
  const progressPercent = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;

  let modalTitleKey: TranslationKey = 'mindset_assessment_modal_title_personality';
  if (assessmentType === 'businessAcumen') modalTitleKey = 'mindset_assessment_modal_title_acumen';
  if (assessmentType === 'startupKnowledge') modalTitleKey = 'mindset_assessment_modal_title_knowledge';

  const scaleLabels = currentQuestion ? scaleLabelMap[currentQuestion.id] : undefined;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t(modalTitleKey)} size="xl">
      {totalQuestions === 0 && !currentQuestion ? <p className="text-slate-300">{t('coming_soon_message')}</p> : (
        <div className="space-y-6">
          <div className="mb-4">
            <div className="flex justify-between text-sm text-slate-300 mb-1">
              <span>{t('mindset_assessment_progress_label')}</span>
              <span>
                {t('mindset_assessment_question_count_label', `Question ${currentQuestionIndex + 1} of ${totalQuestions}`)
                    .replace('{current}', (currentQuestionIndex + 1).toString())
                    .replace('{total}', totalQuestions.toString())}
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2.5">
              <div className="bg-blue-500 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
            </div>
             <p className="text-xs text-slate-400 mt-1 text-right">
                {t('mindset_assessment_questions_remaining_label', `${totalQuestions - (currentQuestionIndex + 1)} questions remaining`)
                    .replace('{remaining}', Math.max(0, totalQuestions - (currentQuestionIndex + 1)).toString())}
            </p>
          </div>

          {currentQuestion && (
            <div className="p-4 bg-slate-700/50 rounded-lg">
              <p className="text-lg font-medium text-slate-100 mb-4">{t(currentQuestion.textKey)}</p>
              
              {currentQuestion.type === 'multiple-choice-scale' && currentQuestion.scaleMin && currentQuestion.scaleMax && (
                  <div className="flex flex-col sm:flex-row justify-around items-stretch mt-2 space-y-4 sm:space-y-0 sm:space-x-2">
                      {Array.from({ length: (currentQuestion.scaleMax - currentQuestion.scaleMin + 1) }, (_, i) => currentQuestion.scaleMin! + i).map(val => (
                          <label key={val} className="flex-1 min-w-[5rem] flex flex-col items-center p-3 rounded-md cursor-pointer hover:bg-slate-600 transition-colors border border-transparent has-[:checked]:bg-slate-600 has-[:checked]:border-blue-500">
                               <input 
                                  type="radio" 
                                  name={currentQuestion.id} 
                                  value={val}
                                  checked={answers[currentQuestion.id] === val}
                                  onChange={() => handleAnswerChange(currentQuestion.id, val)}
                                  className="form-radio h-5 w-5 text-blue-500 bg-slate-700 border-slate-500 focus:ring-blue-500"
                                />
                                {scaleLabels ? (
                                    <span className="text-xs text-center text-slate-300 mt-2">{t(scaleLabels[val - 1])}</span>
                                ) : (
                                    <span className="text-sm text-slate-200 mt-1">{val}</span>
                                )}
                          </label>
                      ))}
                  </div>
              )}

              {(currentQuestion.type === 'multiple-choice-options' || currentQuestion.type === 'scenario-options') && currentQuestion.options && (
                <div className="space-y-3 mt-2">
                    {currentQuestion.options.map(option => (
                        <label key={option.value} className="flex items-center space-x-3 p-3 bg-slate-600/50 rounded-md hover:bg-slate-600 transition-colors cursor-pointer border border-transparent has-[:checked]:bg-slate-600 has-[:checked]:border-blue-500">
                            <input 
                                type="radio" 
                                name={currentQuestion.id} 
                                value={option.value}
                                checked={answers[currentQuestion.id] === option.value}
                                onChange={() => handleAnswerChange(currentQuestion.id, option.value)}
                                className="form-radio h-5 w-5 text-blue-500 bg-slate-700 border-slate-500 focus:ring-blue-500"
                            />
                            <span className="text-slate-200 text-sm">{t(option.labelKey)}</span>
                        </label>
                    ))}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between items-center pt-4 border-t border-slate-700">
            <Button onClick={handlePrev} disabled={currentQuestionIndex === 0} variant="outline">
              {t('mindset_assessment_prev_button')}
            </Button>
            {currentQuestionIndex < totalQuestions - 1 ? (
              <Button onClick={handleNext} variant="primary" disabled={answers[currentQuestion?.id] === undefined}>
                {t('mindset_assessment_next_button')}
              </Button>
            ) : (
              <Button onClick={handleSubmit} variant="primary" className="bg-green-600 hover:bg-green-500" disabled={answers[currentQuestion?.id] === undefined}>
                {t('mindset_assessment_submit_button')}
              </Button>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default AssessmentModal;
