import React from 'react';
import { 
  Calculator, 
  Code, 
  Atom, 
  Dna, 
  FlaskConical, 
  Cog,
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

const subjects = [
  { id: 'math', name: 'Mathematics', icon: Calculator, color: 'bg-blue-500', count: 12 },
  { id: 'coding', name: 'Programming', icon: Code, color: 'bg-green-500', count: 8 },
  { id: 'physics', name: 'Physics', icon: Atom, color: 'bg-purple-500', count: 15 },
  { id: 'biology', name: 'Biology', icon: Dna, color: 'bg-emerald-500', count: 6 },
  { id: 'chemistry', name: 'Chemistry', icon: FlaskConical, color: 'bg-orange-500', count: 9 },
  { id: 'engineering', name: 'Engineering', icon: Cog, color: 'bg-red-500', count: 4 },
];

const recentTopics = [
  'Quadratic Equations',
  'React Hooks',
  'Newton\'s Laws',
  'Cell Division',
  'Organic Chemistry'
];

interface SidebarProps {
  currentView: 'chat' | 'skill-tree' | 'flashcards' | 'courses' | 'games' | 'daily-quest' | 'boss-problems';
  onViewChange: (view: 'chat' | 'skill-tree' | 'flashcards' | 'courses' | 'games' | 'daily-quest' | 'boss-problems') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const [selectedSubject, setSelectedSubject] = React.useState<string>('math');

  return (
    <div className="h-full flex flex-col p-4 space-y-6">
      {/* Subject Switcher */}
      <section aria-labelledby="subjects-heading">
        <h2 id="subjects-heading" className="text-lg font-semibold mb-4 text-foreground">
          Subjects
        </h2>
        <div className="space-y-2">
          {subjects.map((subject) => {
            const Icon = subject.icon;
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
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <span className="flex-1 text-left">{subject.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {subject.count}
                </Badge>
              </Button>
            );
          })}
        </div>
      </section>

      <Separator />

      {/* Navigation */}
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
            variant={currentView === 'skill-tree' ? "default" : "ghost"}
            className="w-full justify-start gap-3 h-12 focus-ring"
            onClick={() => onViewChange('skill-tree')}
          >
            <TreePine className="h-4 w-4" />
            Skill Tree
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

      {/* Recent Topics */}
      <section aria-labelledby="recent-heading">
        <h3 id="recent-heading" className="text-sm font-medium mb-3 text-muted-foreground">
          Recent Topics
        </h3>
        <div className="space-y-1">
          {recentTopics.map((topic, index) => (
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