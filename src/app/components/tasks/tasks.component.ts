import { HttpHeaders } from '@angular/common/http';
import { Component,OnInit } from '@angular/core';
import { TaskService } from '../../service/task.service';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { Task } from './tasks.model';

@Component({
  selector: 'app-tasks',
  styleUrls: ['./tasks.component.css'], // Corrigido de styleUrl para styleUrls
  templateUrl: './tasks.component.html',
})
export class TasksComponent implements OnInit{

  tasks: Task[] = [];
  taskId: number = 0;
  fetchedTask: Task | undefined;


  constructor(private taskService: TaskService,
    private router: Router,
    private authService: AuthService){
  }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getAllTasks().subscribe(
      (tasks: Task[]) => {
        this.tasks = tasks;
      },
      (error) => {
        console.error('Erro ao carregar as tarefas:', error);
      }
    );
  }

  // Organiza as tarefas em colunas com base no status
  getTasksByStatus(status: string): any[] {
    return this.tasks.filter(task => task.status === status);
  }

  deleteTask(taskId: number): void {
    const authToken = this.authService.getToken();

    if (authToken) {
      // Cria os cabeçalhos com o token de autenticação
      const headers = { 'Authorization': `Bearer ${authToken}` };

      this.taskService.deleteTask(taskId, headers).subscribe(
        () => {
          console.log('Tarefa deletada com sucesso.');
          // Recarrega as tarefas após a exclusão bem-sucedida
          this.loadTasks();
        },
        (error) => {
          console.error('Erro ao deletar a tarefa:', error);
        }
      );
    } else {
      console.error('Token de autenticação não encontrado.');
    }
  }

  openAddTaskModal() {
    this.router.navigate(['/addTask']);
  }

  updateTask(taskId: number): void {
    this.router.navigate(['/update', taskId]);
  }

}
