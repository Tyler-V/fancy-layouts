import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { ResizeEvent } from '../../directives/resize.directive';

@Component({
  selector: 'ml-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css'],
  host: { 'class': 'box-shadow' }
})
export class ContainerComponent implements OnInit {

  @HostBinding('style.top.px')
  @Input()
  top: number = 50;

  @HostBinding('style.left.px')
  @Input()
  left: number = 50;

  @HostBinding('style.height.px')
  @Input()
  height: number = 300;

  @HostBinding('style.width.px')
  @Input()
  width: number = 300;

  @Input()
  minWidth: number = 100;

  @Input()
  maxWidth: number = 100;

  constructor() { }

  ngOnInit() { }

  resize(event: ResizeEvent) {
    if (!event) return;
    requestAnimationFrame(() => {
      this.top = event.endTop;
      this.left = event.endLeft;
      this.height = event.endHeight;
      this.width = event.endWidth;
    });
  }

}
