import { Directive, ElementRef, Input, Output, EventEmitter, HostListener, HostBinding, Renderer2, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[mlResize]'
})
export class ResizeDirective implements AfterViewInit {

  @Input() minimumHeight: number;
  @Input() minimumWidth: number;
  @Input() resizePadding: number = 10;
  @Output() resize = new EventEmitter<ResizeEvent>();

  private elementTop: number;
  private elementLeft: number;
  private elementHeight: number;
  private elementWidth: number;

  private direction: Direction;
  private startEvent: any;
  private startTop: number;
  private startLeft: number;
  private startHeight: number;
  private startWidth: number;
  private isDragging: boolean;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngAfterViewInit() {
    this.elementTop = this.el.nativeElement.parentNode.offsetTop;
    this.elementLeft = this.el.nativeElement.parentNode.offsetLeft;
    this.elementHeight = this.el.nativeElement.offsetHeight;
    this.elementWidth = this.el.nativeElement.offsetWidth;
  }

  @HostBinding('style.cursor') cursorDirection: string;
  @HostListener('mouseleave') onMouseLeave() {
    if (!this.startEvent)
      this.renderer.removeClass(this.el.nativeElement, 'resize');
  }

  @HostListener('mousedown', ['$event']) onMouseClick(e) {
    this.onDragStart(e);
  }

  @HostListener('mousemove', ['$event']) onMouseMove(e) {
    if (this.startEvent)
      return;
    this.getResizeDirection(e);
  }

  @HostListener('document:mousemove', ['$event']) onDocumentMouseMove(e) {
    if (!this.startEvent)
      return;
    this.onDragging(e);
  }

  @HostListener('document:mouseup', ['$event']) onMouseUp(e) {
    this.onDragEnd(e);
  }

  //@HostListener('ontouchstart', ['$event']) onTouchStart(e) { }
  //@HostListener('touchmove', ['$event']) onTouchmove(e) { }
  //@HostListener('ontouchend', ['$event']) onTouchEnd(e) { }

  onDragStart(e) {
    this.startEvent = e;
    this.startTop = this.elementTop;
    this.startLeft = this.elementLeft;
    this.startHeight = this.elementHeight;
    this.startWidth = this.elementWidth;
  }

  onDragging(e) {
    this.resize.emit(this.getResize(e));
  }

  onDragEnd(e) {
    this.startEvent = null;
    this.renderer.removeClass(this.el.nativeElement, 'resize');
  }

  areDimensionsValid(e) {
    var x = this.startEvent.pageX - e.pageX;
    var y = this.startEvent.pageY - e.pageY;

    if (this.direction == Direction.North) {
      if (!y) return false;
      if (this.startHeight + y < this.minimumHeight) return false;
      if (this.startTop - y <= 0) return false;
    }
    else if (this.direction == Direction.South) {
      if (!y) return false;
      if (this.startHeight - y < this.minimumHeight) return false;
    }
    else if (this.direction == Direction.East) {
      if (!x) return false;
      if (this.startWidth - x < this.minimumWidth) return false;
    }
    else if (this.direction == Direction.West) {
      if (!x) return false;
      if (this.startLeft - x <= 0) return false;
      if (this.startWidth + x < this.minimumWidth) return false;
    }

    return true;
  }

  getResize(e): any {
    var x = this.startEvent.pageX - e.pageX;
    var y = this.startEvent.pageY - e.pageY;

    if (!this.areDimensionsValid(e))
      return;

    if (this.direction == Direction.North) {
      this.elementHeight = this.startHeight + y;
      this.elementTop = this.startTop - y;
    }
    else if (this.direction == Direction.South) {
      this.elementHeight = this.startHeight - y;
    }
    else if (this.direction == Direction.East) {
      this.elementWidth = this.startWidth - x;
    }
    else if (this.direction == Direction.West) {
      this.elementWidth = this.startWidth + x;
      this.elementLeft = this.startLeft - x;
    }

    return <ResizeEvent>{
      direction: this.direction,
      startTop: this.startTop,
      startLeft: this.startLeft,
      startHeight: this.startHeight,
      startWidth: this.startWidth,
      endTop: this.elementTop,
      endLeft: this.elementLeft,
      endHeight: this.elementHeight,
      endWidth: this.elementWidth
    }
  }

  getResizeDirection(e) {
    var north, south, east, west;

    if (e.layerY <= this.resizePadding) {
      north = true;
    } else if (this.elementHeight - e.layerY <= this.resizePadding) {
      south = true;
    }

    if (this.elementWidth - e.layerX <= this.resizePadding) {
      east = true;
    } else if (e.layerX <= this.resizePadding) {
      west = true;
    }

    if (north) {
      if (east)
        this.cursorDirection = DirectionValues[this.direction = Direction.NorthEast];
      else if (west)
        this.cursorDirection = DirectionValues[this.direction = Direction.NorthWest];
      else
        this.cursorDirection = DirectionValues[this.direction = Direction.North];
    } else if (south) {
      if (east)
        this.cursorDirection = DirectionValues[this.direction = Direction.SouthEast];
      else if (west)
        this.cursorDirection = DirectionValues[this.direction = Direction.SouthWest];
      else
        this.cursorDirection = DirectionValues[this.direction = Direction.South];
    } else if (east) {
      this.cursorDirection = DirectionValues[this.direction = Direction.East];
    } else if (west) {
      this.cursorDirection = DirectionValues[this.direction = Direction.West];
    }
    else
      this.cursorDirection = this.direction = null;

    if (this.direction != null)
      this.renderer.addClass(this.el.nativeElement, 'resize');
    else
      this.renderer.removeClass(this.el.nativeElement, 'resize');
  }
}

export var DirectionValues = [
  "n-resize",
  "s-resize",
  "e-resize",
  "w-resize",
  "ne-resize",
  "nw-resize",
  "se-resize",
  "sw-resize"
];

export enum Direction {
  North,
  South,
  East,
  West,
  NorthEast,
  NorthWest,
  SouthEast,
  SouthWest
}

export interface ResizeEvent {
  direction: Direction,
  startTop: number,
  startLeft: number,
  startHeight: number,
  startWidth: number,
  endTop: number,
  endLeft: number,
  endHeight: number,
  endWidth: number
}