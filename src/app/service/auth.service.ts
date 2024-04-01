import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Task } from '../components/tasks/tasks.model';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { registrationData } from '../components/register/registrationData.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080';
  private token: string | null = null;
  private userName: string | null = null;
  private userRole: string | null = null;

  constructor(private http: HttpClient) { }

  login(credentials: any): Observable<any> {
    const url = `${this.apiUrl}/auth/login`;
    return this.http.post<any>(url, credentials).pipe(
      tap((response) => {
        if (response && response.token && response.userName && response.role) {
          this.token = response.token;
          this.userName = response.userName;
          this.userRole = response.role;
          localStorage.setItem('token', response.token);
          localStorage.setItem('role', response.role);
          console.log('Nome do usuário armazenado:', this.userName);
          console.log('Função (role) do usuário armazenada:', this.userRole);
        }
        console.log('Função (role) do usuário armazenada:', this.userRole);
      })
    );
  }

  // Função para obter o nome do usuário
  getUserName(): string | null {
    return this.userName;
  }

  // Função para obter a role do usuário
  getUserRole(): string | null {
    return this.userRole;
  }

  registerUser(userData: registrationData): Observable<any> {
    const url = `${this.apiUrl}/auth/register`;
    return this.http.post<any>(url, userData);
  }

  // Método para recuperar a lista de todos os usuários
  getUsers(): Observable<any[]> {
    const url = `${this.apiUrl}/auth/users`; // Substitua 'users' pelo endpoint correto na sua API
    const authToken = this.getToken();

    if (authToken) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${authToken}`);
      return this.http.get<any[]>(url, { headers }).pipe(
        catchError(this.handleError)
      );
    } else {
      throw new Error('Token de autenticação não encontrado.');
    }
  }

  isAuthenticated(): boolean {
    // Exemplo hipotético: Verificar se o usuário tem um token válido
    const token = localStorage.getItem('token');
    return !!token; // Retorna true se o token existir, false se não existir
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Método para buscar tarefa por ID com token de autenticação
  getTaskByIdWithToken(id: number): Observable<Task> {
    const authToken = this.getToken();
    if (authToken) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${authToken}`);
      return this.http.get<Task>(`${this.apiUrl}/tasks/${id}`, { headers }).pipe(
        catchError(this.handleError)
      );
    } else {
      throw new Error('Token de autenticação não encontrado.');
    }
  }

  // Método para lidar com erros
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Erro do lado do cliente
      console.error('Ocorreu um erro:', error.error.message);
    } else {
      // O backend retornou um código de erro
      console.error(
        `Código de erro ${error.status}, ` +
        `Erro: ${error.error}`);
    }
    // Retorna um observable com uma mensagem de erro
    return throwError(
      'Algo deu errado; por favor, tente novamente mais tarde.');
  }
}
