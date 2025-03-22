import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'https://openrouter.ai/api/v1/chat/completions';

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'حدث خطأ في الاتصال';
    if (error.status === 401) {
      errorMessage = 'خطأ في مفتاح API - يرجى التحقق من صحة المفتاح والتأكد من أنه لم ينتهي';
    } else if (error.status === 429) {
      errorMessage = 'تم تجاوز حد الطلبات المسموح به - يرجى الانتظار لبضع دقائق قبل المحاولة مرة أخرى';
    } else if (error.status === 500) {
      errorMessage = 'خطأ في خادم OpenAI - يرجى المحاولة مرة أخرى لاحقاً';
    } else if (error.status === 400) {
      errorMessage = 'طلب غير صالح - يرجى التحقق من المدخلات والمحاولة مرة أخرى';
    } else if (error.error instanceof ErrorEvent) {
      errorMessage = `خطأ في الاتصال بالشبكة: ${error.error.message}`;
    }
    console.error('OpenAI API Error:', error);
    return throwError(() => errorMessage);
  }

  sendMessage(message: string): Observable<any> {
    return this.http.post(this.apiUrl, {
      model: 'openai/gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }]
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${environment.apiKey}`,
        'HTTP-Referer': 'http://localhost:4200',
        'X-Title': 'AI Chat App'
      }
    }).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
}