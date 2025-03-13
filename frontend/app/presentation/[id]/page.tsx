'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, ArrowLeft, ArrowRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { PresentationProps as PresentationData } from '@/types/types';
import { ExportButton } from '@/components/ExportButton';

export default function PresentationViewerPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [presentation, setPresentation] = useState<PresentationData | null>(null);
  const [status, setStatus] = useState<string>('PENDING');
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  const fetchPresentation = useCallback(async () => {
    try {
      const response = await api.get(`/presentation/${id}`);
      setPresentation(response.data.presentation);
      setStatus(response.data.status);
      setProgress(100);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching presentation:', error);
      toast.error('Failed to load presentation');
      setLoading(false);
    }
  }, [id]);

  const checkPresentationStatus = useCallback(async () => {
    try {
      const response = await api.get(`/presentation/status/${id}`);
      const newStatus = response.data.status;
      setStatus(newStatus);
      
      if (newStatus === 'COMPLETED') {
        fetchPresentation();
      } else if (newStatus === 'FAILED') {
        toast.error('Presentation generation failed');
        setLoading(false);
      } else {
        setProgress((prev) => Math.min(prev + 5, 95));
      }
    } catch (error) {
      console.error('Error checking presentation status:', error);
      setLoading(false);
    }
  }, [fetchPresentation, id]);

  useEffect(() => {
    checkPresentationStatus();
    
    // Poll for status updates every 3 seconds if not completed
    const interval = setInterval(() => {
      if (status !== 'COMPLETED' && status !== 'FAILED') {
        checkPresentationStatus();
      } else {
        clearInterval(interval);
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [checkPresentationStatus, id, status]);

  const nextSlide = () => {
    if (presentation?.slides && currentSlide < presentation.slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' && presentation?.slides && currentSlide < presentation.slides.length - 1) {
        setCurrentSlide(currentSlide + 1);
      } else if (event.key === 'ArrowLeft' && currentSlide > 0) {
        setCurrentSlide(currentSlide - 1);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [currentSlide, presentation]);

  if (loading || status === 'PENDING' || status === 'PROCESSING') {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4">
        <div className="glass-card p-8 text-center max-w-md w-full">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-bold mb-2 gradient-text">
            Generating Your Presentation
          </h2>
          <p className="text-gray-400 mb-6">
            Our AI is crafting your slides. This may take a minute or two.
          </p>
          <Progress value={progress} className="mb-2" />
          <p className="text-xs text-gray-500">{progress}% complete</p>
        </div>
      </div>
    );
  }

  if (status === 'FAILED') {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4">
        <div className="glass-card p-8 text-center max-w-md w-full">
          <div className="bg-red-500/20 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <span className="text-red-300 text-2xl">✕</span>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-red-400">
            Generation Failed
          </h2>
          <p className="text-gray-400 mb-6">
            Something went wrong while creating your presentation. Please try again with a different prompt.
          </p>
          <Button onClick={() => router.push('/create')}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!presentation) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4">
        <div className="glass-card p-8 text-center max-w-md w-full">
          <h2 className="text-2xl font-bold mb-2 text-red-400">
            Presentation Not Found
          </h2>
          <p className="text-gray-400 mb-6">
            We couldn&apos;t find the presentation you&apos;re looking for.
          </p>
          <Button onClick={() => router.push('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => router.push('/dashboard')}
        >
          <Home className="h-4 w-4 mr-2" /> Dashboard
        </Button>
        
        <div className="text-center">
          <h1 className="text-xl font-bold gradient-text">{presentation.title}</h1>
          <p className="text-sm text-gray-400">
            Slide {currentSlide + 1} of {presentation.slides.length}
          </p>
        </div>
        <div className='flex gap-2'>
        <ExportButton presentation={presentation} />
        </div>
      </div>

      {presentation.slides.map((slide, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={`glass-card p-8 md:p-12 lg:aspect-[20/12] md:aspect-[20/13] xl:aspect-[20/10] 2xl:aspect-[20/8] flex flex-col justify-center ${index === currentSlide ? 'block' : 'hidden'}`}
          id={`slide-${index}`} 
        >
          {slide.type === 'title' ? (
            <div className="text-center">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 gradient-text">
                {slide.title}
              </h2>
              {slide.subtitle && (
                <p className="text-xl md:text-2xl text-gray-300">{slide.subtitle}</p>
              )}
            </div>
          ) : (
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6">{slide.title}</h2>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full">
                  {slide.bullets && (
                    <ul className="space-y-3 text-lg">
                      {slide.bullets.map((bullet, bulletIndex) => (
                        <motion.li 
                          key={bulletIndex} 
                          className="flex items-start"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: bulletIndex * 0.1 }}
                        >
                          <span className="text-primary mr-2 text-xl">•</span>
                          <span>{bullet}</span>
                        </motion.li>
                      ))}
                    </ul>
                  )}

                  {slide.description && (
                    <motion.div
                    initial={{opacity:0,y:10}}
                    animate={{opacity:1,y:0}}
                    transition={{duration:0.4,delay:0.3}}
                    className='text-gray-300 mt-4 border-t border-white/10 pt-4'
                    >
                     <p className='text-base leading-relaxed'>{slide.description}</p>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      ))}

      <div className="flex justify-between mt-6 gap-3">
        <Button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          variant="outline"
          className="w-32"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Previous
        </Button>
        
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-1">
            {presentation.slides.map((_, index) => (
              <button
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide 
                    ? 'w-4 bg-primary' 
                    : 'w-2 bg-gray-600 hover:bg-gray-500'
                }`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        <Button
          onClick={nextSlide}
          disabled={currentSlide === presentation.slides.length - 1}
          className="w-32"
        >
          Next <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
      
      <div className="text-center mt-6 text-xs text-gray-500">
        Use the arrow keys to navigate between slides
      </div>
    </div>
  );
}