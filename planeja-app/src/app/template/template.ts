import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-template',
  imports: [RouterOutlet],
  templateUrl: './template.html',
  styleUrl: './template.scss'
})
export class Template {}
