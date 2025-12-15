'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Brain, CheckCircle, Shield, AlertTriangle, Star } from 'lucide-react';
import { motion } from 'framer-motion';

import type { TestAttempt } from '@/lib/types';
import { getTestAttemptById } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/Logo';

const ValidityDisplay = {
  High: {
    icon: <CheckCircle className="text-green-500" />,
    text: "High Validity",
    description: "The results are considered reliable.",
    color: "bg-green-500/10 text-green-700 dark:bg-green-500/20 dark:text-green-400",
  },
  Medium: {
    icon: <AlertTriangle className="text-yellow-500" />,
    text: "Medium Validity",
    description: "Some inconsistencies were detected.",
    color: "bg-yellow-500/10 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400",
  },
  Low: {
    icon: <Shield className="text-red-500" />,
    text: "Low Validity",
    description: "Results may not be accurate due to irregularities.",
    color: "bg-red-500/10 text-red-700 dark:bg-red-500/20 dark:text-red-400",
  },
};


export default function ResultsPage() {
  const router = useRouter();
  const params = useParams();
  const [attempt, setAttempt] = useState<TestAttempt | null>(null);

  useEffect(() => {
    if (params.testId) {
      const testId = Array.isArray(params.testId) ? params.testId[0] : params.testId;
      const foundAttempt = getTestAttemptById(testId);
      if (foundAttempt) {
        setAttempt(foundAttempt);
      } else {
        // If no attempt is found, maybe redirect to dashboard
        router.replace('/dashboard');
      }
    }
  }, [params.testId, router]);

  if (!attempt) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>Loading results...</p>
      </div>
    );
  }

  const { iqScore, validityReport, isPractice } = attempt;
  const validityInfo = ValidityDisplay[validityReport.status];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 flex items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
             <Logo/>
          </div>
          <CardTitle className="text-2xl">Your Test Results</CardTitle>
          <CardDescription>Completed on {new Date(attempt.completedAt).toLocaleDateString()}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
            className="text-center p-8 bg-primary/5 rounded-lg border border-primary/20 relative"
          >
            {isPractice && (
                <Badge variant="outline" className="absolute top-2 right-2">Practice Attempt</Badge>
            )}
            <p className="text-sm font-medium text-primary">Your Estimated IQ Score</p>
            <p className="text-7xl font-bold text-primary">{iqScore}</p>
          </motion.div>

          <div className="space-y-4">
             <div className={`flex items-start gap-4 p-4 rounded-lg border ${validityInfo.color.replace('bg-', 'border-')}`}>
                {validityInfo.icon}
                <div>
                    <h3 className="font-semibold">{validityInfo.text}</h3>
                    <p className="text-sm">{validityInfo.description}</p>
                </div>
            </div>

            {validityReport.warnings.length > 0 && (
                <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="text-sm font-semibold mb-2">Potential Issues Detected:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {validityReport.warnings.map((warning, i) => (
                            <li key={i}>{warning}</li>
                        ))}
                    </ul>
                </div>
            )}
          </div>
          
          <div className="text-center text-xs text-muted-foreground p-4 border-t">
            <strong>Disclaimer:</strong> This is an informational tool for personal insight and entertainment. It is not a substitute for a professional clinical assessment.
          </div>

        </CardContent>
        <CardFooter>
          <Button onClick={() => router.push('/dashboard')} className="w-full">
            Back to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
