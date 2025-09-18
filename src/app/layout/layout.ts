import { Component } from '@angular/core';
import { Header } from './header/header';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'layout',
  imports: [RouterOutlet, Header],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout {

}
