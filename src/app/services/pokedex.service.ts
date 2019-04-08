import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pokemon } from '../models/pokemon';

@Injectable({
  providedIn: 'root'
})
export class PokedexService {
  offset: number;
  currentPokemon: Pokemon;
  pokemonChange: EventEmitter<Pokemon>;

  constructor(private http: HttpClient) {
    this.offset = -20;
    this.pokemonChange = new EventEmitter<any>();
  }

  getPokemons(): Observable<any> {
    this.offset += 20;
    return this.http.get(`https://pokeapi.co/api/v2/pokemon/?limit=20&offset=${this.offset}`);
  }

  getPokemonDetail(url: string): Observable<any> {
    return this.http.get(url)
  }

  setCurrentPokemon(pokemon: Pokemon) {
    this.currentPokemon = pokemon;
    this.emitNewCurrentPokemon(pokemon)
  }

  getCurrentPokemon(): Observable<any> {
    return this.pokemonChange;
  }

  emitNewCurrentPokemon(pokemon: Pokemon) {
    return this.pokemonChange.emit(pokemon);
  }
}

export const POKEDEX_SERVICE: Array<any> = [
  { provide: PokedexService, useClass: PokedexService }
]
