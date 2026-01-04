import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AuthModal from './auth/AuthModal';
import { Menu, X } from 'lucide-react';

const LandingHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeAuthTab, setActiveAuthTab] = useState<"login" | "register">("login");

  return (
    <header className="w-full py-4 px-4 lg:px-8 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">P</div>
          <span className="text-lg font-bold">PrepSmart</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <nav>
            <ul className="flex items-center gap-6">
              <li>
                <a 
                  href="#features" 
                  onClick={(e) => { e.preventDefault(); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }}
                  className="text-sm hover:text-primary transition-colors cursor-pointer"
                >
                  Features
                </a>
              </li>
              <li>
                <a 
                  href="#exams" 
                  onClick={(e) => { e.preventDefault(); document.getElementById('exams')?.scrollIntoView({ behavior: 'smooth' }); }}
                  className="text-sm hover:text-primary transition-colors cursor-pointer"
                >
                  Exams
                </a>
              </li>
              <li><Link to="/blog" className="text-sm hover:text-primary transition-colors">Blog</Link></li>
              <li><Link to="/current-affairs" className="text-sm hover:text-primary transition-colors">Current Affairs</Link></li>
              <li><Link to="/exam-notifications" className="text-sm hover:text-primary transition-colors">Exam Alerts</Link></li>
              <li><Link to="/downloads" className="text-sm hover:text-primary transition-colors">Downloads</Link></li>
              <li><Link to="/pricing" className="text-sm hover:text-primary transition-colors">Pricing</Link></li>
            </ul>
          </nav>
          
          <div className="flex items-center gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" onClick={() => setActiveAuthTab("login")}>Login</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] max-w-[95vw]">
                <AuthModal activeTab={activeAuthTab} setActiveTab={setActiveAuthTab} />
              </DialogContent>
            </Dialog>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button onClick={() => setActiveAuthTab("register")}>Sign Up</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] max-w-[95vw]">
                <AuthModal activeTab={activeAuthTab} setActiveTab={setActiveAuthTab} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-background z-50 border-b shadow-md">
          <nav className="max-w-7xl mx-auto px-4 py-4">
            <ul className="flex flex-col gap-4">
              <li>
                <a 
                  href="#features" 
                  onClick={(e) => { e.preventDefault(); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); setIsMenuOpen(false); }}
                  className="block py-2"
                >
                  Features
                </a>
              </li>
              <li>
                <a 
                  href="#exams" 
                  onClick={(e) => { e.preventDefault(); document.getElementById('exams')?.scrollIntoView({ behavior: 'smooth' }); setIsMenuOpen(false); }}
                  className="block py-2"
                >
                  Exams
                </a>
              </li>
              <li><Link to="/blog" className="block py-2" onClick={() => setIsMenuOpen(false)}>Blog</Link></li>
              <li><Link to="/current-affairs" className="block py-2" onClick={() => setIsMenuOpen(false)}>Current Affairs</Link></li>
              <li><Link to="/exam-notifications" className="block py-2" onClick={() => setIsMenuOpen(false)}>Exam Alerts</Link></li>
              <li><Link to="/downloads" className="block py-2" onClick={() => setIsMenuOpen(false)}>Downloads</Link></li>
              <li><Link to="/pricing" className="block py-2" onClick={() => setIsMenuOpen(false)}>Pricing</Link></li>
              <li className="pt-2 border-t">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full" onClick={() => setActiveAuthTab("login")}>Login</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px] max-w-[95vw]">
                    <AuthModal activeTab={activeAuthTab} setActiveTab={setActiveAuthTab} />
                  </DialogContent>
                </Dialog>
              </li>
              <li>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full" onClick={() => setActiveAuthTab("register")}>Sign Up</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px] max-w-[95vw]">
                    <AuthModal activeTab={activeAuthTab} setActiveTab={setActiveAuthTab} />
                  </DialogContent>
                </Dialog>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default LandingHeader;
