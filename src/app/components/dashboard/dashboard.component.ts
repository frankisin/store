import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TableComponent } from '../table/table.component';
import { ProdtableComponent } from '../prodtable/prodtable.component';
import { UserTableComponent } from '../user-table/user-table.component';
import {MatTabsModule} from '@angular/material/tabs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NavbarComponent,SidebarComponent,TableComponent,MatTabsModule,ProdtableComponent,UserTableComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  isAdmin: boolean = false;
  isDeveloper : boolean = false;
  canEdit : boolean = true;

  onInit():void{
    let role = localStorage.getItem('role');

    console.log(role);

  }

}
