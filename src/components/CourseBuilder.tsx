import React, { useState } from 'react';
import { Plus, BookOpen, Edit, Trash2, Share2, Play, Users, Clock, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

interface CourseModule {
  id: string;
  title: string;
  description: string;
  type: 'lesson' | 'flashcards' | 'practice' | 'game';
  completed: boolean;
  estimatedTime: number; // in minutes
}

interface Course {
  id: string;
  title: string;
  description: string;
  subject: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  modules: CourseModule[];
  tags: string[];
  created: Date;
  lastAccessed?: Date;
  progress: number; // 0-100
  isShared: boolean;
  author: string;
  totalTime: number; // in minutes
}

export const CourseBuilder: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: '1',
      title: 'Linear Algebra Fundamentals',
      description: 'Master vectors, matrices, and linear transformations through interactive lessons and practice problems.',
      subject: 'math',
      difficulty: 'intermediate',
      modules: [
        {
          id: 'm1',
          title: 'Introduction to Vectors',
          description: 'Learn about vector operations and properties',
          type: 'lesson',
          completed: true,
          estimatedTime: 30
        },
        {
          id: 'm2',
          title: 'Vector Practice Set',
          description: 'Practice vector addition and scalar multiplication',
          type: 'flashcards',
          completed: true,
          estimatedTime: 20
        },
        {
          id: 'm3',
          title: 'Matrix Operations',
          description: 'Addition, subtraction, and multiplication of matrices',
          type: 'lesson',
          completed: false,
          estimatedTime: 45
        },
        {
          id: 'm4',
          title: 'Matrix Game Challenge',
          description: 'Interactive matrix multiplication game',
          type: 'game',
          completed: false,
          estimatedTime: 25
        }
      ],
      tags: ['linear-algebra', 'vectors', 'matrices'],
      created: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      lastAccessed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      progress: 50,
      isShared: false,
      author: 'You',
      totalTime: 120
    },
    {
      id: '2',
      title: 'JavaScript Basics for STEM',
      description: 'Learn JavaScript programming concepts through scientific computing examples and interactive coding challenges.',
      subject: 'coding',
      difficulty: 'beginner',
      modules: [
        {
          id: 'm5',
          title: 'Variables and Data Types',
          description: 'Understanding JavaScript variables and basic data types',
          type: 'lesson',
          completed: true,
          estimatedTime: 25
        },
        {
          id: 'm6',
          title: 'Functions for Calculations',
          description: 'Writing functions for mathematical computations',
          type: 'practice',
          completed: false,
          estimatedTime: 40
        }
      ],
      tags: ['javascript', 'programming', 'stem'],
      created: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      progress: 30,
      isShared: true,
      author: 'You',
      totalTime: 65
    }
  ]);

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Form state for creating/editing courses
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: 'math',
    difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    tags: ''
  });

  const subjects = ['math', 'physics', 'chemistry', 'biology', 'coding', 'engineering'];
  const difficulties = ['beginner', 'intermediate', 'advanced'];
  const moduleTypes = [
    { value: 'lesson', label: 'Lesson', icon: BookOpen },
    { value: 'flashcards', label: 'Flashcards', icon: Star },
    { value: 'practice', label: 'Practice', icon: Edit },
    { value: 'game', label: 'Game', icon: Play }
  ];

  const handleCreateCourse = () => {
    const newCourse: Course = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      subject: formData.subject,
      difficulty: formData.difficulty,
      modules: [],
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      created: new Date(),
      progress: 0,
      isShared: false,
      author: 'You',
      totalTime: 0
    };

    setCourses(prev => [...prev, newCourse]);
    setFormData({ title: '', description: '', subject: 'math', difficulty: 'beginner', tags: '' });
    setShowCreateDialog(false);
  };

  const handleEditCourse = () => {
    if (!editingCourse) return;

    setCourses(prev => prev.map(course => 
      course.id === editingCourse.id 
        ? {
            ...course,
            title: formData.title,
            description: formData.description,
            subject: formData.subject,
            difficulty: formData.difficulty,
            tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
          }
        : course
    ));

    setEditingCourse(null);
    setFormData({ title: '', description: '', subject: 'math', difficulty: 'beginner', tags: '' });
  };

  const handleDeleteCourse = (id: string) => {
    setCourses(prev => prev.filter(course => course.id !== id));
    if (selectedCourse?.id === id) {
      setSelectedCourse(null);
    }
  };

  const startEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      subject: course.subject,
      difficulty: course.difficulty,
      tags: course.tags.join(', ')
    });
  };

  const toggleShareCourse = (courseId: string) => {
    setCourses(prev => prev.map(course => 
      course.id === courseId 
        ? { ...course, isShared: !course.isShared }
        : course
    ));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-success text-success-foreground';
      case 'intermediate': return 'bg-warning text-warning-foreground';
      case 'advanced': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getSubjectColor = (subject: string) => {
    const colors = {
      math: 'bg-blue-100 text-blue-800',
      physics: 'bg-yellow-100 text-yellow-800',
      chemistry: 'bg-green-100 text-green-800',
      biology: 'bg-emerald-100 text-emerald-800',
      coding: 'bg-purple-100 text-purple-800',
      engineering: 'bg-orange-100 text-orange-800'
    };
    return colors[subject as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getModuleTypeIcon = (type: string) => {
    const moduleType = moduleTypes.find(t => t.value === type);
    return moduleType?.icon || BookOpen;
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (selectedCourse) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedCourse(null)}
            className="mb-4 focus-ring"
          >
            ← Back to Courses
          </Button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{selectedCourse.title}</h1>
              <p className="text-muted-foreground mb-4">{selectedCourse.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className={getSubjectColor(selectedCourse.subject)}>
                  {selectedCourse.subject}
                </Badge>
                <Badge className={getDifficultyColor(selectedCourse.difficulty)}>
                  {selectedCourse.difficulty}
                </Badge>
                {selectedCourse.isShared && (
                  <Badge variant="outline" className="text-primary border-primary">
                    <Share2 className="h-3 w-3 mr-1" />
                    Shared
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-muted-foreground mb-1">Progress</div>
              <div className="text-2xl font-bold mb-2">{selectedCourse.progress}%</div>
              <Progress value={selectedCourse.progress} className="w-32" />
            </div>
          </div>
        </div>

        {/* Course Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-2xl font-bold">{selectedCourse.modules.length}</div>
                  <div className="text-sm text-muted-foreground">Modules</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-accent" />
                <div>
                  <div className="text-2xl font-bold">{formatTime(selectedCourse.totalTime)}</div>
                  <div className="text-sm text-muted-foreground">Total Time</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-success" />
                <div>
                  <div className="text-2xl font-bold">
                    {selectedCourse.modules.filter(m => m.completed).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-warning" />
                <div>
                  <div className="text-2xl font-bold">{selectedCourse.isShared ? '∞' : '1'}</div>
                  <div className="text-sm text-muted-foreground">Access</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modules List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Course Modules</h2>
            <Button className="focus-ring">
              <Plus className="h-4 w-4 mr-2" />
              Add Module
            </Button>
          </div>

          {selectedCourse.modules.map((module, index) => {
            const Icon = getModuleTypeIcon(module.type);
            
            return (
              <Card key={module.id} className={`hover:shadow-cosmic transition-all duration-300 ${
                module.completed ? 'ring-1 ring-success' : ''
              }`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        module.completed ? 'bg-success text-success-foreground' : 'bg-muted'
                      }`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-muted-foreground">
                            Module {index + 1}
                          </span>
                          <Badge variant="outline" className="text-xs capitalize">
                            {module.type}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">{module.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {module.description}
                        </CardDescription>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {formatTime(module.estimatedTime)}
                      </span>
                      <Button 
                        variant={module.completed ? "secondary" : "default"}
                        size="sm"
                        className="focus-ring"
                      >
                        {module.completed ? 'Review' : 'Start'}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Courses</h1>
        <p className="text-muted-foreground">
          Create custom learning paths with lessons, flashcards, practice problems, and games.
        </p>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {courses.length} course{courses.length !== 1 ? 's' : ''}
          </span>
        </div>
        
        <Button className="focus-ring" onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Course
        </Button>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <Card key={course.id} className="hover:shadow-cosmic transition-all duration-300 cursor-pointer">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between mb-2">
                <div className="flex flex-wrap gap-1">
                  <Badge className={getSubjectColor(course.subject)}>
                    {course.subject}
                  </Badge>
                  <Badge className={getDifficultyColor(course.difficulty)}>
                    {course.difficulty}
                  </Badge>
                  {course.isShared && (
                    <Badge variant="outline" className="text-primary border-primary">
                      <Share2 className="h-3 w-3 mr-1" />
                      Shared
                    </Badge>
                  )}
                </div>
                
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleShareCourse(course.id);
                    }}
                    className="h-8 w-8 focus-ring"
                    aria-label={course.isShared ? "Unshare course" : "Share course"}
                  >
                    <Share2 className={`h-4 w-4 ${course.isShared ? 'text-primary' : 'text-muted-foreground'}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      startEdit(course);
                    }}
                    className="h-8 w-8 focus-ring"
                    aria-label="Edit course"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCourse(course.id);
                    }}
                    className="h-8 w-8 focus-ring text-destructive hover:text-destructive"
                    aria-label="Delete course"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <CardTitle 
                className="text-lg leading-tight cursor-pointer hover:text-primary transition-colors"
                onClick={() => setSelectedCourse(course)}
              >
                {course.title}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <CardDescription className="mb-4 text-sm line-clamp-2">
                {course.description}
              </CardDescription>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-2" />

                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span>{course.modules.length} modules</span>
                    <span>{formatTime(course.totalTime)}</span>
                  </div>
                  <span>{course.modules.filter(m => m.completed).length} completed</span>
                </div>

                {course.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {course.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {course.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{course.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              <Separator className="my-3" />

              <Button 
                className="w-full focus-ring"
                onClick={() => setSelectedCourse(course)}
              >
                {course.progress > 0 ? 'Continue' : 'Start Course'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create/Edit Course Dialog */}
      <Dialog
        open={showCreateDialog || !!editingCourse}
        onOpenChange={(open) => {
          if (!open) {
            setShowCreateDialog(false);
            setEditingCourse(null);
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingCourse ? 'Edit Course' : 'Create New Course'}
            </DialogTitle>
            <DialogDescription>
              {editingCourse 
                ? 'Update your course details below.'
                : 'Fill in the details to create a new learning course.'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="course-title">Course Title</Label>
              <Input
                id="course-title"
                placeholder="Enter course title..."
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="focus-ring"
              />
            </div>

            <div>
              <Label htmlFor="course-description">Description</Label>
              <Textarea
                id="course-description"
                placeholder="Describe what students will learn..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="focus-ring"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="course-subject">Subject</Label>
                <Select 
                  value={formData.subject} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map(subject => (
                      <SelectItem key={subject} value={subject}>
                        {subject.charAt(0).toUpperCase() + subject.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="course-difficulty">Difficulty</Label>
                <Select 
                  value={formData.difficulty} 
                  onValueChange={(value: any) => setFormData(prev => ({ ...prev, difficulty: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.map(difficulty => (
                      <SelectItem key={difficulty} value={difficulty}>
                        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="course-tags">Tags (comma-separated)</Label>
              <Input
                id="course-tags"
                placeholder="algebra, linear-algebra, vectors"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                className="focus-ring"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowCreateDialog(false);
                  setEditingCourse(null);
                  setFormData({ title: '', description: '', subject: 'math', difficulty: 'beginner', tags: '' });
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={editingCourse ? handleEditCourse : handleCreateCourse}
                disabled={!formData.title.trim() || !formData.description.trim()}
                className="focus-ring"
              >
                {editingCourse ? 'Update Course' : 'Create Course'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};