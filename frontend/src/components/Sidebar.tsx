import React, { useState, useEffect } from 'react';
import { 
  Plus,
  Clock,
  Trophy,
  BookOpen,
  MessageSquare,
  TreePine,
  CreditCard,
  Gamepad2,
  Target,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
  flashcardCount: number;
  created: string;
}

interface SidebarProps {
  currentView: 'chat' | 'skill-tree' | 'flashcards' | 'courses' | 'games' | 'daily-quest' | 'boss-problems';
  onViewChange: (view: 'chat' | 'skill-tree' | 'flashcards' | 'courses' | 'games' | 'daily-quest' | 'boss-problems') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [showCreateSubject, setShowCreateSubject] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [recentTopics, setRecentTopics] = useState<string[]>([]);

  // Load subjects from backend
  useEffect(() => {
    fetchSubjects();
    loadRecentTopics();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/subjects');
      if (response.ok) {
        const data = await response.json();
        setSubjects(data);
        if (data.length > 0 && !selectedSubject) {
          setSelectedSubject(data[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to fetch subjects:', error);
    }
  };

  const loadRecentTopics = () => {
    // Load from localStorage for now - could be moved to backend later
    const stored = localStorage.getItem('recentTopics');
    if (stored) {
      setRecentTopics(JSON.parse(stored));
    }
  };

  const createSubject = async () => {
    if (!newSubjectName.trim()) return;

    try {
      const response = await fetch('http://localhost:3001/api/subjects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newSubjectName,
          icon: 'BookOpen',
          color: `bg-${['blue', 'green', 'purple', 'orange', 'red', 'emerald'][Math.floor(Math.random() * 6)]}-500`
        }),
      });

      if (response.ok) {
        const newSubject = await response.json();
        setSubjects(prev => [...prev, newSubject]);
        setNewSubjectName('');
        setShowCreateSubject(false);
        if (!selectedSubject) {
          setSelectedSubject(newSubject.id);
        }
      }
    } catch (error) {
      console.error('Failed to create subject:', error);
    }
  };

  return (
    <div className="h-full flex flex-col p-4 space-y-6">
      {/* Learning Hub - Moved to top */}
      <section aria-labelledby="navigation-heading">
        <h2 id="navigation-heading" className="text-lg font-semibold mb-4 text-foreground">
          Learning Hub
        </h2>
        <div className="space-y-2">
          <Button
            variant={currentView === 'chat' ? "default" : "ghost"}
            className="w-full justify-start gap-3 h-12 focus-ring"
            onClick={() => onViewChange('chat')}
          >
            <MessageSquare className="h-4 w-4" />
            AI Tutor Chat
          </Button>
          
          <Button
            variant={currentView === 'flashcards' ? "default" : "ghost"}
            className="w-full justify-start gap-3 h-12 focus-ring"
            onClick={() => onViewChange('flashcards')}
          >
            <CreditCard className="h-4 w-4" />
            Flashcards
          </Button>
          
          <Button
            variant={currentView === 'skill-tree' ? "default" : "ghost"}
            className="w-full justify-start gap-3 h-12 focus-ring"
            onClick={() => onViewChange('skill-tree')}
          >
            <TreePine className="h-4 w-4" />
            Skill Tree
          </Button>
          
          <Button
            variant={currentView === 'courses' ? "default" : "ghost"}
            className="w-full justify-start gap-3 h-12 focus-ring"
            onClick={() => onViewChange('courses')}
          >
            <BookOpen className="h-4 w-4" />
            Course Builder
          </Button>
          
          <Button
            variant={currentView === 'games' ? "default" : "ghost"}
            className="w-full justify-start gap-3 h-12 focus-ring"
            onClick={() => onViewChange('games')}
          >
            <Gamepad2 className="h-4 w-4" />
            Learning Games
          </Button>
          
          <Button
            variant={currentView === 'daily-quest' ? "default" : "ghost"}
            className="w-full justify-start gap-3 h-12 focus-ring"
            onClick={() => onViewChange('daily-quest')}
          >
            <Zap className="h-4 w-4" />
            Daily Quest
          </Button>
          
          <Button
            variant={currentView === 'boss-problems' ? "default" : "ghost"}
            className="w-full justify-start gap-3 h-12 focus-ring"
            onClick={() => onViewChange('boss-problems')}
          >
            <Target className="h-4 w-4" />
            Boss Problems
          </Button>
        </div>
      </section>

      <Separator />

      {/* Dynamic Subjects */}
      <section aria-labelledby="subjects-heading">
        <div className="flex items-center justify-between mb-4">
          <h2 id="subjects-heading" className="text-lg font-semibold text-foreground">
            My Subjects
          </h2>
          <Dialog open={showCreateSubject} onOpenChange={setShowCreateSubject}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 focus-ring">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Subject</DialogTitle>
                <DialogDescription>
                  Add a new subject to organize your learning materials.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="subject-name">Subject Name</Label>
                  <Input
                    id="subject-name"
                    placeholder="e.g., Mathematics, Physics, Programming"
                    value={newSubjectName}
                    onChange={(e) => setNewSubjectName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && createSubject()}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowCreateSubject(false)}>
                    Cancel
                  </Button>
                  <Button onClick={createSubject} disabled={!newSubjectName.trim()}>
                    Create Subject
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        {subjects.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">No subjects yet.</p>
            <p className="text-xs">Create your first subject to get started!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {subjects.map((subject) => {
              const isSelected = selectedSubject === subject.id;
              
              return (
                <Button
                  key={subject.id}
                  variant={isSelected ? "default" : "ghost"}
                  className={`w-full justify-start gap-3 h-12 focus-ring ${
                    isSelected 
                      ? 'bg-primary text-primary-foreground shadow-cosmic' 
                      : 'hover:bg-secondary/80'
                  }`}
                  onClick={() => setSelectedSubject(subject.id)}
                  aria-pressed={isSelected}
                >
                  <div className={`w-8 h-8 rounded-lg ${subject.color} flex items-center justify-center`}>
                    <BookOpen className="h-4 w-4 text-white" />
                  </div>
                  <span className="flex-1 text-left">{subject.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {subject.flashcardCount}
                  </Badge>
                </Button>
              );
            })}
          </div>
        )}
      </section>

      {recentTopics.length > 0 && (
        <>
          <Separator />
          
          {/* Recent Topics */}
          <section aria-labelledby="recent-heading">
            <h3 id="recent-heading" className="text-sm font-medium mb-3 text-muted-foreground">
              Recent Topics
            </h3>
            <div className="space-y-1">
              {recentTopics.slice(0, 5).map((topic, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-sm text-muted-foreground hover:text-foreground focus-ring"
                >
                  <BookOpen className="h-3 w-3 mr-2" />
                  {topic}
                </Button>
              ))}
            </div>
          </section>
        </>
      )}

      <Separator />

      {/* Quick Actions */}
      <section aria-labelledby="actions-heading">
        <h3 id="actions-heading" className="text-sm font-medium mb-3 text-muted-foreground">
          Quick Actions
        </h3>
        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start focus-ring"
          >
            <Clock className="h-4 w-4 mr-2" />
            Start Pomodoro
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start focus-ring"
          >
            <Trophy className="h-4 w-4 mr-2" />
            Daily Challenge
          </Button>
        </div>
      </section>
    </div>
  );
};