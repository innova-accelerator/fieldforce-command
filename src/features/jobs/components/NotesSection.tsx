
import React, { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Textarea } from '../../../components/ui/textarea';
import { Label } from '../../../components/ui/label';

interface NotesSectionProps {
  onAddNote: (content: string) => void;
}

const NotesSection: React.FC<NotesSectionProps> = ({ onAddNote }) => {
  const [noteContent, setNoteContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (noteContent.trim()) {
      setIsSubmitting(true);
      try {
        onAddNote(noteContent.trim());
        setNoteContent('');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-sm border p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Add Note</h2>
      </div>
      
      <div className="space-y-3">
        <div>
          <Label htmlFor="noteContent" className="text-sm font-medium text-foreground">
            Internal Note or Comment
          </Label>
          <Textarea
            id="noteContent"
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a note about this job... (Cmd/Ctrl + Enter to submit)"
            className="mt-1 min-h-[100px] resize-vertical"
            disabled={isSubmitting}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            Tip: Use Cmd/Ctrl + Enter to quickly submit
          </div>
          <Button 
            onClick={handleSubmit}
            disabled={!noteContent.trim() || isSubmitting}
            size="sm"
            className="min-w-[80px]"
          >
            {isSubmitting ? (
              'Adding...'
            ) : (
              <>
                <Send className="h-3 w-3 mr-1" />
                Add Note
              </>
            )}
          </Button>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => setNoteContent(prev => prev + (prev ? '\n\n' : '') + '📞 Client call: ')}
        >
          📞 Call Note
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => setNoteContent(prev => prev + (prev ? '\n\n' : '') + '📧 Email sent: ')}
        >
          📧 Email Log
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => setNoteContent(prev => prev + (prev ? '\n\n' : '') + '🔧 Site visit: ')}
        >
          🔧 Site Visit
        </Button>
      </div>
    </div>
  );
};

export default NotesSection;
