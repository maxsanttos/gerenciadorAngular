import { Component } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { registrationData } from './registrationData.model';

@Component({
  selector: 'app-register',
  styleUrls: ['./register.component.css'],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  hide = true;
  email = new FormControl('', [Validators.required, Validators.email]);
  registerForm: FormGroup;
  user: registrationData = {
    login: '',
    password: '',
    role: '',
  };
  constructor(private authService: AuthService, private router: Router, private formBuilder: FormBuilder) {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      role: ['', [Validators.required]]
    });
  }


  register() {
    this.authService.registerUser(this.user).subscribe(
      (response) => {
        // Sucesso no registro - você pode redirecionar o usuário para a página de login ou fazer qualquer ação necessária aqui.
        console.log('Registro bem-sucedido:', response);
      },
      (error) => {
        // Trate os erros aqui, por exemplo, exibindo uma mensagem de erro ao usuário.
        console.error('Erro durante o registro:', error);
      }
    );
    this.router.navigate(['/login']);
  }
  goToLogin() {
    // Navegue para a tela de login quando o botão "Back to Login" for clicado
    this.router.navigate(['/login']); // Substitua '/login' pela rota real da tela de login
  }

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }
}
