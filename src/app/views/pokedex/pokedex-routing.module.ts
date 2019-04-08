import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PokedexComponent } from './pokedex/pokedex.component';
import { PokemonDetailComponent } from './pokemon-detail/pokemon-detail.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: PokedexComponent
      },
      {
        path: ':id',
        component: PokedexComponent
      },
      {
        path: 'pokemon',
        component: PokemonDetailComponent
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PokedexRoutingModule { }