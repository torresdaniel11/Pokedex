import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BattleComponent } from './battle/battle.component';
import { BattleRoutingModule } from './battle-routing.module';
import { BATTLE_SERVICE } from 'src/app/services/battle.service';

@NgModule({
  imports: [
    CommonModule,
    BattleRoutingModule
  ],
  declarations: [BattleComponent],
  providers: [BATTLE_SERVICE]
})
export class BattleModule { }
