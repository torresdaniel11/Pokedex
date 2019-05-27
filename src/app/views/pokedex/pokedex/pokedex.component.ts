import { Component, OnInit, OnDestroy } from '@angular/core';
import { PokedexService } from 'src/app/services/pokedex.service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs/operators';
import { PokemonListItem } from 'src/app/models/pokemon-list-item';

@Component({
  selector: 'app-pokedex',
  templateUrl: './pokedex.component.html',
  styleUrls: ['./pokedex.component.css']
})
export class PokedexComponent implements OnInit, OnDestroy {

  pokemons: PokemonListItem[];
  currentView: string;
  fightOrDetail: string;
  showDialog: boolean = false;
  constructor(public pokeService: PokedexService, private toastr: ToastrService) {
    this.currentView = 'browse';
    this.pokemons = [];
  }

  /*
    onInit life cycle
    ask for the first 20 pokemons
  */
  ngOnInit() {
    this.backToBrowse();
    this.getPokemonsBatch();
    this.pokeService.currentView.subscribe(view => {
      this.currentView = view;
      this.showDialog = view === 'details';
    })
    this.pokeService.fightOrDetail.subscribe(fightOrDetail => {
      this.fightOrDetail = fightOrDetail;
    })
  }

  /*
  onDestroy life cycle
  */
  ngOnDestroy() {
    this.pokeService.restartOffset();
    this.pokeService.setFightOrDetail('detail');
  }

  /*
    request the servcie a batch of 20 pokemons
    post: add 20 new pokemons to the current pokemons
  */
  getPokemonsBatch(): void {
    this.pokeService.getPokemons()
      .pipe(debounceTime(1500))
      .subscribe((res) => {
        this.pokemons.push(...res.results);
        this.toastr.success('Loaded Pokemon batch', 'Success', {
          timeOut: 1000
        });
      })
  }

  /*
    listener of the infinite scroll
    post: ask for a new pokemon batch to add to the view
  */
  onScroll(): void {
    this.getPokemonsBatch()
  }

  /*
    request the pokeapi API a batch of 20 pokemons
    @param fightOrDetail: a string telling if the user want to start a fight or cancel it
  */
  setFightOrDetail(fightOrDetail: string): void {
    this.pokeService.setFightOrDetail(fightOrDetail)
    if (fightOrDetail === 'detail') {
      this.toastr.info('Click on a Pokemon to see the details', 'Pokedex', {
        timeOut: 2500
      });
    } else {
      this.toastr.info('Choose Pokemons for fight', 'Pick for fight', {
        timeOut: 3000
      });
    }
  }

  /*
    dismiss the detail view
  */
  backToBrowse() {
    this.pokeService.setCurrentView('browse')
  }

}
