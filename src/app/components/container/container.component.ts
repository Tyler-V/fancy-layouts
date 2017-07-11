import { Component, ElementRef, Input, HostBinding, OnInit } from '@angular/core';
import { ResizeEvent } from '../../directives/resize.directive';
import { MoveEvent } from '../../directives/move.directive';

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
  height: number = 500;

  @HostBinding('style.width.px')
  @Input()
  width: number = 800;

  @Input()
  minWidth: number = 100;

  @Input()
  maxWidth: number = 100;

  constructor(private el: ElementRef) { }

  ngOnInit() {
    this.top = this.el.nativeElement.parentElement.offsetHeight / 2 - this.height / 2;
    this.left = this.el.nativeElement.parentElement.offsetWidth / 2 - this.width / 2;
  }

  resize(event: ResizeEvent) {
    if (!event) return;
    requestAnimationFrame(() => {
      this.top = event.endTop;
      this.left = event.endLeft;
      this.height = event.endHeight;
      this.width = event.endWidth;
    });
  }

  move(event: MoveEvent) {
    if (!event) return;
    requestAnimationFrame(() => {
      this.top = event.endTop;
      this.left = event.endLeft;
    });
  }

}
