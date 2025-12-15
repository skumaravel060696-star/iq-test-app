'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Mail, Calendar, BrainCircuit } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { UserProfile } from '@/lib/types';
import { getUserProfile } from '@/lib/store';
import { Logo } from '@/components/Logo';

function DetailItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) {
  return (
    <div className="flex items-start gap-4">
      <div className="text-primary">{icon}</div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}


export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const profile = getUserProfile();
    if (!profile) {
      router.replace('/onboarding');
    } else {
      setUser(profile);
    }
  }, [router]);

  if (!user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <BrainCircuit className="h-12 w-12 animate-pulse text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
       <header className="p-4 border-b">
         <div className="container mx-auto flex justify-between items-center">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
                <ArrowLeft/>
                <span className="sr-only">Go back</span>
            </Button>
            <Logo/>
            <div className="w-10"></div>
         </div>
      </header>
      <main className="container mx-auto p-4 md:p-8 flex justify-center">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
            <CardDescription>Your CogniAssess account details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <DetailItem icon={<User />} label="Full Name" value={user.name} />
            <DetailItem icon={<Mail />} label="Email Address" value={user.email} />
            <DetailItem icon={<Calendar />} label="Age" value={user.age} />
            <DetailItem 
              icon={<Calendar />} 
              label="Profile Created" 
              value={new Date(user.createdAt).toLocaleDateString()} 
            />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
