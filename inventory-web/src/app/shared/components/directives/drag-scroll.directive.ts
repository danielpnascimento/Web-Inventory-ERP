
import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDragScroll]',
  standalone: true
})
export class DragScrollDirective {
// Internal state
private isDown = false; // true while the user is "dragging"
private startX = 0; // initial X position of the click/touch (relative to the element)
private startY = 0; // initial Y position of the click/touch (relative to the element)
private scrollLeft = 0; // scrollLeft of the element at the beginning of the drag
private scrollTop = 0; // scrollTop of the element at the beginning of the drag

  constructor(private el: ElementRef, private renderer: Renderer2) {
   // Visual hint: cursor and initial styles to indicate that the element is draggable.
    this.renderer.setStyle(this.el.nativeElement, 'cursor', 'grab');
    // Ensures that the container has overflow available to scroll
    this.renderer.setStyle(this.el.nativeElement, 'overflow', 'auto');
    // Prevents text selection during drag
    this.renderer.setStyle(this.el.nativeElement, 'user-select', 'none');
    // opcional: this.renderer.setStyle(this.el.nativeElement, 'touch-action', 'pan-y'); // evita navegação indesejada em alguns casos
  }

 // MOUSE DOWN → starts dragging
  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    this.isDown = true;
    // calculates initial position relative to the element
    this.startX = event.pageX - this.el.nativeElement.offsetLeft;
    this.startY = event.pageY - this.el.nativeElement.offsetTop;
    // registers initial scroll to use as a basis for the calculation
    this.scrollLeft = this.el.nativeElement.scrollLeft;
    this.scrollTop = this.el.nativeElement.scrollTop;
    // changes cursor while dragging
    this.renderer.setStyle(this.el.nativeElement, 'cursor', 'grabbing');
  }

  // mouseup / mouseleave / blur -> ends dragging (without distinction)
  @HostListener('mouseleave')
  @HostListener('mouseup')
  @HostListener('blur')
  onMouseUpLeave() {
    this.isDown = false;
    // restores cursor
    this.renderer.setStyle(this.el.nativeElement, 'cursor', 'grab');
  }

  // MOUSE MOVE -> while isDown true, calculates displacement and applies scroll
  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isDown) return; // only processes if dragging
    event.preventDefault();   // avoids browser selection/drag
    const x = event.pageX - this.el.nativeElement.offsetLeft;
    const y = event.pageY - this.el.nativeElement.offsetTop;

    // walk = displacement * sensitivity factor (0.85 smoother)
    const walkX = (x - this.startX) * 0.85; // Horizontal speed
    const walkY = (y - this.startY) * 0.85; // Vertical speed

    // applies scroll inverting the walk (for "drag content" behavior)
    this.el.nativeElement.scrollLeft = this.scrollLeft - walkX;
    this.el.nativeElement.scrollTop = this.scrollTop - walkY;
  }

  // TOUCH START -> starts dragging by touch
  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    const touch = event.touches[0];
    this.isDown = true;
    this.startX = touch.pageX - this.el.nativeElement.offsetLeft;
    this.startY = touch.pageY - this.el.nativeElement.offsetTop;
    this.scrollLeft = this.el.nativeElement.scrollLeft;
    this.scrollTop = this.el.nativeElement.scrollTop;
  }

  // TOUCH END -> ends dragging by touch
  @HostListener('touchend')
  onTouchEnd() {
    this.isDown = false;
  }

  // TOUCH MOVE -> similar to mousemove, with different sensitivity (1.5)
  @HostListener('touchmove', ['$event'])
  onTouchMove(event: TouchEvent) {
    if (!this.isDown) return;
    event.preventDefault(); // avoids native scroll while dragging
    const touch = event.touches[0];
    const x = touch.pageX - this.el.nativeElement.offsetLeft;
    const y = touch.pageY - this.el.nativeElement.offsetTop;

    const walkX = (x - this.startX) * 1.5; // touch is usually less precise -> higher factor
    const walkY = (y - this.startY) * 1.5;

    this.el.nativeElement.scrollLeft = this.scrollLeft - walkX;
    this.el.nativeElement.scrollTop = this.scrollTop - walkY;
  }
}

//Works to drag the table in the listing component on the y and x axis
//Just add the import   imports: [DragScrollDirective] after creating this class in
//the listing page that has the table you want to drag with the mouse!
