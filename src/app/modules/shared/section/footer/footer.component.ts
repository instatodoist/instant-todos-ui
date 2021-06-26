import { Component, OnInit } from '@angular/core';

interface IFooterLinks {
  name: string;
  href: string;
  internal: boolean;
}

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styles: []
})
export class FooterComponent implements OnInit {

  links: IFooterLinks[];

  constructor() { }

  ngOnInit(): void {
    this.links = [
      // {
      //   name: 'Privacy Policy',
      //   href: '/pages/privacy-policy',
      //   internal: true
      // },
      // {
      //   name: 'Terms of Use',
      //   href: '/pages/terms',
      //   internal: true
      // },
      // {
      //   name: 'Contact Us',
      //   href: '/pages/contact-us',
      //   internal: true
      // },
      {
        name: 'Report an Issue',
        href: 'https://github.com/techyaura/instatodos-ui/issues/new',
        internal: false
      }
    ];
  }

}
