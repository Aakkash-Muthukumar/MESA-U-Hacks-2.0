import React, { useState, useEffect } from 'react';
import { Star, Lock, CheckCircle, Zap, Trophy, Atom, Calculator, Code, Microscope, Beaker, Plus, TreePine } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface SkillNode {
  id: string;
  name: string;
  subject: 'math' | 'physics' | 'chemistry' | 'biology' | 'coding' | 'engineering';
  level: number;
  prerequisiteIds: string[];
  isUnlocked: boolean;
  isCompleted: boolean;
  progress: number;
  xpReward: number;
  description: string;
}

const SUBJECT_ICONS = {
  math: Calculator,
  physics: Atom,
  chemistry: Beaker,
  biology: Microscope,
  coding: Code,
  engineering: Trophy
};

const SUBJECT_COLORS = {
  math: 'hsl(240 100% 60%)',
  physics: 'hsl(50 100% 50%)', 
  chemistry: 'hsl(140 60% 50%)',
  biology: 'hsl(120 50% 50%)',
  coding: 'hsl(280 60% 60%)',
  engineering: 'hsl(15 90% 60%)'
};

export const SkillTree: React.FC = () => {
  const [skillNodes, setSkillNodes] = useState<SkillNode[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Load skill nodes from localStorage (could be moved to backend later)
  useEffect(() => {
    const stored = localStorage.getItem('skillNodes');
    if (stored) {
      setSkillNodes(JSON.parse(stored));
    }
  }, []);

  // Save skill nodes to localStorage
  const saveSkillNodes = (nodes: SkillNode[]) => {
    setSkillNodes(nodes);
    localStorage.setItem('skillNodes', JSON.stringify(nodes));
  };

  const getNodeStatusIcon = (node: SkillNode) => {
    if (node.isCompleted) return CheckCircle;
    if (node.isUnlocked) return Star;
    return Lock;
  };

  const getNodeStatusColor = (node: SkillNode) => {
    if (node.isCompleted) return 'text-success';
    if (node.isUnlocked) return 'text-primary';
    return 'text-muted-foreground';
  };

  const renderConnectionLine = (fromNode: SkillNode, toNode: SkillNode) => {
    if (!fromNode.prerequisiteIds.length) return null;
    
    return (
      <div className={`absolute w-0.5 h-8 ${fromNode.isUnlocked ? 'bg-primary' : 'bg-border'}`} />
    );
  };

  // Group nodes by level for layout
  const nodesByLevel = skillNodes.reduce((acc, node) => {
    if (!acc[node.level]) acc[node.level] = [];
    acc[node.level].push(node);
    return acc;
  }, {} as Record<number, SkillNode[]>);

  const maxLevel = Math.max(...skillNodes.map(n => n.level));

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Skill Tree</h1>
            <p className="text-muted-foreground">
              Master STEM concepts step by step. Complete skills to unlock advanced topics.
            </p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)} className="focus-ring">
            <Plus className="h-4 w-4 mr-2" />
            Add Skill
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mb-8 p-4 bg-muted/30 rounded-lg">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-success" />
          <span className="text-sm">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-primary" />
          <span className="text-sm">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm">Locked</span>
        </div>
      </div>

      {/* Skill Tree Visualization */}
      {skillNodes.length === 0 ? (
        <div className="text-center py-16">
          <TreePine className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No Skills Yet</h3>
          <p className="text-muted-foreground mb-6">
            Create your first skill to start building your learning path.
          </p>
          <Button onClick={() => setShowCreateDialog(true)} className="focus-ring">
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Skill
          </Button>
        </div>
      ) : (
        <div className="space-y-12">
          {Array.from({ length: maxLevel }, (_, i) => i + 1).map(level => {
            const levelNodes = nodesByLevel[level] || [];
            
            return (
              <div key={level} className="relative">
                <div className="mb-4">
                  <Badge variant="outline" className="text-sm font-medium">
                    Level {level}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {levelNodes.map(node => {
                    const Icon = getNodeStatusIcon(node);
                    const SubjectIcon = SUBJECT_ICONS[node.subject];
                    
                    return (
                      <Card 
                        key={node.id}
                        className={`relative transition-all duration-300 hover:scale-105 ${
                          node.isCompleted ? 'ring-2 ring-success shadow-glow' :
                          node.isUnlocked ? 'ring-2 ring-primary shadow-cosmic hover:shadow-glow' :
                          'opacity-60 grayscale'
                        }`}
                        style={{
                          background: node.isUnlocked ? 
                            `linear-gradient(135deg, hsl(var(--card)) 0%, ${SUBJECT_COLORS[node.subject]}10 100%)` :
                            undefined
                        }}
                      >
                        {/* Glowing effect for completed nodes */}
                        {node.isCompleted && (
                          <div 
                            className="absolute inset-0 rounded-lg opacity-20 animate-pulse"
                            style={{ background: SUBJECT_COLORS[node.subject] }}
                          />
                        )}
                        
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <SubjectIcon 
                                className="h-5 w-5"
                                style={{ color: SUBJECT_COLORS[node.subject] }}
                              />
                              <Badge 
                                variant="secondary" 
                                className="text-xs capitalize"
                                style={{ 
                                  backgroundColor: `${SUBJECT_COLORS[node.subject]}20`,
                                  color: SUBJECT_COLORS[node.subject]
                                }}
                              >
                                {node.subject}
                              </Badge>
                            </div>
                            <Icon className={`h-6 w-6 ${getNodeStatusColor(node)}`} />
                          </div>
                          
                          <CardTitle className="text-lg font-semibold">
                            {node.name}
                          </CardTitle>
                        </CardHeader>
                        
                        <CardContent>
                          <CardDescription className="mb-4 text-sm">
                            {node.description}
                          </CardDescription>
                          
                          {node.isUnlocked && !node.isCompleted && (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="font-medium">{node.progress}%</span>
                              </div>
                              <Progress 
                                value={node.progress} 
                                className="h-2"
                                aria-label={`${node.name} progress: ${node.progress}%`}
                              />
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Zap className="h-4 w-4" />
                              <span>{node.xpReward} XP</span>
                            </div>
                            
                            {node.isUnlocked && (
                              <Button 
                                size="sm" 
                                variant={node.isCompleted ? "secondary" : "default"}
                                disabled={node.isCompleted}
                                className="focus-ring"
                              >
                                {node.isCompleted ? 'Completed' : 'Continue'}
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                
                {/* Connection lines to next level */}
                {level < maxLevel && (
                  <div className="flex justify-center mt-6">
                    <div className="w-0.5 h-6 bg-border" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Create Skill Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Skill</DialogTitle>
            <DialogDescription>
              Add a new skill to your learning tree.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Skill Name</Label>
              <Input placeholder="e.g., Linear Algebra Basics" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea placeholder="What will you learn in this skill?" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Subject</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="math">Mathematics</SelectItem>
                    <SelectItem value="physics">Physics</SelectItem>
                    <SelectItem value="chemistry">Chemistry</SelectItem>
                    <SelectItem value="biology">Biology</SelectItem>
                    <SelectItem value="coding">Programming</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Level</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Level 1</SelectItem>
                    <SelectItem value="2">Level 2</SelectItem>
                    <SelectItem value="3">Level 3</SelectItem>
                    <SelectItem value="4">Level 4</SelectItem>
                    <SelectItem value="5">Level 5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowCreateDialog(false)}>
                Create Skill
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};