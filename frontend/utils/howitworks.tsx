import { ArrowRight, Sparkles, Users, Zap } from "lucide-react";


export const howitWorks = [
        {
          step: "1",
          title: "Sign Up",
          description: "Create your account in seconds",
          icon: <Users className="w-6 h-6 text-violet-400" />,
        },
        {
          step: "2",
          title: "Enter Topic",
          description: "Describe your presentation topic",
          icon: <Zap className="w-6 h-6 text-blue-400" />,
        },
        {
          step: "3",
          title: "AI Generation",
          description: "Our AI creates your slides instantly",
          icon: <Sparkles className="w-6 h-6 text-cyan-400" />,
        },
        {
          step: "4",
          title: "Download",
          description: "Get your presentation instantly",
          icon: <ArrowRight className="w-6 h-6 text-purple-400" />,
        },
      ]