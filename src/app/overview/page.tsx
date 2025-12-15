
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Brain, BrainCircuit, History, LogOut, MoreVertical, Shield, Trophy, User as UserIcon, ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import type { TestAttempt, UserProfile } from '@/lib/types';
import { getBestValidTestAttempt, getLatestTestAttempt, getUserProfile, getTestHistory, clearUserData } from '@/lib/store';
import { Logo } from '@/components/Logo';

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

export default function OverviewPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [latestAttempt, setLatestAttempt] = useState<TestAttempt | null>(null);
  const [bestAttempt, setBestAttempt] = useState<TestAttempt | null>(null);
  const [history, setHistory] = useState<TestAttempt[]>([]);
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

  const displayBestScore = bestAttempt?.iqScore ?? 'N/A';
  const displayLastScore = latestAttempt?.iqScore ?? 'N/A';
  const displayValidity = latestAttempt?.validityReport?.status ?? 'N/A';


  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="p-4 border-b">
         <div className="container mx-auto flex justify-between items-center">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
                <ArrowLeft/>
                <span className="sr-only">Go back</span>
            </Button>
            <Logo/>
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                    <span className="sr-only">Open user menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                    <BrainCircuit className="mr-2 h-4 w-4" />
                    <span>Test Lobby</span>
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
      <main className="container mx-auto p-4 md:p-8">
        <div className="space-y-8">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">Your Cognitive Snapshot</CardTitle>
              <CardDescription>
                {history.length > 0 ? 'Here are your latest results. Keep challenging yourself!' : "You haven't taken any tests yet. Your results will appear here."}
              </CardDescription>
            </CardHeader>
            <CardContent>
               <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <StatCard 
                    icon={<Trophy className="h-4 w-4 text-muted-foreground" />}
                    title="Best Valid IQ"
                    value={`${displayBestScore}`}
                    description="Your highest valid score."
                  />
                  <StatCard 
                    icon={<History className="h-4 w-4 text-muted-foreground" />}
                    title="Last IQ Score"
                    value={`${displayLastScore}`}
                    description={latestAttempt?.isPractice ? 'From a practice attempt.' : 'From your most recent attempt.'}
                  />
                  <StatCard 
                    icon={<Shield className="h-4 w-4 text-muted-foreground" />}
                    title="Last Test Validity"
                    value={displayValidity}
                    description="Confidence in your last result."
                  />
                  <StatCard 
                    icon={<Brain className="h-4 w-4 text-muted-foreground" />}
                    title="Tests Taken"
                    value={`${history.length}`}
                    description="Total number of attempts."
                  />
                </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
