import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Share2, RotateCcw, Check } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Confetti from '@/components/Confetti';
import { useBackgroundMusic } from '@/hooks/useBackgroundMusic';

export default function ValentinePage() {
  const [stage, setStage] = useState<'question' | 'celebration'>('question');
  const [noClickCount, setNoClickCount] = useState(0);
  const [showCopied, setShowCopied] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const { isEnabled: musicEnabled, toggle: toggleMusic } = useBackgroundMusic();

  const yesButtonScale = 1 + noClickCount * 0.3;
  const noButtonScale = Math.max(0.3, 1 - noClickCount * 0.15);

  useEffect(() => {
    if (stage === 'question') {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 600);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  const handleNoClick = () => {
    setNoClickCount((prev) => prev + 1);
  };

  const handleYesClick = () => {
    setStage('celebration');
    setNoClickCount(0);
  };

  const handleStartOver = () => {
    setStage('question');
    setNoClickCount(0);
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Will you be my Valentine?',
      text: 'Someone wants to ask you something special... 💝',
      url: window.location.href
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
      }
    } catch (err) {
      // User cancelled or error occurred
      console.log('Share cancelled or failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 dark:from-rose-950 dark:via-pink-950 dark:to-red-950">
      <Header musicEnabled={musicEnabled} onMusicToggle={toggleMusic} />
      
      <main className="flex-1 flex items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Background pattern */}
        <div 
          className="absolute inset-0 opacity-5 dark:opacity-10"
          style={{
            backgroundImage: 'url(/assets/generated/valentine-pattern.dim_2048x2048.png)',
            backgroundSize: '400px 400px',
            backgroundRepeat: 'repeat'
          }}
        />

        {stage === 'question' ? (
          <div
            className={`relative z-10 max-w-2xl w-full transition-all duration-400 ${
              isAnimating ? 'opacity-0 scale-90' : 'opacity-100 scale-100'
            }`}
          >
            <div className="text-center space-y-8">
              {/* Name */}
              <h2
                className="text-4xl md:text-5xl font-bold text-rose-600 dark:text-rose-400 animate-fade-in-down"
                style={{ fontFamily: "'Pacifico', cursive" }}
              >
                Tannu
              </h2>

              {/* First GIF */}
              <div className="flex justify-center animate-fade-in-up">
                <img 
                  src="/assets/cat-love-you.gif" 
                  alt="Cat saying I love you"
                  className="w-64 h-auto rounded-2xl drop-shadow-2xl"
                />
              </div>

              {/* Question */}
              <h1
                className="text-3xl md:text-4xl font-bold text-rose-600 dark:text-rose-400 animate-fade-in-up"
                style={{ fontFamily: "'Pacifico', cursive" }}
              >
                Will you be my valentine? 💕
              </h1>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8 animate-fade-in-up-delayed">
                {/* Yes Button */}
                <div
                  style={{
                    transform: `scale(${yesButtonScale})`,
                    transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  }}
                >
                  <Button
                    onClick={handleYesClick}
                    size="lg"
                    className="bg-rose-500 hover:bg-rose-600 text-white font-bold text-xl px-12 py-8 rounded-full shadow-2xl hover:shadow-rose-500/50 transition-all duration-300"
                  >
                    <Heart className="mr-2 h-6 w-6 fill-current" />
                    Yes!
                  </Button>
                </div>

                {/* No Button */}
                <div
                  style={{
                    transform: `scale(${noButtonScale})`,
                    transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  }}
                >
                  <Button
                    onClick={handleNoClick}
                    variant="outline"
                    size="lg"
                    className="font-bold text-lg px-8 py-6 rounded-full border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                  >
                    No
                  </Button>
                </div>
              </div>

              {/* Hint text */}
              {noClickCount > 0 && (
                <p className="text-rose-500 dark:text-rose-400 text-lg font-medium animate-fade-in">
                  {noClickCount === 1 && "Are you sure? 🥺"}
                  {noClickCount === 2 && "Please reconsider... 💕"}
                  {noClickCount === 3 && "The Yes button is getting bigger! 💝"}
                  {noClickCount >= 4 && "You know you want to say yes! 💖"}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="relative z-10 max-w-2xl w-full animate-scale-in">
            <Confetti />
            
            <div className="text-center space-y-8">
              {/* Name */}
              <h2
                className="text-4xl md:text-5xl font-bold text-rose-600 dark:text-rose-400 animate-fade-in-down"
                style={{ fontFamily: "'Pacifico', cursive" }}
              >
                Tannu
              </h2>

              {/* Second GIF */}
              <div className="flex justify-center animate-bounce-in">
                <img 
                  src="/assets/hai.gif" 
                  alt="Celebration"
                  className="w-64 h-auto rounded-2xl drop-shadow-2xl"
                />
              </div>

              {/* Success message */}
              <div className="space-y-4 animate-fade-in-up">
                <h1
                  className="text-5xl md:text-7xl font-bold text-rose-600 dark:text-rose-400"
                  style={{ fontFamily: "'Pacifico', cursive" }}
                >
                  Yay! You're my valentine 😘
                </h1>
                <p className="text-base md:text-lg text-gray-600 dark:text-gray-400">
                  I knew you would say yes baby hehehehe
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 animate-fade-in-up-delayed">
                <Button
                  onClick={handleShare}
                  size="lg"
                  variant="outline"
                  className="font-semibold px-8 py-6 rounded-full border-2 border-rose-300 dark:border-rose-700 hover:bg-rose-50 dark:hover:bg-rose-900/20 relative"
                >
                  {showCopied ? (
                    <>
                      <Check className="mr-2 h-5 w-5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Share2 className="mr-2 h-5 w-5" />
                      Share the love
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={handleStartOver}
                  size="lg"
                  variant="ghost"
                  className="font-semibold px-8 py-6 rounded-full hover:bg-rose-100 dark:hover:bg-rose-900/20"
                >
                  <RotateCcw className="mr-2 h-5 w-5" />
                  Start over
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
