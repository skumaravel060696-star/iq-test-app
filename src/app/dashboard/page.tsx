'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { differenceInDays } from 'date-fns';
import { Brain, BrainCircuit, HelpCircle, History, Shield, Trophy } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { TestAttempt, UserProfile } from '@/lib/types';
import { getBestValidTestAttempt, getLatestTestAttempt, getUserProfile, getTestHistory } from '@/lib/store';
import { Logo } from '@/components/Logo';

const RETAKE_COOLDOWN_DAYS = 7;

function StatCard({ icon, title, value, description }: { icon: React.ReactNode, title: string, value: string, description: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [latestAttempt, setLatestAttempt] = useLocalStorage<TestAttempt | null>('cogniassess_latest_attempt', null);
  const [bestAttempt, setBestAttempt] = useLocalStorage<TestAttempt | null>('cogniassess_best_attempt', null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const profile = getUserProfile();
    if (!profile) {
      router.replace('/onboarding');
    } else {
      setUser(profile);
      setLatestAttempt(getLatestTestAttempt());
      setBestAttempt(getBestValidTestAttempt());
    }
  }, [router, setLatestAttempt, setBestAttempt]);

  if (!isClient || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <BrainCircuit className="h-12 w-12 animate-pulse text-primary" />
      </div>
    );
  }

  const daysSinceLastAttempt = latestAttempt
    ? differenceInDays(new Date(), new Date(latestAttempt.completedAt))
    : RETAKE_COOLDOWN_DAYS + 1;

  const canRetake = daysSinceLastAttempt >= RETAKE_COOLDOWN_DAYS;

  const handleStartTest = () => {
    router.push('/test');
  };
  
  const displayScore = bestAttempt?.iqScore ?? latestAttempt?.iqScore;
  const displayValidity = bestAttempt?.validityReport?.status ?? latestAttempt?.validityReport?.status;


  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="p-4 border-b">
         <div className="container mx-auto flex justify-between items-center">
            <Logo/>
            <span className="font-medium">Welcome, {user.name}!</span>
         </div>
      </header>
      <main className="container mx-auto p-4 md:p-8">
        <div className="space-y-8">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">Your Cognitive Snapshot</CardTitle>
              <CardDescription>
                {latestAttempt ? 'Here are your latest results. Keep challenging yourself!' : 'Ready to discover your cognitive potential? Start your first test now.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
               <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <StatCard 
                    icon={<Trophy className="h-4 w-4 text-muted-foreground" />}
                    title="Best Valid IQ"
                    value={bestAttempt ? `${bestAttempt.iqScore}` : 'N/A'}
                    description="Your highest score from a valid test."
                  />
                  <StatCard 
                    icon={<History className="h-4 w-4 text-muted-foreground" />}
                    title="Last IQ Score"
                    value={latestAttempt ? `${latestAttempt.iqScore}` : 'N/A'}
                    description="From your most recent attempt."
                  />
                  <StatCard 
                    icon={<Shield className="h-4 w-4 text-muted-foreground" />}
                    title="Last Test Validity"
                    value={displayValidity || 'N/A'}
                    description="Confidence in your last result."
                  />
                  <StatCard 
                    icon={<Brain className="h-4 w-4 text-muted-foreground" />}
                    title="Tests Taken"
                    value={`${getTestHistory().length}`}
                    description="Total number of attempts."
                  />
                </div>
            </CardContent>
            <CardFooter className="flex-col sm:flex-row gap-2">
              <Button onClick={handleStartTest} className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90">
                {latestAttempt ? 'Retake Test' : 'Start First Test'}
              </Button>
              {!canRetake && (
                <p className="text-sm text-muted-foreground">
                  You can retake the test in {RETAKE_COOLDOWN_DAYS - daysSinceLastAttempt} day(s).
                </p>
              )}
            </CardFooter>
          </Card>
          
          <Card>
              <CardHeader>
                  <CardTitle className="flex items-center gap-2"><HelpCircle className="text-primary"/> Understanding Your Score</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p><strong className="text-foreground">IQ Score:</strong> This is a normalized score based on your performance relative to your age group. The average IQ is 100.</p>
                  <p><strong className="text-foreground">Test Validity:</strong> This reflects our confidence that the score accurately represents your ability. Factors like distractions or unusually fast answers can lower validity.</p>
                  <p><strong className="text-foreground">Disclaimer:</strong> This is an informational tool, not a clinical diagnosis. For a formal assessment, please consult a qualified psychologist.</p>
              </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
