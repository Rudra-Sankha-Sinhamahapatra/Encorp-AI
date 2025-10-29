'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, ArrowLeft, ArrowRight, Home, Pencil, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import api from '@/lib/axios';
import { toast } from 'sonner';
import { PresentationProps as PresentationData } from '@/types/types';
import { ExportButton } from '@/components/ExportButton';
import Cookies from 'js-cookie';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function PresentationViewerPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [presentation, setPresentation] = useState<PresentationData | null>(null);
  const [status, setStatus] = useState<string>('PENDING');
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPresentation, setEditedPresentation] = useState<PresentationData | null>(null);
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
      if (
        isEditing && 
        (event.target as HTMLElement).tagName.toLowerCase() === 'input' ||
        (event.target as HTMLElement).tagName.toLowerCase() === 'textarea'
      ) {
        return;
      }

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
  }, [currentSlide, presentation, isEditing]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedPresentation(presentation);
  };

  const handleSave = async () => {
    try {
      await api.put(`/presentation/${id}`, {
        presentation: editedPresentation,
        userId: Cookies.get("userId")
      });
      setPresentation(editedPresentation);
      setIsEditing(false);
      toast.success('Changes saved successfully');
    } catch (error) {
      console.error('Error saving presentation:', error);
      toast.error('Failed to save changes');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedPresentation(presentation);
  };

  const autoResizeTextarea = (element: HTMLTextAreaElement) => {
    element.style.height = 'auto';
    element.style.height = element.scrollHeight + 'px';
  };

  const updateSlideContent = (index: number, field: string, value: string | string[]) => {
    if (!editedPresentation) return;
    
    const newSlides = [...editedPresentation.slides];
    newSlides[index] = {
      ...newSlides[index],
      [field]: value
    };

    setEditedPresentation({
      ...editedPresentation,
      slides: newSlides
    });
  };

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
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-6xl">
      <div className="md:flex justify-between items-center mb-6">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => router.push('/dashboard')}
          className='max-md:mb-2'
        >
          <Home className="h-4 w-4 mr-2" /> Dashboard
        </Button>
        
        <div className="text-center flex-1 max-w-2xl"> 
          <h1 className="text-xl font-bold">
            {isEditing ? (
              <Textarea
                value={editedPresentation?.title || ''}
                onChange={(e) => setEditedPresentation(prev => prev ? {...prev, title: e.target.value} : prev)}
                className="w-full text-center bg-transparent border-none focus:border-none resize-none min-h-[60px] title-gradient-text"
                onKeyDown={(e) => e.stopPropagation()}
                style={{
                  background: 'transparent',
                  boxShadow: 'none',
                  fontSize: 'inherit',
                  fontWeight: 'inherit',
                }}
              />
            ) : (
              <span className="gradient-text">{presentation?.title}</span>
            )}
          </h1>
          <p className="text-sm text-gray-400 max-sm:mb-4">
            Slide {currentSlide + 1} of {presentation?.slides.length}
          </p>
        </div>

        <div className='flex gap-2'>
          {isEditing ? (
            <>
              <Button variant="outline" size="sm" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" /> Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" /> Save
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={handleEdit}>
                <Pencil className="h-4 w-4 mr-2" /> Edit
              </Button>
              <ExportButton presentation={presentation} />
            </>
          )}
        </div>
      </div>

      {(isEditing ? editedPresentation : presentation)?.slides.map((slide, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={`glass-card p-4 sm:p-6 md:p-12 min-h-[400px] sm:min-h-[500px] md:min-h-[600px] flex flex-col justify-center overflow-hidden ${
            index === currentSlide ? 'block' : 'hidden'
          }`}
          id={`slide-${index}`} 
        >
          {slide.type === 'title' ? (
            <div className="text-center h-full flex flex-col justify-center"> 
              {isEditing ? (
                <>
                  <Textarea 
                    value={slide.title}
                    onChange={(e) => {
                      updateSlideContent(index, 'title', e.target.value);
                      autoResizeTextarea(e.target);
                    }}
                    className="slide-textarea text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-center gradient-text-input"
                    onKeyDown={(e) => e.stopPropagation()}
                  />
                  {slide.subtitle !== undefined && (
                    <Textarea
                      value={slide.subtitle || ''}
                      onChange={(e) => updateSlideContent(index, 'subtitle', e.target.value)}
                      className="slide-textarea text-xl md:text-2xl text-center bg-transparent border-none resize-none min-h-[100px]"
                      placeholder="Add subtitle"
                      style={{
                        background: 'transparent',
                        boxShadow: 'none',
                      }}
                      onKeyDown={(e) => e.stopPropagation()}
                    />
                  )}
                </>
              ) : (
                <>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 gradient-text overflow-hidden text-ellipsis">
                    {slide.title}
                  </h2>
                  {slide.subtitle && (
                    <p className="text-lg sm:text-xl md:text-2xl text-gray-300 overflow-hidden text-ellipsis">{slide.subtitle}</p>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col">
              {isEditing ? (
                <Input
                  value={slide.title}
                  onChange={(e) => updateSlideContent(index, 'title', e.target.value)}
                  className="text-2xl md:text-3xl font-bold mb-6 bg-transparent"
                  onKeyDown={(e) => {
                    e.stopPropagation();
                  }}
                />
              ) : (
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-6 break-words">{slide.title}</h2>
              )}
              <div className="flex flex-col md:flex-row gap-3 sm:gap-6 md:gap-8 overflow-auto">
                <div className="w-full">
                  {slide.bullets && (
                    <div className="space-y-3 text-lg">
                      {isEditing ? (
                        slide.bullets.map((bullet, bulletIndex) => (
                          <div key={bulletIndex} className="flex items-start gap-2 mb-2">
                            <span className="text-primary mt-2">•</span>
                            <Textarea
                              value={bullet}
                              onChange={(e) => {
                                const newBullets = [...slide.bullets!];
                                newBullets[bulletIndex] = e.target.value;
                                updateSlideContent(index, 'bullets', newBullets);
                              }}
                              className="bg-transparent min-h-[60px] flex-1"
                              onKeyDown={(e) => {
                                e.stopPropagation();
                              }}
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              className="mt-2"
                              onClick={() => {
                                const newBullets = slide.bullets!.filter((_, i) => i !== bulletIndex);
                                updateSlideContent(index, 'bullets', newBullets);
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))
                      ) : (
                        <ul className="space-y-3">
                          {slide.bullets.map((bullet, bulletIndex) => (
                            <motion.li 
                              key={bulletIndex}
                              className="flex items-start"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: bulletIndex * 0.1 }}
                            >
                              <span className="text-primary mr-2 text-xl">•</span>
                              <span className="whitespace-pre-wrap">{bullet}</span>
                            </motion.li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

                  {isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={() => {
                        const newBullets = [...(slide.bullets || []), ''];
                        updateSlideContent(index, 'bullets', newBullets);
                      }}
                    >
                      Add Bullet Point
                    </Button>
                  )}

                  {(isEditing || slide.description) && (
                    <motion.div
                      initial={{opacity:0,y:10}}
                      animate={{opacity:1,y:0}}
                      transition={{duration:0.4,delay:0.3}}
                      className='text-gray-300 mt-4 border-t border-white/10 pt-4'
                    >
                      {isEditing ? (
                        <Textarea
                          value={slide.description || ''}
                          onChange={(e) => updateSlideContent(index, 'description', e.target.value)}
                          className="bg-transparent min-h-[100px]"
                          placeholder="Add description"
                          onKeyDown={(e) => {
                            e.stopPropagation();
                          }}
                        />
                      ) : (
                        <p className='text-base leading-relaxed whitespace-pre-wrap'>{slide.description}</p>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      ))}

      <div className="flex flex-wrap justify-between mt-6 gap-2 px-1">
        <Button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          variant="outline"
          className="w-[45%] sm:w-32 text-sm sm:text-base py-1 h-auto"
          size="sm"
        >
          <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" /> <span className="sm:inline">Previous</span>
        </Button>
        
        <Button
          onClick={nextSlide}
          disabled={currentSlide === presentation.slides.length - 1}
          className="w-[45%] sm:w-32 text-sm sm:text-base py-1 h-auto ml-auto"
          size="sm"
        >
          <span className="sm:inline">Next</span> <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2" />
        </Button>
        
        <div className="w-full mt-4 flex justify-center">
          <div className="flex items-center gap-1 overflow-x-auto py-2 max-w-full">
            {presentation.slides.map((_, index) => (
              <button
                key={index}
                className={`h-2 rounded-full transition-all flex-shrink-0 ${
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
      </div>
      
      <div className="text-center mt-6 text-xs text-gray-500">
        Use the arrow keys to navigate between slides
      </div>
    </div>
  );
}