import { Component, OnInit, Input } from '@angular/core';
import { PokedexService } from 'src/app/services/pokedex.service';
import { Pokemon } from 'src/app/models/pokemon';
import { PokemonListItem } from 'src/app/models/pokemon-list-item';

@Component({
  selector: 'app-pokemon-card',
  templateUrl: './pokemon-card.component.html',
  styleUrls: ['./pokemon-card.component.css']
})
export class PokemonCardComponent implements OnInit {
  private _pokemon: PokemonListItem;
  private pokemonDetails: Pokemon;

  constructor(private pokeService: PokedexService) { }

  ngOnInit() {
  }

  @Input()
  set pokemon(pokemon: PokemonListItem) {
    this._pokemon = pokemon;
    this.fetchPokemon(pokemon.url);
  }

  fetchPokemon(url: string) {
    this.pokeService.getPokemonDetail(url).subscribe((res) => {
      this.pokemonDetails = res;
    });
  }

  showPokemonDetails(): void {
    this.pokeService.setCurrentPokemon(this.pokemonDetails);
  }

}
