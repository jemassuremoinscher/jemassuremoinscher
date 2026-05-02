import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Loader2, User, UserCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAnalytics } from "@/hooks/useAnalytics";
import { TransferDialog } from "./TransferDialog";
import { useLanguage } from "@/contexts/LanguageContext";
import arthurWaving from "@/assets/mascotte/arthur-waving.webp";
import arthurThumbsUp from "@/assets/mascotte/arthur-thumbs-up.webp";

interface Message { role: "user" | "assistant"; content: string; }

export const AIChatbot = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", content: t('chatbot.greeting') }]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [isBusinessHours, setIsBusinessHours] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { trackEvent } = useAnalytics();

  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); };
  const checkBusinessHours = () => { const now = new Date(); const day = now.getDay(); const hour = now.getHours(); setIsBusinessHours(day >= 1 && day <= 5 && hour >= 9 && hour < 18); };

  useEffect(() => { scrollToBottom(); }, [messages]);
  useEffect(() => { checkBusinessHours(); const interval = setInterval(checkBusinessHours, 60000); return () => clearInterval(interval); }, []);
  useEffect(() => {
    const open = () => setIsOpen(true);
    window.addEventListener('open-chatbot', open);
    return () => window.removeEventListener('open-chatbot', open);
  }, []);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;
    const userMessage: Message = { role: "user", content: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-chatbot', { body: { messages: [...messages, userMessage] } });
      if (error) throw error;
      if (data?.message) { setMessages(prev => [...prev, { role: "assistant", content: data.message }]); trackEvent('chatbot_message', { category: 'engagement', label: 'ai_response_received' }); }
      else throw new Error("Invalid response");
    } catch (error) {
      console.error('Chatbot error:', error);
      toast.error(t('chatbot.errorTitle'), { description: t('chatbot.errorDesc') });
      setMessages(prev => [...prev, { role: "assistant", content: t('chatbot.errorMessage') }]);
    } finally { setIsLoading(false); }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

  return (
    <>
      {!isOpen && (
        <Button onClick={() => setIsOpen(true)} className="hidden lg:flex fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-elegant hover:shadow-glow z-50 bg-gradient-primary hover:scale-110 transition-all duration-300 focus:ring-2 focus:ring-primary focus:ring-offset-2 animate-pulse-subtle" aria-label={t('chatbot.openLabel')}>
          <MessageCircle className="h-6 w-6" aria-hidden="true" />
        </Button>
      )}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-[380px] h-[600px] shadow-elegant z-50 flex flex-col animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-gradient-primary text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={arthurWaving} alt="Arthur" className="h-10 w-10 object-contain drop-shadow-md" width={40} height={40} />
              <div><h3 className="font-semibold">{t('chatbot.title')}</h3><p className="text-xs opacity-90">{t('chatbot.online')}</p></div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/10" aria-label={t('chatbot.closeLabel')}><X className="h-5 w-5" /></Button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
            {messages.map((message, index) => (
              <div key={index} className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {message.role === 'user' ? (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-primary text-primary-foreground">
                    <User className="h-4 w-4" />
                  </div>
                ) : (
                  <img src={arthurThumbsUp} alt="Arthur" className="flex-shrink-0 w-8 h-8 object-contain" width={32} height={32} />
                )}
                <div className={`flex-1 rounded-lg p-3 ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card border'}`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (<div className="flex gap-3"><img src={arthurThumbsUp} alt="Arthur réfléchit" className="flex-shrink-0 w-8 h-8 object-contain animate-pulse" width={32} height={32} /><div className="bg-card border rounded-lg p-3"><Loader2 className="h-4 w-4 animate-spin" /></div></div>)}
            <div ref={messagesEndRef} />
          </div>
          <div className="border-t p-4 bg-background space-y-3">
            {isBusinessHours && (<Button onClick={() => setShowTransferDialog(true)} variant="outline" size="sm" className="w-full text-primary hover:bg-primary/10"><UserCircle className="h-4 w-4 mr-2" />{t('chatbot.talkToHuman')}</Button>)}
            <div className="flex gap-2">
              <Input value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} onKeyPress={handleKeyPress} placeholder={t('chatbot.placeholder')} disabled={isLoading} className="flex-1" aria-label="Message" />
              <Button onClick={sendMessage} disabled={!inputMessage.trim() || isLoading} size="icon" aria-label={t('chatbot.sendLabel')}><Send className="h-4 w-4" /></Button>
            </div>
            <p className="text-xs text-muted-foreground text-center">{t('chatbot.footer')}{isBusinessHours && ` ${t('chatbot.advisorsAvailable')}`}</p>
          </div>
        </Card>
      )}
      <TransferDialog isOpen={showTransferDialog} onClose={() => setShowTransferDialog(false)} messages={messages} />
    </>
  );
};