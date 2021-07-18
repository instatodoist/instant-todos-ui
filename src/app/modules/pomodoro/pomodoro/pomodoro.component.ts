import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-pomodoro',
  templateUrl: './pomodoro.component.html',
  styleUrls: ['./pomodoro.component.scss']
})
export class PomodoroComponent implements OnInit, AfterViewInit {

  pomodoro = {
    started : false,
    minutes : 0,
    seconds : 0,
    fillerHeight : 0,
    fillerIncrement : 0,
    interval : null,
    minutesDom : null,
    secondsDom : null,
    fillerDom : null,
  };

  private player: any = null;

  constructor(
    @Inject(DOCUMENT) private document: Document
  ) { }


  ngOnInit(): void {
    this.start();
  }

  ngAfterViewInit(): void{
    this.player = this.document.getElementById('player');
  }

  startWork() {
    this.resetVariables(25, 0, true);
  }

  startShortBreak(){
    this.resetVariables(5, 0, true);
  };

  startLongBreak(){
    this.resetVariables(15, 0, true);
  }

  stopTimer(){
    this.resetVariables(25, 0, false);
    this.updateDom();
  }

  private start(){
    this.pomodoro = {
      ...this.pomodoro,
      minutesDom: this.document.querySelector('#minutes'),
      secondsDom: this.document.querySelector('#seconds'),
      fillerDom: this.document.querySelector('#filler'),
      interval: setInterval(()=>{
        this.intervalCallback();
      }, 1000)
    };
  }

  private resetVariables(mins, secs, started){
    this.pomodoro.minutes = mins;
    this.pomodoro.seconds = secs;
    this.pomodoro.started = started;
    this.pomodoro.fillerIncrement = 200/(this.pomodoro.minutes*60);
    this.pomodoro.fillerHeight = 0;
  }

  private intervalCallback(){
    if(!this.pomodoro.started) {
      return false;
    }
    // start alarm beep on 6 seconds
    if(this.pomodoro.seconds === 7){
      this.player.play();
    }
    if(this.pomodoro.seconds === 0) {
      if(this.pomodoro.minutes === 0) {
        this.timerComplete();
        return;
      }
      this.pomodoro.seconds = 59;
      this.pomodoro.minutes--;
    } else {
      this.pomodoro.seconds--;
    }
    return this.updateDom();
  }

  private updateDom(){
    this.pomodoro.minutesDom.innerHTML = this.toDoubleDigit(this.pomodoro.minutes);
    this.pomodoro.secondsDom.innerHTML = this.toDoubleDigit(this.pomodoro.seconds);
    this.pomodoro.fillerHeight = this.pomodoro.fillerHeight + this.pomodoro.fillerIncrement;
    this.pomodoro.fillerDom.style.height = this.pomodoro.fillerHeight + 'px';
  }

  private timerComplete(){
    this.pomodoro.started = false;
    this.pomodoro.fillerHeight = 0;
  }

  private toDoubleDigit(num: any){
    if(num < 10) {
      return '0' + parseInt(num, 10);
    }
    return num;
  }

}
