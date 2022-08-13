import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { filter, firstValueFrom, fromEvent, Subscription } from 'rxjs';
import { debounceTime, map, distinctUntilChanged} from 'rxjs/operators';
import { PokemonService } from 'src/app/services/pokemon.service';
import { SearchService } from 'src/app/services/search.service';
import { Pokemon } from 'src/app/shared/interfaces';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @ViewChild('searchText', { static: true }) searchText!: ElementRef;

  public pokemonList: Pokemon[] = [];
  public isLoading = false;
  public currentPage = 1;
  public pokemonCount = 0;
  public text: string = '';
  public faSearch = faSearch;

  private subscription!: Subscription;

  private url = 'https://pokeapi.co/api/v2/pokemon?offset=';

  constructor(
    private pokemonService: PokemonService,
    private router: Router,
    private searchService: SearchService
  ) { }

  ngOnInit() {
    this.subscription = this.searchService.currentText.subscribe(text => this.text = text)
    fromEvent(this.searchText.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      })
      ,debounceTime(1000)
      ,distinctUntilChanged()
    ).subscribe(async (text: string) => {    
      this.searchService.changeText(text.toLowerCase());

      if (!!text.length) {
        await this.searchPokemon(text.toLowerCase());
      } else {
        this.getPokemonList(0);
      }

    })
    this.getPokemonList(0);
  }

  getPokemonList(offset: number) {
    this.isLoading = true;
    this.pokemonService.getPaginatedPokemons(`${this.url}${offset}&limit=20`).subscribe(async response => {
      if (this.pokemonCount === 0) {
        this.pokemonCount = response.count;
      }
    
      this.pokemonList = [];
      for (const pokemon of response.results) {
        const details = await firstValueFrom(this.pokemonService.getDetails(pokemon.name));

        this.pokemonList.push({
          name: details.name,
          displayName: details.name[0].toUpperCase() + details.name.substring(1),
          imageUrl: details.sprites.front_default,
        });
      }
      this.isLoading = false;
    })
  }

  async searchPokemon(text: string) {
    this.isLoading = true;
    this.pokemonCount = 0;
    this.pokemonList = [];
    const details = await firstValueFrom(this.pokemonService.getDetails(text))
      .catch((error) => {
        console.log(error);
        this.isLoading = false
      });

      this.pokemonList.push({
        name: details.name,
        displayName: details.name[0].toUpperCase() + details.name.substring(1),
        imageUrl: details.sprites.front_default,
      }); 
    this.isLoading = false;
  }

  async submitText(text: string) {
    this.searchService.changeText(text);
    await this.searchPokemon(text);
  }

  changePage(pageNumber: number) {    
    this.getPokemonList((pageNumber - 1) * 20)
  }
  onPokemonClick(pokemon: Pokemon) {
    this.router.navigate(['/pokemon', pokemon.name])
  }
}
