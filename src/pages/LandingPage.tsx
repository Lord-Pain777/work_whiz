import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Target, Users, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="py-6">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-8 w-8 text-white" />
              <span className="text-2xl font-bold text-white">Work Whiz</span>
            </div>
            <Button
              onClick={() => navigate('/login')}
              variant="light"
              className="px-6 py-2"
            >
              Sign In
            </Button>
          </nav>
        </header>

        {/* Hero Section */}
        <main className="pt-16 pb-24">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-bold text-white mb-6"
            >
              Transform Work into Adventure
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-purple-50 mb-12 max-w-2xl mx-auto"
            >
              Boost productivity through gamification. Complete tasks, earn points, and climb the leaderboard while achieving your goals.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                onClick={() => navigate('/login')}
                variant="light"
                size="lg"
                className="inline-flex items-center space-x-2"
              >
                <span>Get Started</span>
                <Trophy className="h-5 w-5" />
              </Button>
            </motion.div>
          </div>

          {/* Features */}
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/10 backdrop-blur-lg rounded-lg p-6"
            >
              <div className="bg-purple-400/20 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Task Management</h3>
              <p className="text-purple-50">
                Organize and track your tasks with an intuitive interface. Set priorities and never miss deadlines.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white/10 backdrop-blur-lg rounded-lg p-6"
            >
              <div className="bg-purple-400/20 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Point System</h3>
              <p className="text-purple-50">
                Earn points for completing tasks and maintaining streaks. Watch your progress grow over time.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white/10 backdrop-blur-lg rounded-lg p-6"
            >
              <div className="bg-purple-400/20 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Leaderboard</h3>
              <p className="text-purple-50">
                Compete with your colleagues in a friendly environment. Rise through the ranks as you achieve more.
              </p>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};