import { Component } from '@angular/core';

import { HomePage } from '../home-page/home-page';
import { MyPage } from '../my-page/my-page';
import { SearchPage } from '../search-page/search-page';
import { HeartPage } from '../heart-page/heart-page';
import { CashPage } from '../cash-page/cash-page';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = MyPage;
  tab3Root = SearchPage;
  tab4Root = HeartPage;
  tab5Root = CashPage;

  constructor() {

  }
}
