import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BattleComponent } from './battle/battle.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: ':myPokemon/vs/:opponentPokemon',
        component: BattleComponent
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BattleRoutingModule { }