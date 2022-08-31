import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsRoutingModule } from './notifications-routing.module';

// angular material
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select'
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LazyloadTranslateModule } from '@dms/app/shared/lazyload-translate/lazyload-translate.module';
import { MatListModule } from '@angular/material/list';
import { DateToTimezoneModule } from '@dms/app/pipes/date-to-timezone/date-to-timezone.module';
import { NotificationsComponent } from './notifications.component';

@NgModule({
  declarations: [NotificationsComponent],
  imports: [
    CommonModule,
    NotificationsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    LazyloadTranslateModule,
    DateToTimezoneModule,

    // material
    FlexLayoutModule,
    MatIconModule,
    MatMenuModule,
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule,
    MatSlideToggleModule,
    MatExpansionModule,
    MatSelectModule,
    MatListModule,
  ]
})
export class NotificationsModule { }
