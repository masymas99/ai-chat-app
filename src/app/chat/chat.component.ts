import { Component } from '@angular/core';
import { ChatService } from '../chat.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type Message = {
  content: string;
  isUser: boolean;
  timestamp: Date;
};

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  imports: [CommonModule, FormsModule],
  standalone: true
})
export class ChatComponent {
  messages: Message[] = [];
  newMessage = '';
  isLoading = false;
  error = '';

  constructor(private chatService: ChatService) {}

  async sendMessage() {
    if (!this.newMessage.trim()) return;

    this.messages.push({ content: this.newMessage, isUser: true, timestamp: new Date() });
    const userMessage = this.newMessage;
    this.newMessage = '';
    this.isLoading = true;
    this.error = '';

    try {
      const response: any = await this.chatService.sendMessage(userMessage).toPromise();
      this.messages.push({
        content: response?.choices[0]?.message?.content || 'No response',
        isUser: false,
        timestamp: new Date()
      });
    } catch (err: any) {
      this.error = err?.message || 'حدث خطأ في الإرسال، يرجى المحاولة مرة أخرى';
    } finally {
      this.isLoading = false;
    }
  }
}