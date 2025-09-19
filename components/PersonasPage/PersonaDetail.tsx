import React, { useState, useEffect } from 'react';
import { Persona, JobToBeDone, Language, TranslationKey, Gender, MaritalStatus, Education } from '../../types';
import { Button } from '../common/Button';
import { RangeSlider } from '../common/RangeSlider';
import { JobToBeDoneModal } from './JobToBeDoneModal';

interface PersonaDetailProps {
  persona: Persona;
  onSave: (updatedPersona: Persona) => void;
  onClose: () => void;
  language: Language;
  t: (key: TranslationKey, defaultText?: string) => string;
}

export const PersonaDetail: React.FC<PersonaDetailProps> = ({ persona, onSave, onClose, language, t }) => {
  const [localPersona, setLocalPersona] = useState<Persona>(persona);
  const [isJtbdModalOpen, setIsJtbdModalOpen] = useState(false);
  const [editingJtbd, setEditingJtbd] = useState<JobToBeDone | null>(null);

  useEffect(() => {
    setLocalPersona(persona);
  }, [persona]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setLocalPersona({ ...localPersona, [e.target.name]: e.target.value });
  };
  
  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalPersona({ ...localPersona, age: value === '' ? '' : parseInt(value, 10) });
  };

  const handleSliderChange = (
    category: 'personality' | 'traits',
    field: keyof Persona['personality'] | keyof Persona['traits'],
    value: number
  ) => {
    setLocalPersona({
      ...localPersona,
      [category]: {
        ...localPersona[category],
        [field]: value
      }
    });
  };
  
  const handleSaveJtbd = (job: JobToBeDone) => {
    const existingIndex = localPersona.jobsToBeDone.findIndex(j => j.id === job.id);
    let updatedJobs: JobToBeDone[];
    if (existingIndex > -1) {
      updatedJobs = localPersona.jobsToBeDone.map(j => j.id === job.id ? job : j);
    } else {
      updatedJobs = [...localPersona.jobsToBeDone, job];
    }
    setLocalPersona({ ...localPersona, jobsToBeDone: updatedJobs });
    setIsJtbdModalOpen(false);
    setEditingJtbd(null);
  };
  
  const handleDeleteJtbd = (jobId: string) => {
     if (window.confirm(t('delete_button') + `?`)) {
        const updatedJobs = localPersona.jobsToBeDone.filter(j => j.id !== jobId);
        setLocalPersona({ ...localPersona, jobsToBeDone: updatedJobs });
     }
  };

  const openJtbdModal = (job: JobToBeDone | null) => {
    setEditingJtbd(job);
    setIsJtbdModalOpen(true);
  };
  
  const genderOptions: { value: Gender; labelKey: TranslationKey }[] = [ { value: '', labelKey: 'persona_gender_select'}, { value: 'Male', labelKey: 'persona_gender_male'}, { value: 'Female', labelKey: 'persona_gender_female'}, { value: 'Other', labelKey: 'persona_gender_other'} ];
  const maritalStatusOptions: { value: MaritalStatus; labelKey: TranslationKey }[] = [ { value: '', labelKey: 'persona_marital_status_select'}, { value: 'Single', labelKey: 'persona_marital_status_single'}, { value: 'Married', labelKey: 'persona_marital_status_married'}, { value: 'In a relationship', labelKey: 'persona_marital_status_relationship'}, { value: 'Divorced', labelKey: 'persona_marital_status_divorced'}, { value: 'Widowed', labelKey: 'persona_marital_status_widowed'} ];
  const educationOptions: { value: Education; labelKey: TranslationKey }[] = [ { value: '', labelKey: 'persona_education_select'}, { value: 'High School', labelKey: 'persona_education_high_school'}, { value: "Bachelor's Degree", labelKey: 'persona_education_bachelors'}, { value: "Master's Degree", labelKey: 'persona_education_masters'}, { value: 'PhD', labelKey: 'persona_education_phd'}, { value: 'Other', labelKey: 'persona_education_other'} ];

  const inputBaseClasses = "w-full p-2 bg-slate-700 border border-slate-600 rounded-md text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-slate-400 text-sm";
  const labelBaseClasses = "block text-sm font-medium text-slate-300 mb-1";
  const sectionClasses = "p-4 bg-slate-800 rounded-xl shadow-lg border border-slate-700";

  return (
    <div className="space-y-6">
      {/* Demographics */}
      <div className={sectionClasses}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div><label className={labelBaseClasses}>{t('persona_name_label')}</label><input type="text" name="name" value={localPersona.name} onChange={handleChange} className={inputBaseClasses} placeholder={t('persona_name_placeholder')} /></div>
          <div><label className={labelBaseClasses}>{t('persona_profession_label')}</label><input type="text" name="profession" value={localPersona.profession} onChange={handleChange} className={inputBaseClasses} placeholder={t('persona_profession_placeholder')} /></div>
          <div><label className={labelBaseClasses}>{t('persona_gender_label')}</label><select name="gender" value={localPersona.gender} onChange={handleChange} className={inputBaseClasses}>{genderOptions.map(opt => <option key={opt.value} value={opt.value}>{t(opt.labelKey)}</option>)}</select></div>
          <div><label className={labelBaseClasses}>{t('persona_age_label')}</label><input type="number" name="age" value={localPersona.age} onChange={handleAgeChange} className={inputBaseClasses} placeholder={t('persona_age_placeholder')} /></div>
          <div><label className={labelBaseClasses}>{t('persona_location_label')}</label><input type="text" name="location" value={localPersona.location} onChange={handleChange} className={inputBaseClasses} placeholder={t('persona_location_placeholder')} /></div>
          <div><label className={labelBaseClasses}>{t('persona_marital_status_label')}</label><select name="maritalStatus" value={localPersona.maritalStatus} onChange={handleChange} className={inputBaseClasses}>{maritalStatusOptions.map(opt => <option key={opt.value} value={opt.value}>{t(opt.labelKey)}</option>)}</select></div>
          <div className="lg:col-span-3"><label className={labelBaseClasses}>{t('persona_education_label')}</label><select name="education" value={localPersona.education} onChange={handleChange} className={inputBaseClasses}>{educationOptions.map(opt => <option key={opt.value} value={opt.value}>{t(opt.labelKey)}</option>)}</select></div>
        </div>
      </div>
      
      {/* Bio */}
      <div className={sectionClasses}><label className={labelBaseClasses}>{t('persona_bio_label')}</label><textarea name="bio" value={localPersona.bio} onChange={handleChange} rows={4} className={inputBaseClasses} placeholder={t('persona_bio_placeholder')} /></div>

      {/* Personality & Traits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={sectionClasses}>
          <h4 className="text-lg font-semibold text-blue-400 mb-4">{t('persona_personality_title')}</h4>
          <div className="space-y-4">
            <RangeSlider leftLabel={t('personality_analytical')} rightLabel={t('personality_creative')} value={localPersona.personality.analyticalCreative} onChange={(v) => handleSliderChange('personality', 'analyticalCreative', v)} />
            <RangeSlider leftLabel={t('personality_busy')} rightLabel={t('personality_time_rich')} value={localPersona.personality.busyTimeRich} onChange={(v) => handleSliderChange('personality', 'busyTimeRich', v)} />
            <RangeSlider leftLabel={t('personality_messy')} rightLabel={t('personality_organized')} value={localPersona.personality.messyOrganized} onChange={(v) => handleSliderChange('personality', 'messyOrganized', v)} />
            <RangeSlider leftLabel={t('personality_independent')} rightLabel={t('personality_team_player')} value={localPersona.personality.independentTeamPlayer} onChange={(v) => handleSliderChange('personality', 'independentTeamPlayer', v)} />
          </div>
        </div>
        <div className={sectionClasses}>
          <h4 className="text-lg font-semibold text-blue-400 mb-4">{t('persona_traits_title')}</h4>
          <div className="space-y-4">
            <RangeSlider leftLabel="0" rightLabel="100" value={localPersona.traits.buyingAuthority} onChange={(v) => handleSliderChange('traits', 'buyingAuthority', v)} /><span className="text-xs text-center block -mt-2 text-slate-400">{t('traits_buying_authority')}</span>
            <RangeSlider leftLabel="0" rightLabel="100" value={localPersona.traits.technical} onChange={(v) => handleSliderChange('traits', 'technical', v)} /><span className="text-xs text-center block -mt-2 text-slate-400">{t('traits_technical')}</span>
            <RangeSlider leftLabel="0" rightLabel="100" value={localPersona.traits.socialMedia} onChange={(v) => handleSliderChange('traits', 'socialMedia', v)} /><span className="text-xs text-center block -mt-2 text-slate-400">{t('traits_social_media')}</span>
            <RangeSlider leftLabel="0" rightLabel="100" value={localPersona.traits.selfHelping} onChange={(v) => handleSliderChange('traits', 'selfHelping', v)} /><span className="text-xs text-center block -mt-2 text-slate-400">{t('traits_self_helping')}</span>
          </div>
        </div>
      </div>
      
      {/* Goals, Frustrations, etc. */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={sectionClasses}><label className={labelBaseClasses}>{t('persona_goals_label')}</label><textarea name="goals" value={localPersona.goals} onChange={handleChange} rows={4} className={inputBaseClasses} placeholder={t('persona_goals_placeholder')} /></div>
        <div className={sectionClasses}><label className={labelBaseClasses}>{t('persona_frustrations_label')}</label><textarea name="frustrations" value={localPersona.frustrations} onChange={handleChange} rows={4} className={inputBaseClasses} placeholder={t('persona_frustrations_placeholder')} /></div>
        <div className={sectionClasses}><label className={labelBaseClasses}>{t('persona_likes_label')}</label><textarea name="likes" value={localPersona.likes} onChange={handleChange} rows={3} className={inputBaseClasses} placeholder={t('persona_likes_placeholder')} /></div>
        <div className={sectionClasses}><label className={labelBaseClasses}>{t('persona_dislikes_label')}</label><textarea name="dislikes" value={localPersona.dislikes} onChange={handleChange} rows={3} className={inputBaseClasses} placeholder={t('persona_dislikes_placeholder')} /></div>
        <div className={sectionClasses}><label className={labelBaseClasses}>{t('persona_skills_label')}</label><textarea name="skills" value={localPersona.skills} onChange={handleChange} rows={3} className={inputBaseClasses} placeholder={t('persona_skills_placeholder')} /></div>
      </div>

      {/* Jobs To Be Done */}
      <div className={sectionClasses}>
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold text-blue-400">{t('persona_jobs_to_be_done_title')}</h4>
          <Button variant="secondary" size="sm" onClick={() => openJtbdModal(null)}>{t('jtbd_add_new_button')}</Button>
        </div>
        <div className="space-y-3">
          {localPersona.jobsToBeDone.length === 0 ? (
            <p className="text-slate-500 italic text-center py-4">{t('jtbd_no_jobs_placeholder')}</p>
          ) : (
            localPersona.jobsToBeDone.map(job => (
              <div key={job.id} className="p-3 bg-slate-700 rounded-md flex justify-between items-center">
                <span className="text-slate-200 font-medium text-sm">{job.title}</span>
                <div className="space-x-2">
                  <Button variant="outline" size="sm" onClick={() => openJtbdModal(job)}>{t('jtbd_edit_button')}</Button>
                  <Button variant="danger" size="sm" onClick={() => handleDeleteJtbd(job.id)}>{t('delete_button')}</Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
       <div className="flex justify-end pt-6 mt-4 border-t border-slate-700 space-x-4">
          <Button type="button" variant="outline" onClick={onClose}>{t('cancel_button')}</Button>
          <Button type="button" variant="primary" onClick={() => onSave(localPersona)}>{t('save_and_close_button')}</Button>
        </div>

      {isJtbdModalOpen && (
        <JobToBeDoneModal
            isOpen={isJtbdModalOpen}
            onClose={() => setIsJtbdModalOpen(false)}
            onSave={handleSaveJtbd}
            jobData={editingJtbd}
            language={language}
            t={t}
        />
      )}
    </div>
  );
};
