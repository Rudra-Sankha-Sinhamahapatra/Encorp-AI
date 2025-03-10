'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Loader2, Presentation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import api from '@/lib/axios';

const presentationSchema = z.object({
  prompt: z.string().min(10, 'Prompt must be at least 10 characters'),
  style: z.string(),
  slides: z.string(),
});

type PresentationForm = z.infer<typeof presentationSchema>;

export default function CreatePage() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const form = useForm<PresentationForm>({
    resolver: zodResolver(presentationSchema),
    defaultValues: {
      prompt: '',
      style: 'modern',
      slides: '10',
    },
  });

  const onSubmit = async (data: PresentationForm) => {
    try {
      setIsGenerating(true);
      setProgress(0);
      
      const response = await api.post('/presentation', data);
      const { jobId } = response.data;
      
      toast.success('Presentation generation started!');
      
      router.push(`/presentation/${jobId}`);
      
    } catch (error) {
      console.error('Error generating presentation:', error);
      toast.error('Failed to start presentation generation');
      setIsGenerating(false);
    }
  };

  return (
    <div className="py-12">
    <div className="container px-4 mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card max-w-2xl mx-auto p-8"
      >
          <div className="flex items-center gap-3 mb-6">
            <Presentation className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold gradient-text">Create Presentation</h1>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What&apos;s your presentation about?</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your presentation topic and key points..."
                        className="h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Be specific about your topic, audience, and desired outcome.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="style"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Presentation Style</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a style" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="modern">Modern & Minimal</SelectItem>
                          <SelectItem value="corporate">Corporate & Professional</SelectItem>
                          <SelectItem value="creative">Creative & Bold</SelectItem>
                          <SelectItem value="academic">Academic & Formal</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slides"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Slides</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select number of slides" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="5">5 slides</SelectItem>
                          <SelectItem value="10">10 slides</SelectItem>
                          <SelectItem value="15">15 slides</SelectItem>
                          <SelectItem value="20">20 slides</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating... {progress}%
                  </>
                ) : (
                  'Generate Presentation'
                )}
              </Button>
            </form>
          </Form>
        </motion.div>
      </div>
    </div>
  );
}