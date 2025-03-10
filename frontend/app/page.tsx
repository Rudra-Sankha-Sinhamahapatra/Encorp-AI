'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Presentation, Sparkles, Clock, Check, Users, Shield, Zap, Star } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="container px-4 py-24 mx-auto text-center">
        <motion.h1 
          className="text-4xl md:text-6xl font-bold mb-6 gradient-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Create Stunning Presentations with AI
        </motion.h1>
        <motion.p 
          className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Transform your ideas into professional presentations in minutes using the power of artificial intelligence.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link href="/auth/signup">
            <Button size="lg" className="mr-4">
              Get Started <ArrowRight className="ml-2" />
            </Button>
          </Link>
          <Link href="/create">
            <Button variant="secondary" className='border border-violet-400' size="lg">
              Create <Sparkles className='ml-2'/>
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container px-4 py-16 mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 gradient-text">Why Choose Encorp?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Sparkles className="w-8 h-8 text-primary" />,
              title: "AI-Powered Generation",
              description: "Create professional presentations with just a prompt using advanced AI technology."
            },
            {
              icon: <Clock className="w-8 h-8 text-primary" />,
              title: "Save Time",
              description: "Generate complete presentations in minutes instead of hours."
            },
            {
              icon: <Presentation className="w-8 h-8 text-primary" />,
              title: "Beautiful Templates",
              description: "Access a wide range of professionally designed templates."
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="glass-card p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container px-4 py-16 mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 gradient-text">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            {
              step: "1",
              title: "Sign Up",
              description: "Create your account in seconds",
              icon: <Users className="w-6 h-6" />
            },
            {
              step: "2",
              title: "Enter Topic",
              description: "Describe your presentation topic",
              icon: <Zap className="w-6 h-6" />
            },
            {
              step: "3",
              title: "AI Generation",
              description: "Our AI creates your slides",
              icon: <Sparkles className="w-6 h-6" />
            },
            {
              step: "4",
              title: "Download",
              description: "Get your presentation instantly",
              icon: <ArrowRight className="w-6 h-6" />
            }
          ].map((step, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-400">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container px-4 py-16 mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 gradient-text">Benefits</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              title: "Time Efficiency",
              description: "Create presentations 10x faster than traditional methods",
              icon: <Clock className="w-6 h-6 text-primary" />
            },
            {
              title: "Professional Design",
              description: "Get access to premium templates and layouts",
              icon: <Presentation className="w-6 h-6 text-primary" />
            },
            {
              title: "Easy to Use",
              description: "No design skills required - just describe your needs",
              icon: <Check className="w-6 h-6 text-primary" />
            },
            {
              title: "Secure Platform",
              description: "Your content is always private and protected",
              icon: <Shield className="w-6 h-6 text-primary" />
            }
          ].map((benefit, index) => (
            <motion.div
              key={index}
              className="glass-card p-6 flex items-start gap-4"
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <div className="shrink-0">{benefit.icon}</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-400">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container px-4 py-16 mx-auto text-center">
        <motion.div
          className="glass-card p-12 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-4 gradient-text">Ready to Transform Your Presentations?</h2>
          <p className="text-lg text-gray-400 mb-8">Join thousands of users who are creating stunning presentations with AI</p>
          <Link href="/auth/signup">
            <Button size="lg">
              Get Started Now <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </motion.div>
      </section>
    </main>
  );
}