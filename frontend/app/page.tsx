"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { features } from "@/utils/features";
import { howitWorks } from "@/utils/howitworks";
import { benefits } from "@/utils/benefits";

export default function Home() {
  return (
    <main className="min-h-screen">
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
          Transform your ideas into professional presentations in minutes using
          the power of artificial intelligence.
        </motion.p>

        <motion.div
          className="relative mx-auto mb-10 max-w-5xl group"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="absolute -inset-2 rounded-xl bg-gradient-to-r from-violet-600 to-primary opacity-75 blur-xl"></div>

          <motion.div
            className="absolute -inset-2 rounded-xl bg-gradient-to-r from-violet-500 via-primary to-blue-500 blur-xl"
            initial={{ opacity: 0.3 }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          ></motion.div>

          <div className="absolute -inset-3 rounded-xl bg-gradient-to-r from-purple-500 via-primary to-blue-500 opacity-0 group-hover:opacity-80 blur-xl transition-opacity duration-700"></div>

          <div className="relative overflow-hidden rounded-xl border border-white/10 transition-all duration-700 group-hover:border-primary/30">
            <Image
              src="https://pbs.twimg.com/media/G3XuWP0XIAAGAQx?format=jpg&name=medium"
              height={800}
              width={2000}
              className="w-full object-cover aspect-[16/9]"
              alt="Hero Image"
              priority
            />
          </div>
        </motion.div>

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
            <Button
              variant="secondary"
              className="border border-violet-400"
              size="lg"
            >
              Create <Sparkles className="ml-2" />
            </Button>
          </Link>
        </motion.div>
      </section>

      <section className="container px-4 py-16 mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 gradient-text">
          Why Choose Encorp?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          { features.map((feature, index) => (
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

      <section className="relative overflow-hidden px-4 py-16 mx-auto">

           <div className="relative container px-4 mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 gradient-text">
          How It Works
        </h2>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          { howitWorks.map((step, index) => (
            <motion.div
              key={index}
              className="text-center p-6 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-primary/30 transition-all duration-500"
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

      <section className="container px-4 py-16 mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 gradient-text">
          Benefits
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          { benefits.map((benefit, index) => (
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

      <section className="container px-4 py-16 mx-auto text-center">
        <motion.div
          className="glass-card p-12 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-4 gradient-text">
            Ready to Transform Your Presentations?
          </h2>
          <p className="text-lg text-gray-400 mb-8">
            Join thousands of users who are creating stunning presentations with
            AI
          </p>
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
