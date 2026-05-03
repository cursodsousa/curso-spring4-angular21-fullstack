import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-template',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './template.html',
  styleUrl: './template.scss'
})
export class Template {}
