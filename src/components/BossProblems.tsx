import React, { useState } from 'react';
import { Skull, Crown, Zap, Trophy, Target, Clock, Star, Lock, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface BossProblem {
  id: string;
  name: string;
  subject: 'math' | 'physics' | 'chemistry' | 'biology' | 'coding' | 'engineering';
  difficulty: 'apprentice' | 'expert' | 'master' | 'legendary';
  description: string;
  longDescription: string;
  phases: BossPhase[];
  xpReward: number;
  unlocked: boolean;
  completed: boolean;
  currentPhase: number;
  totalTime: number; // minutes
  rewards: BossReward[];
  prerequisite?: string;
}

interface BossPhase {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  timeEstimate: number;
}

interface BossReward {
  type: 'badge' | 'avatar' | 'title' | 'cosmetic';
  name: string;
  description: string;
  rarity: 'rare' | 'epic' | 'legendary';
}

const bossProblems: BossProblem[] = [
  {
    id: 'calculus-hydra',
    name: 'The Calculus Hydra',
    subject: 'math',
    difficulty: 'apprentice',
    description: 'Defeat this three-headed beast using derivatives, integrals, and limits!',
    longDescription: 'The Calculus Hydra emerges from the depths of mathematical theory. Each head represents a fundamental concept: derivatives for the first head, integrals for the second, and limits for the third. Only by mastering all three can you claim victory.',
    phases: [
      { id: '1', name: 'Head of Derivatives', description: 'Solve complex derivative problems', completed: false, timeEstimate: 15 },
      { id: '2', name: 'Head of Integrals', description: 'Master integration techniques', completed: false, timeEstimate: 20 },
      { id: '3', name: 'Head of Limits', description: 'Conquer limit calculations', completed: false, timeEstimate: 10 }
    ],
    xpReward: 500,
    unlocked: true,
    completed: false,
    currentPhase: 0,
    totalTime: 45,
    rewards: [
      { type: 'badge', name: 'Hydra Slayer', description: 'Defeated the Calculus Hydra', rarity: 'epic' },
      { type: 'avatar', name: 'Mathematical Warrior', description: 'Unlocks warrior avatar with math symbols', rarity: 'rare' },
      { type: 'title', name: 'Derivative Master', description: 'Display title: "The Derivative Master"', rarity: 'rare' }
    ]
  },
  {
    id: 'quantum-dragon',
    name: 'Quantum Mechanics Dragon',
    subject: 'physics',
    difficulty: 'expert',
    description: 'This dragon exists in multiple states simultaneously. Use quantum physics to collapse its wave function!',
    longDescription: 'Deep in the quantum realm lurks a dragon that defies classical physics. It phases between dimensions, tunnels through barriers, and exhibits wave-particle duality. Only a true master of quantum mechanics can predict its behavior and emerge victorious.',
    phases: [
      { id: '1', name: 'Wave Function Analysis', description: 'Calculate probability distributions', completed: false, timeEstimate: 25 },
      { id: '2', name: 'Quantum Tunneling', description: 'Solve barrier penetration problems', completed: false, timeEstimate: 20 },
      { id: '3', name: 'Uncertainty Principle', description: 'Apply Heisenberg\'s principle', completed: false, timeEstimate: 15 },
      { id: '4', name: 'Final Collapse', description: 'Measure the quantum state', completed: false, timeEstimate: 10 }
    ],
    xpReward: 800,
    unlocked: false,
    completed: false,
    currentPhase: 0,
    totalTime: 70,
    prerequisite: 'Complete 5 physics topics',
    rewards: [
      { type: 'badge', name: 'Quantum Slayer', description: 'Mastered quantum mechanics', rarity: 'legendary' },
      { type: 'cosmetic', name: 'Quantum Aura', description: 'Glowing particle effect around avatar', rarity: 'epic' },
      { type: 'title', name: 'Wave Whisperer', description: 'Display title: "The Wave Whisperer"', rarity: 'epic' }
    ]
  },
  {
    id: 'neural-leviathan',
    name: 'Neural Network Leviathan',
    subject: 'coding',
    difficulty: 'master',
    description: 'A massive AI creature that learns from every attack. Build the perfect neural network to defeat it!',
    longDescription: 'From the silicon seas rises the Neural Network Leviathan, an artificial intelligence of immense complexity. Its behavior adapts with each interaction, making it nearly impossible to defeat with brute force. Only by constructing the perfect neural architecture can you outsmart this digital behemoth.',
    phases: [
      { id: '1', name: 'Data Preprocessing', description: 'Clean and prepare training data', completed: false, timeEstimate: 30 },
      { id: '2', name: 'Architecture Design', description: 'Design the neural network layers', completed: false, timeEstimate: 25 },
      { id: '3', name: 'Training Phase', description: 'Train the model with backpropagation', completed: false, timeEstimate: 35 },
      { id: '4', name: 'Hyperparameter Tuning', description: 'Optimize model performance', completed: false, timeEstimate: 20 },
      { id: '5', name: 'Final Battle', description: 'Deploy your model against the Leviathan', completed: false, timeEstimate: 15 }
    ],
    xpReward: 1200,
    unlocked: false,
    completed: false,
    currentPhase: 0,
    totalTime: 125,
    prerequisite: 'Complete Advanced Programming Track',
    rewards: [
      { type: 'badge', name: 'AI Architect', description: 'Built a legendary neural network', rarity: 'legendary' },
      { type: 'avatar', name: 'Cyber Sage', description: 'Unlock the mystical cyber sage avatar', rarity: 'legendary' },
      { type: 'cosmetic', name: 'Digital Crown', description: 'Floating crown of data streams', rarity: 'legendary' },
      { type: 'title', name: 'Neural Overlord', description: 'Display title: "The Neural Overlord"', rarity: 'legendary' }
    ]
  }
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'apprentice': return 'from-blue-500 to-cyan-500';
    case 'expert': return 'from-purple-500 to-pink-500';
    case 'master': return 'from-orange-500 to-red-500';
    case 'legendary': return 'from-yellow-400 to-orange-500';
    default: return 'from-gray-400 to-gray-600';
  }
};

const getDifficultyIcon = (difficulty: string) => {
  switch (difficulty) {
    case 'apprentice': return <Target className="h-5 w-5" />;
    case 'expert': return <Skull className="h-5 w-5" />;
    case 'master': return <Crown className="h-5 w-5" />;
    case 'legendary': return <Trophy className="h-5 w-5" />;
    default: return <Target className="h-5 w-5" />;
  }
};

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'rare': return 'text-blue-500';
    case 'epic': return 'text-purple-500';
    case 'legendary': return 'text-yellow-500';
    default: return 'text-gray-500';
  }
};

export const BossProblems: React.FC = () => {
  const [selectedBoss, setSelectedBoss] = useState<BossProblem | null>(null);
  const [showBossDetail, setShowBossDetail] = useState(false);

  const startBossChallenge = (boss: BossProblem) => {
    if (!boss.unlocked) return;
    
    setSelectedBoss(boss);
    setShowBossDetail(true);
  };

  const completeBossPhase = (bossId: string, phaseId: string) => {
    // In a real app, this would integrate with the learning system
    console.log(`Completing phase ${phaseId} of boss ${bossId}`);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-cosmic bg-clip-text text-transparent">
          Boss Challenge Arena
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Face legendary STEM challenges that test your mastery. These epic multi-phase battles 
          reward exclusive badges, avatars, and cosmic powers!
        </p>
      </div>

      {/* Boss Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bossProblems.map((boss) => {
          const completedPhases = boss.phases.filter(p => p.completed).length;
          const totalPhases = boss.phases.length;
          const progressPercent = (completedPhases / totalPhases) * 100;

          return (
            <Card 
              key={boss.id}
              className={`relative overflow-hidden transition-all duration-300 hover:scale-105 cursor-pointer ${
                boss.completed 
                  ? 'ring-2 ring-success shadow-glow' 
                  : boss.unlocked 
                  ? 'ring-2 ring-primary shadow-cosmic hover:shadow-glow' 
                  : 'opacity-60 grayscale cursor-not-allowed'
              }`}
              onClick={() => boss.unlocked && startBossChallenge(boss)}
            >
              {/* Background gradient based on difficulty */}
              <div 
                className={`absolute inset-0 bg-gradient-to-br ${getDifficultyColor(boss.difficulty)} opacity-10`}
              />
              
              {/* Boss completion glow effect */}
              {boss.completed && (
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-blue-500/20 animate-pulse" />
              )}
              
              <CardHeader className="relative">
                <div className="flex items-center justify-between">
                  <Badge 
                    className={`bg-gradient-to-r ${getDifficultyColor(boss.difficulty)} text-white capitalize`}
                  >
                    {getDifficultyIcon(boss.difficulty)}
                    <span className="ml-1">{boss.difficulty}</span>
                  </Badge>
                  
                  {boss.completed ? (
                    <CheckCircle className="h-6 w-6 text-success" />
                  ) : boss.unlocked ? (
                    <Star className="h-6 w-6 text-primary" />
                  ) : (
                    <Lock className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  {boss.name}
                </CardTitle>
                
                <Badge variant="outline" className="w-fit capitalize">
                  {boss.subject}
                </Badge>
              </CardHeader>
              
              <CardContent className="relative space-y-4">
                <CardDescription className="text-sm">
                  {boss.description}
                </CardDescription>
                
                {/* Progress if started */}
                {completedPhases > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-medium">{completedPhases}/{totalPhases} phases</span>
                    </div>
                    <Progress value={progressPercent} className="h-2" />
                  </div>
                )}
                
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{boss.totalTime} min</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <span>{boss.xpReward} XP</span>
                  </div>
                </div>
                
                {/* Rewards preview */}
                <div className="space-y-2">
                  <div className="text-xs font-medium text-muted-foreground">REWARDS:</div>
                  <div className="flex flex-wrap gap-1">
                    {boss.rewards.slice(0, 3).map((reward, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className={`text-xs ${getRarityColor(reward.rarity)}`}
                      >
                        {reward.name}
                      </Badge>
                    ))}
                    {boss.rewards.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{boss.rewards.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
                
                {/* Unlock requirement */}
                {!boss.unlocked && boss.prerequisite && (
                  <div className="text-xs text-muted-foreground mt-2 p-2 bg-muted/50 rounded">
                    🔒 {boss.prerequisite}
                  </div>
                )}
                
                {/* Action button */}
                <Button 
                  className="w-full mt-4" 
                  variant={boss.completed ? "outline" : "default"}
                  disabled={!boss.unlocked}
                >
                  {boss.completed 
                    ? 'Completed' 
                    : boss.unlocked 
                    ? completedPhases > 0 
                      ? 'Continue Challenge' 
                      : 'Begin Challenge'
                    : 'Locked'
                  }
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Boss Detail Modal */}
      {showBossDetail && selectedBoss && (
        <Dialog open={showBossDetail} onOpenChange={setShowBossDetail}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${getDifficultyColor(selectedBoss.difficulty)}`}>
                  {getDifficultyIcon(selectedBoss.difficulty)}
                </div>
                {selectedBoss.name}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Boss Story */}
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-sm leading-relaxed">{selectedBoss.longDescription}</p>
              </div>
              
              {/* Battle Phases */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Battle Phases</h3>
                <div className="space-y-3">
                  {selectedBoss.phases.map((phase, index) => (
                    <Card key={phase.id} className={phase.completed ? 'bg-success/10' : ''}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Phase {index + 1}: {phase.name}</h4>
                            <p className="text-sm text-muted-foreground">{phase.description}</p>
                          </div>
                          <div className="text-right space-y-1">
                            <div className="text-sm text-muted-foreground">~{phase.timeEstimate} min</div>
                            {phase.completed ? (
                              <CheckCircle className="h-5 w-5 text-success" />
                            ) : (
                              <Button 
                                size="sm"
                                onClick={() => completeBossPhase(selectedBoss.id, phase.id)}
                              >
                                Start Phase
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              
              {/* Rewards */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Epic Rewards</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedBoss.rewards.map((reward, index) => (
                    <Card key={index} className="bg-gradient-to-br from-background to-muted/30">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${getRarityColor(reward.rarity)} bg-current/10`}>
                            {reward.type === 'badge' && <Trophy className="h-5 w-5" />}
                            {reward.type === 'avatar' && <Crown className="h-5 w-5" />}
                            {reward.type === 'title' && <Star className="h-5 w-5" />}
                            {reward.type === 'cosmetic' && <Zap className="h-5 w-5" />}
                          </div>
                          <div>
                            <h4 className="font-medium">{reward.name}</h4>
                            <p className="text-xs text-muted-foreground">{reward.description}</p>
                            <Badge variant="outline" className={`text-xs mt-1 ${getRarityColor(reward.rarity)}`}>
                              {reward.rarity}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setShowBossDetail(false)}>
                  Back to Arena
                </Button>
                <Button className="bg-gradient-cosmic text-white">
                  <Target className="h-4 w-4 mr-2" />
                  Enter Battle
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};