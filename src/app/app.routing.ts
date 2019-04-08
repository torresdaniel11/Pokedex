import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'pokedex',
    pathMatch: 'full'
  },
  {
    path: '',
    children: [
      {
        path: 'pokedex',
        loadChildren: './views/pokedex/pokedex.module#PokedexModule'
      },
      {
        path: 'battle',
        loadChildren: './views/battle/battle.module#BattleModule'
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }