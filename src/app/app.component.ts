import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ChatComponent, FormsModule],
  template: '<app-chat></app-chat>',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ai-chat-app';
}
