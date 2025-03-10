import { Github, Linkedin, MonitorPlay, Twitter } from "lucide-react";
import Link from "next/link";

interface FooterProps {
    className?: string;
}

export const Footer = ({ className = "" }: FooterProps) => {   
    return (
        <footer className={`border-t border-white/10 py-8 backdrop-blur-xl bg-black/40 ${className}`}>
            <div className="container max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4 md:px-6">
                <div className="flex items-center gap-2 group">
                    <div className="bg-gradient-to-br from-primary/20 to-blue-600/20 p-2 rounded-lg group-hover:from-primary/30 group-hover:to-blue-600/30 transition-all duration-300">
                        <MonitorPlay className="h-5 w-5 text-primary group-hover:text-blue-400 transition-colors" />
                    </div>
                    <span className="font-bold text-lg gradient-text">Encorp AI</span>
                </div>
                
                <p className="text-center text-sm text-white/50 md:text-left">
                    &copy; {new Date().getFullYear()} Encorp AI. All rights reserved.
                </p>
                
                <div className="flex items-center gap-3">
                    <a 
                        href="https://github.com/Rudra-Sankha-Sinhamahapatra" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-gray-400 hover:text-primary hover:bg-white/5 p-1.5 rounded-full transition-colors"
                    >
                        <Github className="h-4 w-4" />
                    </a>
                    <a 
                        href="https://x.com/RudraSankha" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-gray-400 hover:text-primary hover:bg-white/5 p-1.5 rounded-full transition-colors"
                    >
                        <Twitter className="h-4 w-4" />
                    </a>
                    <a 
                        href="https://www.linkedin.com/in/rudra-sankha-sinhamahapatra-6311aa1bb/" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-gray-400 hover:text-primary hover:bg-white/5 p-1.5 rounded-full transition-colors"
                    >
                        <Linkedin className="h-4 w-4" />
                    </a>
                    <div className="border-l border-white/10 h-5 mx-2"></div>
                    <Link href="#" className="text-sm text-gray-400 hover:text-primary hover:bg-white/5 px-3 py-1.5 rounded-full transition-colors">
                        Privacy
                    </Link>
                    <Link href="#" className="text-sm text-gray-400 hover:text-primary hover:bg-white/5 px-3 py-1.5 rounded-full transition-colors">
                        Terms
                    </Link>
                </div>
            </div>
        </footer>
    );
}