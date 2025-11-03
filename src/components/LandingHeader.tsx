
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AuthModal from './auth/AuthModal';
import { Menu, X } from 'lucide-react';

const LandingHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeAuthTab, setActiveAuthTab] = useState<"login" | "register">("login");

  return (
    <header className="w-full py-4 px-4 lg:px-8 border-b">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center text-white font-bold">P</div>
          <span className="text-lg font-bold">PrepSmart</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <nav>
            <ul className="flex items-center gap-6">
              <li><a href="#features" className="text-sm hover:text-brand-blue transition-colors">Features</a></li>
              <li><a href="#exams" className="text-sm hover:text-brand-blue transition-colors">Exams</a></li>
              <li><a href="#" className="text-sm hover:text-brand-blue transition-colors">Pricing</a></li>
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
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white z-50 border-b shadow-md">
          <nav className="max-w-7xl mx-auto px-4 py-4">
            <ul className="flex flex-col gap-4">
              <li><a href="#features" className="block py-2">Features</a></li>
              <li><a href="#exams" className="block py-2">Exams</a></li>
              <li><a href="#" className="block py-2">Pricing</a></li>
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
