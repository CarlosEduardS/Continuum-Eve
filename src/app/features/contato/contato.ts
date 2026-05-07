import { Component } from '@angular/core';
import { LayoutMainInterface } from "../../shared/layout/layout-main-interface/layout-main-interface";
import { Card } from "../../shared/ui/card/card";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contato',
  imports: [LayoutMainInterface, Card, FormsModule],
  templateUrl: './contato.html',
  styleUrl: './contato.scss',
})
export class Contato {
  username = sessionStorage.getItem('username');
  email = sessionStorage.getItem('email');
  message = ''

  SetMessageSuggestions(){
    console.log("Mensagem digitada:", this.message);
  }
}
