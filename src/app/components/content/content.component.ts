import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ml-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css'],
  host: { 'class': 'box-shadow' }
})
export class ContentComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

}
