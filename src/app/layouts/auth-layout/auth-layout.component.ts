import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AppService } from '../../services';
declare let $: any;

interface ICarousel {
  image: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss']
})
export class AuthLayoutComponent implements OnInit, AfterViewInit {

  carousel: ICarousel[] = [];

  constructor(
    private appService: AppService
  ) {
    this.carousel = [
      {
        image: '/assets/images/prod_1.png',
        title: 'home.create_task',
        description: 'home.create_task_description'
      },
      {
        image: '/assets/images/prod_2.jpg',
        title: 'home.track_productivity',
        description: 'home.track_productivity_description'
      },
      {
        image: '/assets/images/prod_3.png',
        title: 'home.create_note',
        description: 'home.create_note_description'
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
