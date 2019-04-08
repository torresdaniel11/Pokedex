import { Component, OnInit } from '@angular/core';
import { PokedexService } from 'src/app/services/pokedex.service';
import { debounceTime } from 'rxjs/operators';
import { PokemonListItem } from 'src/app/models/pokemon-list-item';

@Component({
  selector: 'app-pokedex',
  templateUrl: './pokedex.component.html',
  styleUrls: ['./pokedex.component.css']
})
export class PokedexComponent implements OnInit {

  pokemons: PokemonListItem[];
  constructor(private pokeService: PokedexService) {
    this.pokemons = [];
  }

  ngOnInit() {
    this.getPokemonsBatch()
  }

  getPokemonsBatch(): void {
    this.pokeService.getPokemons()
      .pipe(debounceTime(1500))
      .subscribe((res) => {
        this.pokemons.push(...res.results);
      })
  }

  onScroll(): void {
    this.getPokemonsBatch()
  }

}
