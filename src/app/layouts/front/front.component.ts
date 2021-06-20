import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AppService } from '../../service';
declare let $: any;

interface ICarousel {
  image: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-front',
  templateUrl: './front.component.html',
  styleUrls: ['./front.component.scss']
})
export class FrontComponent implements OnInit, AfterViewInit {

  carousel: ICarousel[] = [];

  constructor(
    private appService: AppService
  ) {
    this.carousel = [
      {
        image: '/assets/images/prod_1.png',
        title: 'Create Tasks',
        description: 'Create Tasks to manage your daily work life priorities'
      },
      {
        image: '/assets/images/prod_2.jpg',
        title: 'Track your Productivity',
        description: 'Easily Track your productivity on daily,monthly & yearly basis'
      },
      {
        image: '/assets/images/prod_3.png',
        title: 'Create Notes',
        description: 'Easily make notes to remember OR to for creating & tracking the Goals .'
      }
    ];
  }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.appService.setTheme(this.appService.ROOT_STATE.config.theme);
    $('.owl-carousel').each(function() {
      const jQuerycarousel = $(this);
      jQuerycarousel.owlCarousel({
        items: jQuerycarousel.data('items'),
        loop: jQuerycarousel.data('loop'),
        margin: jQuerycarousel.data('margin'),
        nav: jQuerycarousel.data('nav'),
        dots: jQuerycarousel.data('dots'),
        autoplay: jQuerycarousel.data('autoplay'),
        autoplayTimeout: jQuerycarousel.data('autoplay-timeout'),
        navText: ['<i class="fa fa-angle-left fa-2x"></i>', '<i class="fa fa-angle-right fa-2x"></i>'],
        responsiveClass: true,
        responsive: {
          // breakpoint from 0 up
          0: {
            items: jQuerycarousel.data('items-mobile-sm'),
            nav: false,
            dots: true
          },
          // breakpoint from 480 up
          480: {
            items: jQuerycarousel.data('items-mobile'),
            nav: false,
            dots: true
          },
          // breakpoint from 786 up
          786: {
            items: jQuerycarousel.data('items-tab')
          },
          // breakpoint from 1023 up
          1023: {
            items: jQuerycarousel.data('items-laptop')
          },
          1199: {
            items: jQuerycarousel.data('items')
          }
        }
      });
    });
  }

}
