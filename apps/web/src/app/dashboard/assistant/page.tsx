"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck, MessageSquare, Send, Bot, User, Activity, AlertTriangle, ShieldAlert, Sparkles } from 'lucide-react';
import { api } from '@/lib/api';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: Date;
  meta?: {
    type: 'scan_report';
    score: number;
    risk: string;
    company: string;
    flags: string[];
  };
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [scans, setScans] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set initial greeting
    setMessages([
      {
        id: '1',
        sender: 'bot',
        text: "Hello! I am HireShield AI. I can review your scan logs and explain security indicators. You can ask me questions like 'Is my recent scan safe?' or ask about general recruitment scams.",
        timestamp: new Date()
      }
    ]);
    loadHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const loadHistory = async () => {
    try {
      const data = await api.getHistory();
      setScans(data);
    } catch (e) {
      console.warn("Assistant failed to fetch audit history:", e);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Math.random().toString(),
      sender: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const query = inputValue.toLowerCase();
    setInputValue('');
    setIsTyping(true);

    // Refresh history
    await loadHistory();

    setTimeout(() => {
      let responseText = "";
      let reportMeta: Message['meta'] = undefined;

      if (query.includes('safe') || query.includes('check') || query.includes('scan') || query.includes('recent')) {
        if (scans.length === 0) {
          responseText = "I don't see any recent scan history in your workspace databases. Go to the 'Verify Scanner' and run an audit on a description first, then ask me to explain it!";
        } else {
          // Explaining the most recent scan
          const recent = scans[0];
          let flagsList: string[] = [];
          try {
            flagsList = JSON.parse(recent.redFlags || '[]');
          } catch (e) {}

          const company = recent.companyName || 'Unknown Employer';
          const score = recent.fraudScore;
          
          if (recent.riskLevel === 'High Risk' || recent.riskLevel === 'Critical Risk') {
            responseText = `⚠️ I found a High-Risk threat in your recent scan logs for "${company}". The posting scored a ${score}% Fraud Risk.\n\nHere are the critical security triggers that were flagged:`;
            reportMeta = {
              type: 'scan_report',
              score,
              risk: recent.riskLevel,
              company,
              flags: flagsList.length > 0 ? flagsList : ["Suspicious communication apps matching money mule check processing indicators."]
            };
          } else if (recent.riskLevel === 'Suspicious') {
            responseText = `⚠️ The scan for "${company}" is marked as Suspicious (${score}% score). We detected some abnormal communication and domain verification parameters. I advise requesting email correspondence from their official corporate domain before sharing files.`;
            reportMeta = {
              type: 'scan_report',
              score,
              risk: recent.riskLevel,
              company,
              flags: flagsList
            };
          } else {
            responseText = `✅ Your scan of "${company}" is classified as Safe (${score}% score). Our NLP model did not match any phishing keywords, remote access setups, or advance fee check indicators. It appears to be a standard career announcement.`;
          }
        }
      } else if (query.includes('advance') || query.includes('fee') || query.includes('check')) {
        responseText = "An **Advance Fee Scam** occurs when a fake recruiter offers to mail you a check to buy 'home office equipment'. They ask you to deposit the check via mobile app and immediately transfer a portion back to a 'vendor'. The check eventually bounces, leaving you liable for the lost funds. Never transfer funds or purchase vouchers using check checks.";
      } else if (query.includes('remote') || query.includes('anydesk') || query.includes('teamviewer')) {
        responseText = "Be extremely careful if a job requires you to download **AnyDesk** or **TeamViewer** for an 'interview' or 'training'. Scammers use this remote access software to connect to your personal laptop and siphon login credentials or banking passwords.";
      } else if (query.includes('identity') || query.includes('ssn') || query.includes('passport')) {
        responseText = "Legitimate companies do not request your **SSN**, **Passport photos**, or **Bank Account credentials** during early application stages. Scammers use fake recruiter profiles to harvest these details for identity theft. Only share tax documentation after receiving an official, verified offer letter.";
      } else {
        responseText = "I can explain fraud patterns such as 'Advance Fee Scams', 'Identity Theft', or 'Remote Access Scams'. Alternatively, ask me to 'check my scan history' to parse your database entries.";
      }

      setMessages(prev => [...prev, {
        id: Math.random().toString(),
        sender: 'bot',
        text: responseText,
        timestamp: new Date(),
        meta: reportMeta
      }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto h-[calc(100vh-10rem)] flex flex-col justify-between">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          HireShield AI <Sparkles className="w-5 h-5 text-blue-400" />
        </h1>
        <p className="text-slate-400 text-sm">Conversational assistant analyzing scan histories and scam markers.</p>
      </div>

      {/* Chat Messages Panel */}
      <Card className="flex-1 bg-slate-900/40 border-slate-900 backdrop-blur flex flex-col justify-between overflow-hidden min-h-0">
        <CardContent className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isBot = msg.sender === 'bot';
            return (
              <div key={msg.id} className={`flex gap-3 max-w-[85%] ${isBot ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  isBot ? 'bg-blue-600/10 border border-blue-500/20 text-blue-400' : 'bg-purple-600/10 border border-purple-500/20 text-purple-400'
                }`}>
                  {isBot ? <Bot className="w-4.5 h-4.5" /> : <User className="w-4.5 h-4.5" />}
                </div>
                
                <div className="space-y-2">
                  <div className={`p-3.5 rounded-xl text-xs leading-relaxed ${
                    isBot ? 'bg-slate-950 border border-slate-900 text-slate-300' : 'bg-blue-600 text-white font-medium shadow-lg shadow-blue-500/10'
                  }`}>
                    {msg.text.split('\n').map((line, idx) => (
                      <p key={idx} className={idx > 0 ? 'mt-1.5' : ''}>{line}</p>
                    ))}
                  </div>

                  {/* Attachment metadata report */}
                  {msg.meta && msg.meta.type === 'scan_report' && (
                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-900 space-y-2 text-xs">
                      <div className="flex items-center justify-between font-semibold">
                        <span className="text-slate-200">{msg.meta.company} Audit</span>
                        <span className="text-red-400 font-bold">{msg.meta.score}% Risk</span>
                      </div>
                      <ul className="space-y-1">
                        {msg.meta.flags.map((flag, idx) => (
                          <li key={idx} className="flex gap-2 text-red-300 text-[10px]">
                            <ShieldAlert className="w-3.5 h-3.5 text-red-500 shrink-0" />
                            {flag}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {isTyping && (
            <div className="flex gap-3 mr-auto items-center text-slate-500 text-xs">
              <div className="w-8 h-8 rounded-lg bg-blue-600/5 border border-blue-500/10 flex items-center justify-center text-blue-400">
                <Bot className="w-4.5 h-4.5" />
              </div>
              <span className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 animate-pulse" /> Consulting NLP index...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>

        <CardFooter className="p-4 border-t border-slate-900 bg-slate-950/40">
          <form onSubmit={handleSend} className="w-full flex gap-3">
            <Input
              placeholder="Ask: 'Is my recent scan safe?' or 'Explain advance fee scams'..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 bg-slate-950 border-slate-900 text-xs text-slate-300"
            />
            <Button type="submit" size="icon" className="bg-blue-600 hover:bg-blue-500" disabled={isTyping || !inputValue.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
