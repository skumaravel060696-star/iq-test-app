'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { differenceInDays } from 'date-fns';
import { BrainCircuit, HelpCircle, LogOut, MoreVertical, User as UserIcon, Shield, Trophy, History } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import type { UserProfile, TestAttempt } from '@/lib/types';
import { getLatestTestAttempt, getUserProfile, getTestHistory, clearUserData } from '@/lib/store';
import { Logo } from '@/components/Logo';

const RETAKE_COOLDOWN_DAYS = 7;


export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [history, setHistory] = useState<TestAttempt[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const profile = getUserProfile();
    if (!profile) {
      router.replace('/onboarding');
    } else {
      setUser(profile);
      setHistory(getTestHistory());
    }
  }, [router]);

  if (!isClient || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <BrainCircuit className="h-12 w-12 animate-pulse text-primary" />
      </div>
    );
  }
  
  const handleSignOut = () => {
    clearUserData();
    router.replace('/onboarding');
  };

  const lastRankedAttempt = history.find(a => !a.isPractice);

  const daysSinceLastRankedAttempt = lastRankedAttempt
    ? differenceInDays(new Date(), new Date(lastRankedAttempt.completedAt))
    : RETAKE_COOLDOWN_DAYS + 1;
  
  const canTakeRanked = daysSinceLastRankedAttempt >= RETAKE_COOLDOWN_DAYS;

  const handleStartTest = () => {
    router.push('/test');
  };
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="p-4 border-b">
         <div className="container mx-auto flex justify-between items-center">
            <Logo/>
            <div className="flex items-center gap-4">
              <span className="font-medium hidden sm:inline">Welcome, {user.name}!</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                    <span className="sr-only">Open user menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => router.push('/overview')}>
                    <BrainCircuit className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/profile')}>
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>User Details</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
         </div>
      </header>
      <main className="container mx-auto p-4 md:p-8 flex justify-center">
        <div className="space-y-8 w-full max-w-2xl">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">Ready for a Challenge?</CardTitle>
              <CardDescription>
                {history.length > 0 ? 'Challenge yourself again or practice your skills.' : 'Start your first test to discover your cognitive potential.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center justify-center p-6 bg-primary/5 rounded-lg border border-primary/20">
                    <h2 className="text-2xl font-semibold mb-4">
                      {history.length === 0 ? 'Start Your First Ranked Test' : (canTakeRanked ? 'Start a New Ranked Test' : 'Start a Practice Test')}
                    </h2>
                     <p className="text-muted-foreground text-center mb-6">
                        {canTakeRanked 
                            ? "This is a ranked attempt and will count towards your best score." 
                            : "This is a practice attempt and will not affect your best score."
                        }
                    </p>
                     <Button onClick={handleStartTest} className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90" size="lg">
                        {history.length === 0 ? 'Start First Test' : 'Start Test'}
                     </Button>
                     {!canTakeRanked && (
                        <p className="text-sm text-muted-foreground pt-4 text-center">
                          You can take a new ranked test in {RETAKE_COOLDOWN_DAYS - daysSinceLastRankedAttempt} day(s).
                        </p>
                    )}
                </div>
            </CardContent>
          </Card>
          
          <Card>
              <CardHeader>
                  <CardTitle className="flex items-center gap-2"><HelpCircle className="text-primary"/> Test Instructions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p><strong className="text-foreground">IQ Score:</strong> This is a normalized score based on your performance relative to your age group. The average IQ is 100.</p>
                  <p><strong className="text-foreground">Test Validity:</strong> This reflects our confidence that the score accurately represents your ability. Factors like distractions or unusually fast answers can lower validity.</p>
                   <p><strong className="text-foreground">Practice & Ranked Attempts:</strong> Your first test is a ranked attempt. After that, you can take a new ranked attempt every 7 days to update your best score. Any other tests taken are considered practice and won't affect your official best score.</p>
                  <p><strong className="text-foreground">Disclaimer:</strong> This is an informational tool, not a clinical diagnosis. For a formal assessment, please consult a qualified psychologist.</p>
              </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
