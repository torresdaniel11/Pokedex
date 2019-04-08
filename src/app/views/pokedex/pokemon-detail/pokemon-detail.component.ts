import { Component, OnInit, OnDestroy } from '@angular/core';
import { PokedexService } from 'src/app/services/pokedex.service';
import { Pokemon } from 'src/app/models/pokemon';

@Component({
  selector: 'app-pokemon-detail',
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.scss']
})
export class PokemonDetailComponent implements OnInit, OnDestroy {
  pokemon: Pokemon;
  subscription: any;

  constructor(private pokeService: PokedexService) { }

  ngOnInit() {
    this.subscription = this.pokeService.getCurrentPokemon()
      .subscribe((pokemon: Pokemon) => {
        this.setPokemon(pokemon);
      })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  setPokemon(pokemon: Pokemon) {
    this.pokemon = pokemon;
  }

}
