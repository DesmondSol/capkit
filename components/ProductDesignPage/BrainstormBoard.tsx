import React, { useState, useRef, useEffect } from 'react';
import { ProductDesignData, BrainstormIdea, TranslationKey } from '../../types';
import { Button } from '../common/Button';

interface BrainstormBoardProps {
  productDesignData: ProductDesignData;
  onUpdateData: (data: ProductDesignData) => void;
  t: (key: TranslationKey, defaultText?: string) => string;
}

const NOTE_COLORS = [
  'bg-yellow-200 text-yellow-800',
  'bg-blue-200 text-blue-800',
  'bg-green-200 text-green-800',
  'bg-pink-200 text-pink-800',
  'bg-purple-200 text-purple-800',
];

const getRandomColor = () => NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)];

export const BrainstormBoard: React.FC<BrainstormBoardProps> = ({ productDesignData, onUpdateData, t }) => {
  const ideas = productDesignData.brainstormIdeas || [];
  const editTimeoutRef = useRef<number | null>(null);

  const addNewIdea = () => {
    const newIdea: BrainstormIdea = {
      id: `idea-${Date.now()}`,
      content: '',
      color: getRandomColor(),
    };
    onUpdateData({ ...productDesignData, brainstormIdeas: [...ideas, newIdea] });
  };

  const deleteIdea = (id: string) => {
    const updatedIdeas = ideas.filter(idea => idea.id !== id);
    onUpdateData({ ...productDesignData, brainstormIdeas: updatedIdeas });
  };
  
  const updateIdeaContent = (id: string, newContent: string) => {
    if (editTimeoutRef.current) {
        clearTimeout(editTimeoutRef.current);
    }
    
    // Optimistic UI update
    const updatedIdeas = ideas.map(idea => (idea.id === id ? { ...idea, content: newContent } : idea));
    onUpdateData({ ...productDesignData, brainstormIdeas: updatedIdeas });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-start">
        <Button onClick={addNewIdea} variant="primary" leftIcon={<PlusIcon className="h-5 w-5" />}>
          {t('brainstorm_add_idea_button')}
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {ideas.map((idea, index) => (
          <div
            key={idea.id}
            className={`${idea.color} rounded-lg p-4 shadow-lg h-56 flex flex-col transition-transform duration-200 hover:scale-105 hover:shadow-xl relative group`}
          >
            <textarea
              value={idea.content}
              onChange={(e) => updateIdeaContent(idea.id, e.target.value)}
              placeholder={t('brainstorm_new_idea_placeholder')}
              className="flex-grow w-full bg-transparent resize-none focus:outline-none font-medium placeholder-gray-500/70"
              aria-label={`Idea note ${index + 1}`}
              autoFocus={idea.content === ''} // Autofocus on newly created empty notes
            />
             <button
                onClick={() => deleteIdea(idea.id)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/10 text-black/40 hover:bg-black/20 hover:text-black/60 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label={`Delete idea ${index + 1}`}
                title={t('delete_button') as string}
             >
                <TrashIcon className="h-4 w-4" />
             </button>
          </div>
        ))}
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
