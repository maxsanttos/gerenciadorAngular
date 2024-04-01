import { Component } from '@angular/core';
import { Task } from '../tasks/tasks.model';
import { DatePipe } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { TaskService } from '../../service/task.service';

@Component({
  selector: 'app-add-tasks',
  styleUrls: ['./add-tasks.component.css'],
  templateUrl: './add-tasks.component.html',
})
export class AddTasksComponent {
  task: Task = {
    id: 0,
    title: '',
    description: '',
    status: 'pending'
  };
  constructor(
    private taskService: TaskService,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private datePipe: DatePipe){
  }
  addTask() {
    const authToken = this.authService.getToken();
    console.log('Token de Autenticação:', authToken);

    if (authToken) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${authToken}`);

      this.taskService.createTask(this.task, headers).subscribe(
        (response) => {
          // Lógica para tratar a resposta após criar a tarefa, redirecionar, etc.
          console.log('Tarefa criada com sucesso:', response);
          this.goToTasks();


        },
        (error) => {
          // Trate erros, se necessário.
          console.error('Erro ao criar tarefa:', error);

          if (error.status === 403) {
            // Tratar erro de autorização (por exemplo, redirecionar para página de login).
            console.log('Erro de autorização. Redirecionando para a página de login.');
            this.router.navigate(['/login']);
            // Código para redirecionar para a página de login.
          } else if (error.status === 400) {
            // Tratar outros erros, como erros de validação.
            console.log('Erro de validação. Verifique os dados da tarefa.');
            // Outras ações para lidar com erros de validação.
          } else {
            // Lidar com outros erros não especificados.
            console.log('Erro desconhecido. Entre em contato com o suporte técnico.');
            // Outras ações para lidar com erros não especificados.
          }
        }
      );
    }
  }

  goToTasks() {
    this.router.navigate(['/tasks']);
  }
}
