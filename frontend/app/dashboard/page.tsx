'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import api from '@/lib/axios';
import { PlusCircle, Loader2, FileText, Clock } from 'lucide-react';

type Presentation = {
  id: string;
  prompt: string;
  status: string;
  createdAt: string;
};

export default function DashboardPage() {
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPresentations = async () => {
      try {
        const userId = Cookies.get('userId');
        const response = await api.get(`/presentation/user/${userId}`);
        setPresentations(response.data.presentations || []);
      } catch (error) {
        console.error('Error fetching presentations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPresentations();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-500/20 text-green-300';
      case 'FAILED':
        return 'bg-red-500/20 text-red-300';
      default:
        return 'bg-yellow-500/20 text-yellow-300';
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 mt-8">
        <h1 className="text-3xl font-bold gradient-text mb-4 md:mb-0">Your Presentations</h1>
        <Button 
          onClick={() => router.push('/create')}
          className="w-full md:w-auto"
        >
          <PlusCircle className="h-4 w-4 mr-2" /> Create New Presentation
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : presentations.length > 0 ? (
        <div className="grid gap-6">
          {presentations.map((presentation) => (
            <motion.div
              key={presentation.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="glass-card p-6"
              onClick={() => router.push(`/presentation/${presentation.id}`)}
              whileHover={{ scale: 1.01 }}
              style={{ cursor: 'pointer' }}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h3 className="font-medium text-lg mb-1">
                    <FileText className="inline-block mr-2 h-5 w-5 text-primary" />
                    {presentation.prompt.length > 50 
                      ? `${presentation.prompt.substring(0, 50)}...` 
                      : presentation.prompt}
                  </h3>
                  <div className="flex items-center text-sm text-gray-400">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{formatDate(presentation.createdAt)}</span>
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(presentation.status)}`}>
                    {presentation.status}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-8 text-center"
        >
          <h2 className="text-2xl font-semibold mb-4">No presentations yet</h2>
          <p className="text-gray-400 mb-6">
            Create your first AI-powered presentation to get started.
          </p>
          <Button onClick={() => router.push('/create')}>
            <PlusCircle className="h-4 w-4 mr-2" /> Create Presentation
          </Button>
        </motion.div>
      )}
    </div>
  );
}