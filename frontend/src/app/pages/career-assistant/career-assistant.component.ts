import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiService } from '../../services/ai.service';
import { AuthService } from '../../services/auth.service';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

@Component({
  selector: 'app-career-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './career-assistant.component.html',
  styleUrls: ['./career-assistant.component.css'],
})
export class CareerAssistantComponent implements OnInit {
  private aiService = inject(AiService);
  authService = inject(AuthService);

  messages: ChatMessage[] = [];
  inputMessage = '';
  isLoading = false;
  conversationId: string | null = null;

  suggestedQuestions = [
    'How can I become a full-stack developer?',
    'What skills should I learn for Angular 19?',
    'Why am I not getting shortlisted for jobs?',
    'What projects should I build to stand out?',
    'What should I learn after Node.js & Express?',
  ];

  ngOnInit() {
    this.startInitialChat();
  }

  startInitialChat() {
    const userName = this.authService.currentUser()?.name || 'Developer';
    this.messages = [
      {
        role: 'assistant',
        content: `👋 Hello **${userName}**! I am your **SkillBridge AI Career Assistant & Technical Mentor**.\n\nI can help you plan learning roadmaps, optimize your resume for ATS scanners, prepare for technical interviews, and guide your tech stack decisions.\n\nAsk me anything or tap one of the suggested prompts below!`,
        timestamp: new Date(),
      },
    ];
  }

  sendMessage(text?: string) {
    const msgToSend = (text || this.inputMessage).trim();
    if (!msgToSend || this.isLoading) return;

    this.messages.push({
      role: 'user',
      content: msgToSend,
      timestamp: new Date(),
    });

    this.inputMessage = '';
    this.isLoading = true;

    this.aiService.chat(msgToSend, this.conversationId || undefined).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.data?.reply) {
          this.conversationId = res.data.conversationId;
          this.messages.push({
            role: 'assistant',
            content: res.data.reply,
            timestamp: new Date(),
          });
        }
      },
      error: () => {
        this.isLoading = false;
        this.messages.push({
          role: 'assistant',
          content: '⚠️ I encountered an issue processing your request. Please try again or rephrase your question.',
          timestamp: new Date(),
        });
      },
    });
  }

  clearChat() {
    this.conversationId = null;
    this.startInitialChat();
  }

  // Simple Markdown formatter for clean text rendering
  formatMarkdown(content: string): string {
    if (!content) return '';
    let html = content
      .replace(/### (.*?)\n/g, '<h4 class="font-bold text-base mt-2 mb-1 text-primary">$1</h4>')
      .replace(/## (.*?)\n/g, '<h3 class="font-bold text-lg mt-3 mb-1 text-primary">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/```([\s\S]*?)```/g, '<pre class="code-block bg-primary p-3 rounded font-mono text-xs my-2 overflow-x-auto">$1</pre>')
      .replace(/• (.*?)\n/g, '<li class="ml-4 list-disc text-sm">$1</li>')
      .replace(/\n\n/g, '<br/><br/>')
      .replace(/\n/g, '<br/>');
    return html;
  }
}
