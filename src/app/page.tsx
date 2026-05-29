'use client';

import { useQuizStore } from '@/lib/store';
import Welcome from '@/components/Welcome';
import Loading from '@/components/Loading';
import Quiz from '@/components/Quiz';
import Result from '@/components/Result';

export default function Home() {
  const appState = useQuizStore((state) => state.appState);
  const _hasHydrated = useQuizStore((state) => state._hasHydrated);

  if (!_hasHydrated) {
    return <Loading />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {appState === 'welcome' && <Welcome />}
      {appState === 'quiz' && <Quiz />}
      {appState === 'result' && <Result />}
    </main>
  );
}
