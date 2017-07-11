import { Directive, ElementRef, Input, Output, EventEmitter, HostListener, HostBinding, Renderer2, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[mlMove]'
})
export class MoveDirective {

  @Input() parentContainer: HTMLElement;
  @Input() movePadding: number = 50;
  @Output() move = new EventEmitter<MoveEvent>();

  private containerHeight: number;
  private containerWidth: number;
  private elementTop: number;
  private elementLeft: number;
  private elementHeight: number;
  private elementWidth: number;

  private startEvent: any;
  private isDragging: boolean;

  private startTop: number;
  private startLeft: number;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngAfterViewInit() {
    this._getDimensions();
  }

  _getDimensions() {
    this.elementTop = this.el.nativeElement.parentNode.offsetTop;
    this.elementLeft = this.el.nativeElement.parentNode.offsetLeft;
    this.elementHeight = this.el.nativeElement.offsetHeight;
    this.elementWidth = this.el.nativeElement.offsetWidth;
  }

  @HostListener('mousedown', ['$event']) onMouseClick(e) {
    this.onDragStart(e);
  }

  @HostListener('document:mousemove', ['$event']) onDocumentMouseMove(e) {
    if (!this.startEvent)
      return;
    this.onDragging(e);
  }

  @HostListener('document:mouseup', ['$event']) onMouseUp(e) {
    this.onDragEnd(e);
  }

  onDragStart(e) {
    this._getDimensions();
    if (!this.isValid(e))
      return;
    this.startEvent = e;
    this.startTop = this.elementTop;
    this.startLeft = this.elementLeft;
    this.renderer.addClass(this.el.nativeElement, 'moving');
  }

  onDragging(e) {
    if (this.startEvent)
      this.move.emit(this.getMove(e));
  }

  onDragEnd(e) {
    this.startEvent = null;
    this.renderer.removeClass(this.el.nativeElement, 'moving');
  }

  isValid(e) {
    if (e.layerX - this.movePadding < 0)
      return false;
    if (e.layerX + this.movePadding > this.elementWidth)
      return false;
    if (e.layerY - this.movePadding < 0)
      return false;
    if (e.layerY + this.movePadding > this.elementHeight)
      return false;
    return true;
  }

  getMove(e) {
    var x = this.startEvent.pageX - e.pageX;
    var y = this.startEvent.pageY - e.pageY;

    var top = this.startTop - y;
    var left = this.startLeft - x;

    if (top > 0 && (top + this.elementHeight + 2 < this.parentContainer.offsetHeight))
      this.elementTop = this.startTop - y;
    if (left > 0 && (left + this.elementWidth + 2 < this.parentContainer.offsetWidth ))
      this.elementLeft = this.startLeft - x;

    return <MoveEvent>{
      startTop: this.startTop,
      startLeft: this.startLeft,
      endTop: this.elementTop,
      endLeft: this.elementLeft
    }
  }
}

export interface MoveEvent {
  startTop: number,
  startLeft: number,
  endTop: number,
  endLeft: number
}
