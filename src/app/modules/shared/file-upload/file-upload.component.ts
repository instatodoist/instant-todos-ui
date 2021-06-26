import { Component, Input, HostListener, ElementRef, Inject, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
// import { DOCUMENT } from '@angular/common';
@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FileUploadComponent,
      multi: true
    }
  ]
})
export class FileUploadComponent implements ControlValueAccessor {

  @Input() src: any;
  @Input() progress = '';
  @Input() placeholder = '';
  onChange: any;
  private file: File | null = null;

  @HostListener('change', ['$event.target'])
  emitFiles(e: any) {
    const elm = e;
    const event: FileList = elm.files;
    const file = event && event.item(0);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.src = reader.result;
    };
    this.onChange(file);
    this.file = file;
  }

  // @HostListener('click', ['$event.target'])
  onEvent($event: any) {
    const target = $event.target;
    const f = target.nextSibling;
    f.click();
  }

  constructor(
    // @Inject(DOCUMENT)
    // private document: Document,
    private host: ElementRef<HTMLInputElement>
  ) {
  }

  writeValue(value: null) {
    // clear file input
    this.host.nativeElement.value = '';
    this.file = null;
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
  }

}
